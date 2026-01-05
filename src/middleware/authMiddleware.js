// =====================================================
// 🛡️ MIDDLEWARE DE AUTENTICAÇÃO
// =====================================================
// Este middleware protege rotas que precisam de login
// Ele verifica se o token JWT é válido
// =====================================================

const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

/**
 * Middleware que verifica se o usuário está autenticado
 * Deve ser usado em rotas que precisam de proteção
 */
function authMiddleware(req, res, next) {
    // 1. Pegar o header Authorization
    const authHeader = req.headers.authorization;

    // 2. Verificar se o header existe
    if (!authHeader) {
        return res.status(401).json({
            error: 'Token não fornecido',
            message: 'Você precisa estar logado para acessar esta rota'
        });
    }

    // =============================================
    // 📋 FORMATO DO HEADER
    // =============================================
    // O token vem no formato: "Bearer <token>"
    // Precisamos separar e pegar só o token
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({
            error: 'Erro no token',
            message: 'Formato do token inválido'
        });
    }

    const [scheme, token] = parts;

    // 3. Verificar se começa com "Bearer"
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({
            error: 'Token mal formatado',
            message: 'O token deve começar com "Bearer"'
        });
    }

    // =============================================
    // ✅ VERIFICAR TOKEN JWT
    // =============================================
    try {
        // jwt.verify decodifica e valida o token
        // Se o token for inválido ou expirado, lança um erro
        const decoded = jwt.verify(token, authConfig.secret);

        // 4. Adiciona o ID do usuário ao request
        // Assim, as próximas funções podem saber quem está logado
        req.userId = decoded.id;

        // 5. Continua para a próxima função (controller)
        return next();

    } catch (error) {
        // Token inválido ou expirado
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expirado',
                message: 'Sua sessão expirou. Faça login novamente.'
            });
        }

        return res.status(401).json({
            error: 'Token inválido',
            message: 'O token fornecido é inválido'
        });
    }
}

module.exports = authMiddleware;
