/* Import Models */
const User = require('../models/User');
const Reservation = require('../models/Reservation');

/* Define Functions */
async function saveChanges(req, res) {
    res.redirect('/account'); //need to tweak
}

async function getProfile(req, res) {
    let mergedData = [];
    let accType = 1; // update this after session handling to be dynamic
    let labName = 'Unknown Lab';
    let userName = 'Anonymous';
    let formattedDate;
    let formattedRequestDate;
    
    try {
        const reservations = await Reservation.find();
        const users = await User.find();

        // Iterate over the reservations in mongodb
        for (let i = 0; i < reservations.length; i++) {
            // Format lab names into strings
            switch (reservations[i].lab) {
                case 1:
                    labName = 'Tesla\'s Trove';
                    break;
                case 2:
                    labName = 'Hopper\'s Hub';
                    break;
                case 3:
                    labName = 'Ghandi\'s Haven';
                    break;
                default:
                    break;
            }

            // Format the dates to MM-DD-YYYY format
            const date = new Date(reservations[i].date);
            const requestDate = new Date(reservations[i].requestDate);
            formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            formattedRequestDate = requestDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

            mergedData.push({labName: labName, seat: reservations[i].seat, date: formattedDate, timeslot: reservations[i].timeslot, requestDate: formattedRequestDate, requestTime: reservations[i].requestTime, userID: reservations[i].userID, userName: userName, accType: accType});
        }

        // Extract user names and push

        for(let j = 0; j < users.length; j++) {
            for(let k = 0; k < mergedData.length; k++) {
                if(users[j].userID == mergedData[k].userID) {
                    mergedData[k].userName = users[j].name;
                }
            }
        }

		mergedData.sort((a, b) => (a.date > b.date) ? 1 : - 1);
        
        res.render('../views/account.hbs', {
            layout: 'main.hbs', // Layout file to use
            title: 'Account Actions', // Title of the page
            css: ['account.css'], // Array of CSS files to include
            js: ['account.js'], // Array of JavaScript files to include
            view: 'account', // View file to use
            accType: "Lab Technician", //TEMP
            isAdmin: accType,
            mergedData: mergedData,
            userData: users
        });
    } catch (error) {
        console.error('Error fetching reservations', error);
        throw error;
    }
}

async function deleteAccount(req, res) {
    //get profile email, findOne that matches, and delete

    res.redirect('/login');
}

module.exports = {
    getProfile,
    saveChanges,
    deleteAccount
    // getUserByID,
    // getEditPageByUserID,
    // editUser
}