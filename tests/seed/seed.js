const User = require('../../models/user');

const populateUsers = function (done) {
  this.timeout(30000);
  User.remove({})
    .then(() => {
      User.register(
        { username: 'test2', email: 'test2@gmail.com' },
        'test',
        (err, user) => {
          if (err) throw err;
        }
      );

      User.register(
        { username: 'test1', email: 'test1@outlook.com' },
        'test',
        (err, user) => {
          if (err) throw err;
        }
      );
    })
    .then(() => done())
    .catch(err => {
      done(err);
    });
};

module.exports = { populateUsers };
