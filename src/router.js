import express from 'express';

const router = express.Router();

// define the home page route
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Haikus'
  });
});

// define the add haiku page route
router.get('/haikus/add', (req, res) => {
  res.render('add_haiku', {
    title: 'Add Haiku'
  });
});

export default router;
