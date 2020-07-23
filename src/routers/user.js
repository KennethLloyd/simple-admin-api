const express = require('express');
const authenticate = require('../middleware/authenticate');
const { userController } = require('../controllers');

const router = new express.Router();

router.post('/users', userController.signUp);
router.post('/users/login', userController.logIn);
router.post('/users/logout', authenticate, userController.logOut);
router.post('/users/logoutAll', authenticate, userController.logOutAllDevices);
router.patch('/users/me', authenticate, userController.editProfile);
router.delete('/users/me', authenticate, userController.deleteAccount);

module.exports = router;
