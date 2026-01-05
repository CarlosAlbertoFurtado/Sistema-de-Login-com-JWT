/*
    Rotas de usuário
    Endpoints protegidos (precisam de token)
*/

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// aplica o middleware em todas as rotas
router.use(authMiddleware);

// buscar perfil
router.get('/', userController.getProfile);

// atualizar perfil
router.put('/', userController.updateProfile);

module.exports = router;
