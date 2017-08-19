import express from 'express';
import { haikuRouter, userRouter } from './routes';


const app = express();
const router = express.Router();

// Init models
import Haiku from '../models/haiku';

// Home page route
router.get('/', (req, res) => {
  Haiku.find({}, (err, haikus) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        title: 'Haikus',
        haikus: haikus
      });
    }
  });
});

// Mount routing middleware
router.use('/haikus', haikuRouter);
router.use('/users', userRouter);

export default router;
