const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema for Reservations in MongoDB
 * 
 * reservationID - The unique identifier of the reservation (20001)
 * timeslotID - The ID of the reserved timeslot (10001)
 * userID - The ID of the reserving user (10001)
 * requestDate - The date of the request (MM-DD-YYYY)
 * requestTime - The time of the request (00:00AM)
 */
const reservationSchema = new Schema({
    reservationID: { type: Number, required: true, unique: true },
    timeslotID: { type: Number, required: true },
    userID: { type: Number, required: true },
    requestDate: { type: Date, required: true },
    requestTime: { type: String, required: true }
})

const Reservation = mongoose.model('reservations', reservationSchema); // 'users' is the name of the collection in the database
module.exports = Reservation; // Export the model so that it can be used in other files
