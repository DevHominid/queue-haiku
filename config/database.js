// TODO: replace with .env values
// TODO: update to es6/+
module.exports = {
  database: 'mongodb://localhost/queue-haiku',
  testDatabase: 'mongodb://localhost/queue-haiku-test',
  secret: 'mysecret',
  admin: {
    first: process.env.ADMIN_FIRST,
    last: process.env.ADMIN_LAST,
    email: process.env.ADMIN_EMAIL,
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASS,
    isAdmin: true
  }
}
