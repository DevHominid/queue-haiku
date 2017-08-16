import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
const router = express.Router();

// Init models
import Haiku from '../models/haiku';

// Home page route
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

// Add haiku page route
router.get('/haikus/add', (req, res) => {
  res.render('add_haiku', {
    title: 'Add Haiku'
  });
});

// Add haiku POST route
router.post('/haikus/add', (req, res) => {
  let haiku = new Haiku();
  haiku.title = req.body.title;
  haiku.author = req.body.author;
  haiku.body = req.body.body;

  haiku.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

export default router;
