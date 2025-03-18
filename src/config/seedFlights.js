const Flight = require('../models/flight');
const sequelize = require('./database');

async function seedFlights() {
    try {
        await sequelize.sync({ force: true }); // Drops and recreates tables
        await Flight.bulkCreate([
            {
                departureCity: 'AUS',
                arrivalCity: 'NYC',
                departureDate: '2024-02-05',
                flightNumber: 'AA123',
                airline: 'American Airlines',
                price: 300.0,
            },
            {
                departureCity: 'AUS',
                arrivalCity: 'NYC',
                departureDate: '2024-02-05',
                flightNumber: 'DL456',
                airline: 'Delta Airlines',
                price: 350.0,
            },
            {
                departureCity: 'LAX',
                arrivalCity: 'ORD',
                departureDate: '2024-02-06',
                flightNumber: 'UA789',
                airline: 'United Airlines',
                price: 200.0,
            },
        ]);
        console.log('Flight data seeded successfully.');
    } catch (error) {
        console.error('Error seeding flight data:', error);
    } finally {
        await sequelize.close();
    }
}

seedFlights();