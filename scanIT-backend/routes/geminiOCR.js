const router = require('express').Router();
const geminiOCRController = require('../controllers/geminiOCRController');
const multer = require('multer');
const upload = multer();

//scan image for text
router.post('/scan-image', upload.single('image'),  geminiOCRController.scanImage);

module.exports = router;