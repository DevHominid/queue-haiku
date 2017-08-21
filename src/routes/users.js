import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Init haiku model
import User from '../../models/user';

// Register form GET route
router.get('/register', (req, res) => {
  res.render('register');
});

// Register form POST route
router.post('/register', (req, res) => {
  
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.assert('name', 'Name is required').notEmpty();
  req.assert('email', 'Email is required').notEmpty();
  req.assert('email', 'Email is not valid').notEmpty();
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
        name:name,
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

router.get('/login', (req, res) => {
  res.render('login');
})

export default router;
