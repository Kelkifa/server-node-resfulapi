const express = require('express');
const DocController = require('../controllers/DocController');
const router = express.Router();


router.post('/getDetail', DocController.getDetail);
router.post('/createDoc', DocController.createDoc);
router.post('/getDocs', DocController.getDocs);

module.exports = router;