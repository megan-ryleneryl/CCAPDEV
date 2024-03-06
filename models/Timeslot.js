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
const timeslotSchema = new Schema({
    tiemslotID: { type: Number, required: true, unique: true },
    labName: { type: String, required: true },
    date: { type: Date, required: true },
    timeslot: { type: String, required: true },
    seat: { type: Number, required: true }
})

const Timeslot = mongoose.model('timeslots', timeslotSchema); // 'users' is the name of the collection in the database
module.exports = Timeslot; // Export the model so that it can be used in other files
