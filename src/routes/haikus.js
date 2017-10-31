import express from 'express';
const router = express.Router();
import { check } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';

// Init models
import Haiku from '../../models/haiku';
import User from '../../models/user';

// Queue GET route
router.get('/queue', (req, res, next) => {
  Haiku.find({})
    .sort('-createdOn')
    .then(haikus => {
      const filterOptions = ['most recent', 'oldest', 'most praised'];

      res.render('queue', {
        title: 'Haiku Queue',
        haikus: haikus,
        filterOptions: filterOptions
      });
    })
    .catch((err) => {
      res.status(500).send(err.message);
      next(err); // Log error
    });
});

// Queue POST route
router.post('/queue', (req, res, next) => {
  const filterOptions = ['most recent', 'oldest', 'most praised'];

  if (req.body.filterOptionValue === 'most recent') {
    Haiku.find({})
      .sort('-createdOn')
      .then(haikus => {
        res.render('queue', {
          title: 'Haiku Queue',
          haikus: haikus,
          filterOptions: filterOptions,
          filterSelected: req.body.filterOptionValue
        });
      })
      .catch((err) => {
        res.status(500).send(err.message);
        next(err); // Log error
      });
  } else if (req.body.filterOptionValue === 'oldest') {
    Haiku.find({})
      .sort('createdOn')
      .then(haikus => {
        res.render('queue', {
          title: 'Haiku Queue',
          haikus: haikus,
          filterOptions: filterOptions,
          filterSelected: req.body.filterOptionValue
        });
      })
      .catch((err) => {
        res.status(500).send(err.message);
        next(err); // Log error
      });
  } else if (req.body.filterOptionValue === 'most praised') {
    Haiku.find({})
      .sort('-praise')
      .then(haikus => {
        res.render('queue', {
          title: 'Haiku Queue',
          haikus: haikus,
          filterOptions: filterOptions,
          filterSelected: req.body.filterOptionValue
        });
      })
      .catch((err) => {
        res.status(500).send(err.message);
        next(err); // Log error
      });
  }
});


// Add haiku GET route
router.get('/add', controlAccess, (req, res) => {
  res.render('add_haiku', {
    title: 'Add Haiku'
  });
});

// Add haiku POST route
router.post('/add', [
  // Validate and sanitize data
  check('title')
    .not().isEmpty().withMessage('Title is required'),
  sanitize('title').escape().trim(),

  check('line1')
    .not().isEmpty().withMessage('Line 1 is required'),
  sanitize('line1').escape().trim(),

  check('line2')
    .not().isEmpty().withMessage('Line 2 is required'),
  sanitize('line2').escape().trim(),

  check('line3')
    .not().isEmpty().withMessage('Line 3 is required'),
  sanitize('username').escape().trim(),
], (req, res, next) => {

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
      haiku.imgUrl = req.body.imgUrl;
      haiku.author = req.user._id;
      haiku.line1 = req.body.line1;
      haiku.line2 = req.body.line2;
      haiku.line3 = req.body.line3;

      haiku.save()
        .then(() => {
          req.flash('success', 'Haiku added!');
          res.redirect('/');
        })
        .catch((err) => {
          res.status(500).send(err.message);
          next(err); // Log error
        });
    }
  });
});

// Haiku GET route
router.get('/:id', (req, res, next) => {
  Haiku.findById(req.params.id)
    .then(haiku => {
      return Promise.all([haiku, User.findById(haiku.author)]);
    })
    .then(results => {
      res.render('haiku', {
        haiku: results[0],
        title: results[0].title,
        author: results[1],
        fullname: `${results[1].first} ${results[1].last}`,
        user: req.user
      });
    })
    .catch((err) => {
      res.status(500).send(err.message);
      next(err); // Log error
    });
});

// Edit haiku GET route
router.get('/edit/:id', controlAccess, (req, res, next) => {
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
    .catch((err) => {
      res.status(500).send(err.message);
      next(err); // Log error
    });
});

// Edit haiku POST route
router.post('/edit/:id', [
  // Validate and sanitize data
  check('title')
    .not().isEmpty().withMessage('Title is required'),
  sanitize('title').escape().trim(),

  check('line1')
    .not().isEmpty().withMessage('Line 1 is required'),
  sanitize('line1').escape().trim(),

  check('line2')
    .not().isEmpty().withMessage('Line 2 is required'),
  sanitize('line2').escape().trim(),

  check('line3')
    .not().isEmpty().withMessage('Line 3 is required'),
  sanitize('line3').escape().trim(),
], (req, res, next) => {

  req.getValidationResult().then((result) => {
    // Get errors
    let errors = result.array();

    if (!result.isEmpty()) {
      Haiku.findById(req.params.id)
      .then(haiku => {
        res.render('edit_haiku', {
          title: 'Edit Haiku',
          haiku: haiku,
          errors: errors
        });
      })
      .catch((err) => {
        res.status(500).send(err.message);
        next(err); // Log error
      });
    } else {
      let haiku = {};
      haiku.title = req.body.title;
      haiku.imgUrl = req.body.imgUrl;
      haiku.author = req.user._id;
      haiku.line1 = req.body.line1;
      haiku.line2 = req.body.line2;
      haiku.line3 = req.body.line3;

      let query = {_id:req.params.id}

      Haiku.update(query, haiku)
        .then(() => {
          req.flash('success', 'Haiku updated!');
          res.redirect('/haikus/'+req.params.id);
        })
        .catch((err) => {
          res.status(500).send(err.message);
          next(err); // Log error
        });
    }
  });
});

// haiku DELETE route
router.delete('/:id', (req, res, next) => {
  if (!req.user._id) {
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Haiku.findById(req.params.id)
   .then(haiku => {
     if (haiku.author != req.user._id) {
       res.status(500).send();
     } else {
       return Haiku.remove(query);
     }
   })
   .then(() => {
     res.send('Success');
   })
   .catch((err) => {
     res.status(500).send(err.message);
     next(err); // Log error
   });
});

// Haiku give praise POST route
router.post('/:id/give-praise', (req, res, next) => {
  let message;
  Haiku.findById(req.params.id)
    .then(haiku => {
      return Promise.all([haiku, User.findById(req.user.id)]);
    })
    .then((results) => {
      const haiku = results[0];
      const user = results[1];

      haiku.praise += 1;
      return Promise.all([haiku, user, haiku.save()])
    })
    .then((results) => {
      const haiku = results[0];
      const user = results[1];
      message = 'Success';

      user.praised.push(haiku.id);
      return user.save();
    })
    .then(() => {
      res.send(message);
    })
    .catch((err) => {
      res.status(500).send(err.message);
      next(err); // Log error
    });
});

// Haiku undo praise POST route
router.post('/:id/undo-praise', (req, res, next) => {
  let message;
  Haiku.findById(req.params.id)
    .then(haiku => {
      return Promise.all([haiku, User.findById(req.user.id)]);
    })
    .then((results) => {
      const haiku = results[0];
      const user = results[1];

      haiku.praise -= 1;
      user.praised = user.praised.filter((id) => {
        return id != haiku.id;
      });
      return Promise.all([haiku.save(), user.save()])
    })
    .then((results) => {
      message = 'Success';
      res.send(message);
    })
    .catch((err) => {
      res.status(500).send(err.message);
      next(err); // Log error
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
