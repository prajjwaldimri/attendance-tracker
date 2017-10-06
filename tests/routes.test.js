/* global it describe */

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../start');
const User = require('../models/user');

describe('Website Routes Testing(routes.js)', () => {
  describe('/login Test', () => {
    it('should return 200 on GET /login ', done => {
      request(app)
        .get('/login')
        .expect(200)
        .end(done);
    });
  });
  describe('/profile Test', () => {
    it('should be redirected on GET /profile without logging in', done => {
      request(app)
        .get('/profile')
        .expect(302)
        .end(done);
    });
  });
  describe('/account Test', () => {
    it('should be redirected on GET /account without logging in', done => {
      request(app)
        .get('/account')
        .expect(302)
        .end(done);
    });
  });
  describe('/signup Test', () => {
    it('should return 200 on GET /signup', done => {
      request(app)
        .get('/signup')
        .expect(200)
        .end(done);
    });
  });
  describe('404 Test', () => {
    it('should return a 404 when passing a wrong route', done => {
      request(app)
        .get('/bogus')
        .expect(404)
        .end(done);
    });
  });
});
