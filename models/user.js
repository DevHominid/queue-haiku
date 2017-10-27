// TODO: bring into src
// TODO: update to es6/+
const mongoose = require('mongoose');

// Init user schema
const userSchema = mongoose.Schema({
  first:{
    type: String,
    required: true
  },
  last:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  isAdmin:{
    type: Boolean,
    default: false
  },
  createdOn:{
    type: Date,
    default: Date.now
  },
  updatedOn:{
    type: Date
  },
  bio:{
    type: String,
    default: 'The elusive poet is known only by the haikus written here.'
  },
  location: {
    type: String,
    default: 'Earth'
  },
  imgUrl:{
    type: String,
    default: '/images/avatar-default.png'
  }
});

userSchema.add({
  praised: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Haiku'
  }]
});

// On every update, change updatedOn value to current date
userSchema.pre('update', function(next) {
  this.update({}, { $set: { updatedOn: new Date() } });
  next();
});

const User = module.exports = mongoose.model('User', userSchema);
