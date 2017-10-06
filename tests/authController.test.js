/* global it describe beforeEach after */

const request = require('supertest');
const app = require('../start');
const seed = require('./seed/seed');
const User = require('../models/user');

describe('Auth Controller(authController.js)', () => {
  beforeEach(seed.populateUsers);

  describe('POST /login tests', () => {
    it('should login the user when username and password are correct', function (
      done
    ) {
      this.timeout(30000);
      request(app)
        .post('/login')
        .send('username=test1')
        .send('password=test')
        .expect(302)
        .end(done);
    });

    it('should not login the user when username and password are incorrect', function (
      done
    ) {
      this.timeout(30000);
      request(app)
        .post('/login')
        .send('username=test2')
        .send('password=testasdas')
        .expect(302)
        .expect('Location', '/login')
        .end(done);
    });
  });

  after(done => {
    User.remove({}, err => {
      if (err) throw err;
      done();
    });
  });
});
