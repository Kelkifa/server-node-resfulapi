const express = require('express');
const GameController = require('../controllers/GameController');
const router = express.Router();

router.patch('/restore', GameController.restore);
router.patch('/delete', GameController.softDelete);
router.get('/clientGet', GameController.clientGet);
router.get('/adminGet', GameController.adminGet);

module.exports = router;