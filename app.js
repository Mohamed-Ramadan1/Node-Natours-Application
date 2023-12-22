//external modules
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();
const AppError = require('./utils/appError');
const globleError = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewsRouter = require('./routes/reviewRoutes');

app.use(helmet());
// middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'To many request from this ip ,please tray in an hour'
});
app.use('/api', limiter);

//Body parser reading data from req.body
app.use(express.json({ limit: '10kb' }));

//data sanitization
app.use(mongoSanitize());

app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);
//serving static files
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log(req.headers);
//   next();
// });

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewsRouter);

//Handling none matching routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl}  on this server!`));
});

//Error handler middleware
// Extracting the (status code , message , error.status)
app.use(globleError);
module.exports = app;
