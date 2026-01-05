// =====================================================
// 🔐 CONTROLLER DE AUTENTICAÇÃO
// =====================================================
// Contém a lógica de registro e login
// Este é o CORAÇÃO do sistema de autenticação!
// =====================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const usersDB = require('../database/users');

// -----------------------------------------------------
// 📝 REGISTRO DE NOVO USUÁRIO
// -----------------------------------------------------
async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        // 1. Validação dos campos
        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Dados incompletos',
                message: 'Nome, email e senha são obrigatórios'
            });
        }

        // 2. Verificar se email já existe
        const existingUser = usersDB.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                error: 'Email já cadastrado',
                message: 'Este email já está sendo usado por outro usuário'
            });
        }

        // 3. Validar tamanho da senha
        if (password.length < 6) {
            return res.status(400).json({
                error: 'Senha fraca',
                message: 'A senha deve ter pelo menos 6 caracteres'
            });
        }

        // =============================================
        // 🔒 HASH DA SENHA COM BCRYPT
        // =============================================
        // O número 10 é o "salt rounds" - quanto maior, mais seguro (e mais lento)
        // 10 é um bom equilíbrio entre segurança e performance
        const passwordHash = await bcrypt.hash(password, 10);

        // 4. Criar usuário no banco (com senha hasheada!)
        const user = usersDB.create({
            name,
            email,
            password: passwordHash  // NUNCA salve a senha original!
        });

        // =============================================
        // 🎟️ GERAR TOKEN JWT
        // =============================================
        // O token contém o ID do usuário e é assinado com a chave secreta
        const token = jwt.sign(
            { id: user.id },           // Payload: dados que queremos guardar
            authConfig.secret,          // Chave secreta
            { expiresIn: authConfig.expiresIn }  // Tempo de expiração
        );

        // 5. Retornar sucesso (sem a senha!)
        return res.status(201).json({
            message: 'Usuário criado com sucesso!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error('Erro no registro:', error);
        return res.status(500).json({
            error: 'Erro interno',
            message: 'Ocorreu um erro ao criar o usuário'
        });
    }
}

// -----------------------------------------------------
// 🔑 LOGIN DO USUÁRIO
// -----------------------------------------------------
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // 1. Validação dos campos
        if (!email || !password) {
            return res.status(400).json({
                error: 'Dados incompletos',
                message: 'Email e senha são obrigatórios'
            });
        }

        // 2. Buscar usuário pelo email
        const user = usersDB.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                error: 'Credenciais inválidas',
                message: 'Email ou senha incorretos'
            });
        }

        // =============================================
        // 🔒 COMPARAR SENHA COM BCRYPT
        // =============================================
        // bcrypt.compare compara a senha digitada com o hash salvo
        // Isso é seguro porque o hash é irreversível!
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Credenciais inválidas',
                message: 'Email ou senha incorretos'
            });
        }

        // =============================================
        // 🎟️ GERAR TOKEN JWT
        // =============================================
        const token = jwt.sign(
            { id: user.id },
            authConfig.secret,
            { expiresIn: authConfig.expiresIn }
        );

        // 3. Retornar sucesso
        return res.status(200).json({
            message: 'Login realizado com sucesso!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({
            error: 'Erro interno',
            message: 'Ocorreu um erro ao fazer login'
        });
    }
}

module.exports = {
    register,
    login
};
