const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');

router.get('/findFlights', flightController.renderFindFlights);
router.post('/findFlights', flightController.findFlights);
router.get('/checkIn', flightController.renderCheckInPage);
router.post('/completeCheckIn', flightController.completeCheckIn);
router.get('/reserve', flightController.renderReservationPage);
router.post('/reserve', flightController.createReservation);

module.exports = router;
