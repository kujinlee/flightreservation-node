const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

console.log(sequelize instanceof Sequelize); // Should log `true`

const Flight = sequelize.define('Flight', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    flightNumber: { type: DataTypes.STRING, allowNull: false, field: 'flight_number' },
    operatingAirlines: { type: DataTypes.STRING, allowNull: false, field: 'operating_airlines' },
    departureCity: { type: DataTypes.STRING, allowNull: false, field: 'departure_city' },
    arrivalCity: { type: DataTypes.STRING, allowNull: false, field: 'arrival_city' },
    dateOfDeparture: { type: DataTypes.DATEONLY, allowNull: false, field: 'date_of_departure' },
    estimatedDepartureTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'estimated_departure_time' },
    price: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0.0, field: 'price' },
}, {
    tableName: 'flight',
    timestamps: false,
});

module.exports = Flight;