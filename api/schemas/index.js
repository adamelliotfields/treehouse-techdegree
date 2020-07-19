const yup = require('yup');

const userSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  emailAddress: yup.string().email().required(),
  password: yup.string().required(),
});

const courseSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  estimatedTime: yup.string().notRequired(),
  materialsNeeded: yup.string().notRequired(),
});

module.exports.userSchema = userSchema;
module.exports.courseSchema = courseSchema;
