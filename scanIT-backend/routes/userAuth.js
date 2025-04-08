const router = require('express').Router();
const userAuthController = require('../controllers/userAuthController');

//Register user
router.post('/register', userAuthController.registerUser);
//Login
router.post('/login', userAuthController.loginUser);
//Google auth
router.post('/google', userAuthController.googleAuth);
module.exports = router;