const path = require('path');
const { Sequelize } = require('sequelize');

// eslint-disable-next-line no-console
const logging = process.env.ENABLE_DB_LOGGING === 'true' ? console.log : false;

const storage = path.resolve(__dirname, '../fsjstd-restapi.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  logging,
  storage,
});

module.exports = sequelize;
