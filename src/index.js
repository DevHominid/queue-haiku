import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import router from './router';
import mongoose from 'mongoose';
import Promise from 'mpromise';
import expressValidator from 'express-validator';
import flash from 'connect-flash';
import session from 'express-session';
import passport from 'passport'
import config from '../config/database';

// Connect to MongoDB
mongoose.connect(config.database).then(
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

// Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true }
}));

// Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport config
require('../config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Set public folder
app.use(express.static(`${__dirname}/../public`));

// Load router module
app.use(router);

// Start server
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
