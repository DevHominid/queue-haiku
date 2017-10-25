import express from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { check } from 'express-validator/check';

const router = express.Router();

// Init User model
import User from '../../models/user';
import Haiku from '../../models/haiku';

// Register form GET route
router.get('/register', (req, res) => {
  res.render('register');
});

// Register form POST route
router.post('/register', [
  check('first')
    .not().isEmpty().withMessage('First name is required')
    .escape()
    .trim(),
  check('last')
    .not().isEmpty().withMessage('Last name is required')
    .escape()
    .trim(),
  check('email')
    .not().isEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email is not valid')
    .escape()
    .trim()
    .custom(value => {
      return User.findOne({ email: value }).then(user => {
        if (user) {
          throw new Error('You already have an account!');
        } else {
          return true;
        }
      })
      .catch(err => console.log(err));
    }).withMessage('You already have an account!'),
  check('username')
    .not().isEmpty().withMessage('Username is required')
    .escape()
    .trim()
    .custom(value => {
      return User.findOne({ username: value }).then(user => {
        if (user) {
          throw new Error('Username already taken :(');
        } else {
          return true;
        }
      })
      .catch(err => console.log(err));
    }).withMessage('Username already taken :('),
  check('password')
    .not().isEmpty().withMessage('Password is required')
    .escape()
    .trim(),
  check('password2')
    .escape()
    .trim()
    .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')

], (req, res, next) => {

  req.getValidationResult().then((result) => {

    // Get errors
    let errors = result.array();

    if (!result.isEmpty()) {
      res.render('register', {
        errors: errors
      });
    } else {
      let newUser = new User({
        first: req.body.first,
        last: req.body.last,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            console.log(err);
          }
          newUser.password = hash;
          newUser.save((err) => {
            if (err) {
              console.log(err);
              return;
            } else {
              req.flash('success', 'Register success!');
              res.redirect('/users/login');
            }
          })
        });
      });
    }
  });
});

// Login form GET route
router.get('/login', (req, res) => {
  res.render('login');
});

// Login form POST route
router.post('/login', (req, res, next) => {

  const username = req.sanitize('username').escape().trim();
  const password = req.sanitize('password').escape().trim();

  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout GET route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logout successful!');
  res.redirect('/users/login');
});

// // Profile GET route
// router.get('/profile/:id', (req, res) => {
//   User.findById(req.params.id)
//   .then(user => {
//     res.render('profile', {
//       poet: user,
//       user: req.user
//     });
//   })
//   .catch(err => console.log(err));
// });

// Profile GET route
router.get('/profile/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      return Promise.all([
        user,
        Haiku.find({ author: user.id }),
        Haiku.find({ author: user.id })
          .limit(3)
          .sort('-createdOn'),
        Haiku.find({ author: user.id })
          .limit(1)
          .sort('-praise')
      ]);
    })
    .then(results => {
      console.log(results[3]);
      res.render('profile', {
        poet: results[0],
        allHaikus: results[1],
        recentHaikus: results[2],
        mostPraised: results[3],
        user: req.user
      });
    })
    .catch(err => console.log(err));
});

// Edit profile GET route
router.get('/profile/edit/:id', (req, res) => {
  User.findById(req.params.id)
  .then(user => {
    res.render('edit_profile', {
      user: user
    });
  })
  .catch(err => console.log(err));
});

// Edit profile POST route
router.post('/profile/edit/:id', (req, res) => {

  // Validation
  req.assert('first', 'First name is required').notEmpty();
  req.assert('last', 'Last name is required').notEmpty();

  // Sanitization
  const first = req.sanitize('first').escape().trim();
  const last = req.sanitize('last').escape().trim();
  const bio = req.sanitize('bio').escape().trim();
  const location = req.sanitize('location').escape().trim();

  req.getValidationResult().then((result) => {

    // Get errors
    let errors = result.array();

    if (!result.isEmpty()) {
      User.findById(req.params.id)
      .then(user => {
        res.render('edit_profile', {
          user: user,
          errors: errors
        });
      })
      .catch(err => console.log(err));
    } else {
      let user = {};
      user.first = req.body.first;
      user.last = req.body.last;
      user.bio = req.body.bio;
      user.location = req.body.location;

      let query = {_id:req.params.id}

      User.update(query, user)
        .then(() => {
          req.flash('success', 'Profile updated!')
          res.redirect('/users/profile/'+req.params.id);
        })
        .catch(err => console.log(err));
    }
  });
});

// My haikus GET route
router.get('/:id/haikus', (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      return Promise.all([user, Haiku.find({ author: user.id })]);
    })
    .then(results => {
      res.render('my_haikus', {
        poet: results[0],
        haikus: results[1],
        user: req.user
      });
    })
    .catch(err => console.log(err));
});

export default router;
