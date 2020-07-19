const bcrypt = require('bcryptjs');
const passport = require('passport');
const { BasicStrategy } = require('passport-http');

const { User } = require('../db');

// The Basic strategy gets the username and password from the Authorization header.
passport.use(
  new BasicStrategy(async (emailAddress, password, done) => {
    try {
      // The first argument to `done` is the error (if any), the second is the user object or false.
      const user = await User.findOne({ where: { emailAddress } });

      // `findOne` returns `null` if the user doesn't exist.
      if (user === null) return done(null, false);

      // `compare` returns a boolean.
      const compare = await bcrypt.compare(password, user.password);

      if (!compare) return done(null, false);

      // If we have a user and the passwords match, return the user.
      return done(null, user.get({ plain: true }));
    } catch (err) {
      return done(err);
    }
  }),
);

module.exports.passport = passport;
