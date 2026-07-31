const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, authorizeRoles('Faculty'), guideController.getGuideRequests);
router.post('/action', authenticateToken, authorizeRoles('Faculty'), guideController.guideAction);

module.exports = router;
