const swaggerJSDoc = require('swagger-jsdoc');

const { host } = global.serverConfig;

// swagger definition
const swaggerDefinition = {
  openapi: '3.0.1',
  info: {
    title: 'Payment API',
    version: '1.0.0',
    description: 'Payment Api Doc',
  },
  servers: [
    { url: host },
  ],
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./routes/**/*.yaml'], // pass all in array
};

// initialize swagger-jsdoc
module.exports = swaggerJSDoc(options);
