const { CustomError } = global;
const { PaymentTransaction } = global.models;
const braintreeConfig = global.serverConfig.BRAINTREE;
const braintree = require('../services/payment').braintree(braintreeConfig);

module.exports = {
  generateClientToken: async (req, res, next) => {
    const response = await braintree.generateClientToken();

    if (!response.success) throw new CustomError(response.message, 400);

    return next({ data: response.clientToken });
  },
  checkout: async (req, res, next) => {
    const {
      nonce, amount, currency, customerFullName,
    } = req.body;

    const response = await braintree.createTransaction(nonce, amount);

    PaymentTransaction.create({
      amount,
      currency,
      customerFullName,
      status: response.success ? 'Success' : 'Error',
      response,
    });

    if (!response.success) throw new CustomError(response.message, 400);

    return next({ message: 'Successful Transaction' });
  },
};
