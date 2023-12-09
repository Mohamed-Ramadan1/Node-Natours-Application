//external modules
const express = require('express');
const morgan = require('morgan');

const app = express();

const AppError = require('./utils/appError');
const globleError = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Handling none matching routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl}  on this server!`));
});

//Error handler middleware
// Extracting the (status code , message , error.status)
app.use(globleError);
module.exports = app;
