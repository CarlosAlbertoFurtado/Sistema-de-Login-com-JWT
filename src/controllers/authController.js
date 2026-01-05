/*
    Controller de autenticação
    Lógica de registro e login de usuários
*/

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const usersDB = require('../database/users');


// registro de novo usuário
async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        // validação básica
        if (!name || !email || !password) {
            return res.status(400).json({
                erro: 'Dados incompletos',
                mensagem: 'Preencha nome, email e senha'
            });
        }

        // verifica se o email já tá cadastrado
        const usuarioExiste = usersDB.findByEmail(email);
        if (usuarioExiste) {
            return res.status(400).json({
                erro: 'Email em uso',
                mensagem: 'Já existe uma conta com esse email'
            });
        }

        // senha precisa ter no mínimo 6 caracteres
        if (password.length < 6) {
            return res.status(400).json({
                erro: 'Senha muito curta',
                mensagem: 'A senha precisa ter pelo menos 6 caracteres'
            });
        }

        // gera o hash da senha (10 rounds de salt)
        const senhaHash = await bcrypt.hash(password, 10);

        // salva o usuário no banco
        const usuario = usersDB.create({
            name,
            email,
            password: senhaHash
        });

        // gera o token jwt
        const token = jwt.sign(
            { id: usuario.id },
            authConfig.secret,
            { expiresIn: authConfig.expiresIn }
        );

        return res.status(201).json({
            mensagem: 'Conta criada com sucesso',
            usuario: {
                id: usuario.id,
                nome: usuario.name,
                email: usuario.email
            },
            token
        });

    } catch (err) {
        console.error('Erro no registro:', err);
        return res.status(500).json({
            erro: 'Erro no servidor',
            mensagem: 'Não foi possível criar a conta'
        });
    }
}


// login do usuário
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                erro: 'Dados incompletos',
                mensagem: 'Informe email e senha'
            });
        }

        // busca o usuário pelo email
        const usuario = usersDB.findByEmail(email);
        if (!usuario) {
            return res.status(401).json({
                erro: 'Falha na autenticação',
                mensagem: 'Email ou senha incorretos'
            });
        }

        // compara a senha com o hash salvo
        const senhaCorreta = await bcrypt.compare(password, usuario.password);
        if (!senhaCorreta) {
            return res.status(401).json({
                erro: 'Falha na autenticação',
                mensagem: 'Email ou senha incorretos'
            });
        }

        // gera token pra sessão
        const token = jwt.sign(
            { id: usuario.id },
            authConfig.secret,
            { expiresIn: authConfig.expiresIn }
        );

        return res.status(200).json({
            mensagem: 'Login realizado',
            usuario: {
                id: usuario.id,
                nome: usuario.name,
                email: usuario.email
            },
            token
        });

    } catch (err) {
        console.error('Erro no login:', err);
        return res.status(500).json({
            erro: 'Erro no servidor',
            mensagem: 'Não foi possível fazer login'
        });
    }
}


module.exports = { register, login };
