/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; // Export router so it can be used in app.js

/* Import Controllers */
const searchController = require('../controllers/searchController.js');

/* Define Routes */
router.get('/', searchController.openSearch); 