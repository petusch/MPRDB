import { Sequelize } from 'sequelize';
import User from './User';
const sequelize = require('../index')

const UserInfo = sequelize.define(
  'userInfo',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      field: 'id',
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    dob: {
      allowNull: true,
      field: 'dob',
      type: Sequelize.DATEONLY,
    },
    image: {
      allowNull: true,
      field: 'image',
      type: Sequelize.STRING,
    },
    userId: {
      allowNull: false,
      field: 'user_id',
      type: Sequelize.BIGINT,
    },
    lastname: {
      allowNull: true,
      field: 'lastname',
      type: Sequelize.STRING,
    },
    firstname: {
      allowNull: true,
      field: 'firstname',
      type: Sequelize.STRING,
    },
  },
  {
    tableName: 'userInfo',
    timestamps: false,
  },
);

export default UserInfo;