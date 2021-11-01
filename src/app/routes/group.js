const express = require('express');
const getUserInfoMidleware = require('../../midlewares/getUserInfoMidleware');
const GroupController = require('../controllers/GroupController');
const router = express.Router();

router.post('/post', getUserInfoMidleware, GroupController.create);
router.get('/getDemo', getUserInfoMidleware, GroupController.getDemoGroups);
router.get('/get', getUserInfoMidleware, GroupController.get);

module.exports = router;