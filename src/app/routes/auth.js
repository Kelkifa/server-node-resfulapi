const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

const authDdosMidleware = require('../../midlewares/authDdosMidleware');

router.get('/firstAccess', authDdosMidleware(50), AuthController.firstAccess);
router.post('/login', authDdosMidleware(5), AuthController.login);
router.post('/register', AuthController.register);

module.exports = router;
