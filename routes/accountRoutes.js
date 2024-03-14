/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; 

/* Import Controllers */
const accountController = require('../controllers/accountController');

/* Import Multer to allow file uploads */
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/profile-pictures/');
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
router.use(express.urlencoded({ extended: true }));

/* Define Routes */
router.post('/update', upload.single('pfp'), (req, res) => {
    accountController.saveChanges(req, res);
}); 

router.get('/', accountController.getProfile);
router.post('/delete', accountController.deleteAccount); 
router.post('/edit-reservation', accountController.editReservation);
router.post('/delete-reservation', accountController.deleteReservation);