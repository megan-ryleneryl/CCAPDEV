/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; // Export router so it can be used in app.js

/* Import Controllers */
const registerController = require('../controllers/registerController');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/userPfp/');
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('registerAvatar'), (req, res) => {
    registerController.uploadUser(req, res);
});


router.get('/', (req, res) => {
    console.log('User is Registering and Account')
    res.render('../views/register.html', { //might have to change to .hbs
        title: "Register an Account"
    })
})