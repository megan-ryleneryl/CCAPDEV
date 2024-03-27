/* Import Models */
const User = require('../models/User');
const Reservation = require('../models/Reservation');

/* Define Functions */
async function getAllReservations (req, res) {
    try {
        const numberOfSeats = 10;
        const today = new Date();
        const seatNumber = [];
        const timeslots = [];
        const dates = [];
        let date = req.query.date;
        let lab = req.query.lab;

        if(!date && !lab) {
            date = (today.getMonth() + 1).toString().padStart(2, 0) + '-' + today.getDate().toString().padStart(2, 0) + '-' + today.getFullYear().toString();;
            lab = "1";
        }

        const reservations = await Reservation.find({ date: date, lab: lab, reservationID: { $ne: '20000' } });

        // Initialize the number of seats from 1 to 10
        for(let i = 1; i <= numberOfSeats; i++) {
            seatNumber.push(i);
        }

        // For every timeslot, loop through every 30 mins, loop through every seat, and every reservation to check if that seat is reserved
        for (let hour = 9; hour <= 17; hour++) {
            for (let mins = 0; mins < 60; mins += 30) {
                const time = `${hour % 12 === 0 ? 12 : hour % 12}:${mins === 0 ? '00' : mins}${hour >= 12 ? 'PM' : 'AM'}`;
                const seats = [];

                for (let j = 1; j <= numberOfSeats; j++) {
                    let isReserved = false;
                    let userID = 999;
                    let name = '';

                    for (let i = 0; i < reservations.length; i++) {
                        if(reservations[i].timeslot === time && reservations[i].seat === j.toString()) {
                            isReserved = true;
                            userID = reservations[i].userID;
                            break;
                        }
                    }

                    if(userID !== 999) {
                        try {
                            const reservation = await User.findOne({ userID: userID });
                            if (reservation) {
                                name = reservation.name;
                            } else {
                                name = 'Anonymous';
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

        // Generate today and the next 6 days for the dropdown
        for (let i = 0; i < 7; i++) {
            const listDate = new Date(today);
            listDate.setDate(today.getDate() + i);
            const formattedDate =  (listDate.getMonth() + 1).toString().padStart(2, 0) + '-' + listDate.getDate().toString().padStart(2, 0) + '-' + listDate.getFullYear().toString();
            dates.push(formattedDate);
        }

        // Render the Handlebars template with the data
        res.render('../views/homepage.hbs', {
            layout: 'main.hbs', // Layout file to use
            title: 'Homepage', // Title of the page
            css: ['homepage.css'], // Array of CSS files to include
            js: ['homepage.js'], // Array of JavaScript files to include
            view: 'homepage', // View file to use
            user: req.user, // User info

            seatNumber: seatNumber, // Number of seats from 1 to 10
            timeslots: timeslots, // Timeslots from 9:00AM to 5:30PM
            seats: Array.from({ length: numberOfSeats }, (_, i) => i + 1), // Array of seats per timeslot
            dates: dates // Dates for selector dropdown
        })
    } catch (error) {
        console.log(error);
    }
};

async function refreshReservations (req, res) {
    try {
        const numberOfSeats = 10;
        const today = new Date();
        const seatNumber = [];
        const timeslots = [];
        const dates = [];
        let date = req.query.date;
        let lab = req.query.lab;

        if(!date && !lab) {
            date = (today.getMonth() + 1).toString().padStart(2, 0) + '-' + today.getDate().toString().padStart(2, 0) + '-' + today.getFullYear().toString();;
            lab = "1";
        }

        const reservations = await Reservation.find({ date: date, lab: lab, reservationID: { $ne: '20000' } });

        // Initialize the number of seats from 1 to 10
        for(let i = 1; i <= numberOfSeats; i++) {
            seatNumber.push(i);
        }

        // For every timeslot, loop through every 30 mins, loop through every seat, and every reservation to check if that seat is reserved
        for (let hour = 9; hour <= 17; hour++) {
            for (let mins = 0; mins < 60; mins += 30) {
                const time = `${hour % 12 === 0 ? 12 : hour % 12}:${mins === 0 ? '00' : mins}${hour >= 12 ? 'PM' : 'AM'}`;
                const seats = [];

                for (let j = 1; j <= numberOfSeats; j++) {
                    let isReserved = false;
                    let userID = 999;
                    let name = '';

                    for (let i = 0; i < reservations.length; i++) {
                        if(reservations[i].timeslot === time && reservations[i].seat === j.toString()) {
                            isReserved = true;
                            userID = reservations[i].userID;
                            break;
                        }
                    }

                    if(userID !== 999) {
                        try {
                            const reservation = await User.findOne({ userID: userID });
                            if (reservation) {
                                name = reservation.name;
                            } else {
                                name = 'Anonymous';
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

        // Generate today and the next 6 days for the dropdown
        for (let i = 0; i < 7; i++) {
            const listDate = new Date(today);
            listDate.setDate(today.getDate() + i);
            const formattedDate =  (listDate.getMonth() + 1).toString().padStart(2, 0) + '-' + listDate.getDate().toString().padStart(2, 0) + '-' + listDate.getFullYear().toString();
            dates.push(formattedDate);
        }

        // Send back the updated table data as json
        res.json({
            seatNumber: seatNumber,
            timeslots: timeslots,
            seats: Array.from({ length: numberOfSeats }, (_, i) => i + 1),
            dates: dates
        });
    } catch (error) {
        console.log(error);
    }
};

async function getUser(req, res) {
    // Get the userID given their name, else return 10000 (default)
    const name = req.query.name;
    try {
        const user = await User.findOne({ name: name });
        const userID = user.userID;
        
        if(!userID) {
            userID = '10000'
        }
        
        res.json({ userID: userID });
    } catch (error) {
        console.error(error);
    }
};

/* Allow functions to be used by other files */
module.exports = {
    getAllReservations,
    refreshReservations,
    getUser
}