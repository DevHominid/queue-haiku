//import mongoose from 'mongoose';
const mongoose = require('mongoose');

// Init haiku schema
const haikuSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  imageURL:{
    type: String,
    required: false
  },
  line1:{
    type: String,
    required: true
  },
  line2:{
    type: String,
    required: true
  },
  line3:{
    type: String,
    required: true
  }
});

const Haiku = module.exports = mongoose.model('Haiku', haikuSchema);
