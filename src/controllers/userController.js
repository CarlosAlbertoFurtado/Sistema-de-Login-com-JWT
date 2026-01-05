/*
    Controller de usuário
    Funções de perfil (rotas protegidas)
*/

const usersDB = require('../database/users');


// retorna os dados do usuário logado
function getProfile(req, res) {
    try {
        const userId = req.userId; // vem do middleware

        const usuario = usersDB.findById(userId);
        if (!usuario) {
            return res.status(404).json({
                erro: 'Não encontrado',
                mensagem: 'Usuário não existe'
            });
        }

        return res.status(200).json({
            usuario: {
                id: usuario.id,
                nome: usuario.name,
                email: usuario.email,
                criadoEm: usuario.createdAt,
                atualizadoEm: usuario.updatedAt
            }
        });

    } catch (err) {
        console.error('Erro ao buscar perfil:', err);
        return res.status(500).json({
            erro: 'Erro no servidor',
            mensagem: 'Não foi possível buscar o perfil'
        });
    }
}


// atualiza o nome do usuário
function updateProfile(req, res) {
    try {
        const userId = req.userId;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                erro: 'Campo obrigatório',
                mensagem: 'Informe o nome'
            });
        }

        const usuario = usersDB.update(userId, { name });
        if (!usuario) {
            return res.status(404).json({
                erro: 'Não encontrado',
                mensagem: 'Usuário não existe'
            });
        }

        return res.status(200).json({
            mensagem: 'Perfil atualizado',
            usuario: {
                id: usuario.id,
                nome: usuario.name,
                email: usuario.email,
                atualizadoEm: usuario.updatedAt
            }
        });

    } catch (err) {
        console.error('Erro ao atualizar:', err);
        return res.status(500).json({
            erro: 'Erro no servidor',
            mensagem: 'Não foi possível atualizar'
        });
    }
}


module.exports = { getProfile, updateProfile };
