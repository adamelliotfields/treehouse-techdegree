const createError = require('http-errors');
const http = require('http');

const { Course } = require('../db');

async function deleteCourseById(req, res, next) {
  const id = parseInt(req.params.id, 10);
  const { user } = req;

  if (Number.isNaN(id)) return next(createError(404));

  try {
    const course = await Course.findByPk(id);

    // Course wasn't found.
    if (course === null) return next(createError(404));

    // Course was found but the user isn't authorized to delete it.
    if (course.userId !== user.id) return next(createError(403));

    await course.destroy();

    return res.status(200).json({
      message: http.STATUS_CODES[200],
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = deleteCourseById;
