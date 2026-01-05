/*
    Servidor principal da aplicação
    Configuração do Express e rotas
*/

require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// parse do body em JSON
app.use(express.json());

// log das requisições pra debug
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    next();
});

// rota inicial - mostra os endpoints disponíveis
app.get('/', (req, res) => {
    res.json({
        api: 'Sistema de Login JWT',
        versao: '1.0.0',
        rotas: {
            cadastro: 'POST /auth/register',
            login: 'POST /auth/login',
            perfil: 'GET /profile',
            atualizar: 'PUT /profile'
        }
    });
});

// rotas de autenticação (públicas)
app.use('/auth', authRoutes);

// rotas do usuário (precisam de token)
app.use('/profile', userRoutes);

// rota não encontrada
app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        detalhe: `${req.method} ${req.path} não existe`
    });
});

// inicializa o servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('\n=================================');
    console.log('   Sistema de Login JWT');
    console.log('=================================');
    console.log(`Servidor online: http://localhost:${PORT}`);
    console.log('\nRotas:');
    console.log(`  POST /auth/register`);
    console.log(`  POST /auth/login`);
    console.log(`  GET  /profile`);
    console.log(`  PUT  /profile`);
    console.log('=================================\n');
});
