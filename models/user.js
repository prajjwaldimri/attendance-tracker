const mongoose = require('mongoose');
mongoose.promise = global.Promise; // Tells mongoose to use ES6 promises
const passportLocalMongoose = require('passport-local-mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const validator = require('validator');
const md5 = require('md5');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Not a valid email']
  },
  fav_artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

userSchema.virtual('gravatar').get(function () {
  let hash = 0;
  if (this.email) {
    hash = md5(this.email);
  }
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
