'use strict'

let UIDGenerator = require('uid-generator')
let moment = require('moment')
let app = require('../server')
let ECPay = require('../vendor/ECPAY_Payment_node_js')
let ECPayAPIHelper = require(
  '../vendor/ECPAY_Payment_node_js/lib/ecpay_payment/helper'
)
let DonateOptions = require(
  '../constants/DonateOptions'
)
let createError = require('../toolbox/createError')
let whitelistMethods = require('../toolbox/whitelistMethods')
let PaymentTypes = require('../constants/PaymentTypes')
let PaymentVendorTypes = require('../constants/PaymentVendorTypes')

module.exports = function(Payment) {
  let tradeIdGen = new UIDGenerator(null, UIDGenerator.BASE58, 20)
  let ecpayOptions = app.get('payment').ecpay.payment_conf;
  let ecpay = new ECPay(ecpayOptions)
  let ecpayAPIHelper = new ECPayAPIHelper(ecpayOptions)

  whitelistMethods(Payment, [])

  Payment.validatesInclusionOf('type', {
    in: Object.keys(PaymentTypes).map(k => PaymentTypes[k]),
  })
  Payment.validatesInclusionOf('vendorType', {
    in: Object.keys(PaymentVendorTypes).map(k => PaymentVendorTypes[k]),
  })

  let createECPayDonationOrder = (app, amount, rest, cb) => {
    tradeIdGen.generate((err, tradeId) => {
      if (err) {
        return cb(err)
      }

      let tradeTime = moment(new Date()).format('YYYY/MM/DD hh:mm:ss')
      let urls = app.get('payment').ecpay.donation
      let baseParams = {
        MerchantTradeNo: tradeId,
        MerchantTradeDate: tradeTime,
        TotalAmount: amount.toString(),
        ReturnURL: urls.serverCallback,
        OrderResultURL: urls.serverRedirect,
        NeedExtraPaidInfo: 'Y',
        ...rest,
      }
      let html = ecpay
        .payment_client
        .aio_check_out_all(baseParams)

      cb(null, html)
    })
  }
  let createECPayOrder = (app, payerId, recipient, amount, postId, cb) => {
    tradeIdGen.generate((err, tradeId) => {
      if (err) {
        return cb(err)
      }

      let tradeTime = moment(new Date()).format('YYYY/MM/DD hh:mm:ss')
      let urls = app.get('payment').ecpay.donation
      let baseParams = {
        MerchantTradeNo: tradeId,
        MerchantTradeDate: tradeTime,
        TotalAmount: amount.toString(),
        TradeDesc: (
          `post donation from ${payerId || 'guest'} to ${recipient.id}`
        ),
        ItemName: `捐款給文章作者:${recipient.username}`,
        ReturnURL: urls.serverCallback,
        OrderResultURL: urls.serverRedirect,
        NeedExtraPaidInfo: 'Y',
        CustomField1: (payerId || '').toString(),
        CustomField2: `${recipient.id},${recipient.username}`,
        CustomField3: amount.toString(),
        CustomField4: (postId || '').toString(),
      }
      let html = ecpay
        .payment_client
        .aio_check_out_all(baseParams)

      cb(null, html)
    })
  }

  Payment.ecpayDonationCreateOrder = (
    req, res, payer, recipientUsername, amount, postId, next
  ) => {
    let { app } = Payment
    let { AppUser } = app.models
    let payerId, html

    if (!DonateOptions.includes(parseInt(amount))) {
      return next(createError(
        'InvalidDonationAmount',
        'Donation amount is invalid'
      ))
    }
    if (req.accessToken) {
      payerId = req.accessToken.userId
    }

    let sendResponse = (err, html) => {
      if (err) {
        return next(err)
      }
      res.send(html)
    }

    if (!recipientUsername) {
      // donation to service
      return createECPayDonationOrder(app, amount, {
        TradeDesc: (
          `post donation from ${payerId || 'guest'} to service`
        ),
        ItemName: `贊助X-Post站方`,
        CustomField1: (payerId || '').toString(),
        CustomField2: '',
        CustomField3: amount.toString(),
        CustomField4: '',
      }, sendResponse)
    }
    // donation to post author
    AppUser.findOne({
      where: { username: recipientUsername || '' },
    }, (err, recipient) => {
      if (err) {
        return next(err)
      }
      if (!recipient) {
        return next(createError(
          'UserNotFound',
          'The recipient user is not found'
        ))
      }
      createECPayDonationOrder(app, amount, {
        TradeDesc: (
          `post donation from ${payerId || 'guest'} to ${recipient.id}`
        ),
        ItemName: `贊助文章作者:${recipient.username}`,
        CustomField1: (payerId || '').toString(),
        CustomField2: `${recipient.id},${recipient.username}`,
        CustomField3: amount.toString(),
        CustomField4: (postId || '').toString(),
      }, sendResponse)
    })
  }
  Payment.remoteMethod('ecpayDonationCreateOrder', {
    isStatic: true,
    http: {
      verb: 'get', path: '/ecpay/donation', errorStatus: 400,
    },
    description: 'Render third party payment page.',
    accepts: [
      { arg: 'req', type: 'object', http: { source: 'req' } },
      { arg: 'res', type: 'object', http: { source: 'res' } },
      { arg: 'payer', type: 'string', http: { source: 'query' } },
      { arg: 'recipient', type: 'string', http: { source: 'query' } },
      {
        arg: 'amount', type: 'number', http: { source: 'query' },
        required: true,
      },
      { arg: 'postId', type: 'string', http: { source: 'query' } },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  })

  Payment.ecpayDonationServerCallback = (req, res, next) => {
    let serializedResult = Object
      .keys(req.body)
      .map(k => `${k}=${req.body[k]}`)
      .join('&')
    let isCheckSumValid = ecpay
      .payment_client
      .helper
      .valid_chkmc_string(serializedResult)

    if (!isCheckSumValid) {
      return next(createError(
        'InvalidCheckSum',
        'Checksum is invalid'
      ))
    }

    let paymentType, meta
    let payerId = req.body.CustomField1
    let recipientId = req.body.CustomField2.split(',')[0]
    let amount = req.body.CustomField3
    let postId = req.body.CustomField4

    if (!payerId && !recipientId) {
      paymentType = PaymentTypes.DONATION_FROM_GUEST_TO_SERVICE
    } else if (payerId && !recipientId) {
      paymentType = PaymentTypes.DONATION_FROM_USER_TO_SERVICE
    } else if (!payerId && recipientId) {
      paymentType = PaymentTypes.DONATION_FROM_GUEST_TO_POST_AUTHOR
    } else if (payerId && recipientId) {
      paymentType = PaymentTypes.DONATION_FROM_USER_TO_POST_AUTHOR
    }

    switch(paymentType) {
      case PaymentTypes.DONATION_FROM_GUEST_TO_SERVICE:
      case PaymentTypes.DONATION_FROM_USER_TO_SERVICE: {
        meta = {}
        break
      }
      case PaymentTypes.DONATION_FROM_GUEST_TO_POST_AUTHOR:
      case PaymentTypes.DONATION_FROM_USER_TO_POST_AUTHOR: {
        meta = {
          postId,
        }
        break
      }
    }

    Payment.create({
      type: paymentType,
      vendorType: PaymentVendorTypes.EC_PAY,
      order: req.body,
      payerId,
      recipientId,
      amount,
      meta,
      isSuccess: req.body.RtnCode === '1',
    }, (err, payment) => {
      if (err) {
        return next(err)
      }
      return res.send('OK')
    })
  }
  Payment.remoteMethod('ecpayDonationServerCallback', {
    isStatic: true,
    http: {
      verb: 'post', path: '/ecpay/donation/callback', errorStatus: 400,
    },
    description: 'Callback when third party payment is done.',
    accepts: [
      { arg: 'req', type: 'object', http: { source: 'req' } },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  })

  Payment.ecpayDonationServerRedirect = (req, res, next) => {
    let { Post } = app.models
    let clientHost = app.get('clientHost')
    let recipient = req.body.CustomField2

    // donation to service
    if (!recipient) {
      let redirectUrl = `${clientHost}/donation`

      if (req.body.RtnCode === '1') {
        redirectUrl = `${redirectUrl}?donationSuccessCode=${req.body.RtnCode}`
      } else {
        redirectUrl = `${redirectUrl}?donationErrorCode=${req.body.RtnCode}`
      }
      return res.redirect(redirectUrl)
    }

    // donation to post author
    let recipientUsername = recipient.split(',')[1]
    let postId = req.body.CustomField4

    return Post.findById(postId, (err, post) => {
      if (err) {
        return next(err)
      }

      let redirectUrl = `${clientHost}/@${recipientUsername}/${post.slug}`

      if (req.body.RtnCode === '1') {
        redirectUrl = `${redirectUrl}?donationSuccessCode=${req.body.RtnCode}`
      } else {
        redirectUrl = `${redirectUrl}?donationErrorCode=${req.body.RtnCode}`
      }
      res.redirect(redirectUrl)
    })
  }
  Payment.remoteMethod('ecpayDonationServerRedirect', {
    isStatic: true,
    http: {
      verb: 'post', path: '/ecpay/donation/redirect', errorStatus: 400,
    },
    description: 'Redirect result when third party payment is done.',
    accepts: [
      { arg: 'req', type: 'object', http: { source: 'req' } },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  })
}

/*

example html
============

<form id="_form_aiochk" action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5" method="post"><input type="hidden" name="MerchantTradeNo" id="MerchantTradeNo" value="AUq5x9mFEhA2LZ7xWiBU" /><input type="hidden" name="MerchantTradeDate" id="MerchantTradeDate" value="2018/10/28 07:02:07" /><input type="hidden" name="TotalAmount" id="TotalAmount" value="1" /><input type="hidden" name="TradeDesc" id="TradeDesc" value="測試交易描述" /><input type="hidden" name="ItemName" id="ItemName" value="捐款給作者" /><input type="hidden" name="ReturnURL" id="ReturnURL" value="https://ecpay-dev.ngrok.io/donation/ecpay/credit/callback" /><input type="hidden" name="OrderResultURL" id="OrderResultURL" value="https://ecpay-dev.ngrok.io/donation/ecpay/credit/result" /><input type="hidden" name="ChoosePayment" id="ChoosePayment" value="Credit" /><input type="hidden" name="PlatformID" id="PlatformID" value="" /><input type="hidden" name="MerchantID" id="MerchantID" value="2000132" /><input type="hidden" name="InvoiceMark" id="InvoiceMark" value="N" /><input type="hidden" name="DeviceSource" id="DeviceSource" value="" /><input type="hidden" name="EncryptType" id="EncryptType" value="1" /><input type="hidden" name="PaymentType" id="PaymentType" value="aio" /><input type="hidden" name="CheckMacValue" id="CheckMacValue" value="B8E705AC129F54736A3C31D194032F491C9A5DA2E4673FE1C4585CBDF2706E32" /><script type="text/javascript">document.getElementById("_form_aiochk").submit();</script></form>

POST callback
=============

example failure req.body: {
  CustomField1: '',
  CustomField2: '',
  CustomField3: '',
  CustomField4: '',
  MerchantID: '2000132',
  MerchantTradeNo: 'CfFXu1QgMZ3qXxr2a6nV',
  PaymentDate: '0001/01/01 00:00:00',
  PaymentType: 'Credit_CreditCard',
  PaymentTypeChargeFee: '1',
  RtnCode: '10100058',
  RtnMsg: '付款失敗',
  SimulatePaid: '0',
  StoreID: '',
  TradeAmt: '1',
  TradeDate: '2018/10/28 19:58:54',
  TradeNo: '1810281958547898',
  CheckMacValue: '17A5E0B2BFC932BE5F1BB62B59466962AAD57297213C407D33D46D0708BEE658'
}

example successful req.body {
  CustomField1: '',
  CustomField2: '',
  CustomField3: '',
  CustomField4: '',
  MerchantID: '2000132',
  MerchantTradeNo: 'zmfg2TY9hAZpbXoP7Q1A',
  PaymentDate: '2018/10/28 19:53:25',
  PaymentType: 'Credit_CreditCard',
  PaymentTypeChargeFee: '1',
  RtnCode: '1',
  RtnMsg: '交易成功',
  SimulatePaid: '0',
  StoreID: '',
  TradeAmt: '1',
  TradeDate: '2018/10/28 19:51:47',
  TradeNo: '1810281951477896',
  CheckMacValue: '274C752CCC0877B7CB77E26CFA8E347BD47E5D4840A1F9B19DC6B01A0455129F'
}

POST redirect
=============

example failure req.body: {
  CustomField1: '',
  CustomField2: '',
  CustomField3: '',
  CustomField4: '',
  MerchantID: '2000132',
  MerchantTradeNo: 'CfFXu1QgMZ3qXxr2a6nV',
  PaymentDate: '0001/01/01 00:00:00',
  PaymentType: 'Credit_CreditCard',
  PaymentTypeChargeFee: '1',
  RtnCode: '10100058',
  RtnMsg: 'ERROR',
  SimulatePaid: '0',
  StoreID: '',
  TradeAmt: '1',
  TradeDate: '2018/10/28 19:58:54',
  TradeNo: '1810281958547898',
  CheckMacValue: '316D71BA4E6C1A2DD2C34A02DB3D9ED226B918155063F937B96E7663BA9E2FA3'
}

example successful req.body: {
  CustomField1: '',
  CustomField2: '',
  CustomField3: '',
  CustomField4: '',
  MerchantID: '2000132',
  MerchantTradeNo: 'zmfg2TY9hAZpbXoP7Q1A',
  PaymentDate: '2018/10/28 19:53:25',
  PaymentType: 'Credit_CreditCard',
  PaymentTypeChargeFee: '1',
  RtnCode: '1',
  RtnMsg: 'Succeeded',
  SimulatePaid: '0',
  StoreID: '',
  TradeAmt: '1',
  TradeDate: '2018/10/28 19:51:47',
  TradeNo: '1810281951477896',
  CheckMacValue: 'EEDCB95393372A390605ECC02A366978EFBB64FC2CBA0BF29DD544BA5EC1A7EB'
}

*/
