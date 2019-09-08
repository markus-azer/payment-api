const PaymentTransaction = require('./schemas/paymentTransactions');

module.exports = {
  PaymentTransaction: {
    findOne: PaymentTransaction.findOne,
    find: (query, {
      selectFields, populate, lean = false,
    }) => PaymentTransaction.find(query, selectFields).lean(lean),
    create: data => PaymentTransaction.create(data),
  },
};
