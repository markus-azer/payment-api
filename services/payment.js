const braintree = require('braintree');

module.exports = {
  braintree: ({
    env, merchantId, publicKey, privateKey,
  }) => {
    if (!merchantId || !publicKey || !privateKey) {
      throw new Error('Cannot find braintree variables. See https://github.com/braintree/braintree_express_example#setup-instructions for instructions');
    }

    const environment = (env === 'Production') ? braintree.Environment.Production : braintree.Environment.Sandbox;
    const gateway = braintree.connect({
      environment, merchantId, publicKey, privateKey,
    });

    return {
      generateClientToken: customerId => new Promise((resolve, reject) => {
        gateway.clientToken.generate(customerId ? { customerId } : {},
          (err, response) => (err ? reject(err) : resolve(response)));
      }),
      createTransaction: (paymentMethodNonce, amount) => new Promise((resolve, reject) => {
        gateway.transaction.sale({
          amount,
          paymentMethodNonce,
          options: {
            submitForSettlement: true,
          },
        }, (err, response) => (err ? reject(err) : resolve(response)));
      }),
    };
  },
};
