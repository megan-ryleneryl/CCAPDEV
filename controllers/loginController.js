/* Import Models */
const User = require('../models/User.js');

async function loginUser(req, res) {
    const loginEmail = req.body.email.trim(); 
    const loginPassword = req.body.password.trim(); 

    try {
        // Find the user in the database
        const user = await User.findOne({ email: loginEmail });

        if (user && (loginPassword == user.password)) {
            // Successful login
            console.log('Login Attempt Successful')
            res.status(200).redirect('/homepage');
        } else {
            // Invalid credentials
            res.status(401).json({ message: 'Invalid username or password, please try again' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    loginUser
};
