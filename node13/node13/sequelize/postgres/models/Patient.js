import { Sequelize } from 'sequelize';
const sequelize = require('../index')

const Patient = sequelize.define(
  'patient',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      field: 'id',
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
  userId: {
      allowNull: false,
      field: 'user_id',
      type: Sequelize.BIGINT,
    },
    doctorId: {
      allowNull: false,
      field: 'doctor_id',
      type: Sequelize.BIGINT,
    },
    
  },
  {
    tableName: 'patients',
    timestamps: false,
  },
);

export default Patient;