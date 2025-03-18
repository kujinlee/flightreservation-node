#!/bin/bash

# Create the project directory
mkdir -p flightreservation-node/src/{config,controllers,models,routes,views}

# Navigate to the project directory
cd flightreservation-node

# Initialize a new Node.js project
npm init -y

# Install required dependencies
npm install express ejs sequelize mysql2 dotenv

# Create .env file
cat <<EOL > .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=reservation
PORT=8080
EOL

# Create database configuration file
cat <<EOL > src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

module.exports = sequelize;
EOL

# Create reservation model
cat <<EOL > src/models/reservation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define('Reservation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    numberOfBags: { type: DataTypes.INTEGER },
    checkedIn: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = Reservation;
EOL

# Create flight controller
cat <<EOL > src/controllers/flightController.js
const Reservation = require('../models/reservation');

exports.renderFindFlights = (req, res) => {
    res.render('findFlights');
};

exports.findFlights = (req, res) => {
    const { from, to, departureDate } = req.body;
    res.send(\`Searching flights from \${from} to \${to} on \${departureDate}\`);
};

exports.completeCheckIn = async (req, res) => {
    const { reservationId, numberOfBags } = req.body;
    const reservation = await Reservation.findByPk(reservationId);
    if (reservation) {
        reservation.numberOfBags = numberOfBags;
        reservation.checkedIn = true;
        await reservation.save();
        res.render('checkInConfirmation', { msg: 'Check-in completed successfully!' });
    } else {
        res.status(404).send('Reservation not found');
    }
};
EOL

# Create flight routes
cat <<EOL > src/routes/flightRoutes.js
const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');

router.get('/findFlights', flightController.renderFindFlights);
router.post('/findFlights', flightController.findFlights);
router.post('/completeCheckIn', flightController.completeCheckIn);

module.exports = router;
EOL

# Create app.js
cat <<EOL > src/app.js
const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const flightRoutes = require('./routes/flightRoutes');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', flightRoutes);

// Sync database and start server
sequelize.sync().then(() => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(\`Server running on http://localhost:\${PORT}\`));
});
EOL

# Create EJS views
cat <<EOL > src/views/findFlights.ejs
<!DOCTYPE html>
<html>
<head>
    <title>Find Flights</title>
</head>
<body>
    <h2>Find Flights</h2>
    <form action="/findFlights" method="post">
        <label>From: <input type="text" name="from" required></label><br>
        <label>To: <input type="text" name="to" required></label><br>
        <label>Departure Date: <input type="date" name="departureDate" required></label><br>
        <button type="submit">Search</button>
    </form>
</body>
</html>
EOL

cat <<EOL > src/views/checkIn.ejs
<!DOCTYPE html>
<html>
<head>
    <title>Check-In</title>
</head>
<body>
    <h2>Check-In</h2>
    <form action="/completeCheckIn" method="post">
        <label>Reservation ID: <input type="number" name="reservationId" required></label><br>
        <label>Number of Bags: <input type="number" name="numberOfBags" required></label><br>
        <button type="submit">Check-In</button>
    </form>
</body>
</html>
EOL

cat <<EOL > src/views/checkInConfirmation.ejs
<!DOCTYPE html>
<html>
<head>
    <title>Check-In Confirmation</title>
</head>
<body>
    <h2>Check-In Confirmation</h2>
    <p><%= msg %></p>
</body>
</html>
EOL

cat <<EOL > src/views/completeReservation.ejs
<!DOCTYPE html>
<html>
<head>
    <title>Complete Reservation</title>
</head>
<body>
    <h2>Complete Reservation</h2>
    <form action="/completeReservation" method="post">
        <label>Reservation ID: <input type="number" name="reservationId" required></label><br>
        <label>Card Number: <input type="text" name="cardNumber" required></label><br>
        <label>Expiry Date: <input type="text" name="expiryDate" required></label><br>
        <label>CVV: <input type="text" name="cvv" required></label><br>
        <button type="submit">Complete Reservation</button>
    </form>
</body>
</html>
EOL

# Create README.md
cat <<EOL > README.md
# Flight Reservation System (Node.js)

This is a Node.js implementation of the Flight Reservation System. It allows users to search for flights, complete reservations, and check-in for flights.

## Prerequisites

- Node.js
- Docker (for database setup)

## Setup

1. Install dependencies:
    \`\`\`sh
    npm install
    \`\`\`

2. Set up the database using Docker:
    \`\`\`sh
    docker-compose up -d
    \`\`\`

3. Start the application:
    \`\`\`sh
    npm start
    \`\`\`

4. Access the application at [http://localhost:8080](http://localhost:8080).
EOL

echo "Node.js project setup complete!"
