/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; // Export router so it can be used in app.js

/* Import Multer to allow file uploads */
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploadedFiles/');
  },
  filename: function (req, file, cb) {
    // You can customize the filename here if needed
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

/* Import Controllers */
const reserveController = require('../controllers/reserveController');

/* Define Routes */
// router.get('/search/:query&:cafeID', reviewController.getReviewsByQuery); // For seaching reviews in a specific cafe
// router.post('/create/:cafeID/:userID', upload.single('reviewImage'), reviewController.createReview); // For creating a new review
// router.get('/:reviewID/edit', reviewController.getReviewByIdThenEdit); // For getting a review by its ID
// router.post('/:reviewID/edit', reviewController.editReview); // For editing a review
// router.post('/:reviewID/delete', reviewController.deleteReview); // For deleting a review
// router.get('/:reviewID/reply', reviewController.getReviewByIdThenReply); // For getting a review by its ID
// router.post('/:reviewID/reply', reviewController.createReply);
// router.post('/:reviewID/helpful', reviewController.markAsHelpful); // mark a review as helpful
// router.post('/:reviewID/unhelpful', reviewController.markAsUnhelpful); // mark a review as unhelpful
// router.get('/:reviewID/gethelpful', reviewController.getHelpfulCount);
// router.get('/:reviewID/getunhelpful', reviewController.getUnhelpfulCount);