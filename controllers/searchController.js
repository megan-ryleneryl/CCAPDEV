/* Import Models */
const User = require('../models/User');
const Reservation = require('../models/Reservation');

/* Define Functions */
async function openSearch (req, res) {
    try {
        const dates = [];
        const timeslots = [];
        let names = [];
        const today = new Date();
        const users = await User.find();

        // Get timeslots from 9:00AM to 5:30PM
        for (let hour = 9; hour <= 17; hour++) {
            for (let mins = 0; mins < 60; mins += 30) {
                const time = `${hour % 12 === 0 ? 12 : hour % 12}:${mins === 0 ? '00' : mins}${hour >= 12 ? 'PM' : 'AM'}`;
                timeslots.push(time);
            }
        }

        // Get the names of all users except admin
        users.forEach(user => {
            if(user.accType !== 'Lab Technician') {
                names.push(user.name);
            }
        });

        // Get the dates of today and the next 6 days
        for (let i = 0; i < 7; i++) {
            const listDate = new Date(today);
            listDate.setDate(today.getDate() + i);
            const formattedDate =  (listDate.getMonth() + 1).toString().padStart(2, 0) + '-' + listDate.getDate().toString().padStart(2, 0) + '-' + listDate.getFullYear().toString();
            dates.push(formattedDate);
        }
        
        res.render('../views/search.hbs', {
            layout: 'main.hbs', // Layout file to use
            title: 'Search Page', // Title of the page
            css: ['search.css'], // Array of CSS files to include
            js: ['search.js'], // Array of JavaScript files to include
            view: 'search', // View file to use
            user: req.user, // User info
    
            dates: dates, // Array of dates to display
            timeslots: timeslots, // Array of timeslots from 9:00AM to 5:30PM
            users: names // Array of user names to display, except admin
        })
    } catch (error) {
        console.error(error);
    }
}

async function getSlots(req, res) {    
    const selectedDate = req.body.date;
    const selectedLab = req.body.lab;
    const selectedTimeslot = req.body.timeslot;
    const selectedUser = req.body.user;
    let returnData = [];
    let label = 'seats';

    try {
        const reservations = await Reservation.find();

        // Search for user's slots with the given params
        // Else, search for all available slots given the params
        if(selectedUser !== 'default') {
            const user = await User.findOne({ name: selectedUser });
            const userID = user.userID;
            label = 'users';

            // Find all reservations with this userID
            reservations.forEach(reservation => {
                if(reservation.userID === userID) {
                    returnData.push(reservation);
                }
            });
        } else {
            reservations.forEach(reservation => {
                returnData.push(reservation);
            });
        }

        // Remove all slots that don't match the selected date
        if(selectedDate !== 'default') {
            returnData = returnData.filter(reservation => reservation.date === selectedDate);
        }

        // Remove all slots that don't match the selected lab
        if(selectedLab !== 'default') {
            returnData = returnData.filter(reservation => reservation.lab === selectedLab);
        }

        // Remove all slots that don't match the selected timeslot
        if(selectedTimeslot !== 'default') {
            returnData = returnData.filter(reservation => reservation.timeslot === selectedTimeslot);
        }

        if(returnData.length === 0) {
            label = 'none';
        }

        // Send back the updated table data as json
        // Every table row must contain lab, date, timeslot, seat, and user
        res.json({
            label: label,
            resultsData: returnData,
        });
    } catch (error) {
        console.error(error);
    }
}

/* Allow functions to be used by other files */
module.exports = {
    openSearch,
    getSlots
}