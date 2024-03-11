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

/* Define Routes */
router.get('/save', upload.single('upload-pfp'), (req, res) => {
    accountController.saveChanges(req, res);
}); // this needs to be fixed

router.get('/', accountController.getProfile);
router.get('/delete', accountController.deleteAccount);
// router.get('/:id', accountController.getUserByID); // For displaying a specific user
// router.get('/:id/edit', accountController.getEditPageByUserID);
// router.post('/:id/edit', upload.single('editedAvatar'), accountController.editUser);