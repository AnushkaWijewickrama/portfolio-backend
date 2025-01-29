const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

router.get('/', userController.getUser);
router.delete('/:id', verifyToken, userController.deleteUserHandler);
router.post('/login', userController.login);
router.post('/register', verifyToken, userController.register);

module.exports = router;
