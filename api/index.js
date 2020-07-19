const consola = require('consola');
const http = require('http');

const app = require('./app');
const seed = require('./seed');
const { sequelize } = require('./db');

const { HOST, NODE_ENV, PORT } = process.env;

const port = parseInt(PORT || '3001', 10);
const host = HOST || '0.0.0.0';

const server = http.createServer(app);

server.listen({ host, port });

server.on('listening', async () => {
  const addr = NODE_ENV !== 'production' ? { address: 'localhost', port } : server.address();
  const bind = `http://${addr.address}:${addr.port}`;

  try {
    // Check if we can connect to the database.
    await sequelize.authenticate();
    consola.success('Connected to database!');

    // Get an array of all tables.
    const schemas = await sequelize.showAllSchemas({ logging: false });
    const names = schemas.map((schema) => schema.name);

    // If we don't have one of these tables, we need to seed the database.
    if (!names.includes('Courses') || !names.includes('Users')) {
      consola.info('Seeding...');
      await seed();
      consola.success('Seed successful!');
    }
  } catch (err) {
    consola.fatal(err);
    // If we can't connect to the database, we have to shut down the server.
    process.exit(1);
  }

  consola.success(`Listening on ${bind}`);
});

server.on('error', (err) => {
  consola.fatal(err);
  process.exit(1);
});

// Graceful shutdown.
['SIGINT', 'SIGTERM', 'SIGUSR2'].forEach((signal) => {
  process.on(signal, () => {
    if (NODE_ENV !== 'production') {
      // Don't bother gracefully shutting down in development.
      process.exit(0);
    }

    server.close(() => {
      consola.info('Shutting down...');
      process.exit(0);
    });
  });
});
