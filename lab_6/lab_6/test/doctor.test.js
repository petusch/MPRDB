import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { OK, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, NOT_ACCEPTABLE } from 'http-status';
import app from '../app';

chai.use(chaiHttp);

describe('/doctors', () => {
  let tokenAdmin;
  let tokenUser;
  let userId;
  let addedDoctorId;
  let addedUserId;

  const doctorName = 'doctor names';
  const newDoctorName = 'new doctor name';

  before(async () => {
    const {
      body: {
        data: {
          jwt,
          user: { _id }
        },
      },
    } = await chai
      .request(app)
      .post('/login')
      .send({
        login: 'mama3',
        password: 'mama3',
      })
      .set('Content-Type', 'application/json');
      tokenUser = jwt;
      userId = _id;
  });

  before(async () => {
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

  before(async () => {
    const {
      body: {
        data: {
          _id
        }
      }
    } = await chai
      .request(app)
      .post('/users')
      .send({
        login: 'ww445s',
        password: 'ww4445s'
      })
      .set('Content-Type', 'application/json');

    addedUserId = _id;
  });
  

//+
  it('POST /doctors should return UNAUTHORIZED without authorization header',
    async () => {
      const { status } = await chai
        .request(app)
        .post('/doctors')
        .send({
          name: doctorName,
          user_id: addedUserId
        })
        .set('Content-Type', 'application/json');
      expect(status).to.equal(UNAUTHORIZED);
    }).timeout(5000);

  
//+
    it('POST /doctors should return status FORBIDDEN by user',
    async () => {
      const { status } = await chai
        .request(app)
        .post('/doctors')
        .set('Authorization', `Bearer ${tokenUser}`)
        .send({
          name: doctorName,
          user_id: addedUserId
        })
        .set('Content-Type', 'application/json');
      expect(status).to.equal(FORBIDDEN);
    }).timeout(5000);

//+
    it('POST /doctors should create doctor by admin or medsister',
    async () => {
      const {
        status,
        body: {
          data: { _id, name, user_id }
        }
      } = await chai
        .request(app)
        .post('/doctors')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({
          name: doctorName,
          user_id: addedUserId
        })
        .set('Content-Type', 'application/json');
      expect(status).to.equal(OK);
      expect(name).to.equal(doctorName);
      expect(user_id).to.equal(addedUserId);
      addedDoctorId = _id;
    }).timeout(5000);



    //+
  it('PUT /doctors:doctor_id should return UNAUTHORIZED without authorization header',
  async () => {
    const { status } = await chai
      .request(app)
      .put(`/doctors/${addedDoctorId}`)
      .send({
        name: newDoctorName,
        user_id: addedUserId
      })
      .set('Content-Type', 'application/json');
    expect(status).to.equal(UNAUTHORIZED);
  }).timeout(5000);

//+
it('PUT /doctors:doctor_id should return status FORBIDDEN by not admin', async () => {
  const { status } = await chai
    .request(app)
    .put(`/doctors/${addedDoctorId}`)
    .set('Authorization', `Bearer ${tokenUser}`)
    .send({
      name: newDoctorName,
      user_id: addedUserId
    })
    .set('Content-Type', 'application/json');
  expect(status).to.equal(FORBIDDEN);
}).timeout(5000);

//+
it('PUT /doctors:doctor_id should update by admin',
  async () => {

    const {
      status,
      body: {
        data: { name, _id }
      }
    } = await chai
      .request(app)
      .put(`/doctors/${addedDoctorId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        name: newDoctorName,
        user_id: addedUserId
      })
      .set('Content-Type', 'application/json');
    expect(status).to.equal(OK);
    expect(name).to.equal(newDoctorName);
    expect(_id).to.equal(addedDoctorId);
  }).timeout(5000);


  //+
  it('GET /doctors:doctor_id should return UNAUTHORIZED without authorization header',
    async () => {
      const { status } = await chai
        .request(app)
        .get(`/doctors/${addedDoctorId}`)
        .set('Content-Type', 'application/json');
      expect(status).to.equal(UNAUTHORIZED);
    }).timeout(5000);

    //+
  it('GET /doctors:doctor_id should return doctor',
    async () => {
      const {
        status,
        body: {
          data: { name, _id }
        }
      } = await chai
        .request(app)
        .get(`/doctors/${addedDoctorId}`)
        .set('Authorization', `Bearer ${tokenUser}`)
        .set('Content-Type', 'application/json');
      expect(status).to.equal(OK);
      expect(name).to.equal(newDoctorName);
      expect(_id).to.equal(addedDoctorId);
    }).timeout(5000);

    //+
  it('DELETE /doctors:doctor_id should return UNAUTHORIZED without authorization header',
    async () => {
      const { status } = await chai
        .request(app)
        .delete(`/doctors/${addedDoctorId}`)
        .set('Content-Type', 'application/json');
      expect(status).to.equal(UNAUTHORIZED);
    }).timeout(5000);

    //+
  it('DELETE /doctors:doctor_id should return status FORBIDDEN by not admin',
   async () => {
    const { status } = await chai
      .request(app)
      .delete(`/doctors/${addedDoctorId}`)
      .set('Authorization', `Bearer ${tokenUser}`)
      .set('Content-Type', 'application/json');
    expect(status).to.equal(FORBIDDEN);
  }).timeout(5000);

  //+
  it('DELETE /doctors:doctor_id should delete by admin',
    async () => {
      const { status } = await chai
        .request(app)
        .delete(`/doctors/${addedDoctorId}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .set('Content-Type', 'application/json');
      expect(status).to.equal(OK);
    }).timeout(5000);

//+
  it('DELETE trash user doctors',
    async () => {
      const { status } = await chai
        .request(app)
        .delete(`/users/${addedUserId}`)
        .set('Authorization', `Bearer ${tokenAdmin}`);
      expect(status).to.equal(OK);
    }).timeout(5000);

});