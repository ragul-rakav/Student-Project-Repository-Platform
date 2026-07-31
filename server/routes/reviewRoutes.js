const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, authorizeRoles('Faculty'), reviewController.getReviews);
router.post('/action', authenticateToken, authorizeRoles('Faculty'), reviewController.reviewAction);

module.exports = router;
