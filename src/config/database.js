const { Sequelize } = require('sequelize');
const { Flight, Reservation } = require('../models/associations');

require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

// Ensure models are initialized and associations are set up
sequelize.sync().then(() => {
    console.log('Database synchronized');
});

module.exports = sequelize;
