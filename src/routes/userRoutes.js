// =====================================================
// 🛣️ ROTAS DE USUÁRIO (PROTEGIDAS)
// =====================================================
// Todas estas rotas precisam de token válido!
// O middleware authMiddleware verifica o token
// =====================================================

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// =============================================
// 🛡️ APLICAR MIDDLEWARE EM TODAS AS ROTAS
// =============================================
// Todas as rotas abaixo passarão pelo middleware
router.use(authMiddleware);

// GET /profile - Obter dados do usuário logado
router.get('/', userController.getProfile);

// PUT /profile - Atualizar dados do usuário
router.put('/', userController.updateProfile);

module.exports = router;
