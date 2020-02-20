import { Sequelize } from 'sequelize';
const sequelize = require('../index')

const Role = sequelize.define(
  'role',
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
    tableName: 'role',
    timestamps: false,
  },
);

export default Role;