const express = require('express');
const DocController = require('../controllers/DocController');
const router = express.Router();


router.delete('/deleteContent', DocController.deleteContent);
router.delete('/deleteDoc', DocController.deleteDoc);
router.post('/createDoc', DocController.createDoc);
router.post('/createContent', DocController.createContent);
router.get('/getTypes', DocController.getTypeList);
router.post('/getContent', DocController.getContent);

module.exports = router;