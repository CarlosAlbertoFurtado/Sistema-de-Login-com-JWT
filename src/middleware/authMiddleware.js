/*
    Middleware de autenticação
    Verifica se o token JWT é válido
*/

const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');


function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    // verifica se mandou o header
    if (!authHeader) {
        return res.status(401).json({
            erro: 'Token ausente',
            mensagem: 'Faça login para acessar'
        });
    }

    // formato esperado: "Bearer <token>"
    const partes = authHeader.split(' ');

    if (partes.length !== 2) {
        return res.status(401).json({
            erro: 'Token inválido',
            mensagem: 'Formato incorreto'
        });
    }

    const [tipo, token] = partes;

    // verifica se é Bearer
    if (!/^Bearer$/i.test(tipo)) {
        return res.status(401).json({
            erro: 'Token mal formatado',
            mensagem: 'Use o formato Bearer <token>'
        });
    }

    // valida o token
    try {
        const dados = jwt.verify(token, authConfig.secret);
        req.userId = dados.id;
        return next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                erro: 'Sessão expirada',
                mensagem: 'Faça login novamente'
            });
        }

        return res.status(401).json({
            erro: 'Token inválido',
            mensagem: 'Não foi possível autenticar'
        });
    }
}


module.exports = authMiddleware;
