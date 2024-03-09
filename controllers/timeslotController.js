/* Import Models */
const Reservation = require('../models/Reservation');

/* Define Functions */
const getAllReservations = (req, res) => {
    Reservation.find().lean() //I don't fully understand this yet ngl
        .then((result) => {
            // If the query is successful, render the homepage view by passing the result of the query to the view
            res.render('../views/homepage.hbs', {
                title: "Swiftseats Homepage",
                timeslots: result
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

/* Allow functions to be used by other files */
module.exports = {
    getAllReservations
}