// still have to clean up comments

/* Dependencies */
const express = require('express'); // Import Express, allows you to create a server and routes
const exphbs = require('express-handlebars'); // Import Express-Handlebars, allows you to create views
const mongoose = require('mongoose'); // Import Mongoose, allows you to connect to MongoDB
const dotenv = require('dotenv'); // Import dotenv, allows you to use .env file

/* Imported Routes */
const slotRoutes = require('./routes/slotRoutes');
const loginRoutes = require('./routes/loginRoutes.js');
const regRoutes = require('./routes/regRoutes');
const reserveRoutes = require('./routes/reserveRoutes'); 
const accountRoutes = require('./routes/accountRoutes');

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
    res.redirect('/home'); // Redirect user to /home
});

// App Routes
app.use('/timeslots', slotRoutes); // Use the slotRoutes module for all routes starting with /timeslots
app.use('/login', loginRoutes); // use the loginRoutes module for routes with /login
app.use('/register', regRoutes); // use the regRoutes modules for routes with /register
app.use('/reserve', reserveRoutes); // Use the reserveRoutes module for all routes starting with /reserve
app.use('/account', accountRoutes); // Use the accountRoutes module for all routes starting with /accountRoutes

/* Connect to MongoDB and then Listen for Requests */
/**
 * admin is the username
 * 12345 is the password
 * megan-ccpadev-mco is the database name
 */
const dbURI = 'mongodb+srv://admin:<password>@megan-apdev-mco.wwbdtyp.mongodb.net/?retryWrites=true&w=majority&appName=megan-apdev-mco'; 
mongoose.connect(dbURI)
    .then((result) => {
        console.log("App connected to MongoDB Atlas megan-ccapdev-mco database.");
        /* If the DB connection was successful, listen for requests on localhost:3000 */
        app.listen(3000, () => {
            console.log("App started. Listening on port 3000.");
        });
    })
    .catch((err) => {
        console.log(err);
    });