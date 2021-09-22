const express = require('express');
const TodoController = require('../controllers/TodoController');
const router = express.Router();

router.get('/get', TodoController.get);
router.post('/add', TodoController.add);

module.exports = router;