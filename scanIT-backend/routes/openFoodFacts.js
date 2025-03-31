const { verifyToken } = require('../middleware/auth');
const openFoodFactsController = require('../controllers/openFoodFactsController');
const router = require('express').Router();

//add a new product to Open Food Facts API
router.post('/add-new-product', verifyToken, openFoodFactsController.addNewProduct);
//edit a product in Open Food Facts API
router.post('/edit-product', verifyToken, openFoodFactsController.editProduct);

module.exports = router;