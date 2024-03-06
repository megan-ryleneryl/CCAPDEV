/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; // Export router so it can be used in app.js

/* Import Controllers */
const loginController = require('../controllers/loginController');

router.post('/', loginController.loginUser, (req, res) =>{
    console.log('Form Received');
});

router.get('/', (req, res) => {
    console.log('User is Logging In')
    res.render('../views/login.html', { //might have to change to .hbs
        title: "User Login"
    })
})