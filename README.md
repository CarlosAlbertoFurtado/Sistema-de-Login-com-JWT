# 🔐 Sistema de Login com JWT

Sistema de autenticação completo usando **JWT** (JSON Web Tokens) e **bcrypt** para hash de senhas.

## 📚 Conceitos Aprendidos

| Conceito | Descrição |
|----------|-----------|
| **JWT** | Token que permite autenticação stateless |
| **bcrypt** | Algoritmo seguro para hash de senhas |
| **Middleware** | Função que intercepta e verifica requisições |

## 🚀 Como Executar

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor (modo desenvolvimento)
npm run dev

# 3. O servidor estará rodando em http://localhost:3000
```

## 📍 Endpoints

### Rotas Públicas

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Criar nova conta |
| POST | `/auth/login` | Fazer login |

### Rotas Protegidas (precisam de token)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/profile` | Ver perfil do usuário |
| PUT | `/profile` | Atualizar nome |

## 📝 Exemplos de Uso

### 1. Registrar Usuário

```json
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

**Resposta:**
```json
{
  "message": "Usuário criado com sucesso!",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Fazer Login

```json
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "123456"
}
```

### 3. Acessar Rota Protegida

```json
GET http://localhost:3000/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 📁 Estrutura do Projeto

```
📦 Sistema de Login com JWT
├── 📂 src
│   ├── 📂 config
│   │   └── auth.js         # Configurações JWT
│   ├── 📂 controllers
│   │   ├── authController.js   # Login/Registro
│   │   └── userController.js   # Perfil
│   ├── 📂 database
│   │   └── users.js        # Banco em memória
│   ├── 📂 middleware
│   │   └── authMiddleware.js   # Verificação JWT
│   ├── 📂 routes
│   │   ├── authRoutes.js   # Rotas públicas
│   │   └── userRoutes.js   # Rotas protegidas
│   └── server.js           # Servidor principal
├── .env                    # Variáveis de ambiente
├── .env.example            # Exemplo de configuração
├── package.json
└── README.md
```

## 🔒 Segurança

- ✅ Senhas são hasheadas com bcrypt (nunca salvas em texto)
- ✅ Tokens JWT expiram após 7 dias
- ✅ Rotas protegidas verificam token antes de executar

## 📖 Próximos Passos

- [ ] Adicionar banco de dados real (MongoDB/PostgreSQL)
- [ ] Implementar logout (blacklist de tokens)
- [ ] Adicionar refresh tokens
- [ ] Implementar roles (admin/user)
