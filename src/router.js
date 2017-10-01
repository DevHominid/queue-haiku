import express from 'express';
import { haikuRouter, userRouter } from './routes';

const app = express();
const router = express.Router();

// Init models
import Haiku from '../models/haiku';
import User from '../models/user';

// Home page route
router.get('/', (req, res) => {
  Haiku.find({})
    .then(haikus => {
      res.render('index', {
        title: 'Haikus',
        haikus: haikus
      });
    })
    .catch(err => console.log(err));
});

// Mount routing middleware
router.use('/haikus', haikuRouter);
router.use('/users', userRouter);

export default router;
