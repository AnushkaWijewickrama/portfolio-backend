const expressproduct = require('express');
const projectController = require('../controllers/project');
const projectrouter = expressproduct.Router();
const projectverifyToken = require('../middleware/authMiddleware');
const upload = require('../helpers/storage');

// router.get('/', userController.getUser);
// router.delete('/:id', verifyToken, userController.deleteUserHandler);
// router.post('/login', userController.login);
projectrouter.post('/', upload, projectverifyToken, projectController.postProject);

module.exports = projectrouter;
