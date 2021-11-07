const express = require('express');
const DocController = require('../controllers/DocController');
const router = express.Router();


router.post('/alwaysChange', DocController.alwaysChange);
router.patch('/deleteContent', DocController.deleteContent);
router.patch('/deleteDoc', DocController.deleteDoc);
router.patch('/updateContent', DocController.updateContent);
router.patch('/updateDoc', DocController.updateDoc);
router.post('/createContent', DocController.creatContent);
router.post('/getDetail', DocController.getDetail);
router.post('/createDoc', DocController.createDoc);
router.post('/getDocs', DocController.getDocs);

module.exports = router;