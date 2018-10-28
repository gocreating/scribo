'use strict'

let ECPay = require('../vendor/ECPAY_Payment_node_js')

module.exports = function(server) {
  let router = server.loopback.Router()

  router.get('/donation/ecpay/credit', (req, res) => {
    let baseParams = {
      MerchantTradeNo: 'Pf0a0d7e9fae1bb72bc9',
      MerchantTradeDate: '2017/02/13 15:45:30',
      TotalAmount: '100',
      TradeDesc: '測試交易描述',
      ItemName: '測試商品等',
      ReturnURL: 'https://64b5d4e9.ngrok.io/donation/ecpay/credit/callback',
    }
    let ecpay = new ECPay()
    let html = ecpay
      .payment_client
      .aio_check_out_credit_onetime(baseParams)

    res.send(html)
  })

  router.get('/donation/ecpay/credit/callback', (req, res) => {
    console.log('===========')
    console.log('cb received')
    console.log('===========')
  })

  server.use(router)
}
