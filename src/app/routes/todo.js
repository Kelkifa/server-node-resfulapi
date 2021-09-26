const express = require('express');
const TodoController = require('../controllers/TodoController');
const router = express.Router();

// router.delete('/test', TodoController.test);
router.delete('/delete', TodoController.delete);
// router.delete('/deletes', TodoController.deletes);
router.get('/get', TodoController.get);
router.post('/add', TodoController.add);

module.exports = router;