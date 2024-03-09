/* Import Models */
const User = require('../models/User');
const Reservation = require('../models/Reservation');

/* Define Functions */
const makeReservation = (req, res) => {
    res.render('../views/reserve.hbs', {
        layout: 'main.hbs', // Layout file to use
        title: 'Make Reservation', // Title of the page
        css: ['reserve.css'], // Array of CSS files to include
        js: ['reserve.js'], // Array of JavaScript files to include
        view: 'reserve', // View file to use
        accType: "Lab Technician" //TEMP
    })
}

const submitReservation = (req, res) => { 
    // extract user, extract array of slots
    // for every reservation in slots array, create record in mongodb
}

/* Allow functions to be used by other files */
module.exports = {
    makeReservation,
    submitReservation
}