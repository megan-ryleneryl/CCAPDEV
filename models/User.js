const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema for User Profile in MongoDB
 * 
 * userID - The unique identifier for the user (10001)
 * name - The name of the user (Firstname Lastname)
 * accType - The account type (0 = Student, 1 = Lab Technician)
 * email - The DLSU email address (user@dlsu.edu.ph)
 * password - The password
 * pfp - The profile picture href (../public/profile-pictures/pic.jpg)
 * bio - The bio of the user (long text)
 */
const userSchema = new Schema({
    userID: { type: String, required: true },
    name: { type: String, required: true },
    accType: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pfp: { type: String, required: true, default: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" },
    bio: { type: String, required: true, default: "Hello! Please set a bio."}
})

const User = mongoose.model('users', userSchema); // 'users' is the name of the collection in the database
module.exports = User; // Export the model so that it can be used in other files
