const express = require('express');
const DocController = require('../controllers/DocController');
const router = express.Router();



router.post('/createDoc', DocController.createDoc);
router.post('/createGroup', DocController.createGroup);
router.get('/getGroup', DocController.getDocGroup);

module.exports = router;