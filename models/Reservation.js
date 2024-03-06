const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema for User Profile in MongoDB
 * 
 * id - Unique identifier for the user
 * bio - Bio of the user (long)
 * avatar - filepath of the user's profile picture
 * password - user's password
 */
const reservationSchema = new Schema({
    reservationID: { type: Number, required: true, unique: true },
    timeslotID: { type: Number, required: true },
    userID: { type: Number, required: true },
    requestDate: { type: Date, required: true },
    requestTime: { type: String, required: true }
})

const Reservation = mongoose.model('timeslots', reservationSchema); // 'users' is the name of the collection in the database
module.exports = Reservation; // Export the model so that it can be used in other files
