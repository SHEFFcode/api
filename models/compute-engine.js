const _api = require('./api-wrapper');
const moment = require('moment-business-days');
const HISTORY_HORIZON = 180;

class StockComputeEngine {

  /**
   * Safe async function to create a max profit resposne object if possible.
   * @param {string} stockSymbol 
   * @returns {promise}
   */
  maxProfit(stockSymbol) {
    return new Promise((resolve, reject) => {
      let now = moment().format('YYYY-MM-DD');
      this._historicalPricesFor(stockSymbol, now, HISTORY_HORIZON)
        .then((prices) => {
          if (prices.length < 1) {
            reject({ status: 404, error: 'No quotes found for current stock symbol.', data: null });
          }

          let maxProfitTuple = this._maxProfitDays(prices, now);

          if (maxProfitTuple.length < 3) {
            reject({ status: 404, error: 'Error, no way to make a profit in 180 days.', data: null });
          }

          resolve({
            status: 200, error: null,
            data: {
              buy: maxProfitTuple[0], sell: maxProfitTuple[1], profit: maxProfitTuple[2]
            }
          });
        })
        .catch((err) => {
          reject({ status: 500, error: 'Internal Server Error, please try again later.', data: null });
        });
    });
  }

  /**
   * Private function to get back a tuple of best days to buy and sell for max profit
   * @param {any[][]} prices 
   * @param {string} now 
   * @returns {any[]}
   */
  _maxProfitDays(prices, now) {
    if (!prices || prices.length < 2) {
      return [];
    }
    let i = 0, buy = 0, sell = 0, min = 0, profit = 0, buySellTuple = [];

    for (i = 0; i < prices.length; i++) {
      if (prices[i][0] < prices[min][0]) {
        min = i;
      } else if (prices[i][0] - prices[min][0] > profit) {
        buy = prices[min][1];
        sell = prices[i][1];
        profit = prices[i][0] - prices[min][0];
      }
    }

    if (buy === 0 && sell === 0 && profit === 0) {
      return [];
    }

    buySellTuple[0] = buy;
    buySellTuple[1] = sell;
    buySellTuple[2] = profit;

    buySellTuple = this._convertToDateTouple(buySellTuple, now);

    return buySellTuple;
  }

  /**
   * Private function to convert buySellTuple to a dateTuple
   * @param {any[]} tuple 
   * @param {string} now 
   * @returns {any[]}
   */
  _convertToDateTouple(tuple, now) {
    if (tuple.length < 3) {
      return tuple;
    }
    let dateTouple = [];
    let [start, end] = this._getDateRangeFromHorizon(now, HISTORY_HORIZON);

    dateTouple[0] = moment(tuple[0]).businessAdd(1, 'days').format('YYYY-MM-DD');
    dateTouple[1] = moment(tuple[1]).businessAdd(1, 'days').format('YYYY-MM-DD');
    dateTouple[2] = tuple[2];

    return dateTouple;
  }

  /**
   * Private async function to get historical prices for a stock symbol
   * @param {string} stockSymbol 
   * @param {string} now 
   * @param {number} historyHorizon 
   * @returns {promise}
   */
  _historicalPricesFor(stockSymbol, now, historyHorizon) {
    return new Promise((resolve, reject) => {
      let [from, to] = this._getDateRangeFromHorizon(now, historyHorizon);

      _api.getQuoteHistory(stockSymbol, from, to)
        .then((quotes) => resolve(quotes))
        .catch((err) => reject(err));
    });
  }

  /**
   * Private function to produce start and end dates based off historyHorizon constant
   * @param {string} now 
   * @param {number} historyHorizon 
   */
  _getDateRangeFromHorizon(now, historyHorizon) {
    let endDate = now;
    let startDate = moment(endDate, "YYYY-MM-DD").subtract(historyHorizon, 'days').format('YYYY-MM-DD');

    return [startDate, endDate];
  }
}

stockComputeEngine = new StockComputeEngine();

module.exports = stockComputeEngine;