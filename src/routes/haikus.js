import express from 'express';
const router = express.Router();

// Init models
import Haiku from '../../models/haiku';
import User from '../../models/user';


// Add haiku page route
router.get('/add', controlAccess, (req, res) => {
  res.render('add_haiku', {
    title: 'Add Haiku'
  });
});

// Add haiku POST route
router.post('/add', (req, res) => {

  // Validation
  req.assert('title', 'Title is required').notEmpty();
  req.assert('line1', 'Line 1 is required').notEmpty();
  req.assert('line2', 'Line 2 is required').notEmpty();
  req.assert('line3', 'Line 3 is required').notEmpty();

  // Sanitization
  const title = req.sanitize('title').escape().trim();
  const line1 = req.sanitize('line1').escape().trim();
  const line2 = req.sanitize('line2').escape().trim();
  const line3 = req.sanitize('line3').escape().trim();

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
      haiku.imageURL = req.body.imageURL;
      haiku.author = req.user._id;
      haiku.line1 = req.body.line1;
      haiku.line2 = req.body.line2;
      haiku.line3 = req.body.line3;

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
router.get('/:id', (req, res) => {
  Haiku.findById(req.params.id, (err, haiku) => {
    User.findById(haiku.author, (err, user) => {
      res.render('haiku', {
        haiku:haiku,
        author: user.name
      });
    });
  });
});

// Haiku GET edit route
router.get('/edit/:id', controlAccess, (req, res) => {
  Haiku.findById(req.params.id, (err, haiku) => {
    if (haiku.author != req.user._id) {
      req.flash('danger', 'Access denied!');
      res.redirect('/');
    }
    res.render('edit_haiku', {
      title: 'Edit Haiku',
      haiku:haiku
    });
  });
});

// Edit haiku POST route
router.post('/edit/:id', (req, res) => {

  // Sanitization
  const title = req.sanitize('title').escape().trim();
  const line1 = req.sanitize('line1').escape().trim();
  const line2 = req.sanitize('line2').escape().trim();
  const line3 = req.sanitize('line3').escape().trim();

  let haiku = {};
  haiku.title = req.body.title;
  haiku.imageURL = req.body.imageURL;
  haiku.author = req.user._id;
  haiku.line1 = req.body.line1;
  haiku.line2 = req.body.line2;
  haiku.line3 = req.body.line3;

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

// Delete haiku
router.delete('/:id', (req, res) => {
  if (!req.user._id) {
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Haiku.findById(req.params.id, (err, haiku) => {
    if (haiku.author != req.user._id) {
      res.status(500).send();
    } else {
      Haiku.remove(query, (err) => {
        if (err) {
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Access control
function controlAccess(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

export default router;
