// =====================================================
// 📦 BANCO DE DADOS EM MEMÓRIA
// =====================================================
// Em um projeto real, você usaria MongoDB ou PostgreSQL
// Aqui usamos um array para fins didáticos
// =====================================================

// Array que simula a tabela de usuários
const users = [];

// Contador para gerar IDs únicos
let nextId = 1;

// -----------------------------------------------------
// FUNÇÕES DO BANCO DE DADOS
// -----------------------------------------------------

/**
 * Busca um usuário pelo email
 * @param {string} email - Email do usuário
 * @returns {Object|undefined} - Usuário encontrado ou undefined
 */
function findByEmail(email) {
    return users.find(user => user.email === email);
}

/**
 * Busca um usuário pelo ID
 * @param {number} id - ID do usuário
 * @returns {Object|undefined} - Usuário encontrado ou undefined
 */
function findById(id) {
    return users.find(user => user.id === id);
}

/**
 * Cria um novo usuário no banco
 * @param {Object} userData - Dados do usuário (name, email, password)
 * @returns {Object} - Usuário criado com ID
 */
function create(userData) {
    const newUser = {
        id: nextId++,
        name: userData.name,
        email: userData.email,
        password: userData.password, // Já vem com hash!
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    return newUser;
}

/**
 * Atualiza os dados de um usuário
 * @param {number} id - ID do usuário
 * @param {Object} updates - Campos a atualizar
 * @returns {Object|null} - Usuário atualizado ou null
 */
function update(id, updates) {
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
        return null;
    }
    
    // Atualiza apenas os campos permitidos
    if (updates.name) {
        users[userIndex].name = updates.name;
    }
    
    users[userIndex].updatedAt = new Date().toISOString();
    
    return users[userIndex];
}

/**
 * Lista todos os usuários (para debug)
 * @returns {Array} - Lista de usuários
 */
function findAll() {
    return users;
}

// Exporta as funções
module.exports = {
    findByEmail,
    findById,
    create,
    update,
    findAll
};
