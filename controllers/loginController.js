/* Import Models */
const User = require('../models/User.js');

async function loginUser(req, res) {
    const loginUsername = req.body.username; //double check if this matches
    const loginPassword = req.body.password; //double check if this matches
        try {
        // Find the user in the database
        const user = await User.findOne({ _id: loginUsername });
          if (user && (loginPassword == user.password)) {
            // Successful login
            console.log('Login Attempt Made')
            res.status(200).redirect('/');
        } else {
            // Invalid credentials
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    loginUser
};
