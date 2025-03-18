const Reservation = require('../models/reservation');
const Flight = require('../models/flight');

exports.renderFindFlights = (req, res) => {
    res.render('findFlights');
};

exports.findFlights = async (req, res) => {
    const { from, to, departureDate } = req.body;

    try {
        const flights = await Flight.findAll({
            where: {
                departureCity: from,
                arrivalCity: to,
                dateOfDeparture: departureDate,
            },
        });

        if (flights.length > 0) {
            res.render('findFlightsResults', { flights });
        } else {
            res.render('findFlightsResults', { flights: [], msg: 'No flights found for the given criteria.' });
        }
    } catch (error) {
        console.error('Error finding flights:', error);
        res.status(500).send('An error occurred while searching for flights.');
    }
};

exports.completeCheckIn = async (req, res) => {
    const { reservationId, numberOfBags } = req.body;

    try {
        const reservation = await Reservation.findByPk(reservationId, {
            include: [{ model: Flight, as: 'flight' }],
        });

        if (reservation) {
            reservation.numberOfBags = numberOfBags;
            reservation.checkedIn = true;
            await reservation.save();

            res.render('checkInConfirmation', {
                msg: 'Check-in completed successfully!',
                reservation,
                flight: reservation.flight,
            });
        } else {
            res.status(404).send('Reservation not found');
        }
    } catch (error) {
        console.error('Error during check-in:', error);
        res.status(500).send('An error occurred during check-in.');
    }
};

exports.renderReservationPage = async (req, res) => {
    const { flightId } = req.query;

    try {
        const flight = await Flight.findByPk(flightId);
        if (flight) {
            res.render('reserve', { flight });
        } else {
            res.status(404).send('Flight not found');
        }
    } catch (error) {
        console.error('Error rendering reservation page:', error);
        res.status(500).send('An error occurred while loading the reservation page.');
    }
};

exports.createReservation = async (req, res) => {
    const { flightId, passengerId, cardNumber, amount } = req.body;

    try {
        const reservation = await Reservation.create({
            flightId,
            passengerId,
            cardNumber,
            amount: parseFloat(amount), // Ensure amount is stored as a number
        });

        res.render('reservationConfirmation', { reservation });
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).send('An error occurred while creating the reservation.');
    }
};

exports.renderCheckInPage = async (req, res) => {
    const { reservationId } = req.query;

    try {
        const reservation = await Reservation.findByPk(reservationId);
        if (reservation) {
            res.render('checkIn', { reservation });
        } else {
            res.status(404).send('Reservation not found');
        }
    } catch (error) {
        console.error('Error rendering check-in page:', error);
        res.status(500).send('An error occurred while loading the check-in page.');
    }
};
