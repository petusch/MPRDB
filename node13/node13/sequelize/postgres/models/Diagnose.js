import { Sequelize } from 'sequelize';
const sequelize = require('../index')

const Diagnose = sequelize.define(
  'diagnose',
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
      field: 'disease',
      type: Sequelize.STRING,
    }
    
  },
  {
    tableName: 'diagnoses',
    timestamps: false,
  },
);

export default Diagnose;