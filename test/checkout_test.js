/* eslint-disable max-len */
const expect = require('chai').expect;
const supertest = require('supertest');

const PORT = process.env.PORT || '3000';
const api = supertest(`http://localhost:${PORT}`);
const braintreeConfig = require('../config/config').BRAINTREE;
const gateway = require('../services/payment').braintree(braintreeConfig);

describe('Checkout route', () => {
  it('generates a client token', (done) => {
    api.get('/checkout').end((err, res) => {
      expect(res.data).to.match(/[\w=]+/);
      done();
    });
  });
});
