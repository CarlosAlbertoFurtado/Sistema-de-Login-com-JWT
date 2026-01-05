// =====================================================
// 🚀 SERVIDOR PRINCIPAL
// =====================================================
// Ponto de entrada da aplicação
// Configura Express e conecta todas as rotas
// =====================================================

// Carregar variáveis de ambiente PRIMEIRO!
require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Criar aplicação Express
const app = express();

// =============================================
// ⚙️ MIDDLEWARES GLOBAIS
// =============================================

// Permite receber JSON no body das requisições
app.use(express.json());

// Log simples de requisições (para debug)
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
});

// =============================================
// 🛣️ ROTAS
// =============================================

// Rota de teste / boas-vindas
app.get('/', (req, res) => {
    res.json({
        message: '🔐 Sistema de Login com JWT',
        version: '1.0.0',
        endpoints: {
            register: 'POST /auth/register',
            login: 'POST /auth/login',
            profile: 'GET /profile (precisa de token)',
            updateProfile: 'PUT /profile (precisa de token)'
        }
    });
});

// Rotas de autenticação (públicas)
app.use('/auth', authRoutes);

// Rotas de usuário (protegidas)
app.use('/profile', userRoutes);

// =============================================
// ❌ TRATAMENTO DE ROTAS NÃO ENCONTRADAS
// =============================================
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        message: `A rota ${req.method} ${req.path} não existe`
    });
});

// =============================================
// 🏃 INICIAR SERVIDOR
// =============================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('');
    console.log('=============================================');
    console.log('🔐 SISTEMA DE LOGIN COM JWT');
    console.log('=============================================');
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    console.log('');
    console.log('📍 Endpoints disponíveis:');
    console.log(`   POST http://localhost:${PORT}/auth/register`);
    console.log(`   POST http://localhost:${PORT}/auth/login`);
    console.log(`   GET  http://localhost:${PORT}/profile`);
    console.log(`   PUT  http://localhost:${PORT}/profile`);
    console.log('=============================================');
    console.log('');
});
