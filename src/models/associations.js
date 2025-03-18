const Flight = require('./flight');
const Reservation = require('./reservation');

// Define associations
Flight.hasMany(Reservation, { foreignKey: 'flightId', as: 'reservations' });
Reservation.belongsTo(Flight, { foreignKey: 'flightId', as: 'flight' });

module.exports = { Flight, Reservation };