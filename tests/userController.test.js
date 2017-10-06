/* global it describe beforeEach after */

const request = require('supertest');
const app = require('../start');
const User = require('../models/user');

describe('User Controller(userController.js)', () => {
  beforeEach(done => {
    User.remove({}, err => {
      if (err) throw err;
      done();
    });
  });
  describe('Signup Tests', () => {
    it('should succeed when sending correct data through form', function (done) {
      this.timeout(30000);
      request(app)
        .post('/signup')
        .send('username=testuser')
        .send('email=test2@test.com')
        .send('password=test')
        .send('password-confirm=test')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          User.findOne({ username: 'testuser' }, function (err, user) {
            if (err) {
              return done(err);
            } else if (!user) {
              return done(new Error('No User Found with that username'));
            } else {
              done();
            }
          });
        });
    });

    it('should fail when sending incorrect data through form', function (done) {
      this.timeout(30000);
      request(app)
        .post('/signup')
        .send('username=testusername')
        .send('email=<script>console.log("Hello")</script>')
        .send('password=test2')
        .send('password-confirm=test3')
        .expect(422)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          User.findOne({ username: 'testusername' }, function (err, user) {
            if (err) {
              return done(err);
            } else if (user) {
              return done(new Error('User Found! Fatal Error!'));
            } else {
              done();
            }
          });
        });
    });
  });
  after(done => {
    User.remove({}, err => {
      if (err) throw err;
      done();
    });
  });
});
