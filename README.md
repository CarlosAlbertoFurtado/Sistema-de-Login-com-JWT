# Sistema de Autenticação com JWT

API REST de autenticação desenvolvida em Node.js, implementando JSON Web Tokens para gerenciamento de sessões e bcrypt para criptografia de senhas.

## Sobre o Projeto

Este projeto nasceu da minha necessidade de entender profundamente como funcionam os sistemas de autenticação modernos. Desenvolvi esta API do zero, pesquisando as melhores práticas de segurança e implementando cada funcionalidade manualmente para consolidar meu conhecimento em:

- Geração e validação de tokens JWT
- Hashing seguro de senhas com bcrypt
- Middleware de proteção de rotas
- Arquitetura de APIs RESTful

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **JWT (jsonwebtoken)** - Autenticação via tokens
- **bcryptjs** - Criptografia de senhas
- **dotenv** - Variáveis de ambiente

## Instalação

```bash
# Clone o repositório
git clone https://github.com/CarlosAlbertoFurtado/Sistema-de-Login-com-JWT.git

# Acesse a pasta
cd Sistema-de-Login-com-JWT

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute o servidor
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## Endpoints da API

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Cadastro de novo usuário |
| POST | `/auth/login` | Autenticação e geração de token |

### Usuário (rotas protegidas)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/profile` | Retorna dados do usuário autenticado |
| PUT | `/profile` | Atualiza informações do perfil |

## Exemplos de Requisição

### Cadastro
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Carlos", "email": "carlos@email.com", "password": "minhasenha"}'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "carlos@email.com", "password": "minhasenha"}'
```

### Acessar Perfil
```bash
curl http://localhost:3000/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Estrutura do Projeto

```
src/
├── config/
│   └── auth.js          # Configurações do JWT
├── controllers/
│   ├── authController.js    # Lógica de autenticação
│   └── userController.js    # Lógica de usuário
├── database/
│   └── users.js         # Persistência de dados
├── middleware/
│   └── authMiddleware.js    # Validação de tokens
├── routes/
│   ├── authRoutes.js    # Rotas públicas
│   └── userRoutes.js    # Rotas protegidas
└── server.js            # Ponto de entrada
```

## Segurança Implementada

- Senhas nunca são armazenadas em texto puro (hash bcrypt com salt)
- Tokens JWT com tempo de expiração configurável
- Middleware de autenticação em todas as rotas privadas
- Variáveis sensíveis isoladas em arquivo `.env`

## Melhorias Futuras

- Integração com banco de dados (MongoDB ou PostgreSQL)
- Implementação de refresh tokens
- Sistema de recuperação de senha
- Níveis de permissão (roles)

## Autor

Desenvolvido por **Carlos Alberto Furtado**

---

*Este projeto faz parte do meu portfólio de estudos em desenvolvimento backend.*
