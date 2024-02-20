const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  it('responds with 200', async () => {
    const response = await request(app)
      .get('/')
      .set('Accept', 'text/html');

    expect(response.statusCode).toBe(200);
  });
});

describe('POST /addresses', () => {
  it('responds with json', async () => {
    const response = await request(app)
      .post('/addresses')
      .send({ postcode: 'SL1 1AA' }) // replace with a valid postcode
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
  });

  it('responds with 500 for invalid postcode', async () => {
    const response = await request(app)
      .post('/addresses')
      .send({ postcode: 'INVALID-POSTCODE' }) // send an invalid postcode
      .set('Accept', 'application/json');
  
    expect(response.statusCode).toBe(500);
  });
});


