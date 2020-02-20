import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { OK, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, NOT_ACCEPTABLE } from 'http-status';
import app from '../app';

chai.use(chaiHttp);

describe('/patients', () => {
  let tokenAdmin;
  let tokenUser;
  let userId;
  let addedDoctorId;
  let addedPatientId;
  let addedUserId;

  const patientName = 'patient name';
  const newPatientName = 'name';

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
          jwt,
          user: { _id }
        },
      },
    } = await chai
      .request(app)
      .post('/login')
      .send({
        login: 'mama2',
        password: 'mama2',
      })
      .set('Content-Type', 'application/json');
      tokenUser = jwt;
      userId = _id;
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
        login: 'ww4s45',
        password: 'ww444s5'
      })
      .set('Content-Type', 'application/json');

    addedUserId = _id;
  });
 
 
  before(async () => {
    const {
        status,
        body: {
          data: {_id }
        }
      } = await chai
        .request(app)
        .post('/doctors')
        .send({
          name: 'ggg',
          user_id: addedUserId
        }) 
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .set('Content-Type', 'application/json');
    
      addedDoctorId = _id;
  });




//+
  it('POST /patients should return UNAUTHORIZED without authorization header',
    async () => {
      const { status } = await chai
        .request(app)
        .post('/patients')
        .send({
          name: patientName,
          doctor_id: addedDoctorId,
          user_id: addedUserId
        })
        .set('Content-Type', 'application/json');
      expect(status).to.equal(UNAUTHORIZED);
    }).timeout(5000);

  
//+
    it('POST /patients should return status FORBIDDEN by user',
    async () => {
      const { status } = await chai
        .request(app)
        .post('/patients')
        .set('Authorization', `Bearer ${tokenUser}`)
        .send({
          name: patientName,
          user_id: addedUserId,
          doctor_id: addedDoctorId
        })
        .set('Content-Type', 'application/json');
      expect(status).to.equal(FORBIDDEN);
    }).timeout(5000);


    it('POST /patients should create patient by admin or medsister',
    async () => {
      const {
        status,
        body: {
          data: { 
              _id, name, user_id, doctor_id
             }
        }
      } = await chai
        .request(app)
        .post('/patients')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({
          name: patientName,
          user_id: addedUserId,
          doctor_id: addedDoctorId
        })
        .set('Content-Type', 'application/json');
      expect(status).to.equal(OK);
      expect(name).to.equal(patientName);
      expect(user_id).to.equal(addedUserId);
      expect(doctor_id).to.equal(addedDoctorId);
      addedPatientId = _id;
   }
    ).timeout(5000);



    //+
  it('PUT /patients:patient_id should return UNAUTHORIZED without authorization header',
  async () => {
    const { status } = await chai
      .request(app)
      .put(`/patients/${addedPatientId}`)
      .send({
        name: newPatientName,
        user_id: addedUserId
      })
      .set('Content-Type', 'application/json');
    expect(status).to.equal(UNAUTHORIZED);
  }).timeout(5000);

//+
it('PUT /patients:patient_id should return status FORBIDDEN by not admin', 
async () => {
  const { status } = await chai
    .request(app)
    .put(`/patients/${addedPatientId}`)
    .set('Authorization', `Bearer ${tokenUser}`)
    .send({
      name: newPatientName,
      user_id: addedUserId
    })
    .set('Content-Type', 'application/json');
  expect(status).to.equal(FORBIDDEN);
}).timeout(5000);

/*
it('PUT /patients:patient_id should update by admin',
  async () => {
    const {
      status,
      body: {
        data:
        {name, _id}
      }
    } = await chai
      .request(app)
      .put(`/patients/${addedPatientId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        name: newPatientName,
        user_id: addedUserId
      })
      .set('Content-Type', 'application/json');
    expect(status).to.equal(OK);
    expect(name).to.equal(newPatientName);
    expect(_id).to.equal(addedPatientId);
  }).timeout(5000);

*/
  //+
  it('GET /patients:patient_id should return UNAUTHORIZED without authorization header',
    async () => {
      const { status } = await chai
        .request(app)
        .get(`/patients/${addedPatientId}`)
        .set('Content-Type', 'application/json');
      expect(status).to.equal(UNAUTHORIZED);
    }).timeout(5000);

    /*
  it('GET /patients:patient_id should return patient',
    async () => {
      const {
        status,
        body: {
          data: { name, _id }
        }
      } = await chai
        .request(app)
        .get(`/patients/${addedPatientId}`)
        .set('Authorization', `Bearer ${tokenUser}`)
        .set('Content-Type', 'application/json');
      expect(status).to.equal(OK);
      expect(name).to.equal(newPatientName);
      expect(_id).to.equal(addedPatientId);
    }).timeout(5000);
*/
    //+
  it('DELETE /patients:patient_id should return UNAUTHORIZED without authorization header',
    async () => {
      const { status } = await chai
        .request(app)
        .delete(`/patients/${addedPatientId}`)
        .set('Content-Type', 'application/json');
      expect(status).to.equal(UNAUTHORIZED);
    }).timeout(5000);

    //+
  it('DELETE /patients:patient_id should return status FORBIDDEN by not admin',
   async () => {
    const { status } = await chai
      .request(app)
      .delete(`/patients/${addedPatientId}`)
      .set('Authorization', `Bearer ${tokenUser}`)
      .set('Content-Type', 'application/json');
    expect(status).to.equal(FORBIDDEN);
  }).timeout(5000);

  //+
  it('DELETE /patients:patient_id should delete by admin',
    async () => {
      const { status } = await chai
        .request(app)
        .delete(`/patients/${addedPatientId}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .set('Content-Type', 'application/json');
      expect(status).to.equal(OK);
    }).timeout(5000);

//+
  it('DELETE trash user patients',
    async () => {
      const { status } = await chai
        .request(app)
        .delete(`/users/${addedUserId}`)
        .set('Authorization', `Bearer ${tokenAdmin}`);
      expect(status).to.equal(OK);
    }).timeout(5000);

});