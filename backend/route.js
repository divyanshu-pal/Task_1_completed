const express = require('express');

const router = express.Router();
const priceController = require('./controller/PriceController')
router.get('/',priceController.getPrices);
router.post('/',priceController.addPrices);

module.exports = router;