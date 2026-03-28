const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET /login - Mostrar formulário de login
router.get('/login', authController.getLogin);

// GET /register - Mostrar formulário de registo
router.get('/register', authController.getRegister);

// POST /register - Processar o registo e gravar na BD
router.post('/register', authController.postRegister);

// POST /login - Processar o login
router.post('/login', authController.postLogin);

// GET /logout - Fazer logout
router.get('/logout', authController.logout);

module.exports = router;
