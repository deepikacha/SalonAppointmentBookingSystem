const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserProfile = require('./UserProfile');

const UserTimeSlot = sequelize.define('UserTimeSlot', {
  id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    unique:true,
    primaryKey:true,
    autoIncrement: true,
  },
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
  services: {
    type: DataTypes.STRING, // Comma-separated list of services
    allowNull: false,
  },
  customerId: {  // Define customerId as a foreign key field
    type: DataTypes.INTEGER,
    references: {
      model: 'UserProfiles',  // Name of the related table/model
      key: 'id',  // Primary key of the related model
    },
    allowNull: false,  // Ensure this field is required
  },
});

UserProfile.hasMany(UserTimeSlot, { foreignKey: 'customerId' });
UserTimeSlot.belongsTo(UserProfile, { foreignKey: 'customerId' });

module.exports = UserTimeSlot;
