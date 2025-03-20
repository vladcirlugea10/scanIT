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
//Remove an allergy
router.delete('/remove-allergy', verifyToken, userController.removeAllergy);

//Add a scanned product
router.put('/add-scanned-product', verifyToken, userController.addScannedProduct);
//Add a new product
router.put('/add-new-product', verifyToken, userController.addNewProduct);

//Get user data
router.get('/:email', verifyToken, userController.getUserData);
//Edit user data
router.put('/edit/:userId', verifyToken, userController.editUserData);
module.exports = router;