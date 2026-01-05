# Sistema de Autenticação JWT

API de autenticação feita em Node.js usando JWT para controle de sessão e bcrypt para criptografia de senhas.

## Motivação

Criei esse projeto pra estudar na prática como funciona autenticação em APIs REST. A ideia foi implementar do zero um sistema de login completo, entendendo cada parte: desde o hash da senha até a validação do token nas rotas protegidas.

## Stack

- Node.js
- Express
- JWT (jsonwebtoken)
- bcryptjs
- dotenv

## Como rodar

```bash
# instalar dependências
npm install

# configurar variáveis de ambiente
cp .env.example .env

# rodar em modo desenvolvimento
npm run dev
```

Servidor roda em `http://localhost:3000`

## Rotas

### Públicas

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/register | Criar conta |
| POST | /auth/login | Fazer login |

### Protegidas (precisa de token)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /profile | Ver perfil |
| PUT | /profile | Atualizar nome |

## Exemplos

**Cadastro:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Carlos", "email": "carlos@email.com", "password": "123456"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "carlos@email.com", "password": "123456"}'
```

**Acessar perfil:**
```bash
curl http://localhost:3000/profile \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Estrutura

```
src/
├── config/auth.js         # config do JWT
├── controllers/
│   ├── authController.js  # login e registro
│   └── userController.js  # perfil
├── database/users.js      # dados em memória
├── middleware/authMiddleware.js
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
└── server.js
```

## Segurança

- Senhas são hasheadas com bcrypt antes de salvar
- Tokens expiram em 7 dias (configurável)
- Rotas protegidas validam o token antes de executar

## Próximos passos

- Conectar com banco de dados real
- Implementar refresh token
- Adicionar recuperação de senha

---

Feito por Carlos Alberto Furtado
