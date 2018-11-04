'use strict'

let env = require('../env')

module.exports = {
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
    },
  },
}
