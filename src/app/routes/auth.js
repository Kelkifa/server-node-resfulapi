const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

const authDdosMidleware = require('../../midlewares/authDdosMidleware');

router.get('/firstAccess', authDdosMidleware(4), AuthController.firstAccess);
router.post('/login', authDdosMidleware(3), AuthController.login);
router.post('/register', AuthController.register);

module.exports = router;
