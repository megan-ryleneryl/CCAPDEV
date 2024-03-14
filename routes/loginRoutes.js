/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; // Export router so it can be used in app.js

/* Import Controllers */
const loginController = require('../controllers/loginController');

router.get('/', (req, res) => {
    res.render('../views/index.hbs', {
        layout: 'bodyOnly.hbs', // Layout file to use
        title: 'User Login', // Title of the page
        css: ['index.css'], // Array of CSS files to include
        js: ['index.js'], // Array of JavaScript files to include
        view: 'index' // View file to use
    })
});

router.post('/check', loginController.loginUser, (req, res) =>{
    console.log('Form Received');
});