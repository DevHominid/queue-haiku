//import mongoose from 'mongoose';
let mongoose = require('mongoose');

// Init haiku schema
let haikuSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
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

let Haiku = module.exports = mongoose.model('Haiku', haikuSchema);
