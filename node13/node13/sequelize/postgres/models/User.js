import { Sequelize } from 'sequelize';
const sequelize = require('../index')

const User = sequelize.define(
  'user',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      field: 'id',
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    login: {
      allowNull: false,
      field: 'login',
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      allowNull: false,
      field: 'password',
      type: Sequelize.STRING,
    },
    
    roleId: {
      allowNull: false,
      field: 'role_id',
      type: Sequelize.BIGINT,
    },
  },
  {
    tableName: 'users',
    timestamps: false,
  },
);

User.prototype.toJSON = function () {
  const user = { ...this.dataValues };

  delete user.password;

  return user;
};

export default User;