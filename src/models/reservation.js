const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define('Reservation', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    checkedIn: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'checked_in' },
    numberOfBags: { type: DataTypes.INTEGER, field: 'number_of_bags' },
    passengerId: { type: DataTypes.BIGINT, field: 'passenger_id' },
    flightId: { type: DataTypes.BIGINT, field: 'flight_id' },
    created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created' },
    cardNumber: { type: DataTypes.STRING, field: 'card_number' },
    amount: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0.0, field: 'amount' },
}, {
    tableName: 'reservation',
    timestamps: false,
});

module.exports = Reservation;