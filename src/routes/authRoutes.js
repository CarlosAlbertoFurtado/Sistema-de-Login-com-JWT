// =====================================================
// 🛣️ ROTAS DE AUTENTICAÇÃO
// =====================================================
// Rotas públicas - não precisam de token
// =====================================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /auth/register - Criar nova conta
router.post('/register', authController.register);

// POST /auth/login - Fazer login
router.post('/login', authController.login);

module.exports = router;
