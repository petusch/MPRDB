import { Sequelize } from 'sequelize';
const sequelize = require('../index')

const Doctor = sequelize.define(
  'doctor',
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
    cabinet_number: {
      allowNull: true,
      field: 'description',
      type: Sequelize.STRING,
    },
    specialityId: {
      allowNull: false,
      field: 'speciality_id',
      type: Sequelize.BIGINT,
    },
    
  },
  {
    tableName: 'doctors',
    timestamps: false,
  },
);

export default Doctor;