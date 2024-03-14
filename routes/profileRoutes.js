/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; 

/* Import Controllers */
const profileController = require('../controllers/profileController');

router.get('/:userID', profileController.getProfilePage);