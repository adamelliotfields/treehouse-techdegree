const createError = require('http-errors');

const { passport } = require('../auth');

function authenticate(req, res, next) {
  // Passport Basic throws if the `authorization` header is not present.
  if (typeof req.headers.authorization !== 'undefined') {
    return passport.authenticate('basic', { session: false }, (err, user) => {
      if (err !== null) return next(err);

      // User will be false if the user doesn't exist or the password is incorrect.
      if (!user) return next(createError(401, { errors: ['emailAddress or password is invalid'] }));

      // Set req.user.
      req.user = user;

      return next();
    })(req, res, next);
  }

  return next(createError(401, { errors: ['Authorization is a required header'] }));
}

module.exports.authenticate = authenticate;
