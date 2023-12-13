const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //IF found missing data(email or password)
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //Check if the user is existing or not
  const user = await User.findOne({ email }).select('+password');
  //IF every thing is ok

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
});

//Protecting resources middleware
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  //Check if token notfound
  if (!token) {
    return next(
      new AppError('You are not logged in! pleas log in to access', 401)
    );
  }
  //verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user that token belong  no longer exist', 401)
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password pleas login again', 401)
    );
  }
  //passing the user to req to access it in the restrict middleware
  req.user = currentUser;
  next();
});

//Authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //Check if the user have the attributes role
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action ', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get user based on email
  const user = await User.findOne({ email: req.body.email });
  console.log(req.body.email);

  console.log(user);
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  //Generate random reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });
  //send token to user emil
});

exports.resetPassword = (req, res, next) => {};
