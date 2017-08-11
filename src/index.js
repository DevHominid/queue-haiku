import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

// Init app
const app = express();
const port = process.env.PORT || 3000;

// Set view engine
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set public folder
app.use(express.static(`${__dirname}/../public`));

// Home route
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Haikus'
  });
});

// Add haiku route
app.get('/haikus/add', (req, res) => {
  res.render('add_haiku', {
    title: 'Add Haiku'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
