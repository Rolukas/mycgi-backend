// Modules
const { Router } = require('express');
const router = Router();

/* Controllers */
const { onLogin } = require('../controllers/login.controller');
const { onCreateUser, onUpdateUser, onDeleteUser } = require('../controllers/user.controller');
const { onCreateRelationProfile } = require('../controllers/profile.controller');

/* Controllers */

/* Routes */

// Login
router.get('/api/Login', onLogin);

// User
router.post('/api/User', onCreateUser);
//router.put('/api/User', onUpdateUser);
//router.delete('/api/User', onDeleteUser);

// Profile
router.post('/api/Profile', onCreateRelationProfile);


/* Routes */

module.exports = router;