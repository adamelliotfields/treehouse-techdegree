const express = require('express');

const { authenticate } = require('../middleware');
const {
  getUser,
  createUser,
  getAllCourses,
  createCourse,
  getCourseById,
  updateCourseById,
  deleteCourseById,
} = require('../handlers');

const router = express.Router();

// Send an empty 200 response for the index route.
router.get('/', (req, res) => res.status(200).end());

// prettier-ignore
router.route('/users')
      .get([authenticate], getUser)
      .post(createUser);

// prettier-ignore
router.route('/courses')
      .get(getAllCourses)
      .post([authenticate], createCourse);

// prettier-ignore
router.route('/courses/:id')
      .get(getCourseById)
      .put([authenticate], updateCourseById)
      .delete([authenticate], deleteCourseById);

module.exports = router;
