import express from 'express';
import path from 'path';

// Init app
const app = express();
const port = process.env.PORT || 3000;

// Set view engine
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// Home route
app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
