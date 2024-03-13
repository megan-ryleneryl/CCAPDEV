const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema for Reservations in MongoDB
 * 
 * reservationID - The unique identifier of the reservation (20001)
 * lab - The lab number (1 = Tesla's Trove, 2 = Hopper's Hub, 3 = Ghandi's Haven)
 * date - The date of the timeslot (MM-DD-YYYY)
 * timeslot - The time of the timeslot (00:00AM)
 * seat - The seat number (1 to 10)
 * userID - The ID of the reserving user (10001)
 * requestDate - The date of the request (MM-DD-YYYY)
 * requestTime - The time of the request (00:00AM)
 */
const reservationSchema = new Schema({
    reservationID: { type: String, required: true, unique: true },
    lab: { type: String, required: true },
    date: { type: String, required: true },
    timeslot: { type: String, required: true },
    seat: { type: String, required: true },
    userID: { type: String, required: true },
    requestDate: { type: String, required: true },
    requestTime: { type: String, required: true }
})

const Reservation = mongoose.model('reservations', reservationSchema); // 'users' is the name of the collection in the database
module.exports = Reservation; // Export the model so that it can be used in other files
