// =====================================================
// 👤 CONTROLLER DE USUÁRIO
// =====================================================
// Contém a lógica das rotas protegidas
// Essas funções só são acessíveis com token válido!
// =====================================================

const usersDB = require('../database/users');

// -----------------------------------------------------
// 📋 OBTER PERFIL DO USUÁRIO LOGADO
// -----------------------------------------------------
function getProfile(req, res) {
    try {
        // O middleware já verificou o token e adicionou o userId
        const userId = req.userId;

        // Buscar usuário no banco
        const user = usersDB.findById(userId);

        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado',
                message: 'O usuário não existe mais no sistema'
            });
        }

        // Retornar dados (sem a senha!)
        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        return res.status(500).json({
            error: 'Erro interno',
            message: 'Ocorreu um erro ao buscar o perfil'
        });
    }
}

// -----------------------------------------------------
// ✏️ ATUALIZAR PERFIL DO USUÁRIO
// -----------------------------------------------------
function updateProfile(req, res) {
    try {
        const userId = req.userId;
        const { name } = req.body;

        // Validar dados
        if (!name) {
            return res.status(400).json({
                error: 'Dados incompletos',
                message: 'O nome é obrigatório'
            });
        }

        // Atualizar no banco
        const updatedUser = usersDB.update(userId, { name });

        if (!updatedUser) {
            return res.status(404).json({
                error: 'Usuário não encontrado',
                message: 'O usuário não existe mais no sistema'
            });
        }

        // Retornar dados atualizados
        return res.status(200).json({
            message: 'Perfil atualizado com sucesso!',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                updatedAt: updatedUser.updatedAt
            }
        });

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        return res.status(500).json({
            error: 'Erro interno',
            message: 'Ocorreu um erro ao atualizar o perfil'
        });
    }
}

module.exports = {
    getProfile,
    updateProfile
};
