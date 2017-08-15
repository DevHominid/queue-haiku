import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Init models
import Haiku from '../models/haiku';

// define the home page route
router.get('/', (req, res) => {
  Haiku.find({}, (err, haikus) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        title: 'Haikus',
        haikus: haikus
      });
    }
  });
});

// define the add haiku page route
router.get('/haikus/add', (req, res) => {
  res.render('add_haiku', {
    title: 'Add Haiku'
  });
});

export default router;
