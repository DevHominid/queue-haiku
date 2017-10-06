import express from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';

const router = express.Router();

// Init User model
import User from '../../models/user';

// Register form GET route
router.get('/register', (req, res) => {
  res.render('register');
});

// Register form POST route
router.post('/register', (req, res) => {

  const first = req.sanitize('first').escape().trim();
  const last = req.sanitize('last').escape().trim();
  const email = req.sanitize('email').escape().trim();
  const username = req.sanitize('username').escape().trim();
  const password = req.sanitize('password').escape().trim();
  const password2 = req.sanitize('password2').escape().trim();

  req.assert('first', 'First name is required').notEmpty();
  req.assert('last', 'Last name is required').notEmpty();
  req.assert('email', 'Email is required').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('username', 'Username is required').notEmpty();
  req.assert('password', 'Password is required').notEmpty();
  req.assert('password2', 'Passwords do not match').equals(req.body.password);

  req.getValidationResult().then((result) => {

    // Get errors
    let errors = result.array();

    if (!result.isEmpty()) {
      res.render('register', {
        errors:errors
      });
    } else {
      let newUser = new User({
        first:first,
        last:last,
        email:email,
        username:username,
        password:password
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

// Profile GET route
router.get('/profile/:id', (req, res) => {
  User.findById(req.params.id)
  .then(user => {
    res.render('profile', {
      poet: user,
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

export default router;
