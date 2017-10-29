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

// Dotenv config
dotenv.config();

// use native promises
mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose.connect(config.database, {
  useMongoClient: true
}).then(
  () => {console.log('Connected to MongoDB');},
  err => {console.log(err);}
);
let db = mongoose.connection;

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

// TODO: move into config/database
// TODO: move /config into /src
// TODO: cleanup code
// Check for admin
const checkAdmin = () => new Promise((resolve, reject) => {
  User.find({ username: process.env.ADMIN_USERNAME })
    .then((admin) => {

      if (!admin.length) {
        const newAdmin = User({
          first: process.env.ADMIN_FIRST,
          last: process.env.ADMIN_LAST,
          username: process.env.ADMIN_USERNAME,
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASS,
          isAdmin: true
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) {
              reject(err);
            }
            newAdmin.password = hash;
            newAdmin.save((err) => {
              if (err) {
                reject(err)
              } else {
                console.log(`New admin ${newAdmin.first} ${newAdmin.last} created!`);
                resolve(`New admin ${newAdmin.first} ${newAdmin.last} created!`);
              }
            })
          });
        });
      } else {
        resolve('admin exists');
      }
    })
    .catch(err => console.log(err));
});

// Start server
checkAdmin()
  .then(() => app.listen(port, () => console.log(`Server started on port: ${port}`)));
