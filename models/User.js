const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema for User Profile in MongoDB
 * 
 * id - Unique identifier for the user
 * bio - Bio of the user (long)
 * avatar - filepath of the user's profile picture
 * password - user's password
 */
const userSchema = new Schema({
    userID: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    accType: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pfp: { type: String, required: true, default: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" },
    bio: { type: String, required: true, default: "Hello! Please set a bio."}
})

const User = mongoose.model('users', userSchema); // 'users' is the name of the collection in the database
module.exports = User; // Export the model so that it can be used in other files
