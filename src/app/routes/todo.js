const express = require('express');
const TodoController = require('../controllers/TodoController');
const router = express.Router();

// router.delete('/test', TodoController.test);
router.delete('/delete', TodoController.delete);
router.delete('/deleteTodo', TodoController.deleteTodo);
// router.delete('/deletes', TodoController.deletes);
router.post('/get', TodoController.get);
router.post('/changeState', TodoController.changeState);
router.post('/addTodo', TodoController.addTodo);
router.post('/add', TodoController.add);

module.exports = router;