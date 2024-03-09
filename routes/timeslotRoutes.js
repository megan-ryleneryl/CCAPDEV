/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; // Export router so it can be used in app.js

/* Import Controllers */
const timeslotController = require('../controllers/timeslotController');

/* Define Routes */
router.get('/', timeslotController.getAllReservations); // User visits /timeslots