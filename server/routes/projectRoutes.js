const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', authenticateToken, upload.array('files', 5), projectController.submitProject);
router.post('/ideas', authenticateToken, projectController.publishIdea);
router.post('/:id/like', authenticateToken, projectController.toggleLike);
router.post('/:id/comments', authenticateToken, projectController.postComment);
router.post('/:id/report', authenticateToken, projectController.reportProject);
router.post('/:id/clone', authenticateToken, projectController.cloneProject);
router.delete('/:id', authenticateToken, projectController.deleteProject);

module.exports = router;
