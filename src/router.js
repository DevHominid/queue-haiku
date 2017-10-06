import express from 'express';
import { haikuRouter, userRouter } from './routes';

const app = express();
const router = express.Router();

// Init models
import Haiku from '../models/haiku';
import User from '../models/user';

// Index GET route
router.get('/', (req, res) => {
  Haiku.find({})
    .then(haikus => {
      res.render('index', {
        title: 'Haikus',
        haikus: haikus,
        user: req.user
      });
    })
    .catch(err => console.log(err));
});

// About GET route
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About'
  });
});

// Mount routing middleware
router.use('/haikus', haikuRouter);
router.use('/users', userRouter);

export default router;
