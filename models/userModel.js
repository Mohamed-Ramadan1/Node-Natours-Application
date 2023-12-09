const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'User must have a name !'] },
  email: {
    type: String,
    required: [true, 'User should have a email'],
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, 'Pleas provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'User should have a string'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'user should confirm the password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same '
    }
  }
});

//Before saving the password to the database must be increpted
userSchema.pre('save', async function(next) {
  //If the the password not modifayed nothing will happen
  if (!this.isModified('password')) return next();
  //encript the password
  this.password = await bcrypt.hash(this.password, 12);
  //deleting the confirmaing password by making it undefined
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;