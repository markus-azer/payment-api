const https = require('https');
const Joi = require('@hapi/joi');

const { empty } = global;

module.exports = {
  // eslint-disable-next-line object-shorthand
  customError: function (message, errorCode) { // eslint-disable-line func-names
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'The requested resource couldn\'t be found';
    this.errorCode = errorCode || 404;
  },
  // eslint-disable-next-line arrow-body-style
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema, { abortEarly: false });
      if (result.error) {
        return next(result.error);
      }
      req.body = result.value;
      return next();
    };
  },
  // eslint-disable-next-line arrow-body-style
  validateQuery: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.query, schema, { abortEarly: false });
      if (result.error) {
        return next(result.error);
      }
      req.query = result.value;
      return next();
    };
  },
  // eslint-disable-next-line arrow-body-style
  validateParams: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.params, schema, { abortEarly: false });
      if (result.error) {
        return next(result.error);
      }
      req.params = result.value;
      return next();
    };
  },
  // eslint-disable-next-line arrow-body-style
  notification: (config) => {
    return {
      // eslint-disable-next-line arrow-body-style
      sendSlackNotification: (channelId, message) => {
        return new Promise((resolve, reject) => {
          try {
            const notificationsConfig = config && config.notifications;

            if (empty(notificationsConfig)) {
              throw new Error('Notification Config is Missing');
            }

            const { slackHostName, slackToken } = notificationsConfig;
            if (empty(slackHostName) || empty(slackToken)) {
              throw new Error('Slack Host Name & Slack Token is required');
            }

            if (empty(channelId) || empty(message)) {
              throw new Error('channelId Or message is Missing');
            }

            const options = {
              hostname: slackHostName,
              port: 443,
              path: `/api/chat.postMessage?token=${slackToken}&channel=${channelId}&username=elnotifier&text=${encodeURI(message)}`,
              method: 'POST',
            };

            const req = https.request(options, (response) => {
              // Continuously update stream with data
              let body = '';
              // eslint-disable-next-line no-return-assign
              response.on('data', d => body += d);

              // Data reception is done, do whatever with it!
              response.on('end', () => resolve(body));
            });
            req.on('error', error => reject(error));
            req.end();
          } catch (error) {
            reject(error);
          }
        });
      },
    };
  },
};
