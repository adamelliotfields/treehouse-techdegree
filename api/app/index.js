const consola = require('consola');
const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const http = require('http');
const morgan = require('morgan');

const router = require('../router');
const { passport } = require('../auth');

// create the Express app
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use('/api', router);

// Not found handler.
app.use((req, res, next) => next(createError(404)));

// Global error handler.
app.use((err, req, res, next) => {
  // Don't expose the error message in production.
  const message = process.env.NODE_ENV === 'production' ? http.STATUS_CODES[500] : err.message;

  if (res.headersSent) return next(err);

  // Don't log errors to console in production.
  if (process.env.NODE_ENV !== 'production') {
    consola.error(err);
  }

  // If the error is already an HttpError instance, send it.
  if (err instanceof createError.HttpError) return res.status(err.status).json(err);

  return res.status(500).json(createError(500, message));
});

module.exports = app;
