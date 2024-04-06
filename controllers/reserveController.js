/* Import Models */
const User = require('../models/User');
const Reservation = require('../models/Reservation');

/* Define Functions */
async function makeReservation (req, res) {
    try {
        const numberOfSeats = 10;
        const today = new Date();
        const seatNumber = [];
        const timeslots = [];
        const dates = [];
        const names = [];
        let date = req.query.date;
        let lab = req.query.lab;

        const users = await User.find();
        const loggedUser = req.user;
        
        // Determine account type
        // If student, only include anon and own name
        if(loggedUser.accType === "Student") {
            names.push("Anonymous");
            thisUser = users.find(user => user.userID === loggedUser.userID); // TOOD: change after session handling
            names.push(thisUser.name);
        } else {
            // If admin, include all names except admins
            for(let i = 0; i < users.length; i++) {
                if(users[i].accType !== 'Lab Technician') {
                    names.push(users[i].name);
                }
            }
        }

        if(!date && !lab) {
            date = (today.getMonth() + 1).toString().padStart(2, 0) + '-' + today.getDate().toString().padStart(2, 0) + '-' + today.getFullYear().toString();
            lab = "1";
        }

        const reservations = await Reservation.find({ date: date, lab: lab, reservationID: { $ne: '20000' }, userID: { $ne: '10000'} });

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
                    let userID = 99999;
                    let name = '';

                    for (let i = 0; i < reservations.length; i++) {
                        if(reservations[i].timeslot === time && reservations[i].seat === j.toString()) {
                            isReserved = true;
                            userID = reservations[i].userID;
                            break;
                        }
                    }

                    if(userID !== 99999) {
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
                    userID = 99999;
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
        res.render('../views/reserve.hbs', {
            layout: 'main.hbs', // Layout file to use
            title: 'Reserve a Slot', // Title of the page
            css: ['reserve.css'], // Array of CSS files to include
            js: ['reserve.js'], // Array of JavaScript files to include
            view: 'reserve', // View file to use
            names: names, // Names of the users
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

async function refreshTable (req, res) {
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
                    let userID = 99999;
                    let name = '';

                    for (let i = 0; i < reservations.length; i++) {
                        if(reservations[i].timeslot === time && reservations[i].seat === j.toString()) {
                            isReserved = true;
                            userID = reservations[i].userID;
                            break;
                        }
                    }

                    if(userID !== 99999) {
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
                    userID = 99999;
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

async function submitReservation (req, res) { 
    const selectedCells = req.body || [];
    const name = selectedCells[0].name;
    let userID = '';

    try {
        // Load user and last reservationID
        if(name !== 'Anonymous') {
            const user = await User.findOne({ name: name });
            userID = user.userID;
        } else {
            userID = '99999'; 
        }
        
        const numReservations = await Reservation.countDocuments();
        let newReservationID = 20001 + parseInt(numReservations);
        
        // Prepare requestDate
        const today = new Date();
        const requestDate = (today.getMonth() + 1).toString().padStart(2, 0) + '-' + today.getDate().toString().padStart(2, 0) + '-' + today.getFullYear().toString();
        
        // Prepare requestTime
        const hours = today.getHours() % 12 || 12;
        const minutes = today.getMinutes().toString().padStart(2, '0');
        const ampm = today.getHours() >= 12 ? 'PM' : 'AM';
        const requestTime = hours + ':' + minutes + ampm;

        // Create new reservations in the database
        for(let i = 0; i < selectedCells.length; i++) {
            Reservation.create({
                reservationID: newReservationID.toString(),
                lab: selectedCells[i].lab,
                date: selectedCells[i].date,
                timeslot: selectedCells[i].timeslot,
                seat: selectedCells[i].seat,
                userID: userID,
                requestDate: requestDate,
                requestTime: requestTime
            });

            newReservationID = newReservationID + 1;
        }
        res.status(200).json({ message: 'Reservations created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating reservations' });
    }
}

/* Allow functions to be used by other files */
module.exports = {
    makeReservation,
    refreshTable,
    submitReservation
}