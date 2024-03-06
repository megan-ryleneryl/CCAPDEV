// //TODO - config this file

// /* Import Models */
// const User = require('../models/User');
// const Review = require('../models/Review');

// /* Define Functions */
// const getUserByID = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const userResult = await User.findById(id).lean();
//         // console.log(userResult);

//         if (!userResult) {
//             res.render('../views/404.hbs', {
//                 title: "404"
//             });

//             return;
//         }

//         const reviewResult = await Review.find({userID: id}).sort({ _id: -1 }).lean();
//         // console.log(reviewResult);

//         res.render('../views/userprofile.hbs', {
//             title: userResult._id,
//             stylesheets: ["global.css", "homepage.css", "userprofile.css"],
//             user: userResult,
//             review: reviewResult
//         });
//     } catch (err) {
//         console.log (err);
//     }
// }

// const getEditPageByUserID = (req, res) => {
//     console.log("getEditPageByUserID called");
//     console.log(req.params);

//     const userID = req.params.id;

//     User.findById(userID).lean()
//         .then((result) => {
//             console.log(result);
//             res.render('../views/editUserProfile.hbs', {
//                 title: "Edit Profile",
//                 stylesheets: ["global.css", "homepage.css", "userprofile.css"],
//                 user: result
//             })
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// }

// const editUser = (req, res) => {
//     const userID = req.params.id.toString();
//     const newBio = req.body.editedBio.toString();
//     let avatarPath = "";

//     if (req.file) {
//         avatarPath = '/userPfp/' + req.file.originalname; // Set the image path
//         console.log("Uploaded to" + avatarPath);
//     } else {
//         avatarPath = req.body.originalAvatar;
//     }

//     User.findByIdAndUpdate(userID, {
//         bio: newBio,
//         avatar: avatarPath
//     })
//         .then((result) => {
//             res.redirect('/users/' + userID);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// }

// module.exports = {
//     getUserByID,
//     getEditPageByUserID,
//     editUser
// }