const request = require('supertest');
const app = require('../svr').app;
const expect = require('expect');

describe('Server', () => {

  describe('GET /compute/maxprofit', () => {

    describe('#AAPL', () => {
      it('Should return 200', (done) => {
        request(app)
          .get('/compute/maxprofit/AAPL')
          .expect(200)
          .end(done);
      });

      it('Should return an object', (done) => {
        request(app)
          .get('/compute/maxprofit/AAPL')
          .expect((res) => {
            expect(res.body).toBeA('object');
          })
          .end(done);
      });

      it('Should return an object with keys status, eror and data', (done) => {
        request(app)
          .get('/compute/maxprofit/AAPL')
          .expect((res) => {
            expect(res.body).toIncludeKeys(['status', 'error', 'data']);
          })
          .end(done);
      });

      it('Should not have an error object', (done) => {
        request(app)
          .get('/compute/maxprofit/AAPL')
          .expect((res) => {
            expect(res.body.error).toBe(null);
          })
          .end(done);
      });

      it('Should have a data object', (done) => {
        request(app)
          .get('/compute/maxprofit/AAPL')
          .expect((res) => {
            expect(res.body.data).toBeA('object');
          })
          .end(done);
      });

      it('Should have a data object with keys buy sell and profit', (done) => {
        request(app)
          .get('/compute/maxprofit/AAPL')
          .expect((res) => {
            expect(res.body.data).toIncludeKeys(['buy', 'sell', 'profit']);
          })
          .end(done);
      });
    });

    describe('#blank', () => {
      it('Should return 400 bad request object, alpha only', (done) => {
        request(app)
          .get('/compute/maxprofit')
          .expect(400)
          .expect((res) => {
            expect(res.body.error).toBe('Please provide a valid alpha only symbol!');
          })
          .end(done);
      });
    });

    describe('#<script>console.log("hello")', () => {
      it('Should return 400 bad request object, alpha only', (done) => {
        request(app)
          .get('/compute/maxprofit/<script>console.log("hello")')
          .expect(400)
          .expect((res) => {
            expect(res.body.error).toBe('Please provide a valid alpha only symbol!');
          })
          .end(done);
      });
    });

    describe('#DDASH', () => {
      it('Should return 404 not found object, no quotes', (done) => {
        request(app)
          .get('/compute/maxprofit/DDASH')
          .expect(404)
          .expect((res) => {
            expect(res.body).toBeA('object');
            expect(res.body.error).toBe('No quotes found for current stock symbol.');
          })
          .end(done);
      });
    });
  });
});


