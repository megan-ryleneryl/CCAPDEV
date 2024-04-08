/* Import Models */
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const bcrypt = require('bcrypt');

/* Define Functions */
async function getProfile(req, res) {
    const loggedUser = req.user || '';
    let mergedData = [];
    let reservations = [];
    let labName = 'Unknown Lab';
    let formattedDate;
    let formattedRequestDate;
    let isAdmin = 0;
    let userName = loggedUser.accType === 'Student' ? loggedUser.name : 'Anonymous';
    isAdmin = loggedUser.accType === 'Lab Technician' ? 1 : 0;
    
    try {
        // If lab technician, show all reservations
        if(isAdmin) {
            reservations = await Reservation.find({
                reservationID: { $ne: '20000' },
                userID: { $ne: '10000' }
            });
        } else {
            // Otherwise, show only reservations made by the logged in user
            reservations = await Reservation.find({ userID: loggedUser.userID });
        } 
        
        const users = await User.find({ 
            userID: { 
                $nin: [loggedUser.userID, '10000'] // Exclude both the logged-in user and users with ID 10000
            } 
        });

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
                formattedDate = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
                formattedRequestDate = requestDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');

                mergedData.push({labName: labName, seat: reservations[i].seat, date: formattedDate, timeslot: reservations[i].timeslot, requestDate: formattedRequestDate, requestTime: reservations[i].requestTime, userID: reservations[i].userID, userName: userName, accType: loggedUser.accType });
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
        mergedData = mergedData.map(user => {
            return { ...user, isAdmin: isAdmin };
        });

        res.render('../views/account.hbs', {
            layout: 'main.hbs', // Layout file to use
            title: 'Account Actions', // Title of the page
            css: ['account.css'], // Array of CSS files to include
            js: ['account.js'], // Array of JavaScript files to include
            view: 'account', // View file to use
            user: loggedUser,
            isAdmin: isAdmin,
            mergedData: mergedData,
            userData: users
        });
    } catch (error) {
        console.error('Error fetching reservations', error);
        throw error;
    }
}

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
                console.log(formData.password);
                console.log(await bcrypt.compare(formData.password, user.password));
                if(!(await bcrypt.compare(formData.password, user.password))) {
                    bcrypt.hash(formData.password, 10, async function(err, hashedPassword) {
                        if (err) {
                            console.error(err);
                        } else {
                            // If successful, store the hashed password
                            await user.updateOne({ password: hashedPassword });
                        }
                    });
                }
            }

            if(formData.bio) {
                user.bio = formData.bio.trim();
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
        // Return error response
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
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

    for(let i = 0; i < updatedData.length; i++) {
        updatedData[i] = updatedData[i].toString();
    }

    // Perform the actual update of db records
    try {
        // Find the matching original reservation to make edits to
        const reservation = await Reservation.findOne({ timeslot: origData[3], requestTime: origData[5] });
        const users = await User.find();
        const reservationID = reservation.reservationID;

        if(reservationID && users) {
            let labNumber = 0;
            let userID = "20000";

            // Reconvert formats for Lab and UserID
            switch (updatedData[0]) {
                case "Tesla's Trove":
                    labNumber = '1';
                    break;
                case "Hopper's Hub":
                    labNumber = '2';
                    break;
                case "Ghandi's Haven":
                    labNumber = '3';
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
            const reservation = await Reservation.findOne({ seat: receivedData[1], date: receivedData[2], timeslot: receivedData[3], requestTime: receivedData[5] });

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
    const loggedUserID = req.body.userID;
    const loggedUser = await User.findOne({ userID: loggedUserID });
    const userReservations = await Reservation.find({ userID: loggedUserID });
    
    try {
        if(loggedUser) {
            // UserID = '10000' represents a deactivated reservation
            await loggedUser.updateOne({ userID: '10000' });

            // Reflect in all user reservations
            for(i = 0; i < userReservations.length; i++) {
                await userReservations[i].updateOne({ userID: '10000' });
            }

            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    saveChanges,
    getProfile,
    editReservation,
    deleteReservation,
    deleteAccount
}