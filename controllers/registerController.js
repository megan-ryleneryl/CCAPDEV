/* Import Models */
const User = require('../models/User.js');
const bcrypt = require('bcrypt');

async function uploadUser(req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword =  await bcrypt.hash(password, 10);
    const pfp = req.file;

    const exists = await User.find({ email: email});

    if(!exists) {
        //Determine what the last userID is
        const numUsers = await User.countDocuments();
        const newUserID = 10001 + parseInt(numUsers);

        //Determine which account type is selected
        var selectedRadio = req.body['account-type'];
        if (selectedRadio == "Lab Technician") {
            accType = 1;
        } else {
            accType = 0;
        }

        try {
            User.create({
                userID: newUserID.toString(),
                name: username,
                accType: accType,
                email: email,
                password: hashedPassword,
                pfp: "/profile-pictures/" + pfp.originalname
            });

            if(User.findOne({ userID: newUserID })) {
                console.log('Registered an Account Successfully!');
                res.redirect('/login');
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Error saving user data');
        }
    } //else {
    //     alert('Account email already exists, please try again');
    //     document.getElementById('reg-form').reset();
    // }    
}

module.exports = {
    uploadUser
}