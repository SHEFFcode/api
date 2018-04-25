function haltOnTimedout(req, res, next) {
  if (!req.timedout) {
    next();
  } else {
    let err = new Error("My custom timeout error");
    err.status = 504;
    next(err);
  }
}

module.exports = haltOnTimedout;