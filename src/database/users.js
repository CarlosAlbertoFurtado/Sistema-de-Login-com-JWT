/*
    Banco de dados em memória
    Simula um banco para fins de estudo
    Em produção, usar MongoDB ou PostgreSQL
*/

const usuarios = [];
let proximoId = 1;


// busca por email
function findByEmail(email) {
    return usuarios.find(u => u.email === email);
}

// busca por id
function findById(id) {
    return usuarios.find(u => u.id === id);
}

// cria novo usuário
function create(dados) {
    const novoUsuario = {
        id: proximoId++,
        name: dados.name,
        email: dados.email,
        password: dados.password,
        createdAt: new Date().toISOString()
    };

    usuarios.push(novoUsuario);
    return novoUsuario;
}

// atualiza usuário
function update(id, dados) {
    const index = usuarios.findIndex(u => u.id === id);

    if (index === -1) return null;

    if (dados.name) {
        usuarios[index].name = dados.name;
    }

    usuarios[index].updatedAt = new Date().toISOString();
    return usuarios[index];
}

// lista todos (debug)
function findAll() {
    return usuarios;
}


module.exports = {
    findByEmail,
    findById,
    create,
    update,
    findAll
};
