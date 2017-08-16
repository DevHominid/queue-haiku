import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import router from './router';
import mongoose from 'mongoose';
import Promise from 'mpromise';

// Connect to MongoDB
mongoose.connect('mongodb://localhost/queue-haiku').then(
  () => {console.log('Connected to MongoDB');},
  err => {console.log(err);}
);
let db = mongoose.connection;

// Init app
const app = express();
const port = process.env.PORT || 3000;

// Set view engine
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// Body parser middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

// Set public folder
app.use(express.static(`${__dirname}/../public`));

// Load router module
app.use(router)

// Start server
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
