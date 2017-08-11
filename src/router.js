import express from 'express';

const router = express.Router();

// define the home page route
router.get('/', (req, res) => {
  let haikus = [
    {
      id: 1,
      title: 'Haiku One',
      author: 'John Doe',
      body: 'This is Haiku one'
    },
    {
      id: 2,
      title: 'Haiku Two',
      author: 'Jane Doe',
      body: 'This is Haiku two'
    },
    {
      id: 3,
      title: 'Haiku Three',
      author: 'John Doe',
      body: 'This is Haiku three'
    }
  ];
  res.render('index', {
    title: 'Haikus',
    haikus: haikus
  });
});

// define the add haiku page route
router.get('/haikus/add', (req, res) => {
  res.render('add_haiku', {
    title: 'Add Haiku'
  });
});

export default router;
