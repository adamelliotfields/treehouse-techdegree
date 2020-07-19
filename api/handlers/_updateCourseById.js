const createError = require('http-errors');

const { Course, User } = require('../db');
const { courseSchema } = require('../schemas');

async function updateCourseById(req, res, next) {
  const id = parseInt(req.params.id, 10);
  const { user } = req;
  const { title, description, estimatedTime, materialsNeeded } = req.body;

  if (Number.isNaN(id)) return next(createError(404));

  try {
    const course = await Course.findByPk(id);

    // Course wasn't found.
    if (course === null) return next(createError(404));

    // Course was found but the user isn't authorized to update it.
    if (course.userId !== user.id) return next(createError(403));

    // Validate the request body.
    await courseSchema.validate(req.body, { abortEarly: false });

    // Update the course.
    await course.update({ title, description, estimatedTime, materialsNeeded });

    // Get the updated course.
    const updatedCourse = await Course.findByPk(id, {
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      include: [{ model: User, attributes: ['id', 'emailAddress', 'firstName', 'lastName'] }],
    });

    // Send the updated course along with the user.
    return res.status(200).json({ ...updatedCourse.get({ plain: true }) });
  } catch (err) {
    return typeof err.errors !== 'undefined'
      ? next(createError(400, { errors: err.errors }))
      : next(err);
  }
}

module.exports = updateCourseById;
