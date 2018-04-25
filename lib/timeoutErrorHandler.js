function timeoutErrorHandler(err, req, res, next) {
  res.status(503).json({ "status": 503, "error": "Request Timed Out", "data": null });
  return;
}

module.exports = timeoutErrorHandler;