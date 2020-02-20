import User from './models/User';
import UserInfo from './models/UserInfo';
import Patient from './models/Patient';
import Doctor from './models/Doctor';
import Speciality from './models/Speciality';
import PatientDiagnose from './models/PatientDiagnose';
import Diagnose from './models/Diagnose';
import Role from './models/Role';


const touch = () => {
 
  Role.hasMany(User, { foreignKey: 'roleId' });

  User.belongsTo(Role);
  User.hasOne(UserInfo, { foreignKey: 'userId', onDelete: "cascade" });
  User.hasMany(Doctor, { foreignKey: 'userId' });

 Patient.belongsToMany(
    Diagnose,
    { foreignKey: 'patientId', through: PatientDiagnose }
  ); 

  Diagnose.belongsToMany(
    Patient,
    { foreignKey: 'diagnoseId', through: PatientDiagnose }
  );

  Patient.belongsTo(User, { foreignKey: 'userId' });
  Patient.belongsTo(Doctor, { foreignKey: 'doctorId' });

  Doctor.belongsTo(User, { foreignKey: 'userId' });
  Doctor.belongsTo(Speciality,  { foreignKey: 'specialityId'});
  }

export default touch;