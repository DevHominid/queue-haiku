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
    default: 'https://res.cloudinary.com/dud5wowp2/image/upload/v1507145742/avatar-default_hdc4lg.png'
  }
});

// On every save, change updatedOn value to current date
userSchema.pre('save', function(next) {
  // Get current date
  const currentDate = new Date();

  // Update value
  this.updatedOn = currentDate;

  next();
});

const User = module.exports = mongoose.model('User', userSchema);
