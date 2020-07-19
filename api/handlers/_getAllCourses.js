const { Course, User } = require('../db');

async function getAllCourses(req, res, next) {
  try {
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
    // ON c.userId = u.id;
    const courses = await Course.findAll({
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      include: [{ model: User, attributes: ['id', 'emailAddress', 'firstName', 'lastName'] }],
    });

    return res.status(200).json([
      // Convert to plain JS objects before sending.
      ...courses.map((course) => course.get({ plain: true })),
    ]);
  } catch (err) {
    return next(err);
  }
}

module.exports = getAllCourses;
