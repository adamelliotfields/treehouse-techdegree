const createError = require('http-errors');

const { Course, User } = require('../db');

async function getCourseById(req, res, next) {
  try {
    // Request params are always strings.
    const id = parseInt(req.params.id, 10);

    // We will get a database error if the ID parses to NaN (e.g., GET /courses/foo).
    if (Number.isNaN(id)) return next(createError(404));

    // SELECT
    //   c.id,
    //   c.title,
    //   c.description,
    //   c.estimatedTime,
    //   c.materialsNeeded,
    //   u.id AS 'User.id',
    //   u.emailAddress AS 'User.emailAddress',
    //   u.firstName AS 'User.firstName',
    //   u.lastName AS 'User.lastName'
    // FROM Courses AS c
    // LEFT JOIN Users AS u
    // ON c.userId = u.id
    // WHERE c.id = :id;
    const course = await Course.findByPk(id, {
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      include: [{ model: User, attributes: ['id', 'emailAddress', 'firstName', 'lastName'] }],
    });

    if (course === null) return next(createError(404));

    return res.status(200).json({ ...course.get({ plain: true }) });
  } catch (err) {
    return next(err);
  }
}

module.exports = getCourseById;
