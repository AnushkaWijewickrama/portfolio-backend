const expressproduct = require('express');
const projectController = require('../controllers/project');
const projectrouter = expressproduct.Router();
const projectverifyToken = require('../middleware/authMiddleware');
const upload = require('../helpers/storage');

projectrouter.get('/project', projectController.getProjects);
projectrouter.delete('/project/:id', projectverifyToken, projectController.deleteProductDetails);
projectrouter.post('/project', upload, projectverifyToken, projectController.postProject);
projectrouter.put('/project/:id', upload, projectverifyToken, projectController.updateProjectDetails);
projectrouter.get('/project/:id', upload, projectverifyToken, projectController.getProject);

module.exports = projectrouter;
