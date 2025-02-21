const {  DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const EmployeeProfile = require('./EmployeeProfile');

const EmployeeTimeslot = sequelize.define('EmployeeTimeslot', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  reserved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

EmployeeProfile.hasMany(EmployeeTimeslot, { foreignKey: 'employeeId' });
EmployeeTimeslot.belongsTo(EmployeeProfile, { foreignKey: 'employeeId' });

module.exports = EmployeeTimeslot;
