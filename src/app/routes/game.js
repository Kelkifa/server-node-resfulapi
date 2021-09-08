const express = require('express');
const GameController = require('../controllers/GameController');
const router = express.Router();

router.get('/clientGet', GameController.clientGet);

module.exports = router;