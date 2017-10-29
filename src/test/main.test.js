import 'babel-polyfill';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import User from '../../models/user';
import mongoose from 'mongoose';
import config from '../../config/database';
import { findUser, findUsers, createUser, deleteUser, checkAdmin } from '../services/user';
import { hashPassword } from '../services/auth';

chai.use(chaiAsPromised);

const expect = chai.expect;
const Schema = mongoose.Schema;

// Define test users & admin
const testUser = {
  first: 'testy',
  last: 'mctester',
  email: 'testy@test.com',
  username: 'testuser123',
  password: '1234'
}
const testUser2 = {
  first: 'testa',
  last: 'mctestor',
  email: 'example@test.com',
  username: 'testuser456',
  password: '1234'
}
const testAdmin = {
  first: 'first',
  last: 'last',
  email: 'admin@test.com',
  username: 'testadmin123',
  password: '1234',
  isAdmin: true
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
     const password = testUser.password;
     const hashPass = await hashPassword(password);
     expect(hashPass).to.be.a('string');
     expect(hashPass).to.not.equal(password);
   });
   it('rejects on err', async function() {
     let password;
     return expect(hashPassword(password)).to.eventually.be.rejected;
   });
});

describe('findUser service', () => {
  before((done) => {
    createUser(testUser).then(() => {
      console.log('Added testUser');
      done();
    });
  });
  it('fetches user from db', async () => {
    const query = { username: testUser.username }
    const user = await findUser(query);
    expect(user).to.be.an('object');
    expect(user.username).to.deep.equal('testuser123');
  });
  after(function(done) {
    deleteUser({ username: testUser.username }).then(() => {
      console.log('Deleted testUser');
      done();
    });
  });
});

describe('findUsers service', () => {
  before((done) => {
    createUser(testUser).then(() => {
      console.log('Added testUser');
      createUser(testUser2).then(() => {
        console.log('Added testUser2');
        done();
      });
    });
  });
  it('fetches users from db', async () => {
    const query = {};
    const users = await findUsers(query);
    expect(users).to.be.an('array');
    expect(users[0].username).to.deep.equal('testuser123');
    expect(users[1].username).to.deep.equal('testuser456');
  });
  after(function(done) {
    deleteUser({ username: testUser.username }).then(() => {
      console.log('Deleted testUser');
      deleteUser({ username: testUser2.username }).then(() => {
        console.log('Deleted testUser2');
        done();
      });
    });
  });
});

describe('createUser service', function() {
   it('saves user to db', async function() {
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

describe('deleteUser service', function() {
  before((done) => {
    createUser(testUser).then(() => {
      console.log('Added testUser');
      done();
    });
  });
  it('removes user from db', async () => {
    const result = await deleteUser({ username: testUser.username });
    expect(result).to.deep.equal('user deleted');
    // return expect(deleteUser({ username: testUser.username })).to.eventually.be.fulfilled;
  });
  it('rejects on err', async () => {
    const nonUser = { username: 'nonExistent' };
    return expect(deleteUser(nonUser)).to.eventually.be.rejected;
  });
});


describe('checkAdmin service', () => {
  it('creates new admin user if not in db', async () => {
    const query = { username: testAdmin.username };
    const result = await checkAdmin(query, testAdmin);
    expect(result).to.deep.equal('New admin first last created!');
  });
  it('skips if admin already exists', async () => {
    const query = { username: testAdmin.username };
    const result = await checkAdmin(query, testAdmin);
    expect(result).to.deep.equal('Admin exists');
  });
  after((done) => {
    deleteUser({ username: testAdmin.username }).then(() => {
      console.log('Deleted testAdmin');
      done();
    });
  });
});

describe('User model', () => {
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
