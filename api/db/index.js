const sequelize = require('./_sequelize');
const { Course, User } = require('./_models');

module.exports.sequelize = sequelize;
module.exports.Course = Course;
module.exports.User = User;
