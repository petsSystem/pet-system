# 🔐 CREDENCIAIS DE TESTE - SISTEMA PET SHOP

## 👤 **USUÁRIOS CRIADOS**

### 🔑 **Usuário Administrador 1**
- **CPF**: `12345678900`
- **Senha**: `password` (hash BCrypt)
- **Nome**: Admin User
- **Role**: ADMIN
- **Username**: sys_12345678900

### 🔑 **Usuário Administrador 2** 
- **CPF**: `11111111111`
- **Senha**: `secret` (hash BCrypt)
- **Nome**: Test User
- **Role**: ADMIN
- **Username**: sys_11111111111

---

## 🌐 **ENDPOINTS VALIDADOS**

### ✅ **Serviços Funcionando**
- **Frontend**: http://localhost:3000 ✅
- **Backend**: http://localhost:5000 ✅
- **Swagger UI**: http://localhost:5000/swagger-ui/index.html ✅
- **API Docs**: http://localhost:5000/v3/api-docs ✅
- **PostgreSQL**: localhost:5432 ✅

### 🔐 **Autenticação**
- **Endpoint**: `POST /api/v1/pet/sys/auth/login`
- **Payload**: 
```json
{
  "username": "11111111111",
  "password": "secret"
}
```

### 📊 **Principais Endpoints da API**

#### 🏢 **Empresas**
- `GET /api/v1/pet/companies` - Listar empresas
- `POST /api/v1/pet/companies` - Criar empresa
- `PUT /api/v1/pet/companies/{id}` - Atualizar empresa

#### 👥 **Usuários**
- `GET /api/v1/pet/users` - Listar usuários
- `POST /api/v1/pet/users` - Criar usuário
- `PUT /api/v1/pet/users/{id}` - Atualizar usuário

#### 📋 **Categorias**
- `GET /api/v1/pet/categories` - Listar categorias
- `POST /api/v1/pet/categories` - Criar categoria
- `PUT /api/v1/pet/categories/{id}` - Atualizar categoria

#### 🛍️ **Produtos/Serviços**
- `GET /api/v1/pet/products` - Listar produtos
- `POST /api/v1/pet/products` - Criar produto
- `PUT /api/v1/pet/products/{id}` - Atualizar produto

#### 👤 **Clientes**
- `GET /api/v1/pet/customers` - Listar clientes
- `POST /api/v1/pet/customers` - Criar cliente
- `PUT /api/v1/pet/customers/{id}` - Atualizar cliente

#### 🐕 **Pets**
- `GET /api/v1/pet/pets` - Listar pets
- `POST /api/v1/pet/pets` - Criar pet
- `PUT /api/v1/pet/pets/{id}` - Atualizar pet

#### 📅 **Agendamentos**
- `GET /api/v1/pet/appointments/schedule` - Listar agendamentos
- `POST /api/v1/pet/appointments` - Criar agendamento
- `PUT /api/v1/pet/appointments/{id}` - Atualizar agendamento
- `PATCH /api/v1/pet/appointments/status` - Alterar status
- `GET /api/v1/pet/appointments/month` - Disponibilidade mensal
- `GET /api/v1/pet/appointments/day` - Disponibilidade diária

#### 📊 **Horários**
- `GET /api/v1/pet/schedules` - Listar horários
- `POST /api/v1/pet/schedules` - Criar horário
- `PUT /api/v1/pet/schedules/{id}` - Atualizar horário

---

## 🗄️ **BANCO DE DADOS**

### 📊 **Estrutura Criada**
- **Usuários**: 2 usuários admin criados
- **Perfis**: Perfil administrador configurado
- **Empresa**: SYSTEM COMPANY criada
- **Relacionamentos**: Usuários vinculados à empresa e perfil

### 🔧 **Comandos Úteis**
```bash
# Conectar ao banco
docker exec -it postgres-petshop psql -U postgres -d ps-backend-database

# Verificar usuários
SELECT username, cpf, name, role FROM sys_user;

# Verificar empresas
SELECT id, name, cnpj FROM company;

# Verificar perfis
SELECT id, name, role FROM profile;
```

---

## 🚀 **COMO TESTAR**

### 1. **Login no Frontend**
1. Acesse: http://localhost:3000
2. Use CPF: `11111111111`
3. Use Senha: `secret`

### 2. **Teste via API**
```bash
# Login
curl -X POST http://localhost:5000/api/v1/pet/sys/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "11111111111", "password": "secret"}'

# Usar token retornado nos próximos requests
curl -H "Authorization: Bearer {TOKEN}" \
  http://localhost:5000/api/v1/pet/companies
```

### 3. **Swagger UI**
1. Acesse: http://localhost:5000/swagger-ui/index.html
2. Teste endpoints interativamente
3. Use "Authorize" com o token JWT

---

## ⚠️ **OBSERVAÇÕES**

- **Problema de Autenticação**: Há um issue com o hash BCrypt que precisa ser investigado
- **Dados de Teste**: Banco populado com dados mínimos para funcionamento
- **CORS**: Configurado para desenvolvimento local
- **JWT**: Token válido por tempo configurado no backend

---

## 🔧 **PRÓXIMOS PASSOS**

1. **Corrigir autenticação** - Investigar problema com BCrypt
2. **Popular dados** - Adicionar categorias, produtos e clientes de exemplo
3. **Testar fluxo completo** - Validar agendamento end-to-end
4. **Configurar CORS** - Para produção
5. **Implementar testes** - Unitários e integração