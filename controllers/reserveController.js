// //TODO - implement timeslot reservation

// /* Import Models */
// const Review = require('../models/Review');
// const Cafe = require('../models/Cafe');

// /* Define Functions */
// // Don't forget to export the function at the end of this document

// // For getting reviews for a specific cafe, based on the title or body of the review
// const getReviewsByQuery = (req, res) => {
//     const query = req.params.query;
//     const cafeID = req.params.cafeID;

//     // Find search query in either the title or body field
//     Review.find({
//         // Find search query in either the title or body field
//         $and: [
//             // Find search query in either the title or body field
//             {
//                 $or: [
//                     { title: { $regex: query, $options: 'i' } },
//                     { body: { $regex: query, $options: 'i' } }
//                 ]
//             },
//             // Ensure that the review has a field of cafeID = cafeID
//             { cafeID: cafeID }
//         ]
//     })
//         .lean()
//         .then((result) => {
//             res.json(result); // Return the result to the client browser
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// };

// // For creating a review for a specific cafe from a specific user
// const createReview = (req, res) => {
//     // URL parameters
//     const userID = req.params.userID.toString();
//     const cafeID = req.params.cafeID.toString();

//     // Form details
//     const rating = req.body.reviewRating;
//     const title = req.body.reviewTitle.toString();
//     const body = req.body.reviewBody.toString();

//     // Create a new review object
//     const newReview = new Review({
//         userID: userID,
//         cafeID: cafeID,
//         rating: rating,
//         title: title,
//         body: body
//     });

//     if (req.file) {
//         newReview.media = '/uploadedFiles/' + req.file.originalname; // Set the image path
//       }

//     newReview.save()
//         .then((result) => {
//             console.log("Review saved in database");

//             return Review.find({ cafeID: cafeID }, 'rating').lean();
//         })
//         // After saving to the database, look for the ratings
//         .then((reviews) => {
//             const ratings = reviews.map((review) => review.rating); // Get all the ratings
//             const averageRating = calculateAverageRating(ratings); // Calculate the average rating

//             return Cafe.findByIdAndUpdate(cafeID, { rating: averageRating }); // Update the cafe rating
//         })
//         .then((result) => {
//             console.log("Cafe rating updated");
//             res.redirect('/cafes/' + cafeID); // Redirect to the cafe page
//         })
//         .catch((err) => {
//             console.log(err);
//         });

//     // TODO: Update the review average of the cafe
//     // TODO: Upload media functionality

//     // Helper function to calculate the average rating and round down
//     function calculateAverageRating(ratings) {
//         if (ratings.length === 0) {
//             return 0; // or any default value
//         }
    
//         const sum = ratings.reduce((total, rating) => total + rating, 0);
//         const average = sum / ratings.length;
    
//         // Use Math.floor to round down to the nearest whole number
//         return Math.floor(average);
//     }
// };

// // For generating the edit page of a specific review
// const getReviewByIdThenEdit = (req, res) => {
//     const reviewID = req.params.reviewID;

//     Review.findById(reviewID)
//         .lean()
//         .then((result) => {
//             res.render('../views/editReview.hbs', {
//                 stylesheets: ["editReview.css"],  
//                 title: "Edit Review",
//                 review: result
//             });
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// };

// // For updating a review based on the review ID
// const editReview = (req, res) => {
//     console.log(req.body);
//     console.log(req.params);
//     // URL parameters
//     // const reviewID = req.params.reviewID.toString();
//     // const cafeID = req.params.cafeID.toString();
//     // const query = req.params.query;

//     const reviewID = req.params.reviewID.toString();
//     const cafeID = req.body.cafeID.toString();
//     const updatedReviewTitle = req.body.updatedReviewTitle.toString();
//     const updatedReviewBody = req.body.updatedReviewBody.toString();
//     const updatedReviewRating = req.body.updatedRating;

//     Review.findByIdAndUpdate(reviewID, {
//         title: updatedReviewTitle,
//         body: updatedReviewBody,
//         rating: updatedReviewRating,
//         isEdited: true
//     })
//         // After saving to the database, look for the ratings
//         .then((result) => {
//             console.log("User review has been edited.");

//             return Review.find({ cafeID: cafeID }, 'rating').lean();
//         })
//         .then((reviews) => {
//             const ratings = reviews.map((review) => review.rating); // Get all the ratings
//             const averageRating = calculateAverageRating(ratings); // Calculate the average rating

//             return Cafe.findByIdAndUpdate(cafeID, { rating: averageRating }); // Update the cafe rating
//         })
//         .then((result) => {
//             console.log("Cafe rating updated");
//             res.redirect('/cafes/' + cafeID); // Redirect to the cafe page
//         })
//         .catch((err) => {
//             console.log(err);
//         });

//     // Helper function to calculate the average rating and round down
//     function calculateAverageRating(ratings) {
//         if (ratings.length === 0) {
//             return 0; // or any default value
//         }

//         const sum = ratings.reduce((total, rating) => total + rating, 0);
//         const average = sum / ratings.length;

//         // Use Math.floor to round down to the nearest whole number
//         return Math.floor(average);
//     }
// };

// const getReviewByIdThenReply = (req, res) => {
//     const reviewID = req.params.reviewID;

//     Review.findById(reviewID)
//         .lean()
//         .then((result) => {
//             res.render('../views/replyToReview.hbs', {
//                 title: "Reply to Review",
//                 review: result
//             });
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// };


// const markAsHelpful = (req, res) => {
//     const reviewID = req.params.reviewID;

//     Review.findById(reviewID)
//         .then((result) => {
//             result.helpful += 1;
//             console.log("User marked review as helpful");
//             return result.save();
//         })
//         .then(() => {
//             res.status(200).send({ message: 'Marked as helpful successfully.' });
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// };

// const markAsUnhelpful = (req, res) => {
//     const reviewID = req.params.reviewID;

//     Review.findById(reviewID)
//         .then((result) => {
//             result.unhelpful += 1;
//             console.log("User marked review as unhelpful");
//             return result.save();
//         })
//         .then(() => {
//             res.status(200).send({ message: 'Marked as unhelpful successfully.' });
//         })
//         .catch((err) => {
//             console.log(err);
//         });
//  };

//  const getHelpfulCount = (req, res) => {
//     const reviewID = req.params.reviewID;

//     Review.findById(reviewID)
//     .then((result) => {
//         return result.helpful;
//     })
//     .then(() => {
//         res.status(200).send({ message: 'Retrieved helpful count successfully.' });
//     })
//  }

//  const getUnhelpfulCount = (req, res) => {
//     const reviewID = req.params.reviewID;

//     Review.findById(reviewID)
//     .then((result) => {
//         return result.unhelpful;
//     })
//     .then(() => {
//         res.status(200).send({ message: 'Retrieved helpful count successfully.' });
//     })
//  }


// const createReply = (req, res) => {
//     console.log(req.body);
//     console.log(req.params);
//     const reviewID = req.params.reviewID;
//     const replyBody = req.body.replyBody;
//     const cafeID = req.body.replyCafeID;

//     Review.findByIdAndUpdate(reviewID, { ownerResponse: replyBody })
//         .then((result) => {
//             console.log("Reply saved in database");
//             res.redirect('/cafes/' + cafeID);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// };

// // For deleting a review based on the review ID
// const deleteReview = (req, res) => {
//     const reviewID = req.params.reviewID.toString();
//     const cafeID = req.body.cafeID.toString();

//     Review.findByIdAndDelete(reviewID)
//         .then((result) => {
//             return Review.find({ cafeID: cafeID }, 'rating').lean();
//         })
//         .then((reviews) => {
//             const ratings = reviews.map((review) => review.rating);
//             const averageRating = calculateAverageRating(ratings);

//             // Update the cafe rating
//             return Cafe.findByIdAndUpdate(cafeID, { rating: averageRating });
//         })
//         .then((result) => {
//             res.redirect('/cafes/' + cafeID); // Redirect to the cafe page
//         })
//         .catch((err) => {
//             console.log(err);
//         });

//     function calculateAverageRating(ratings) {
//         if (ratings.length === 0) {
//             return 0; // or any default value
//         }
    
//         const sum = ratings.reduce((total, rating) => total + rating, 0);
//         const average = sum / ratings.length;
    
//         // Use Math.floor to round down to the nearest whole number
//         return Math.floor(average);
//     }
// }

// /* Allow functions to be used by other files */
// module.exports = {
//     getReviewsByQuery,
//     createReview,
//     getReviewByIdThenEdit,
//     editReview,
//     getReviewByIdThenReply,
//     markAsHelpful,
//     markAsUnhelpful,
//     getHelpfulCount,
//     getUnhelpfulCount,
//     deleteReview,
//     createReply
// }