import { Sequelize } from 'sequelize';
const sequelize = require('../index')

const PatientDiagnose = sequelize.define(
  'patient_diagnose',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      field: 'id',
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    patientId: {
        allowNull: false,
        field: 'patient_id',
        type: Sequelize.BIGINT,
      },
      diagnoseId: {
        allowNull: false,
        field: 'diagnose_id',
        type: Sequelize.BIGINT,
      }
  },
  {
    tableName: 'patients_diagnoses',
    timestamps: false,
  },
);

export default PatientDiagnose;