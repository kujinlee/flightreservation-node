const sequelize = require('../config/database');
const Flight = require('./flight');
const Reservation = require('./reservation');

// Set up associations with explicit foreign key names and aliases
Flight.hasMany(Reservation, { foreignKey: 'flight_id', as: 'reservations' });
Reservation.belongsTo(Flight, { foreignKey: 'flight_id', as: 'flight' });

console.log('Associations initialized:');
console.log(Reservation.associations);

module.exports = { sequelize, Flight, Reservation };