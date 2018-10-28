'use strict'

let UIDGenerator = require('uid-generator')
let moment = require('moment')
let ECPay = require('../vendor/ECPAY_Payment_node_js')
let ECPayAPIHelper = require('../vendor/ECPAY_Payment_node_js/lib/ecpay_payment/helper')

module.exports = function(server) {
  let tradeIdGen = new UIDGenerator(null, UIDGenerator.BASE58, 20)
  let ecpay = new ECPay()
  let ecpayAPIHelper = new ECPayAPIHelper()
  let router = server.loopback.Router()

  router.get('/donation/ecpay', (req, res, next) => {
    tradeIdGen.generate((err, tradeId) => {
      if (err) {
        return next(err)
      }

      let tradeTime = moment(new Date()).format('YYYY/MM/DD hh:mm:ss')
      let urls = server.get('ecpay')
      let baseParams = {
        MerchantTradeNo: tradeId,
        MerchantTradeDate: tradeTime,
        TotalAmount: '1',
        TradeDesc: '測試交易描述',
        ItemName: '捐款給作者',
        ReturnURL: urls.serverCallback,
        OrderResultURL: urls.serverRedirect,
      }
      let html = ecpay
        .payment_client
        .aio_check_out_all(baseParams)

      res.send(html)
    })
  })

  router.post('/donation/ecpay/callback', (req, res) => {
    let serializedResult = Object
      .keys(req.body)
      .map(k => `${k}=${req.body[k]}`)
      .join('&')
    let isCheckSumValid = ecpay
      .payment_client
      .helper
      .valid_chkmc_string(serializedResult)

    if (isCheckSumValid) {
      return res.send('OK')
    }
  })

  router.post('/donation/ecpay/redirect', (req, res) => {
    let clientHost = server.get('clientHost')

    if (req.body.RtnCode !== '1') {
      return res.redirect(`${clientHost}/?errorCode=${req.body.RtnCode}`)
    }
    res.redirect(clientHost)
  })

  server.use(router)
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
