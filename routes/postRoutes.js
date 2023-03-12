const express = require('express');
const router = express.Router();
const postController = require('../controllers/postControllers')

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.route('/').post( upload.single('image'), postController.createPost);
router.route('/').get(postController.getAllPosts);


module.exports = router;