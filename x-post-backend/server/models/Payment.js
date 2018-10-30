'use strict'

let UIDGenerator = require('uid-generator')
let moment = require('moment')
let ECPay = require('../vendor/ECPAY_Payment_node_js')
let ECPayAPIHelper = require(
  '../vendor/ECPAY_Payment_node_js/lib/ecpay_payment/helper'
)
let DonateOptions = require(
  '../../../x-post-frontend/src/constants/DonateOptions'
)
let createError = require('../toolbox/createError')
let whitelistMethods = require('../toolbox/whitelistMethods')
let PaymentTypes = require('../constants/PaymentTypes')
let PaymentVendorTypes = require('../constants/PaymentVendorTypes')

module.exports = function(Payment) {
  let tradeIdGen = new UIDGenerator(null, UIDGenerator.BASE58, 20)
  let ecpay = new ECPay()
  let ecpayAPIHelper = new ECPayAPIHelper()

  whitelistMethods(Payment, [
    'ecpayDonationCreateOrder',
  ])

  Payment.validatesInclusionOf('type', {
    in: Object.keys(PaymentTypes).map(k => PaymentTypes[k]),
  })
  Payment.validatesInclusionOf('vendorType', {
    in: Object.keys(PaymentVendorTypes).map(k => PaymentVendorTypes[k]),
  })

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
        CustomField4: postId.toString(),
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
    AppUser.findOne({
      where: { username: recipientUsername },
    }, (err, recipient) => {
      let sendResponse = (err, html) => {
        if (err) {
          return next(err)
        }
        res.send(html)
      }

      if (err) {
        return next(err)
      }
      if (!recipient) {
        return next(createError(
          'UserNotFound',
          'The recipient user is not found'
        ))
      }
      if (req.accessToken) {
        payerId = req.accessToken.userId
      }
      createECPayOrder(app, payerId, recipient, amount, postId, sendResponse)
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

    let paymentType
    let payerId = req.body.CustomField1
    let recipientId = req.body.CustomField2.split(',')[0]
    let amount = req.body.CustomField3
    let postId = req.body.CustomField4

    if (!payerId && recipientId) {
      paymentType = PaymentTypes.DONATION_FROM_GUEST_TO_POST_AUTHOR
    } else if (payerId && recipientId) {
      paymentType = PaymentTypes.DONATION_FROM_USER_TO_POST_AUTHOR
    }
    Payment.create({
      type: paymentType,
      vendorType: PaymentVendorTypes.EC_PAY,
      order: req.body,
      payerId,
      recipientId,
      amount,
      meta: {
        postId,
      },
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
    let { app } = Payment
    let { Post } = app.models
    let clientHost = app.get('clientHost')
    let recipientUsername = req.body.CustomField2.split(',')[1]
    let postId = req.body.CustomField4

    return Post.findById(postId, (err, post) => {
      if (err) {
        return next(err)
      }

      let redirectUrl = `${clientHost}/@${recipientUsername}/${post.slug}`

      if (req.body.RtnCode !== '1') {
        return res.redirect(
          `${redirectUrl}?donationErrorCode=${req.body.RtnCode}`
        )
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
