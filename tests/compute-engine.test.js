const request = require('supertest');
const computeEngine = require('../models/compute-engine');
const prices = require('./test-data/sorted-data.json');
const pricesLoss = require('./test-data/loss-only.json');
const priceGain = require('./test-data/gain-only.json');
const pricesEmpty = require('./test-data/empty-array.json');
const now = '2018-04-21';
const expect = require('expect');

describe('Compute Engine', () => {
  describe('#_maxProfitDays', () => {
    it('Should come up with the a tuple [buyDate: string, sellDate: string, profit: number]', () => {
      let result = computeEngine._maxProfitDays(prices, now);
      expect(result[0]).toBeA('string');
      expect(result[1]).toBeA('string');
      expect(result[2]).toBeA('number');
    });

    it('Should come up with the correct max profit date where profit is possible', () => {
      let result = computeEngine._maxProfitDays(prices, now);
      expect(result[0]).toBe('2017-10-26');
      expect(result[1]).toBe('2018-03-14');
      expect(result[2]).toBe(18.14);
    });

    it('Should come up with an empty array where profit is not possible', () => {
      let result = computeEngine._maxProfitDays(pricesLoss, now);
      expect(result).toBeAn('array');
      expect(result.length).toBe(0);
    });

    it('Should come up with a value when you can only gain', () => {
      let result = computeEngine._maxProfitDays(priceGain, now);
      expect(result).toBeAn('array');
      expect(result.length).toBeGreaterThan(0);
    });

    it('Should come up with an empty array where prices is an empty array', () => {
      let result = computeEngine._maxProfitDays(pricesEmpty, now);
      expect(result).toBeAn('array');
      expect(result.length).toBe(0);
    });
  });

  describe('#_getDateRangeFromHorizon', () => {
    it('Should generate an array [fromDate: string, toDate: string]', () => {
      let result = computeEngine._getDateRangeFromHorizon(now, 180);
      expect(result).toBeAn('array');
      expect(result[0]).toBeA('string');
      expect(result[0]).toBeA('string');
    });

    it('Should generate correct date range', () => {
      let result = computeEngine._getDateRangeFromHorizon(now, 180);
      expect(result[0]).toBe('2017-10-23');
      expect(result[1]).toBe('2018-04-21');
    });
  });

  describe('#_historicalPricesFor', () => {
    it('Should return a promise', (done) => {
      let result = computeEngine._historicalPricesFor('MSFT', now, 180);
      expect(result).toBeA(Promise);
      done();
    });
  });

  describe('#maxProfit', () => {
    it('Should return a promise', (done) => {
      let result = computeEngine.maxProfit('MSFT');
      expect(result).toBeA(Promise);
      done();
    });
  });
});


