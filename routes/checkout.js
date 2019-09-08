const router = require('express').Router();

const schemas = require('../controllers/checkoutValidation');
const CheckoutController = require('../controllers/checkout');

const { CatchErrors, ValidateBody } = global;

router.route('/')
  .get(ValidateBody(schemas.clientToken), CatchErrors(CheckoutController.generateClientToken))
  .post(ValidateBody(schemas.checkout), CatchErrors(CheckoutController.checkout));

module.exports = router;
