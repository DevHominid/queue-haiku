import mongoose from "mongoose";

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
  body:{
    type: String,
    required: true
  }
});

let Haiku = module.exports = mongoose.model('Haiku', haikuSchema);
