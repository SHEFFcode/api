const _api = require('yahoo-finance');

class API {

  /**
   * Retrieved quote history for specified range
   * @param {string} stockSymbol 
   * @param {string} from 
   * @param {string} to 
   */
  getQuoteHistory(stockSymbol, from, to) {
    return new Promise((resolve, reject) => {

      _api.historical(
        { symbol: stockSymbol, from, to, period: 'd' },
        (err, quotes) => err ? reject(err) : resolve(this._sortQuotes(quotes))
      );
    });
  }

  /**
 * Sorts quotes from oldest to most recent and returns in proper format
 * @param {any[][]} quotes 
 */
  _sortQuotes(quotes) {
    let result = quotes.map((quote) => [quote.high, quote.date]).reverse();
    return result;
  }
}

let api = new API();

module.exports = api;