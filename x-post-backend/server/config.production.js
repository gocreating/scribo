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
        serverCallback: 'https://x-post.herokuapp.com/api/payments/ecpay/donation/callback',
        serverRedirect: 'https://x-post.herokuapp.com/api/payments/ecpay/donation/redirect',
      },
    },
  },
  clientHost: 'https://gocreating.github.io/x-post/#',
  remoting: {
    rest: {
      handleErrors: true,
    },
  },
}
