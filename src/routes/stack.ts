const expressStack = require('express');
const stackController = require('../controllers/stack');
const stackRouter = expressStack.Router();
const stackverifyToken = require('../middleware/authMiddleware');
const stackUpload = require('../helpers/storage');

stackRouter.get('/stack', stackController.getStacks);
// projectrouter.delete('/project/:id', projectverifyToken, projectController.deleteProductDetails);
stackRouter.post('/stack', stackUpload, stackController.postStack);
// projectrouter.put('/project/:id', stackUpload, projectverifyToken, projectController.updateProjectDetails);
// projectrouter.get('/project/:id', stackUpload, projectverifyToken, projectController.getProject);

module.exports = stackRouter;
