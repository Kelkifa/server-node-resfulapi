const express = require('express');

const GroupController = require('../controllers/GroupController');
const router = express.Router();

router.post('/addMember', GroupController.addMember);
router.post('/create', GroupController.create);
router.get('/getDemo', GroupController.getDemoGroups);
router.get('/get', GroupController.get);

module.exports = router;