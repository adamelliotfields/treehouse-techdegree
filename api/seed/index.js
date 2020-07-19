const consola = require('consola');
const { performance } = require('perf_hooks');

const { courses, users } = require('./_data.json');
const { Course, User } = require('../db');

async function seed() {
  // You need to call `sync()` to ensure the tables are created before inserting any rows.
  await User.sync({ force: true });
  await Course.sync({ force: true });
  // You need to explicitly tell Sequelize to fire hooks when using bulk methods.
  await User.bulkCreate(users, { individualHooks: true });
  await Course.bulkCreate(courses);
}

module.exports = seed;

(async () => {
  // module.parent will be null if we run this file without requiring it.
  if (module.parent === null) {
    const start = performance.now();
    let end = 0;

    consola.info('Starting database seed...');

    try {
      await seed();
      end = performance.now();
      consola.success(`Finished database seed in ${Math.round(end - start)}ms!`);
      process.exit(0);
    } catch (err) {
      consola.fatal(err);
      process.exit(1);
    }
  }
})();
