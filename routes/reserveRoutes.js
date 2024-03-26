/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; // Export router so it can be used in app.js

/* Import Controllers */
const reserveController = require('../controllers/reserveController');

/* Define Routes */
router.get('/', reserveController.makeReservation); // For loading the page
router.get('/refresh', reserveController.refreshTable); // For reloading the table based on filters
router.post('/submit-reservation', reserveController.submitReservation); // For submitting all reservation slots