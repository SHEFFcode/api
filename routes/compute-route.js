const express = require('express');
const router = express.Router();
const stockComputeEngine = require('../models/compute-engine');
const expressSanitized = require('express-sanitize-escape');
const pjson = require('../lib/environ');
const timeout = require('connect-timeout');
const haltOnTimedout = require('../lib/haltOnTimedout');
const timeoutErrorHandler = require('../lib/timeoutErrorHandler');

expressSanitized.sanitizeParams(router, ['symbol']);

router.get('/maxprofit/:symbol?',
  timeout(pjson.setts.timeout, { respond: true }),
  haltOnTimedout,
  (req, res) => {
    let symbol = req.params.symbol;
    if (!symbol || symbol.length === 0) {
      res.status(400).send({ status: 400, error: 'Please provide a valid alpha only symbol!', data: null });
      return;
    } else {
      symbol = symbol.trim().toUpperCase();
    }

    stockComputeEngine.maxProfit(symbol)
      .then((responseObj) => {
        res.status(responseObj.status).json(responseObj);
      })
      .catch((err) => {
        res.status(err.status).json(err);
      });
  },
  timeoutErrorHandler);

module.exports = router;