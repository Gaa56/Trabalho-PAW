const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET /login - Mostrar formulário de login
router.get('/login', authController.getLogin);

// POST /login - Processar o login
router.post('/login', authController.postLogin);

// GET /logout - Fazer logout
router.get('/logout', authController.logout);

module.exports = router;
