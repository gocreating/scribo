'use strict'

let env = require('../env')

module.exports = {
  port: 4001,
  payment: {
    ecpay: {
      'payment_conf': {
        OperationMode: 'Production',
        MercProfile: {
          MerchantID: env.ecpayMercProfile.production.MerchantID,
          HashKey: env.ecpayMercProfile.production.HashKey,
          HashIV: env.ecpayMercProfile.production.HashIV,
        },
        IgnorePayment: [
          // 'Credit',
          // 'WebATM',
          // 'ATM',
          // 'CVS',
          // 'BARCODE',
          // 'AndroidPay',
        ],
      },
      donation: {
        serverCallback: 'https://scribo-backend.herokuapp.com/api/payments/ecpay/donation/callback',
        serverRedirect: 'https://scribo-backend.herokuapp.com/api/payments/ecpay/donation/redirect',
      },
    },
  },
  clientHost: 'https://gocreating.github.io/scribo/#',
  remoting: {
    rest: {
      handleErrors: true,
    },
  },
}
