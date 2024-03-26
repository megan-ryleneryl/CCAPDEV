const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/User.js');

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        try {
            // Find the user in the database
            const user = await User.findOne({ email: email });

            // If the user does not exist, return an error
            if (user == null) {
                return done(null, false, { message: 'No user with that email.' });
            }

            // If the user exists, compare the password
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect.' });
            }
        } catch (err) {
            return done(err);
        }
    };

    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        authenticateUser
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            // Find the user in the database
            const user = await User.findOne({ _id: id });
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    });
}

module.exports = initialize;