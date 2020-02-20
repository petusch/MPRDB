import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { OK, UNAUTHORIZED } from 'http-status';
import app from '../app';

chai.use(chaiHttp);

describe('/login AUTH', () => {
  it('POST /login should return unauthorized error for not existing user', async () => {
    const { status } = await chai
      .request(app)
      .post('/login')
      .send({
        login: 'ddss',
        password: 'ddsss',
      })
      .set('Content-Type', 'application/json');
    expect(status).to.equal(UNAUTHORIZED);
  }).timeout(5000);

  it('POST /login should login user', async () => {
    const {
      body: {
        data: {
          jwt,
        },
      },
      status,
    } = await chai
      .request(app)
      .post('/login')
      .send({
        login: 'admin',
        password: 'admin',
      })
      .set('Content-Type', 'application/json');

    expect(status).to.equal(OK);
    expect(typeof jwt).to.equal('string');
  }).timeout(5000);
});