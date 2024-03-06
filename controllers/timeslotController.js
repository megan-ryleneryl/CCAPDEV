/* Import Models */
const Timeslot = require('../models/Timeslot');
const User = require('../models/User');
const Reservation = require('../models/Reservation');

/* Define Functions */
// Don't forget to export the function at the end of this document

const getAllTimeslots = (req, res) => {
    Timeslot.find().lean() //I don't fully understand this yet ngl
        .then((result) => {
            // If the query is successful, render the homepage view by passing the result of the query to the view
            res.render('../views/index.html', {
                title: "Bean There, Done That",
                timeslots: result
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

/* Allow functions to be used by other files */
module.exports = {
    getAllTimeslots
}