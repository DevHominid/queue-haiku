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
router.get('/', (req, res) => {
  Haiku.find({})
    .sort({createdOn: -1, praise: -1})
    .limit(3)
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

router.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

// Mount routing middleware
router.use('/haikus', haikuRouter);
router.use('/users', userRouter);

export default router;
