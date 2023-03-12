const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.post('/login', authController.handleLogin);
router.post('/register', authController.handleRegister);
router.route('/changePic').put( upload.single('image'), authController.changeUserProfileImg);



module.exports = router;