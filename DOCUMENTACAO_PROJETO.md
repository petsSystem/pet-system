# 🐾 DOCUMENTAÇÃO COMPLETA - SISTEMA PET SHOP

## 📋 VISÃO GERAL DO PROJETO

Sistema completo de gestão para pet shops desenvolvido com arquitetura moderna, oferecendo funcionalidades de agendamento, administração e controle de usuários.

### 🎯 **Objetivo**
Automatizar e otimizar a gestão de pet shops através de uma plataforma web robusta e intuitiva.

### 🏗️ **Arquitetura**
- **Backend**: API REST com Spring Boot + PostgreSQL
- **Frontend**: Aplicação web com Next.js + TypeScript
- **Autenticação**: JWT + Spring Security
- **Deploy**: Heroku (Backend) + Vercel (Frontend)

---

## 🛠️ STACK TECNOLÓGICA

### **Backend (ps-backend)**
```
├── Java 17
├── Spring Boot 3.1.0
├── Spring Security (JWT)
├── Spring Data JPA
├── PostgreSQL
├── Hibernate Spatial
├── ModelMapper
├── Swagger/OpenAPI
├── JavaMail
└── Lombok
```

### **Frontend (ps-web)**
```
├── Next.js 13.5.4
├── TypeScript
├── Tailwind CSS
├── React Hook Form + Yup
├── Axios
├── Context API
├── Cypress (E2E)
└── React Toastify
```

---

## 📁 ESTRUTURA DO PROJETO

```
pet-system/
├── ps-backend/          # API REST Spring Boot
│   ├── src/main/java/br/com/petshop/
│   │   ├── appointment/     # Módulo de agendamentos
│   │   ├── authentication/ # Autenticação e JWT
│   │   ├── category/       # Categorias de serviços
│   │   ├── company/        # Gestão de empresas
│   │   ├── customer/       # Gestão de clientes
│   │   ├── pet/           # Gestão de pets
│   │   ├── product/       # Serviços/produtos
│   │   ├── profile/       # Perfis e permissões
│   │   ├── schedule/      # Horários e agenda
│   │   ├── user/          # Usuários do sistema
│   │   └── commons/       # Utilitários comuns
│   └── src/main/resources/
├── ps-web/              # Frontend Next.js
│   ├── src/app/         # App Router (Next.js 13)
│   ├── src/components/  # Componentes reutilizáveis
│   ├── src/contexts/    # Context API
│   ├── src/services/    # Chamadas API
│   └── src/utils/       # Utilitários
└── docs/               # Documentação adicional
```

---

## 🔐 SISTEMA DE AUTENTICAÇÃO

### **Fluxo de Login**
1. **Entrada**: CPF + Senha
2. **Validação**: Spring Security + JWT
3. **Resposta**: Token + Dados do usuário
4. **Armazenamento**: Cookies seguros
5. **Autorização**: Middleware de rotas

### **Endpoints de Auth**
```
POST /api/v1/auth/sys     # Login sistema admin
POST /api/v1/auth/app     # Login app mobile
POST /api/v1/auth/forget  # Recuperar senha
```

### **Perfis de Usuário**
- **ADMIN**: Acesso total ao sistema
- **OWNER**: Proprietário de empresa
- **MANAGER**: Gerente de filial
- **USER**: Funcionários (Veterinário, Recepcionista)

---

## 🏢 MÓDULOS PRINCIPAIS

### **1. 🏪 Gestão de Empresas (Company)**
- **Entidade**: CompanyEntity
- **Funcionalidades**: CRUD de empresas/filiais
- **Campos**: Nome, CNPJ, endereço, contato
- **API**: `/api/v1/companies`

### **2. 👥 Gestão de Usuários (User)**
- **Entidade**: UserEntity
- **Funcionalidades**: CRUD de usuários do sistema
- **Campos**: Nome, CPF, email, perfil, empresa
- **API**: `/api/v1/users`

### **3. 🎯 Categorias (Category)**
- **Entidade**: CategoryEntity
- **Funcionalidades**: Tipos de serviços (Banho, Tosa, Veterinário)
- **Campos**: Nome, descrição, ativo
- **API**: `/api/v1/categories`

### **4. 🛍️ Produtos/Serviços (Product)**
- **Entidade**: ProductEntity
- **Funcionalidades**: Serviços oferecidos
- **Campos**: Nome, preço, duração, categoria
- **API**: `/api/v1/products`

### **5. 👤 Clientes (Customer)**
- **Entidade**: CustomerEntity
- **Funcionalidades**: Gestão de clientes
- **Campos**: Nome, CPF, telefone, endereço
- **API**: `/api/v1/customers`

### **6. 🐕 Pets (Pet)**
- **Entidade**: PetEntity
- **Funcionalidades**: Cadastro de animais
- **Campos**: Nome, espécie, raça, idade, cliente
- **API**: `/api/v1/pets`

### **7. 📅 Agendamentos (Appointment)**
- **Entidade**: AppointmentEntity
- **Funcionalidades**: Sistema de agendamento completo
- **Campos**: Data, horário, cliente, pet, serviço, status
- **API**: `/api/v1/appointments`

### **8. ⏰ Horários (Schedule)**
- **Entidade**: ScheduleEntity
- **Funcionalidades**: Configuração de horários de funcionamento
- **Campos**: Dias da semana, horários, intervalos
- **API**: `/api/v1/schedules`

### **9. 🔒 Perfis (Profile)**
- **Entidade**: ProfileEntity
- **Funcionalidades**: Controle de permissões
- **Campos**: Nome, recursos, ações permitidas
- **API**: `/api/v1/profiles`

---

## 📅 FLUXO DE AGENDAMENTO (7 ETAPAS)

### **Etapa 1: Categoria** (`/scheduling-01`)
- Seleciona tipo de serviço
- API: `GET /api/v1/categories?active=true`

### **Etapa 2: Serviço** (`/scheduling-02`)
- Escolhe serviço específico
- API: `GET /api/v1/products?categoryId={id}`

### **Etapa 3: Cliente/Pet** (`/scheduling-03`)
- Seleciona ou cadastra cliente + pet
- API: `GET /api/v1/customers`, `GET /api/v1/pets`

### **Etapa 4: Data** (`/scheduling-04`)
- Visualiza calendário de disponibilidade
- API: `GET /api/v1/appointments/month`

### **Etapa 5: Horário** (`/scheduling-05`)
- Escolhe horário disponível
- API: `GET /api/v1/appointments/day`

### **Etapa 6: Funcionário** (`/scheduling-06`)
- Seleciona funcionário (opcional)
- API: `GET /api/v1/users?role=EMPLOYEE`

### **Etapa 7: Confirmação** (`/scheduling-07`)
- Revisa e confirma agendamento
- API: `POST /api/v1/appointments`

---

## 🔒 SISTEMA DE PERMISSÕES

### **Recursos (Resources)**
```java
COMPANY    // Gestão de empresas
USER       // Gestão de usuários  
CATEGORY   // Gestão de categorias
SERVICE    // Gestão de serviços
CUSTOMER   // Gestão de clientes
EMPLOYEE   // Gestão de funcionários
SCHEDULE   // Gestão de horários
```

### **Ações (Actions)**
```java
CREATE     // Criar registros
SHOW       // Visualizar registros
EDIT       // Editar registros
ACTIVATE   // Ativar/Desativar
DELETE     // Excluir registros
```

### **Controle Frontend**
```typescript
<PermissionContainer resource="COMPANY" action="CREATE">
  <CreateButton />
</PermissionContainer>
```

---

## 📊 STATUS DOS AGENDAMENTOS

```java
SCHEDULED    // Agendado
CONFIRMED    // Confirmado  
IN_PROGRESS  // Em andamento
COMPLETED    // Concluído
CANCELLED    // Cancelado
NO_SHOW      // Não compareceu
```

---

## 📧 SISTEMA DE NOTIFICAÇÕES

### **Tipos de Email**
- **Confirmação**: Agendamento criado
- **Lembrete**: 24h antes do agendamento
- **Alteração**: Mudança de data/horário
- **Cancelamento**: Agendamento cancelado

### **Implementação**
- **Service**: MailNotificationService
- **Templates**: Thymeleaf
- **Provider**: JavaMail + SMTP

---

## 🗄️ BANCO DE DADOS

### **Principais Tabelas**
```sql
companies          # Empresas/filiais
users             # Usuários do sistema
profiles          # Perfis de acesso
customers         # Clientes
pets              # Animais dos clientes
categories        # Tipos de serviços
products          # Serviços/produtos
schedules         # Horários de funcionamento
appointments      # Agendamentos
```

### **Relacionamentos**
- User ↔ Company (N:1)
- Customer ↔ Pet (1:N)
- Appointment ↔ Customer (N:1)
- Appointment ↔ Pet (N:1)
- Product ↔ Category (N:1)

---

## 🚀 DEPLOY E AMBIENTES

### **Backend (Heroku)**
```
Ambiente: Production
URL: https://ps-backend.herokuapp.com
Database: PostgreSQL Heroku
```

### **Frontend (Vercel)**
```
Ambiente: Production  
URL: https://ps-web.vercel.app
CDN: Vercel Edge Network
```

### **Configurações**
- **Dockerfile**: Backend containerizado
- **Procfile**: Configuração Heroku
- **system.properties**: Java 17

---

## 🔧 CONFIGURAÇÃO LOCAL

### **Backend**
```bash
# Requisitos
Java 17+
Maven 3.8+
PostgreSQL

# Executar
cd ps-backend
mvn spring-boot:run
```

### **Frontend**
```bash
# Requisitos
Node.js 18+
npm/yarn

# Executar
cd ps-web
npm install
npm run dev
```

### **Variáveis de Ambiente**
```env
# Backend
DATABASE_URL=postgresql://localhost:5432/petshop
JWT_SECRET=your-secret-key
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 📋 FUNCIONALIDADES IMPLEMENTADAS

### ✅ **Completas**
- [x] Sistema de autenticação JWT
- [x] CRUD completo de todas entidades
- [x] Fluxo de agendamento (7 etapas)
- [x] Sistema de permissões básico
- [x] Notificações por email
- [x] Interface responsiva
- [x] Validação de formulários
- [x] Tratamento de erros

### 🔄 **Em Desenvolvimento**
- [ ] Perfis de usuário completos
- [ ] Dashboard com métricas
- [ ] Relatórios financeiros
- [ ] App mobile
- [ ] Sistema de pagamentos

### 📋 **Planejadas**
- [ ] Integração WhatsApp
- [ ] Sistema de fidelidade
- [ ] Estoque de produtos
- [ ] Agenda online para clientes

---

## 🧪 TESTES

### **Backend**
- **JUnit 5**: Testes unitários
- **Spring Boot Test**: Testes de integração
- **Coverage**: 100% (conforme badge)

### **Frontend**
- **Cypress**: Testes E2E
- **Jest**: Testes unitários (planejado)

---

## 📚 DOCUMENTAÇÃO ADICIONAL

### **Arquivos de Referência**
- `FLUXO_APLICACAO.md`: Fluxos detalhados do sistema
- `PERMISSOES_E_PERFIS.md`: Sistema de permissões
- `CREDENCIAIS_TESTE.md`: Usuários para teste
- `SOLUCAO_LOGIN.md`: Troubleshooting de login

### **API Documentation**
- **Swagger UI**: `/swagger-ui.html`
- **OpenAPI**: `/v3/api-docs`

---

## 🔍 PRINCIPAIS ENDPOINTS

### **Autenticação**
```
POST /api/v1/auth/sys           # Login sistema
POST /api/v1/auth/forget        # Recuperar senha
```

### **Gestão**
```
GET  /api/v1/companies          # Listar empresas
GET  /api/v1/users              # Listar usuários
GET  /api/v1/customers          # Listar clientes
GET  /api/v1/products           # Listar serviços
```

### **Agendamento**
```
GET  /api/v1/appointments/month # Disponibilidade mensal
GET  /api/v1/appointments/day   # Horários do dia
POST /api/v1/appointments       # Criar agendamento
```

---

## 🎨 COMPONENTES FRONTEND

### **Principais Componentes**
```typescript
// Formulários
GenericForm          # Formulário dinâmico
InputPS             # Input personalizado
SelectPS            # Select personalizado
DatePicker          # Seletor de data

// Layout
Sidebar             # Menu lateral
PSHeader            # Cabeçalho
Modal               # Modais
Toast               # Notificações

// Tabelas
PSTable             # Tabela com paginação
EmptyState          # Estado vazio
Loading             # Carregamento
```

### **Contexts**
```typescript
AuthContext         # Autenticação
AppContext          # Estado global
AppointmentContext  # Agendamentos
CompanyContext      # Empresas
```

---

## 🔧 UTILITÁRIOS

### **Backend**
```java
ValidationCommonService    # Validações comuns
AuthenticationCommonService # Autenticação
AuditorBaseEntity         # Auditoria
```

### **Frontend**
```typescript
api.ts              # Cliente HTTP
date-utils.ts       # Manipulação de datas
currency.ts         # Formatação monetária
mask.ts             # Máscaras de input
checkPermission.ts  # Verificação de permissões
```

---

## 📈 MÉTRICAS E MONITORAMENTO

### **Logs**
- **Backend**: `backend.log`
- **Frontend**: `frontend.log`
- **Formato**: Structured logging

### **Monitoramento**
- **Health Check**: `/actuator/health`
- **Metrics**: `/actuator/metrics`
- **Info**: `/actuator/info`

---

## 🚨 CONSIDERAÇÕES DE SEGURANÇA

### **Implementado**
- ✅ JWT com expiração
- ✅ Validação de entrada
- ✅ CORS configurado
- ✅ Senhas criptografadas
- ✅ SQL Injection protection

### **Recomendações**
- [ ] Rate limiting
- [ ] Auditoria completa
- [ ] Validação backend em todos endpoints
- [ ] Testes de penetração

---

## 🎯 PRÓXIMOS PASSOS

### **Prioridade Alta**
1. Completar sistema de permissões
2. Implementar dashboard com métricas
3. Adicionar testes automatizados
4. Melhorar documentação da API

### **Prioridade Média**
5. Desenvolver app mobile
6. Sistema de relatórios
7. Integração com pagamentos
8. Notificações push

### **Prioridade Baixa**
9. Sistema de fidelidade
10. Integração WhatsApp
11. Estoque de produtos
12. Analytics avançado

---

## 📞 SUPORTE E CONTATO

### **Credenciais de Teste**
- **Admin**: CPF `12345678900` / Senha `123456`
- **Empresa**: SYSTEM COMPANY

### **URLs**
- **Frontend**: https://ps-web.vercel.app
- **Backend**: https://ps-backend.herokuapp.com
- **Swagger**: https://ps-backend.herokuapp.com/swagger-ui.html

---

## 📄 LICENÇA

Projeto proprietário desenvolvido para gestão de pet shops.

---

**Última atualização**: Dezembro 2024  
**Versão**: 1.0.0  
**Status**: Em produção ✅