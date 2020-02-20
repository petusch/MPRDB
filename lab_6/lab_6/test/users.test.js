import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { OK, UNAUTHORIZED, FORBIDDEN, NOT_FOUND } from 'http-status';
import app from '../app';

chai.use(chaiHttp);

describe('/users', () => {
  let tokenAdmin;
  let tokenUser;
  let tokenAddedUser;
  let addedUserId;
  const login = 'qqq224';
  const password = 'qq2q24';

  const fname = 'Ivans';
  const newFname = 'Stepan';

  before(async () => {
    const {
      body: {
        data: { jwt: token },
      },
    } = await chai
      .request(app)
      .post('/login')
      .send({
        login: 'mama3',
        password: 'mama3',
      })
      .set('Content-Type', 'application/json');
    tokenUser = token;

    const {
      body: {
        data: { jwt },
      },
    } = await chai
      .request(app)
      .post('/login')
      .send({
        login: 'admin',
        password: 'admin',
      })
      .set('Content-Type', 'application/json');

    tokenAdmin = jwt;

  });

  
  it('POST /users should create user', async () => {
    const {
      status,
      body: {
        data: {
          firstname, _id, jwt
        }
      }
    } = await chai
      .request(app)
      .post('/users')
      .send({
        firstname: fname,
        login: login,
        password: password
      })
      .set('Content-Type', 'application/json');
    expect(status).to.equal(OK);
    expect(firstname).to.equal(fname);
    addedUserId = _id;
    tokenAddedUser = jwt;
  }).timeout(5000);


  it('POST /login should auth new user', async () => {
    const {
      status,
      body: {
        data: { jwt }
      }
    } = await chai
      .request(app)
      .post('/login')
      .send({
        login: login,
        password: password
      })
      .set('Content-Type', 'application/json');
    expect(status).to.equal(OK);
    tokenAddedUser = jwt;
  }).timeout(5000);


  it('PUT /users:user_id should return UNAUTHORIZED without authorization header',
    async () => {
      const { status } = await chai
        .request(app)
        .put(`/users/${addedUserId}`)
        .send({
          firstname: newFname,
          password: password
        })
        .set('Content-Type', 'application/json');
      expect(status).to.equal(UNAUTHORIZED);
    }).timeout(5000);



    it('PUT /users:user_id should return status FORBIDDEN while trying to update not self (not admin)', 
    async () => {
      const { status } = await chai
        .request(app)
        .put(`/users/${addedUserId}`)
        .set('Authorization', `Bearer ${tokenUser}`)
        .send({
          firstname: newFname,
          password: password
        })
        .set('Content-Type', 'application/json');
      expect(status).to.equal(FORBIDDEN);
    }).timeout(5000);
  


    it('PUT /users:user_id should update by admin any user',
      async () => {
        const {
          status,
          body: {
            data: { firstname, _id }
          }
        } = await chai
          .request(app)
          .put(`/users/${addedUserId}`)
          .set('Authorization', `Bearer ${tokenAdmin}`)
          .send({
            firstname: newFname,
            password: password
          })
          .set('Content-Type', 'application/json');
        expect(status).to.equal(OK);
        expect(firstname).to.equal(newFname);
        expect(_id).to.equal(addedUserId);
      }).timeout(5000);
  


    it('PUT /users:user_id user can update himself',
      async () => {
        const {
          status,
          body: {
            data: { firstname, _id }
          }
        } = await chai
          .request(app)
          .put(`/users/${addedUserId}`)
          .set('Authorization', `Bearer ${tokenAddedUser}`)
          .send({
            firstname: newFname,
            password: password
          })
          .set('Content-Type', 'application/json');
        expect(status).to.equal(OK);
        expect(firstname).to.equal(newFname);
        expect(_id).to.equal(addedUserId);
      }).timeout(5000);
  


    it('GET /users:user_id should return UNAUTHORIZED without authorization header',
      async () => {
        const { status } = await chai
          .request(app)
          .get(`/users/${addedUserId}`)
          .set('Content-Type', 'application/json');
        expect(status).to.equal(UNAUTHORIZED);
      }).timeout(5000);
  

      
  it('DELETE /users:user_id should return UNAUTHORIZED without authorization header',
  async () => {
    const { status } = await chai
      .request(app)
      .delete(`/users/${addedUserId}`)
      .set('Content-Type', 'application/json');
    expect(status).to.equal(UNAUTHORIZED);
  }).timeout(5000);

it('DELETE /users:user_id should return status FORBIDDEN by not admin', async () => {
  const { status } = await chai
    .request(app)
    .delete(`/users/${addedUserId}`)
    .set('Authorization', `Bearer ${tokenUser}`)
    .set('Content-Type', 'application/json');
  expect(status).to.equal(FORBIDDEN);
}).timeout(5000);

it('DELETE /users:user_id should delete by admin',
  async () => {
    const { status } = await chai
      .request(app)
      .delete(`/users/${addedUserId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .set('Content-Type', 'application/json');
    expect(status).to.equal(OK);
  }).timeout(5000);

});



