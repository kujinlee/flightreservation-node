const { Sequelize } = require('sequelize');
require('dotenv').config();

// Determine the database host
// Use `host.docker.internal` if running in a container, otherwise fallback to `127.0.0.1`
const DB_HOST = process.env.DB_HOST && process.env.DB_HOST.trim() !== '' 
    ? process.env.DB_HOST 
    : (process.env.DOCKER_ENV ? 'host.docker.internal' : '127.0.0.1');

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
});

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Sync the database
sequelize.sync().then(() => {
    console.log('Database synchronized');
});

module.exports = sequelize;
