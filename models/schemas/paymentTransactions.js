const mongoose = require('mongoose');
const { asyncIdGenerator } = require('../utilities');

const Schema = mongoose.Schema;

const PaymentTransactionSchema = new Schema({
  id: { type: String, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['USD', 'EUR', 'THB', 'HKD', 'SGD', 'AUD'], required: true },
  customerFullName: { type: String, required: true },
  status: { type: String, enum: ['Success', 'Error'], required: true },
  response: {},

}, { timestamps: true });

// eslint-disable-next-line func-names
PaymentTransactionSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      this.id = await asyncIdGenerator.generateUniqueId(this, 't', 12);
    } else {
      throw new Error('PaymentTransaction Cant be Modified');
    }

    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('PaymentTransaction', PaymentTransactionSchema, 'paymentTransactions');
