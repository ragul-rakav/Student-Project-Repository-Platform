const express = require('express');
const router = express.Router();
const collabController = require('../controllers/collabController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, collabController.getCollaborations);
router.post('/request', authenticateToken, collabController.requestAccess);
router.post('/respond', authenticateToken, collabController.respondRequest);
router.post('/enhancements', authenticateToken, collabController.submitEnhancement);

module.exports = router;
