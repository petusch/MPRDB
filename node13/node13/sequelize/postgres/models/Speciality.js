import { Sequelize } from 'sequelize';
import Doctor from './Doctor';
const sequelize = require('../index')

const Speciality = sequelize.define(
  'speciality',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      field: 'id',
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    
    name: {
      allowNull: false,
      field: 'name',
      type: Sequelize.STRING,
    },
  },
  {
    tableName: 'specialities',
    timestamps: false,
  },
);

export default Speciality;