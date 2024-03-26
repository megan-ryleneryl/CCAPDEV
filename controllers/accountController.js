/* Import Models */
const User = require('../models/User');
const Reservation = require('../models/Reservation');

/* Define Functions */
async function saveChanges(req, res) {    
    try {
        // Extract updated user data from the request body
        const formData = req.body;
        const pfp = req.file;
        const user = await User.findOne({ email: formData.email });

        // Update user data with the updated fields
        if (user) {
            if(formData.name) {
                user.name = formData.name;
            }

            if(formData.password) {
                user.password = formData.password;
            }

            if(formData.bio) {
                user.bio = formData.bio;
            }

            if(pfp) {
                user.pfp = "/profile-pictures/" + pfp.originalname;
            }
            
            await user.save();

            // Send a success response
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            // If user not found, send an error response
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        // Handle any errors that occur during the update process
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function getProfile(req, res) {
    let mergedData = [];
    let accType = 1; // TODO: update this after session handling to be dynamic
    let labName = 'Unknown Lab';
    let userName = 'Anonymous';
    let formattedDate;
    let formattedRequestDate;
    
    try {
        const reservations = await Reservation.find();
        const users = await User.find({ userID: { $ne: '10000' } });
        const loggedUser = await User.findOne({ name: 'Pierre Ramos' });

        // Iterate over the reservations in mongodb
        for (let i = 0; i < reservations.length; i++) {
            if(reservations[i].reservationID !== '20000') {
                // Format lab names into strings
                switch (reservations[i].lab) {
                    case '1':
                        labName = 'Tesla\'s Trove';
                        break;
                    case '2':
                        labName = 'Hopper\'s Hub';
                        break;
                    case '3':
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
            js: ['account.js', 'profile.js'], // Array of JavaScript files to include
            view: 'account', // View file to use
            accType: "Lab Technician",
            user: loggedUser,
            isAdmin: accType,
            mergedData: mergedData,
            userData: users
        });
    } catch (error) {
        console.error('Error fetching reservations', error);
        throw error;
    }
}

async function editReservation(req, res) {
    const receivedData = req.body;
    const numElements = receivedData.length;
    const origData = [];
    const updatedData = [];

    // Divide the intially merged array into 2
    for(let i = 0; i < numElements; i++) {
        if(i < numElements/2) {
            origData.push(receivedData[i]);
        } else {
            updatedData.push(receivedData[i]);
        }
    }

    // Perform the actual update of db records
    try {
        // Find the matching original reservation to make edits to
        const reservation = await Reservation.findOne({ timeslot: origData[3], requestTime: origData[5] });
        const users = await User.find();

        if(reservation && users) {
            let labNumber = 0;
            let userID = "20000";

            // Reconvert formats for Lab and UserID
            switch (updatedData[0]) {
                case "Tesla's Trove":
                    labNumber = 1;
                    break;
                case "Hopper's Hub":
                    labNumber = 2;
                    break;
                case "Ghandi's Haven":
                    labNumber = 3;
                    break;
                default:
                    break;
            }

            for(let i = 0; i < users.length; i++) {
                if(users[i].name === updatedData[6]) {
                    userID = users[i].userID.toString();
                }
            }

            // Manually check all reservation data for user updates
            reservation.lab = reservation.lab !== labNumber ? labNumber : reservation.lab;
            reservation.seat = reservation.seat !== updatedData[1] ? updatedData[1] : reservation.seat;
            reservation.date = reservation.date !== updatedData[2] ? updatedData[2] : reservation.date;
            reservation.timeslot = reservation.timeslot !== updatedData[3] ? updatedData[3] : reservation.timeslot;
            reservation.requestDate = reservation.requestDate !== updatedData[4] ? updatedData[4] : reservation.requestDate;
            reservation.requestTime = reservation.requestTime !== updatedData[5] ? updatedData[5] : reservation.requestTime;
            reservation.userID = reservation.userID !== userID ? userID : reservation.userID;
            
            await reservation.save();

            // Send a success response
            res.status(200).json({ message: 'Reservation updated successfully' });
        } else {
            // If reservation was not found, send an error response
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (error) {
        // Handle any errors that occur during the update process
        console.error('Error updating reservation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function deleteReservation(req, res) {
    const receivedData = req.body;

    if(receivedData) {
        try {
            const reservation = await Reservation.findOne({ timeslot: receivedData[3], requestTime: receivedData[5] });
        
            if(reservation) {
                // ReservationID = '20000' represents a deactivated reservation
                await reservation.updateOne({ reservationID: '20000' });
                res.status(200).json({ message: 'Reservation deleted successfully' });
            } else {
                res.status(404).json({ message: 'Reservation not found' });
            }
        } catch (error) {
            console.error('Error deleting reservation:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

async function deleteAccount(req, res) {
    // TODO: get profile email, findOne that matches, and set userID to 10000
    // Also accomodate other res statuses
    res.sendStatus(204);
}

module.exports = {
    saveChanges,
    getProfile,
    editReservation,
    deleteReservation,
    deleteAccount
}