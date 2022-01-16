const express = require('express');
const TodoController = require('../controllers/TodoController');
const router = express.Router();

// router.delete('/test', TodoController.test);
router.delete('/delete', TodoController.delete);
router.delete('/deleteMulti', TodoController.deleteMulti);
router.delete('/deleteTodo', TodoController.deleteTodo);
// router.delete('/deletes', TodoController.deletes);
router.post('/get', TodoController.get);
router.post('/getPassed', TodoController.getPassed);
router.post('/changeState', TodoController.changeState);
router.post('/addTodo', TodoController.addTodo);
router.post('/add', TodoController.add);
router.post('/search', TodoController.search);

module.exports = router;