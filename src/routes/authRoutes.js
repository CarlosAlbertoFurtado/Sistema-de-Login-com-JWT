/*
    Rotas de autenticação
    Endpoints públicos (sem token)
*/

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// cadastro
router.post('/register', authController.register);

// login
router.post('/login', authController.login);

module.exports = router;
