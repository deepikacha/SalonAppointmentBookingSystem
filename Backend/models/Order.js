const {  DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserProfile = require('./UserProfile');

const Order = sequelize.define('Order', {
  paymentId: {
    type: DataTypes.STRING,
    
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:'pending'
  },
});

UserProfile.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(UserProfile, { foreignKey: 'userId' });

module.exports = Order;
