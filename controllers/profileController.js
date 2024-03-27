/* Import Models */
const User = require('../models/User');

async function getProfilePage(req, res) {
    try {
        const queryID = req.params.userID;
        const user = await User.findOne({ userID: queryID });
        const users = await User.find();

        res.render('../views/profile.hbs', {
            layout: 'main.hbs', // Layout file to use
            title: 'View Profile', // Title of the page
            css: ['profile.css'], // Array of CSS files to include
            js: ['profile.js'], // Array of JavaScript files to include
            view: 'profile', // View file to use
            userData: users,
            profileUser: user,
            user: req.user, // User info
        });
    } catch(error) {
        console.error(error);
    }
}

module.exports = {
    getProfilePage
}