/* Import Models */
const User = require('../models/User');
const Reservation = require('../models/Reservation');

/* Define Functions */
const makeReservation = (req, res) => {
    // extract user, extract array of slots
    // for every reservation in slots array, create record in mongodb


}

/* Allow functions to be used by other files */
module.exports = {
    makeReservation
}