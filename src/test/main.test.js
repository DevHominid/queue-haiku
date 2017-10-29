import chai from 'chai';
import User from '../../models/user';

const expect = chai.expect;

describe('User', function() {
  it('should be invalid if first name is empty', function(done) {
    const u = new User();

    u.validate(function(err) {
      expect(err.errors.name).to.exist;
      done();
    });
  });
});
