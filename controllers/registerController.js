/* Import Models */
const User = require('../models/User.js');

const uploadUser = (req, res) => {
    const username = req.body.username;
    const accType = req.body.account-type;
    const email = req.body.email;
    const password = req.body.password;
    const bio = req.body.bio;
    const pfp = req.file;
    
    newUser = new User({
        userID: 20000, //need to implement auto computation
        name: username,
        accType: accType,
        email: email,
        password: password,
        bio: bio,
        pfp: "/public/profile-pictures/" + pfp.originalname
    });

    newUser.save()
    .then(savedUser => {
        console.log('User Registered an Account Successfully!');
        res.redirect('/');
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