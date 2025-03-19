const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const sequelize = require('./config/database');
const flightRoutes = require('./routes/flightRoutes');
require('./models'); // Ensure models and associations are initialized

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set global base URL
const BASE_URL = '/flightreservation-node';
app.use((req, res, next) => {
    res.locals.BASE_URL = '/flightreservation-node'; // Make BASE_URL available in all views
    next();
});
app.use(BASE_URL, flightRoutes);

// Load SSL/TLS certificates if HTTPS is enabled
const USE_HTTPS = process.env.USE_HTTPS === 'true';
let server;

if (USE_HTTPS) {
    const sslOptions = {
        key: fs.readFileSync(path.join(__dirname, '../certs/key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '../certs/cert.pem')),
    };
    console.log('SSL options loaded:', sslOptions);
    server = https.createServer(sslOptions, app);
} else {
    server = http.createServer(app);
}

// Sync database and start the server
sequelize.sync().then(() => {
    const PORT = process.env.PORT || 8080; // Internal port the app listens on
    const EXPOSED_PORT = process.env.EXPOSED_PORT || PORT; // External port for containerized environments
    const HOST_PORT = process.env.DOCKER_ENV === 'true' ? EXPOSED_PORT : PORT; // Use EXPOSED_PORT only if DOCKER_ENV=true
    const HOST_URL = process.env.HOST_URL || 'localhost'; // Use HOST_URL from .env or default to 'localhost'

    server.listen(PORT, () => {
        const protocol = USE_HTTPS ? 'https' : 'http';
        console.log(`Server running on ${protocol}://${HOST_URL}:${HOST_PORT}${BASE_URL}`);
    });
});
