import express from 'express';
import { haikuRouter, userRouter } from './routes';
import aws from 'aws-sdk';
import { S3_BUCKET } from './index';

const app = express();
const router = express.Router();

// Init models
import Haiku from '../models/haiku';
import User from '../models/user';

// Index GET route
router.get('/', (req, res, next) => {
  Haiku.find({})
    .sort({praise: -1, createdOn: -1})
    .limit(3)
    .then(haikus => {
      res.render('index', {
        title: 'Haikus',
        haikus: haikus,
        user: req.user
      });
    })
    .catch((err) => {
      res.status(500).send(err.message);
      next(err); // log error
    });
});

// About GET route
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About'
  });
});

// Create S3 signed url, PUT route to S3
router.get('/sign-s3', (req, res, next) => {
  const s3 = new aws.S3();
  const id = req.user._id;
  const folderName = req.query['folder-name'];
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: `${folderName}/${id}-${fileName}`,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      return res.end();
      next(err); // log error
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${s3Params.Key}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

// Mount routing middleware
router.use('/haikus', haikuRouter);
router.use('/users', userRouter);

export default router;
