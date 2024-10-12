const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

// Middleware to handle CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

const v1 = '/api/v1';
// Router
const authCMSRouter = require('./app/api/v1/auth/router');
const usersRouter = require('./app/api/v1/users/router');
const userRefreshTokenRouter = require('./app/api/v1/userRefreshToken/router');
const talentsRouter = require('./app/api/v1/talents/router');
const schedulesRouter = require('./app/api/v1/schedules/router');
const eventsRouter = require('./app/api/v1/events/router');
const registrationRouter = require('./app/api/v1/registration/router');
const uploadDocumentRouter = require('./app/api/v1/uploadDocument/router');
const imagesRouter = require('./app/api/v1/images/router');
const paymentsRouter = require('./app/api/v1/payments/router');

// Middlewares
const notFoundMiddleware = require('./app/middlewares/not-found');
const handleErrorMiddleware = require('./app/middlewares/handler-error');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: `Welcome to API UpSkills`,
//   });
// });

app.get('/', (req, res) => res.send('Welcome to API UpSkills'));

app.listen(3000, () => console.log('Server ready on port 9000.'));

// App Router
app.use(`${v1}/cms`, authCMSRouter);
app.use(`${v1}/cms`, usersRouter);
app.use(`${v1}/cms`, userRefreshTokenRouter);
app.use(`${v1}/cms`, talentsRouter);
app.use(`${v1}/cms`, schedulesRouter);
app.use(`${v1}/cms`, eventsRouter);
app.use(`${v1}/cms`, registrationRouter);
app.use(`${v1}/cms`, uploadDocumentRouter);
app.use(`${v1}/cms`, imagesRouter);
app.use(`${v1}/cms`, paymentsRouter);

// App Middlewares
app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

module.exports = app;
