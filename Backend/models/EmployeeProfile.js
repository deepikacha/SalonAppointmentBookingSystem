const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const EmployeeProfile = sequelize.define('EmployeeProfile', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  services: {
    type: DataTypes.STRING, // Comma-separated list of services
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = EmployeeProfile;
