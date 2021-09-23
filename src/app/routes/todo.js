const express = require('express');
const TodoController = require('../controllers/TodoController');
const router = express.Router();

router.delete('/delete', TodoController.delete);
router.get('/get', TodoController.get);
router.post('/add', TodoController.add);

module.exports = router;