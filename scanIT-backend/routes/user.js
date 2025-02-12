const router = require('express').Router();
const userController = require('../controllers/userController');

//Change password
router.put('/change-password', userController.changePassword);
//Send forgot password email
router.post('/forgot-password', userController.forgotPasswordEmail);

module.exports = router;