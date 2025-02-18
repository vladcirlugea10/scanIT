const router = require('express').Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

//Change password
router.put('/change-password', userController.changePassword);
//Send forgot password email
router.post('/forgot-password', userController.forgotPasswordEmail);
//Check reset code
router.post('/check-code', userController.checkCode);

//Add an allergy
router.put('/add-allergy', verifyToken, userController.addAllergy);

module.exports = router;