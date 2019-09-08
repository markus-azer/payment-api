const Joi = require('@hapi/joi');

module.exports = {
  clientToken: Joi.object().keys({
  }),
  checkout: Joi.object().keys({
    nonce: Joi.string().required(),
    customerFullName: Joi.string().alphanum().min(3).max(30)
      .required(),
    currency: Joi.string().valid('USD', 'EUR', 'THB', 'HKD', 'SGD', 'AUD').required(),
    amount: Joi.number().required(),
  }),
};
