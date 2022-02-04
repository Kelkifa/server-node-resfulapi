const express = require('express');
const router = express.Router();
const PaperController = require('../controllers/PaperController');

router.post('/createPaper', PaperController.CreatePaper);
router.post('/alwayChange', PaperController.AlwayChange);
router.post('/getDetail', PaperController.GetPaperDetail);
router.post('/getPaperList', PaperController.GetPaperList);


module.exports = router;