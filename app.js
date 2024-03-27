/* Dependencies */
const express = require('express'); // Import Express, allows you to create a server and routes
const exphbs = require('express-handlebars'); // Import Express-Handlebars, allows you to create views
const mongoose = require('mongoose'); // Import Mongoose, allows you to connect to MongoDB
const bodyParser = require('body-parser');

// Imported for sessions
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassport = require('./passport-config.js');
initializePassport(passport);

/* Imported Routes */
const timeslotRoutes = require('./routes/timeslotRoutes.js');
const registerRoutes = require('./routes/registerRoutes.js');
const reserveRoutes = require('./routes/reserveRoutes.js'); 
const accountRoutes = require('./routes/accountRoutes.js');
const searchRoutes = require('./routes/searchRoutes.js');
const profileRoutes = require('./routes/profileRoutes.js');

/* Initialize Express App */
const app = express();

/* Middleware */
app.use(express.static(__dirname + "/public")); // Set static folder
app.use(express.urlencoded({ extended: true })); // Allows you to access req.body for POST routes
app.use(bodyParser.urlencoded({ extended: false }));

// Use Handlebars as the view engine
const hbs = exphbs.create({
    extname: 'hbs',
    helpers: {
        // JSON
        json: function (context) {
            return JSON.stringify(context);
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

app.use(express.json());
app.engine("hbs", hbs.engine); // Inform the handlebars engine that file extension to read is .hbs
app.set("view engine", "hbs"); // Set express' default file extension for views as .hbs
app.set("views", "./views"); // Set the directory for the views

// Use sessions
app.use(flash());
app.use(session({
    secret: 'CKA8mqzpyGEuQRCZHJHhK39qCbtxYwu8',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride('_method')); // To allow the POST logout form to become a DELETE request

// Make login the landing page
app.get('/', (req, res) => {
    // If user is authenticated, redirect to homepage
    if (req.isAuthenticated()) {
        res.redirect('/homepage');
    } else {
        // If user is not authenticated, redirect to login page
        res.redirect('/login');
    }
});

// For about page
app.get('/about', (req, res) => {
    res.render('../views/about.hbs', {
        layout: 'main.hbs', // Layout file to use
        title: 'About', // Title of the page
        css: ['about.css'], // Array of CSS files to include
        user: req.user, // User
    })
});

// App Routes
app.use('/homepage', timeslotRoutes); // Use the timeslotRoutes module for all routes starting with /homepage
app.use('/register', registerRoutes); // Use the registerRoutes modules for routes with /register
app.use('/reserve', reserveRoutes); // Use the reserveRoutes module for all routes starting with /reserve
app.use('/account', accountRoutes); // Use the accountRoutes module for all routes starting with /account
app.use('/search', searchRoutes); // Use the searchRoutes module for all routes starting with /search
app.use('/profile', profileRoutes); // Use the searchRoutes module for all routes starting with /profile

// Login Routes
app.get('/login', (req, res) => {
    res.render('../views/index.hbs', {
        title: "Login",
        css: ["index.css"],
        layout: "bodyOnly.hbs",
        messages: req.flash('error')
    })
});

app.post('/login', 
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    function(req, res) {
        // This function is for checking if remember me was clicked
        if (req.body.rememberMe) {
            req.session.cookie.maxAge = 3 * 7 * 24 * 60 * 60 * 1000; // Cookie expires after 3 weeks
        } else {
            req.session.cookie.expires = false; // Cookie expires at end of session
        }
      res.redirect('/homepage'); 
    }
);

app.delete('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
})

/* Connect to MongoDB and then Listen for Requests */
/**
 * admin is the username
 * 12345 is the password
 * megan-ccpadev-mco is the database name
 */
const dbURI = 'mongodb+srv://admin:12345@cluster0.wwbdtyp.mongodb.net/megan-ccapdev-mco'; 
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