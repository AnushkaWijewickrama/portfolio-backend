const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

router.get('/user/', userController.getUser);
router.delete('/user/:id', verifyToken, userController.deleteUserHandler);
router.post('/user/login', userController.login);
router.post('/user/register', verifyToken, userController.register);

module.exports = router;
