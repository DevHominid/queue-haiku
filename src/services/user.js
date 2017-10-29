import User from '../../models/user';
import { hashPassword } from './auth';

/**
 * Fetch a user from the database
 *
 * @param  {Object} filter
 * @return {Promise<Object>}
 */
 const findUser = (filter = {}) => {
   return User.find(filter).exec();
 };

 /**
  * Create user and save to the database
  *
  * @param  {String} first
  * @param  {String} last
  * @param  {String} email
  * @param  {String} username
  * @param  {String} password
  * @param  {Boolean} isAdmin
  * @return {Promise<Object>}
  */
  const createUser = (first, last, email, username, password, isAdmin) => new Promise((resolve, reject) => {
    const newUser = User({
      first: first,
      last: last,
      email: email,
      username: username,
      password: password,
      isAdmin: isAdmin
    });
    // Hash password
    newUser.password = hashPassword(newUser.password)
      .then((newUser) => {
        newUser.save((err) => {
          if (err) {
            reject(err);
          } else {
            resolve(newUser);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

 /**
  * Check if admin exists in database
  *
  * @param  {Object} filter
  * @return {Promise<Object>}
  */
  const checkAdmin = (adminUsername) => new Promise((resolve, reject) => {
    findUser({ username: adminUsername }).then((admin) => {
      if (!admin.length) {
        const first = process.env.ADMIN_FIRST;
        const last = process.env.ADMIN_LAST;
        const email = process.env.ADMIN_EMAIL;
        const username = process.env.ADMIN_USERNAME;
        const password = process.env.ADMIN_PASS;
        const isAdmin = true;
        createUser(first, last, email, username, password, isAdmin).then((newAdmin) => {
          let message = `New admin ${newAdmin.first} ${newAdmin.last} created!`
          resolve(message);
        })
        .catch((err) => {
          console.log(err);
        })
      } else {
        reject('Admin already exists');
      }
    })
    .catch((err) => {
      console.log(err);
    })
  });
