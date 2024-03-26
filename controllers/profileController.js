/* Import Models */
const User = require('../models/User');
const Reservation = require('../models/Reservation');

async function getProfilePage(req, res) {
    // const thisUser = 'Pierre Ramos';
    
    try {
        const queryID = req.params.userID;
        const user = await User.findOne({ userID: queryID });
        const users = await User.find();
        let profileType = 'Student';
        if(user.accType === '1') {
            profileType = 'Lab Technician';
        }

        res.render('../views/profile.hbs', {
            layout: 'main.hbs', // Layout file to use
            title: 'View Profile', // Title of the page
            css: ['profile.css'], // Array of CSS files to include
            js: ['profile.js'], // Array of JavaScript files to include
            view: 'profile', // View file to use
            accType: "Lab Technician", //TEMP
            profileType: profileType,
            userData: users,
            user: user
        });
    } catch(error) {
        console.error(error);
    }
}

module.exports = {
    getProfilePage
}