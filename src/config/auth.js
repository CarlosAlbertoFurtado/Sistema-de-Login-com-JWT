// =====================================================
// ⚙️ CONFIGURAÇÕES DE AUTENTICAÇÃO
// =====================================================
// Centraliza todas as configurações do JWT
// =====================================================

module.exports = {
    // Chave secreta para assinar os tokens
    // NUNCA compartilhe essa chave ou coloque no código!
    secret: process.env.JWT_SECRET,

    // Tempo de expiração do token
    // Exemplos: '1h', '7d', '30d'
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};
