import express from 'express';
const router = express.Router();

// Init haiku model
import User from '../../models/user';

// Register Form
router.get('/register', (req, res) => {
  res.render('register');
});

export default router;
