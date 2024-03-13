/* Import Models */
const Reservation = require('../models/Reservation');

/* Define Functions */
async function getAllReservations (req, res) {
    try {
        const reservations = await Reservation.find();
        const numberOfSeats = 10;
        const seatNumber = [];
        const timeslots = [];

        // Initialize the number of seats from 1 to 10
        for(let i = 1; i <= numberOfSeats; i++) {
            seatNumber.push(i);
        }

        for (let hour = 9; hour <= 17; hour++) {
            for (let mins = 0; mins < 60; mins += 30) {
                const time = `${hour % 12 === 0 ? 12 : hour % 12}:${mins === 0 ? '00' : mins}${hour >= 12 ? 'PM' : 'AM'}`;
                const seats = [];

                for (let j = 1; j <= numberOfSeats; j++) {
                    let isReserved = false;
                    let userID = 999;
                    let name = '';

                    for (let i = 0; i < reservations.length; i++) {
                        if(reservations[i].timeslot === time && reservations[i].seat === j) {
                            isReserved = true;
                            userID = reservations[i].userID;
                            break;
                        }
                    }

                    if(userID !== 999) {
                        try {
                            const reservation = await reservations.findOne({ userID: userID });
                            if (reservation) {
                                name = reservation.name;
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    
                    const className = isReserved ? 'reserved' : 'available';
                    seats.push({ reserved: isReserved, class: className, name: name });
                    userID = 999;
                    name = '';
                }
                timeslots.push({ time: time, seats: seats });
            }
        }

        // Render the Handlebars template with the data
        res.render('../views/homepage.hbs', {
            layout: 'main.hbs', // Layout file to use
            title: 'Homepage', // Title of the page
            css: ['homepage.css'], // Array of CSS files to include
            js: ['homepage.js'], // Array of JavaScript files to include
            view: 'homepage', // View file to use
            accType: "Lab Technician", //TEMP

            seatNumber: seatNumber, // Number of seats from 1 to 10
            timeslots: timeslots, 
            seats: Array.from({ length: numberOfSeats }, (_, i) => i + 1),
        })
    } catch (error) {
        console.log(error);
    }
};

/* Allow functions to be used by other files */
module.exports = {
    getAllReservations
}