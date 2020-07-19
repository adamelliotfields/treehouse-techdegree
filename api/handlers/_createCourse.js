const createError = require('http-errors');

const { Course, User } = require('../db');
const { courseSchema } = require('../schemas');

async function createCourse(req, res, next) {
  const { user } = req;
  const { title, description, estimatedTime, materialsNeeded } = req.body;

  try {
    await courseSchema.validate(req.body, { abortEarly: false });

    const { id } = await Course.create({
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId: user.id,
    });

    const course = await Course.findByPk(id, {
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      include: [{ model: User, attributes: ['id', 'emailAddress', 'firstName', 'lastName'] }],
    });

    return res.status(201).json({ ...course.get({ plain: true }) });
  } catch (err) {
    return typeof err.errors !== 'undefined'
      ? next(createError(400, { errors: err.errors }))
      : next(err);
  }
}

module.exports = createCourse;
