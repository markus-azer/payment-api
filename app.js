const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const swaggerUi = require('swagger-ui-express');
const config = require('./config/config');
const swaggerSpec = require('./swagger');
const responseWrapper = require('./middlewares/responseWrapper');
const {
  customError,
  notification,
  validateParams,
  validateQuery,
  validateBody,
} = require('./utilities');
const { catchErrors } = require('./middlewares/error');

// Set Global Promise & empty & CustomError & SendNotifications
global.empty = require('is-empty');

global.Promise = bluebird;
global.ValidateParams = validateParams;
global.ValidateQuery = validateQuery;
global.ValidateBody = validateBody;
global.CatchErrors = catchErrors;
global.CustomError = customError;
global.SendNotifications = notification({ notifications: config.notifications });

// Configure mongoose
mongoose.Promise = bluebird;
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
global.models = require('./models'); // Push Models to global

const { SendNotifications, CustomError } = global;

// To Print Unhandled Error
process.on('unhandledRejection', ({ message, stack }) => {
  // eslint-disable-next-line no-console
  SendNotifications.sendSlackNotification(config.SLACK_ERROR_CHANNEL, `Error on Payment Api System \n \`\`\`${stack}\`\`\``).catch(error => console.log(error.message));
  // eslint-disable-next-line no-console
  console.error('unhandledRejection', message);
});

// Create new express app and get the port
const app = express();
const port = config.PORT;

// swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configure the app Middlewares
app.use(helmet.hidePoweredBy({ setTo: 'PHP/5.4.0' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

// Import Routes
const indexRoute = require('./routes');
const checkoutRoute = require('./routes/checkout');

// Route Middlewares
app.use('/', indexRoute);
app.use('/checkout', checkoutRoute);

// The Catch all Not found route
app.all('*', (req, res, next) => next(new CustomError('Not Found', 404)));

// Error handler
app.use(responseWrapper.errorHandler);

// Data handler
app.use(responseWrapper.dataHandler);

// Bind the app to the port
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server Up and Running \n=> http://localhost:${config.PORT}`));

module.exports = app;
