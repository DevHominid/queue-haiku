import 'babel-polyfill';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import User from '../../models/user';
import mongoose from 'mongoose';
import config from '../../config/database';
import { createUser, deleteUser } from '../services/user';
import { hashPassword } from '../services/auth';

chai.use(chaiAsPromised);

const expect = chai.expect;
const Schema = mongoose.Schema;

// Define test user
const testUser = {
  first: 'testy',
  last: 'mctester',
  email: 'testy@test.com',
  username: 'testuser123',
  password: '1234'
}

// Create sandboxed test db connection
before(function(done) {
  mongoose.connect(config.testDatabase, {
    useMongoClient: true
  }).then(() => {
    console.log('Connected to MongoDB: queue-haiku-test');
    done();
  },
  err => {console.log(err);}
  );
  const db = mongoose.connection;
});

describe('hashPassword service', function() {
   it('returns a hashed password', async function() {
     let password = testUser.password;
     return expect(hashPassword(password)).to.eventually.be.fulfilled;
   });
   it('rejects on err', async function() {
     let password;
     return expect(hashPassword(password)).to.eventually.be.rejected;
   });
});

describe('createUser method', function() {
   it('saves testUser to db', async function() {
     return expect(createUser(testUser)).to.eventually.be.fulfilled;
   });
   it('rejects on err', async function() {
     const emptyUser = {};
     return expect(createUser(emptyUser)).to.eventually.be.rejected;
   });
   after(function(done) {
     deleteUser({ username: testUser.username }).then(() => {
       console.log('Deleted testUser');
       done();
     });
   });
});

describe('User model', function() {
  it('should be invalid if required fields are empty', function(done) {
    const u = new User();

    u.validate(function(err) {
      expect(err.errors.first).to.exist;
      expect(err.errors.last).to.exist;
      expect(err.errors.email).to.exist;
      expect(err.errors.username).to.exist;
      expect(err.errors.password).to.exist;
      done();
    });
  });
});
