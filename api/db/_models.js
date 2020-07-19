/* eslint-disable max-classes-per-file */

const bcrypt = require('bcryptjs');
const { DataTypes, Model } = require('sequelize');

const sequelize = require('./_sequelize');

class User extends Model {}
class Course extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      // Note that `primaryKey` implies UNIQUE NOT NULL.
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeSave: async (user) => {
        // 4 is the minimum number of salting rounds (max is 31, default is 10).
        const salt = await bcrypt.genSalt(4);
        const password = await bcrypt.hash(user.password, salt);
        // eslint-disable-next-line no-param-reassign
        user.password = password;
      },
    },
  },
);

Course.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Course',
  },
);

User.hasMany(Course, {
  foreignKey: 'userId',
  // If a user is deleted, delete all courses associated with that user.
  onDelete: 'CASCADE',
});

Course.belongsTo(User, {
  foreignKey: 'userId',
  // If a course is deleted, don't do anything to the associated user.
  onDelete: 'NO ACTION',
});

module.exports.User = User;
module.exports.Course = Course;
