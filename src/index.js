import express from 'express';
import 'babel-polyfill';
import path from 'path';
import bodyParser from 'body-parser';
import router from './router';
import mongoose from 'mongoose';
import expressValidator from 'express-validator';
import expressMessages from 'express-messages';
import flash from 'connect-flash';
import session from 'express-session';
import passport from 'passport'
import config from '../config/database';
import User from '../models/user';
import helmet from 'helmet';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import aws from 'aws-sdk';
import { checkAdmin } from './services/user';

// Dotenv config
dotenv.config();

// Set mongoose promise library
mongoose.Promise = global.Promise;

// Determine URI
let mongoDB;
const NODE_ENV = process.env.NODE_ENV;
const mongoUser = encodeURIComponent(process.env.MONGO_USER);
const mongoPass = encodeURIComponent(process.env.MONGO_PASS);
const mongoURIProd = process.env.MONGO_URI_PROD;
const prodDB = `mongodb://${mongoUser}:${mongoPass}${mongoURIProd}`;
const localDB = process.env.MONGO_URI_LOCAL;
NODE_ENV === 'production' ? mongoDB = prodDB : mongoDB = localDB;
console.log(prodDB);
// Set up mongoose connection
mongoose.connect(mongoDB, {
  useMongoClient: true
}).then(
  () => {console.log(`Connected to MongoDB -- running in ${NODE_ENV} mode`);},
  err => {next(err);}
);
// Get the connection
let db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Init app
const app = express();
const port = process.env.PORT || 3000;

// AWS config
aws.config.region = 'us-west-1';
export const S3_BUCKET = process.env.S3_BUCKET;

// Set secure HTTP headers with helmet middleware
app.use(helmet());

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
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = expressMessages(req, res);
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

// Serve static files
// TODO: use a reverse proxy
app.use(express.static(`${__dirname}/../public`));
app.use(express.static(`${__dirname}/../dist`));

// Load router module
app.use(router);

// Error logging middleware
app.use((err, req, res, next) => {
  console.log(`Error: \nMessage: ${err.message}`);
});


// Define admin credentials
const adminCred = {
  first: process.env.ADMIN_FIRST,
  last: process.env.ADMIN_LAST,
  email: process.env.ADMIN_EMAIL,
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASS,
  isAdmin: true
}

// Start server
checkAdmin({ username: process.env.ADMIN_USERNAME }, adminCred)
  .then(() => app.listen(port, () => console.log(`Server started on port: ${port}`)));
