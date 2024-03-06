// still have to clean up comments

/* Dependencies */
const express = require('express'); // Import Express, allows you to create a server and routes
const exphbs = require('express-handlebars'); // Import Express-Handlebars, allows you to create views
const mongoose = require('mongoose'); // Import Mongoose, allows you to connect to MongoDB
const dotenv = require('dotenv'); // Import dotenv, allows you to use .env file

/* Imported Routes */
// Code here. Use require() to import routes from the routes folder.
const cafeRoutes = require('./routes/cafeRoutes'); // Import the cafeRoutes module for use below
const loginRoutes = require('./routes/loginRoutes');
const regRoutes = require('./routes/regRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); // Import the cafeRoutes module for use below
const userRoutes = require('./routes/userRoutes');

/* Initialize Express App */
const app = express();

/* Middleware */
app.use(express.static(__dirname + "/public")); // Set static folder
app.use(express.urlencoded({ extended: true })); // Allows you to access req.body for POST routes
app.use(express.static(__dirname + "/public"));
// Use Handlebars as the view engine
const hbs = exphbs.create({
    extname: 'hbs',
    helpers: {
        // JSON
        json: function (context) {
            return JSON.stringify(context);
        }
    },
});

app.engine("hbs", hbs.engine); // Inform the handlebars engine that file extension to read is .hbs
app.set("view engine", "hbs"); // Set express' default file extension for views as .hbs
app.set("views", "./views"); // Set the directory for the views

app.get('/', (req, res) => {
    console.log("User has visited localhost:3000.");
    res.redirect('/home'); // Redirect user to /cafes
});

// Cafe Routes
app.use('/tiemslots', slotRoutes); // Use the cafeRoutes module for all routes starting with /cafes
app.use('/login', loginRoutes); // use the loginRoutes module for routes with /login
app.use('/register', regRoutes); // use the regRoutes modules for routes with /register
app.use('/reserve', reserveRoutes); // Use the cafeRoutes module for all routes starting with /cafes
app.use('/account', accountRoutes);

const PORT = process.env.PORT || 3000; // Use the specified port or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// /* Connect to MongoDB and then Listen for Requests */
// /**
//  * admin is the username
//  * apdevMCO14 is the password
//  * ccpadev-mco is the database name
//  */
// const dbURI = 'mongodb+srv://admin:apdevMCO14@cluster0.ddsc64j.mongodb.net/ccapdev-mco?retryWrites=true&w=majority'; 
// mongoose.connect(dbURI)
//     .then((result) => {
//         console.log("App connected to MongoDB Atlas ccapdev-mco database.");
//         /* If the DB connection was successful, listen for requests on localhost:3000 */
//         app.listen(3000, () => {
//             console.log("App started. Listening on port 3000.");
//         });
//     })
//     .catch((err) => {
//         console.log(err);
//     });