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
  * Create user and save to db
  *
  * @param  {Object} user
  * @return {Promise<Object>}
  */
  export const createUser = (user) => new Promise((resolve, reject) => {
    const newUser = new User({
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
   * @param  {Object} query
   * @return {Promise<Object>}
   */
   export const deleteUser = (query) => new Promise((resolve, reject) => {
     findUser(query).then(user => {
       const idQuery = { _id: user._id }
       User.remove(idQuery)
         .then(() => {
           resolve('user deleted');
         }).catch((err) => {
           reject(err);
         });
     }).catch((err) => {
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
    findUser(query).then((admin) => {
      if (!admin) {
        createUser(newAdmin).then((newAdmin) => {
          let message = `New admin ${newAdmin.first} ${newAdmin.last} created!`
          resolve(message);
        })
        .catch((err) => {
          reject(err);
          console.log(err);
        })
      } else {
        console.log('Admin already exists');
        reject();
      }
    })
    .catch((err) => {
      reject(err);
      console.log(err);
    });
  });
