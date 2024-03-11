/* Import Models */
const Reservation = require('../models/Reservation');

/* Define Functions */
const getAllReservations = (req, res) => {
    res.render('../views/homepage.hbs', {
        layout: 'main.hbs', // Layout file to use
        title: 'Homepage', // Title of the page
        css: ['homepage.css'], // Array of CSS files to include
        js: ['homepage.js'], // Array of JavaScript files to include
        view: 'homepage', // View file to use
        accType: "Lab Technician" //TEMP
    })


    // Reservation.find().lean() //I don't fully understand this yet ngl
    //     .then((result) => {
    //         // If the query is successful, render the homepage view by passing the result of the query to the view
    //         res.render('../views/homepage.hbs', {
    //             title: "Swiftseats Homepage",
    //             timeslots: result
    //         });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
};

/* Allow functions to be used by other files */
module.exports = {
    getAllReservations
}