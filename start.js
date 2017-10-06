const chalk = require('chalk');
const mongoose = require('mongoose');
mongoose.promise = global.Promise;

require('dotenv').config({ path: 'variables.env' });

// Connect to the database
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(process.env.MLAB_DB_TEST);
} else {
  mongoose.connect(process.env.MLAB_DB);
}

// Require Models for mongoose
require('./models/user');

const app = require('./app');

// Up the App
app.listen(process.env.PORT, function () {
  console.log(chalk.bgRed.underline(`Listening on PORT: ${process.env.PORT}!`));
});

module.exports = app;
