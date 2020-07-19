const createError = require('http-errors');

const { User } = require('../db');
const { userSchema } = require('../schemas');

async function createUser(req, res, next) {
  const { firstName, lastName, emailAddress, password } = req.body;

  try {
    // This throws if the post body does not match the schema.
    // We must set abortEarly to false to return a list of all validation errors.
    await userSchema.validate(req.body, { abortEarly: false });

    // `findOrCreate` returns an array with the user and a boolean; we only want the boolean.
    const [, created] = await User.findOrCreate({
      where: { emailAddress },
      defaults: { firstName, lastName, emailAddress, password },
    });

    // If `created` is false, then the user already exists.
    if (!created) {
      return next(createError(400, { errors: ['emailAddress must be unique'] }));
    }

    // Get the newly created user.
    const user = await User.findOne({
      where: { emailAddress },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });

    return res.status(201).json({ ...user.get({ plain: true }) });
  } catch (err) {
    // If an errors array exists, it is a validation error.
    // Otherwise, it is most likely a database error.
    return typeof err.errors !== 'undefined'
      ? next(createError(400, { errors: err.errors }))
      : next(err);
  }
}

module.exports = createUser;
