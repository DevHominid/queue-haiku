// TODO: bring into src
// TODO: update to es6/+
//import mongoose from 'mongoose';
const mongoose = require('mongoose');

// Init haiku schema
const haikuSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    required: false
  },
  line1: {
    type: String,
    required: true
  },
  line2: {
    type: String,
    required: true
  },
  line3: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  updatedOn: {
    type: Date
  }
});

haikuSchema.add({
  praise: {
    type: Number,
    default: 0
  }
});

// On every update, change updatedOn value to current date
haikuSchema.pre('update', function(next) {
  this.update({}, { $set: { updatedOn: new Date() } });
  next();
});

const Haiku = module.exports = mongoose.model('Haiku', haikuSchema);
