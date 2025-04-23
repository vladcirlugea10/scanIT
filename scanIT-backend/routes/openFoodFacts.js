const { verifyToken } = require('../middleware/auth');
const openFoodFactsController = require('../controllers/openFoodFactsController');
const router = require('express').Router();
const multer = require('multer');
const upload = multer();

//add a new product to Open Food Facts API
router.post('/add-new-product', verifyToken, openFoodFactsController.addNewProduct);
//edit a product in Open Food Facts API
router.post('/edit-product', verifyToken, openFoodFactsController.editProduct);
//add product images to Open Food Facts API
router.post('/add-product-image', verifyToken, upload.single('image'), openFoodFactsController.addProductImage);

module.exports = router;