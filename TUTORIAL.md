# 📚 Tutorial Completo: Sistema de Login com JWT

## Guia Passo a Passo para Desenvolvedores Backend Iniciantes

---

# 🎯 O Que Você Vai Aprender

Ao final deste tutorial, você saberá:
- ✅ O que é JWT e por que usar
- ✅ Como fazer hash de senhas com bcrypt
- ✅ Como criar middlewares de proteção
- ✅ Como estruturar um projeto de autenticação

---

# 📖 Parte 1: Conceitos Fundamentais

## 1.1 O Que é Autenticação?

**Autenticação** é o processo de verificar se alguém é quem diz ser.

```
👤 Usuário: "Sou o João"
🔐 Sistema: "Prove! Qual sua senha?"
👤 Usuário: "123456"
🔐 Sistema: "Correto! Aqui está seu token de acesso"
```

## 1.2 O Que é JWT (JSON Web Token)?

JWT é um **token** (texto codificado) que contém informações do usuário.

### Estrutura do JWT:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA5MjM0NTY3fQ.abc123...
└──────── HEADER ────────┘└────── PAYLOAD ──────┘└─ SIGNATURE ─┘
```

| Parte | O que contém |
|-------|--------------|
| **Header** | Tipo do token e algoritmo |
| **Payload** | Dados do usuário (ID, email, etc) |
| **Signature** | Assinatura para garantir que não foi alterado |

### Por que usar JWT?

| Método Antigo (Sessão) | JWT (Moderno) |
|------------------------|---------------|
| Servidor guarda dados | Cliente guarda o token |
| Difícil de escalar | Fácil de escalar |
| Precisa de banco de dados | Stateless (sem estado) |

## 1.3 O Que é bcrypt?

**bcrypt** é um algoritmo para transformar senhas em textos irreversíveis (hash).

```javascript
// Senha original
"123456"

// Após bcrypt.hash()
"$2a$10$N9qo8uLOickgx2ZMRZoMy..."
```

### Por que não salvar senha em texto?

⚠️ Se um hacker invade o banco de dados:
- **Senha em texto:** Ele vê `123456` e acessa tudo
- **Senha com hash:** Ele vê `$2a$10$N9qo...` e não consegue reverter

---

# 📖 Parte 2: Estrutura do Projeto

## 2.1 Organização de Pastas

```
📦 Sistema de Login com JWT/
│
├── 📂 src/                    # Código fonte
│   ├── 📂 config/             # Configurações
│   │   └── auth.js            # Configurações do JWT
│   │
│   ├── 📂 controllers/        # Lógica de negócio
│   │   ├── authController.js  # Login e registro
│   │   └── userController.js  # Perfil do usuário
│   │
│   ├── 📂 database/           # Banco de dados
│   │   └── users.js           # Funções de acesso aos dados
│   │
│   ├── 📂 middleware/         # Interceptadores
│   │   └── authMiddleware.js  # Verifica se está logado
│   │
│   ├── 📂 routes/             # Definição de rotas
│   │   ├── authRoutes.js      # Rotas públicas
│   │   └── userRoutes.js      # Rotas protegidas
│   │
│   └── server.js              # Ponto de entrada
│
├── .env                       # Variáveis secretas
├── .env.example               # Exemplo de configuração
├── package.json               # Dependências
└── README.md                  # Documentação
```

## 2.2 Por Que Essa Estrutura?

| Pasta | Responsabilidade |
|-------|------------------|
| **controllers** | Contém a LÓGICA (o que fazer) |
| **routes** | Define OS CAMINHOS (onde acessar) |
| **middleware** | INTERCEPTA requisições (verifica coisas) |
| **database** | ACESSA os dados (lê e escreve) |
| **config** | Guarda CONFIGURAÇÕES |

### Princípio: Separação de Responsabilidades

Cada arquivo faz UMA coisa. Isso facilita:
- 🔧 Manutenção
- 🧪 Testes
- 👥 Trabalho em equipe

---

# 📖 Parte 3: Desenvolvimento Passo a Passo

## Passo 1: Inicializar o Projeto

```bash
# Criar pasta
mkdir "Sistema de Login com JWT"
cd "Sistema de Login com JWT"

# Inicializar Node.js
npm init -y
```

O comando `npm init -y` cria o `package.json` automaticamente.

## Passo 2: Instalar Dependências

```bash
npm install express jsonwebtoken bcryptjs dotenv
```

| Pacote | Para que serve |
|--------|----------------|
| `express` | Framework web para criar APIs |
| `jsonwebtoken` | Criar e verificar tokens JWT |
| `bcryptjs` | Fazer hash de senhas |
| `dotenv` | Carregar variáveis de ambiente |

## Passo 3: Configurar Variáveis de Ambiente

Crie o arquivo `.env`:

```env
PORT=4000
JWT_SECRET=minha_chave_super_secreta_2024
JWT_EXPIRES_IN=7d
```

> ⚠️ **IMPORTANTE:** Nunca compartilhe o `.env` ou coloque no GitHub!

## Passo 4: Criar o Banco de Dados

Arquivo: `src/database/users.js`

```javascript
// Array simula o banco de dados
const users = [];
let nextId = 1;

// Buscar por email
function findByEmail(email) {
    return users.find(user => user.email === email);
}

// Buscar por ID
function findById(id) {
    return users.find(user => user.id === id);
}

// Criar usuário
function create(userData) {
    const newUser = {
        id: nextId++,
        ...userData,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return newUser;
}

module.exports = { findByEmail, findById, create };
```

### Explicação:
- `users = []` → Array que guarda todos os usuários
- `findByEmail()` → Procura usuário pelo email
- `findById()` → Procura usuário pelo ID
- `create()` → Adiciona novo usuário

## Passo 5: Criar o Controller de Autenticação

Arquivo: `src/controllers/authController.js`

Este é o **CORE** do sistema! Contém registro e login.

### Função de Registro:

```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function register(req, res) {
    const { name, email, password } = req.body;
    
    // 1. Verificar se email já existe
    const existingUser = usersDB.findByEmail(email);
    if (existingUser) {
        return res.status(400).json({ error: 'Email já existe' });
    }
    
    // 2. Fazer HASH da senha (NUNCA salvar em texto!)
    const passwordHash = await bcrypt.hash(password, 10);
    //                                              ↑
    //                         "salt rounds" - quanto maior, mais seguro
    
    // 3. Salvar usuário COM a senha hasheada
    const user = usersDB.create({
        name,
        email,
        password: passwordHash  // Senha protegida!
    });
    
    // 4. Gerar token JWT
    const token = jwt.sign(
        { id: user.id },        // Payload (dados no token)
        process.env.JWT_SECRET, // Chave secreta
        { expiresIn: '7d' }     // Expira em 7 dias
    );
    
    // 5. Retornar sucesso + token
    return res.status(201).json({
        message: 'Usuário criado!',
        token
    });
}
```

### Função de Login:

```javascript
async function login(req, res) {
    const { email, password } = req.body;
    
    // 1. Buscar usuário pelo email
    const user = usersDB.findByEmail(email);
    if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    // 2. Comparar senha digitada com o hash salvo
    const passwordMatch = await bcrypt.compare(password, user.password);
    //                                         ↑              ↑
    //                               Senha digitada    Hash no banco
    
    if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    // 3. Senha correta! Gerar token
    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    
    return res.status(200).json({
        message: 'Login realizado!',
        token
    });
}
```

### Fluxo Visual:

```
REGISTRO:
senha "123456" → bcrypt.hash() → "$2a$10$..." → salva no banco

LOGIN:
senha "123456" → bcrypt.compare("123456", "$2a$10$...") → true/false
```

## Passo 6: Criar o Middleware de Autenticação

Arquivo: `src/middleware/authMiddleware.js`

O middleware **intercepta** a requisição antes de chegar no controller.

```javascript
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // 1. Pegar o header Authorization
    const authHeader = req.headers.authorization;
    // Formato esperado: "Bearer eyJhbGciOiJ..."
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    // 2. Separar "Bearer" do token
    const [scheme, token] = authHeader.split(' ');
    //         ↑              ↑
    //     "Bearer"     "eyJhbGciOiJ..."
    
    // 3. Verificar o token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //                   ↑
        //    Se inválido, lança erro e vai pro catch
        
        // 4. Adiciona o ID do usuário na requisição
        req.userId = decoded.id;
        
        // 5. Continua para o controller
        return next();
        
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}
```

### Como o Middleware Funciona:

```
Requisição → Middleware → Controller
     ↓            ↓            ↓
  Chega      Verifica      Executa
  aqui       o token       a lógica
```

## Passo 7: Criar as Rotas

### Rotas Públicas (`src/routes/authRoutes.js`):

```javascript
const router = require('express').Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
```

### Rotas Protegidas (`src/routes/userRoutes.js`):

```javascript
const router = require('express').Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Aplica middleware em TODAS as rotas deste arquivo
router.use(authMiddleware);

router.get('/', userController.getProfile);
router.put('/', userController.updateProfile);

module.exports = router;
```

## Passo 8: Criar o Servidor

Arquivo: `src/server.js`

```javascript
require('dotenv').config(); // Carrega .env

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Permite receber JSON
app.use(express.json());

// Conecta as rotas
app.use('/auth', authRoutes);     // /auth/register, /auth/login
app.use('/profile', userRoutes);  // /profile (protegida)

// Inicia o servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```

---

# 📖 Parte 4: Fluxo Completo

## 4.1 Fluxo de Registro

```
1. Cliente envia: POST /auth/register
   { "name": "João", "email": "joao@email.com", "password": "123456" }

2. authController.register():
   - Verifica se email existe → NÃO
   - Faz hash da senha → "$2a$10$..."
   - Salva no banco
   - Gera token JWT

3. Resposta:
   { "message": "Criado!", "token": "eyJhbG..." }
```

## 4.2 Fluxo de Login

```
1. Cliente envia: POST /auth/login
   { "email": "joao@email.com", "password": "123456" }

2. authController.login():
   - Busca usuário pelo email → ENCONTROU
   - Compara senha com hash → CORRETA
   - Gera novo token JWT

3. Resposta:
   { "message": "Login!", "token": "eyJhbG..." }
```

## 4.3 Fluxo de Rota Protegida

```
1. Cliente envia: GET /profile
   Header: Authorization: Bearer eyJhbG...

2. authMiddleware():
   - Extrai token do header
   - Verifica com jwt.verify() → VÁLIDO
   - Adiciona userId ao req
   - Chama next()

3. userController.getProfile():
   - Usa req.userId para buscar dados
   - Retorna perfil

4. Resposta:
   { "user": { "id": 1, "name": "João" } }
```

---

# 📖 Parte 5: Conceitos Importantes

## 5.1 Status HTTP

| Código | Significado | Quando usar |
|--------|-------------|-------------|
| 200 | OK | Sucesso geral |
| 201 | Created | Recurso criado |
| 400 | Bad Request | Dados inválidos |
| 401 | Unauthorized | Não autenticado |
| 404 | Not Found | Não encontrado |
| 500 | Server Error | Erro no servidor |

## 5.2 Métodos HTTP

| Método | Ação | Exemplo |
|--------|------|---------|
| GET | Buscar | Obter perfil |
| POST | Criar | Registrar usuário |
| PUT | Atualizar | Editar perfil |
| DELETE | Remover | Deletar conta |

## 5.3 Boas Práticas de Segurança

| ✅ Faça | ❌ Não Faça |
|---------|-------------|
| Hash de senhas | Salvar senha em texto |
| Usar .env | Colocar segredos no código |
| Validar dados | Confiar no cliente |
| Tokens curtos | Tokens que nunca expiram |

---

# 🎯 Exercícios Para Praticar

1. **Adicione validação de email** - Verifique se o email tem formato válido
2. **Crie rota de deletar conta** - DELETE /profile
3. **Adicione logout** - Implemente uma blacklist de tokens
4. **Adicione roles** - Crie níveis admin/user

---

# 📚 Próximos Passos

Agora que você domina autenticação JWT, próximos projetos:

1. **API com Roles** - Permissões de admin/user
2. **Reset de Senha** - Envio de email com token
3. **Refresh Token** - Renovar token sem login

---

> 💡 **Dica Final:** A melhor forma de aprender é praticando. Tente recriar este projeto do zero sem olhar o código!
