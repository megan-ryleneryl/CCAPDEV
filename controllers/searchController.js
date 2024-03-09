/* Import Models */
const User = require('../models/User');
const Reservation = require('../models/Reservation');

/* Define Functions */
const getTimeslotByQuery = (req, res) => {
    const searchQuery = req.body.searchQuery; // revise to take in the indiv filters
    
    //insert Reservation.find() and User.find()
}

/* Allow functions to be used by other files */
module.exports = {
    getTimeslotByQuery
}