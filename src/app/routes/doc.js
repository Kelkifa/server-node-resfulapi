const express = require('express');
const DocController = require('../controllers/DocController');
const router = express.Router();



router.post('/createGroup', DocController.createDocGroup);
router.get('/getGroup', DocController.getDocGroup);

router.delete('/deleteContent', DocController.deleteContent);
router.delete('/deleteDoc', DocController.deleteDoc);
router.put('/updateContent', DocController.updateContent);
router.post('/createDoc', DocController.createDoc);
router.post('/createContent', DocController.createContent);
router.get('/getTypes', DocController.getTypeList);
router.post('/getContent', DocController.getContent);

module.exports = router;