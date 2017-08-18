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

  // Validation
  req.assert('title', 'Title is required').notEmpty();
  req.assert('author', 'Author is required').notEmpty();
  req.assert('body', 'Body is required').notEmpty();

  req.getValidationResult().then((result) => {

    // Get errors
    let errors = result.array();

    if (!result.isEmpty()) {
      res.render('add_haiku', {
        title: 'Add Haiku',
        errors:errors
      });
    } else {
      let haiku = new Haiku();
      haiku.title = req.body.title;
      haiku.author = req.body.author;
      haiku.body = req.body.body;

      haiku.save((err) => {
        if (err) {
          console.log(err);
        } else {
          req.flash('success', 'Haiku added!');
          res.redirect('/');
        }
      });
    }
  });
});

// Haiku GET route
router.get('/haiku/:id', (req, res) => {
  Haiku.findById(req.params.id, (err, haiku) => {
    res.render('haiku', {
      haiku:haiku
    });
  });
});

// Haiku GET edit route
router.get('/haiku/edit/:id', (req, res) => {
  Haiku.findById(req.params.id, (err, haiku) => {
    res.render('edit_haiku', {
      title: 'Edit Haiku',
      haiku:haiku
    });
  });
});

// Edit haiku POST route
router.post('/haikus/edit/:id', (req, res) => {
  let haiku = {};
  haiku.title = req.body.title;
  haiku.author = req.body.author;
  haiku.body = req.body.body;

  let query = {_id:req.params.id}

  Haiku.update(query, haiku, (err) => {
    if (err) {
      console.log(err);
    } else {
      req.flash('success', 'Haiku updated!')
      res.redirect('/');
    }
  });
});

router.delete('/haiku/:id', (req, res) => {
  let query = {_id:req.params.id}

  Haiku.remove(query, (err) => {
    if (err) {
      console.log(err);
    }
    res.send('Success');
  });
});

export default router;
