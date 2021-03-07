const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();

router.get('/users', UserController.getAllUsers);
router.post('/user', UserController.createUser);
router.post('/user/login', UserController.authorizeUser);

module.exports = router;