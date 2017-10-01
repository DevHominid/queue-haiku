import express from 'express';
const router = express.Router();

// Init models
import Haiku from '../../models/haiku';
import User from '../../models/user';


// Add haiku GET route
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

      haiku.save()
        .then(() => {
          req.flash('success', 'Haiku added!');
          res.redirect('/');
        })
        .catch(err => console.log(err));
    }
  });
});

// Haiku GET route
router.get('/:id', (req, res) => {
  Haiku.findById(req.params.id)
    .then(haiku => {
      return Promise.all([haiku, User.findById(haiku.author)]);
    })
    .then(results => {
      res.render('haiku', {
        haiku: results[0],
        author: results[1].name
      });
    })
    .catch(err => console.log(err));
});

// Edit haiku GET route
router.get('/edit/:id', controlAccess, (req, res) => {
  Haiku.findById(req.params.id)
    .then(haiku => {
      if (haiku.author != req.user._id) {
        req.flash('danger', 'Access denied!');
        res.redirect('/');
      }
      res.render('edit_haiku', {
        title: 'Edit Haiku',
        haiku:haiku
      });
    })
    .catch(err => console.log(err));
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

  Haiku.update(query, haiku)
    .then(() => {
      req.flash('success', 'Haiku updated!')
      res.redirect('/');
    })
    .catch(err => console.log(err));
});

// haiku DELETE route
router.delete('/:id', (req, res) => {
  if (!req.user._id) {
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Haiku.findById(req.params.id)
   .then(haiku => {
     if (haiku.author != req.user._id) {
       res.status(500).send();
     } else {
       Haiku.remove(query)
         .then(() => res.send('Success'))
         .catch(err => console.log(err));
     }
   })
   .catch(err => console.log(err));
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
