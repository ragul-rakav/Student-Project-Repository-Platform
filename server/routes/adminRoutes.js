const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/users', authenticateToken, authorizeRoles('Administrator'), adminController.getUsers);
router.post('/users', authenticateToken, authorizeRoles('Administrator'), adminController.addUser);
router.delete('/users/:id', authenticateToken, authorizeRoles('Administrator'), adminController.removeUser);

router.get('/departments', adminController.getDepartments);
router.post('/departments', authenticateToken, authorizeRoles('Administrator'), adminController.addDepartment);
router.delete('/departments/:name', authenticateToken, authorizeRoles('Administrator'), adminController.removeDepartment);

router.get('/tiers', adminController.getTiers);
router.put('/tiers', authenticateToken, authorizeRoles('Administrator'), adminController.updateTiers);

router.get('/analytics', authenticateToken, authorizeRoles('Administrator'), adminController.getAnalytics);
router.get('/notifications', authenticateToken, adminController.getNotifications);

module.exports = router;
