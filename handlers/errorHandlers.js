/*
Catch errors from async functions. Next immediately jumps to the next thing
whenever the function fn catches any error
 */
exports.catchErrors = fn => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

/*
If no route is found then redirect the users to the 404 page
 */
exports.notFound = (req, res, next) => {
  res.status(404).render('404');
};

exports.developmentErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
};

/*
Handles the errors while production. DO not leak stacktraces to the user
 */
exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);

  switch (err.name) {
    // passport-local-mongoose Errors  https://github.com/saintedlama/passport-local-mongoose#error-messages
    case 'UserExistsError':
    case 'AttemptTooSoonError':
    case 'MissingPasswordError':
    case 'TooManyAttemptsError':
    case 'IncorrectPasswordError':
    case 'IncorrectUsernameError':
    case 'MissingUsernameError':
      req.flash('error', err.message);
      res.redirect('back');
      break;

    default:
      res.render('error', {
        message: err.message,
        error: {}
      });
  }
};
