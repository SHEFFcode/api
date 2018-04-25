const request = require('supertest');
const api = require('../models/api-wrapper');
const quotes = require('./test-data/raw-data.json');
const expect = require('expect');

describe('API', () => {
  describe('#getQuoteHistory', (done) => {
    it('Should produce an array of quotes if the stock symbol is valid', () => {
      api.getQuoteHistory('MSFT', '2017-10-24', '2018-04-21')
        .then((response) => {
          expect(response.length).toBeGreaterThan(0);
        })
        .catch((err) => {
          //TODO
        });
    });

    it('Should reject a promise when the stock symbol is not valid', () => {
      api.getQuoteHistory('DDASH', '2017-10-24', '2018-04-21')
        .then((response) => {
          //TODO
        })
        .catch((err) => {
          expect(err).toExist();
        });
    });
  });


  describe('#_sortQuotes', () => {
    it('Should produce a [price: number, date: string] tuple', () => {
      let result = api._sortQuotes(quotes);
      expect(result).toBeAn('array');
      expect(api._sortQuotes(quotes)[0][0]).toBeA('number');
      expect(api._sortQuotes(quotes)[0][1]).toBeA('string');
    });

    it('Should produce correct oldest item', () => {
      let result = api._sortQuotes(quotes);
      expect(api._sortQuotes(quotes)[0][0]).toBe(79.339996);
      expect(api._sortQuotes(quotes)[0][1]).toBeA('string');
    });
  });
});


