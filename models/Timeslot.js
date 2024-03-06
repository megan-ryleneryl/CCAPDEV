const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema for Individual Timeslots in MongoDB
 * 
 * timeslotID - The unique identifier for the timeslot (10001)
 * lab - The lab number (1 = Tesla's Trove, 2 = Hopper's Hub, 3 = Ghandi's Haven)
 * date - The date of the timeslot (MM-DD-YYYY)
 * timeslot - The time of the timeslot (00:00AM)
 * seat - The seat number (1 to 10)
 */
const timeslotSchema = new Schema({
    timeslotID: { type: Number, required: true, unique: true },
    lab: { type: Number, required: true },
    date: { type: Date, required: true },
    timeslot: { type: String, required: true },
    seat: { type: Number, required: true }
})

const Timeslot = mongoose.model('timeslots', timeslotSchema); // 'timeslots' is the name of the collection in the database
module.exports = Timeslot; // Export the model so that it can be used in other files
