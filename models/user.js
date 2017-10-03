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
    type: String
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
