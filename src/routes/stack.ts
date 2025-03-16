const expressStack = require('express');
const stackController = require('../controllers/stack');
const stackRouter = expressStack.Router();
const stackverifyToken = require('../middleware/authMiddleware');
const stackUpload = require('../helpers/storage');

stackRouter.get('/stack', stackController.getStacks);
stackRouter.delete('/stack/:id', stackverifyToken, stackController.deleteStackDetails);
stackRouter.post('/stack', stackUpload, stackverifyToken, stackController.postStack);
stackRouter.put('/stack/:id', stackUpload, stackverifyToken, stackController.updateStackDetails);
stackRouter.get('/stack/:id', stackUpload, stackverifyToken, stackController.getStack);

module.exports = stackRouter;
