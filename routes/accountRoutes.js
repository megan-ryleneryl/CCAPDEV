/* Import express & define router */
const express = require('express');
const router = express.Router();
module.exports = router; 

/* Import Multer to allow file uploads */
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/profile-pictures/');
  },
  filename: function (req, file, cb) {
    // You can customize the filename here if needed
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });


/* Import Controllers */
const accountController = require('../controllers/accountController');

// /* Define Routes */
// router.get('/:id', userController.getUserByID); // For displaying a specific user
// router.get('/:id/edit', userController.getEditPageByUserID);
// router.post('/:id/edit', upload.single('editedAvatar'), userController.editUser);