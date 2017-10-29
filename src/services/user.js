import User from '../../models/user';
import { hashPassword } from './auth';

/**
 * Fetch a user from the database
 *
 * @param  {Object} filter
 * @return {Promise<Object>}
 */
 const findUser = (filter = {}) => {
   return User.find(filter).exec(); // Promise
 };

 /**
  * Create user and save to db
  *
  * @param  {Object} user
  * @return {Promise<Object>}
  */
  export const createUser = (user) => new Promise((resolve, reject) => {
    const newUser = User({
      first: user.first,
      last: user.last,
      email: user.email,
      username: user.username,
      password: user.password,
      isAdmin: user.isAdmin
    });
    // Hash password
    hashPassword(newUser.password)
      .then((password) => {
        newUser.password = password;
        newUser.save((err) => {
          err ? reject(err) : resolve(newUser)
        });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });

  /**
   * Delete user from db
   *
   * @param  {Object} user
   * @return {Promise<Object>}
   */
   export const deleteUser = (user) => new Promise((resolve, reject) => {
     User.find(user).remove((err) => {
       err ? reject(err) : resolve('user deleted')
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
        const newAdmin = {
          first: process.env.ADMIN_FIRST,
          last: process.env.ADMIN_LAST,
          email: process.env.ADMIN_EMAIL,
          username: process.env.ADMIN_USERNAME,
          password: process.env.ADMIN_PASS,
          isAdmin: true
        }
        createUser(newAdmin).then((newAdmin) => {
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
    });
  });
