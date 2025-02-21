const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserTimeSlot = require('./UserTimeslot');

const CompletedSession = sequelize.define('CompletedSession', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  feedback: {
    type: DataTypes.TEXT,
  },
  review: {
    type: DataTypes.TEXT,
  },
  services: {
    type: DataTypes.STRING, // Comma-separated list of services
    allowNull: false,
  },
  userTimeSlotId: {
    type: DataTypes.INTEGER,
    references: {
      model: UserTimeSlot,
      key: 'id',   
    },
  },
  employeeResponse: {
    type: DataTypes.TEXT, // Employee's single response to user's feedback
  },
});

UserTimeSlot.hasMany(CompletedSession, { foreignKey: 'userTimeSlotId' });
CompletedSession.belongsTo(UserTimeSlot, { foreignKey: 'userTimeSlotId' });

module.exports = CompletedSession;
