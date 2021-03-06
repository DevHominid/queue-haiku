import User from '../../models/user';
import { hashPassword } from './auth';

/**
 * Fetch a user from the db
 *
 * @param  {Object} query
 * @return {Promise<Object>}
 */
 export const findUser = (query) => {
   return User.findOne(query).exec(); // Promise
 };

 /**
  * Fetch multiple users from the db
  *
  * @param  {Object} query
  * @return {Promise<Object>}
  */
  export const findUsers = (query = {}) => {
    return User.find(query).exec(); // Promise
  };

 /**
  * Create new user and save to db
  *
  * @param  {Object} user
  * @return {Promise<Object>}
  */
  export const createUser = (user) => new Promise((resolve, reject) => {
    const newUser = new User(user);
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
   * @param  {Object} query
   * @return {Promise<Object>}
   */
   export const deleteUser = (query) => new Promise((resolve, reject) => {
     findUser(query)
       .then(user => {
         const idQuery = { _id: user._id }
         return User.remove(idQuery);
       })
       .then(() => {
         resolve('user deleted');
       })
       .catch((err) => {
         reject(err);
       });
   });

 /**
  * Check if admin exists in database
  *
  * @param  {Object} query
  * @param  {Object} admin
  * @return {Promise<Object>}
  */
  export const checkAdmin = (query, newAdmin) => new Promise((resolve, reject) => {
    findUser(query)
      .then((admin) => {
        if (!admin) {
          return Promise.all([admin, createUser(newAdmin)]);
        } else {
          let message = 'Admin exists';
          console.log(message);
          resolve(message);
        }
      })
      .then((result) => {
        if (result) {
          const newAdmin = result[1];
          let message = `New admin ${newAdmin.first} ${newAdmin.last} created!`;
          console.log(message);
          resolve(message);
        }
      })
      .catch((err) => {
        reject(err);
        next(err);
      });
  });
