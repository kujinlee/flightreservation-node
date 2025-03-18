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
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
