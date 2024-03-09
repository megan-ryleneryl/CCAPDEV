/* Import Models */
const User = require('../models/User.js');

const uploadUser = (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const pfp = req.file;

    //Determine what the last userID is
    const numUsers = db.users.estimatedDocumentCount();
    const newUserID = 20001 + numUsers;

    //Determine which account type is selected
    var selectedRadio = req.body['account-type'];
    if (selectedRadio == "Lab Technician") {
        accType = 1;
    } else {
        accType = 0;
    }

    newUser = new User({
        userID: newUserID,
        name: username,
        accType: accType,
        email: email,
        password: password,
        pfp: "/public/profile-pictures/" + pfp.originalname
    });

    newUser.save()
    .then(savedUser => {
        console.log('User Registered an Account Successfully!');
        res.redirect('/index.hbs'); //is this the correct syntax?
    })
    .catch(error => {
        res.status(500).send('Error saving user data');

        // code below used to debug

        // res.status(500).send(inUsername);
        // res.status(500).send(inPassword);
        // res.status(500).send(inBio)
    });
}

module.exports = {
    uploadUser
}