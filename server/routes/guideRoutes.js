const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, authorizeRoles('Faculty', 'Administrator'), guideController.getGuideRequests);
router.post('/action', authenticateToken, authorizeRoles('Faculty', 'Administrator'), guideController.guideAction);

module.exports = router;
