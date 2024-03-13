/* Import Models */
const User = require('../models/User');
const Reservation = require('../models/Reservation');

/* Define Functions */
const openSearch = (req, res) => {
    res.render('../views/search.hbs', {
        layout: 'main.hbs', // Layout file to use
        title: 'Search Page', // Title of the page
        css: ['search.css'], // Array of CSS files to include
        js: ['search.js'], // Array of JavaScript files to include
        view: 'search', // View file to use
        accType: "Lab Technician" //TEMP
    })
}

/* Allow functions to be used by other files */
module.exports = {
    openSearch
}