const expressproduct = require('express');
const projectController = require('../controllers/project');
const projectrouter = expressproduct.Router();
const projectverifyToken = require('../middleware/authMiddleware');
const upload = require('../helpers/storage');

projectrouter.get('/', projectController.getProjects);
projectrouter.delete('/:id', projectverifyToken, projectController.deleteProductDetails);
projectrouter.post('/', upload, projectverifyToken, projectController.postProject);
projectrouter.put('/:id', upload, projectverifyToken, projectController.updateProject);

module.exports = projectrouter;
