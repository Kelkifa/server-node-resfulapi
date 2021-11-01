const express = require('express');
const DocController = require('../controllers/DocController');
const router = express.Router();



router.post('/createDoc', DocController.createDoc);
router.get('/getDocDetail', DocController.getDocDetail);
router.get('/getDocs', DocController.getDocNameList);
router.post('/createGroup', DocController.createGroup);
router.get('/getGroups', DocController.getGroup);

module.exports = router;