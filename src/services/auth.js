import bcrypt from 'bcryptjs';

/**
 * Hash password with bcrypt
 *
 * @param  {Object} filter
 * @return {Promise<Object>}
 */
export const hashPassword = (password) => new Promise((resolve, reject) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        reject(err);
      }
      password = hash;
      resolve(password);
    });
  });
});
