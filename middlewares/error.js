// error-middleware.js

/**
 * Handler to catch `async` operation errors.
 * Reduces having to write `try-catch` all the time.
 */

module.exports = {
  catchErrors: action => (req, res, next) => action(req, res, next).catch(next),
};
