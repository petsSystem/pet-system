# 🖥️ ANÁLISE DO FRONTEND - FLUXOS DO ADMIN

## 📋 RESUMO DA ANÁLISE

Analisei a estrutura do frontend Next.js para validar os fluxos do usuário ADMIN, especificamente para criação de petshops e owners.

---

## 🎯 **O QUE VOU FAZER**

### **1. Verificação Atual:**
- ✅ Frontend rodando na porta 3001
- ✅ Estrutura de rotas analisada
- ✅ Menu/navegação mapeada
- ✅ Páginas de gestão identificadas

### **2. Próximos Passos:**
1. **Testar Login ADMIN** no frontend
2. **Verificar Menu "Petshop"** - se lista empresas para ADMIN
3. **Testar Criação de Petshop** via interface
4. **Testar Criação de Owner** via interface
5. **Validar Vinculação** Owner → Petshop

---

## 🗂️ **ESTRUTURA ENCONTRADA**

### **Menu Principal (Sidebar):**
```typescript
// SideBarRoutes.tsx
{
  to: "/company",
  label: "Petshop", 
  resource: ResourcesEnum.COMPANY
},
{
  to: "/user",
  label: "Usuários",
  resource: ResourcesEnum.USER
}
```

### **Páginas Identificadas:**

#### **1. Gestão de Petshops (`/company`)**
- **Arquivo**: `/app/(admin-routes)/company/page.tsx`
- **Função**: Formulário de edição de empresa
- **Status**: ⚠️ **Apenas edição** - Não há listagem de empresas

#### **2. Gestão de Usuários (`/user`)**
- **Listagem**: `/app/(admin-routes)/user/page.tsx`
- **Formulário**: `/app/(admin-routes)/user/[id]/page.tsx`
- **Status**: ✅ **Completo** - Lista + CRUD

---

## 🔍 **PROBLEMAS IDENTIFICADOS**

### **1. Menu "Petshop" - Comportamento Incorreto**
```typescript
// CompanyContext.tsx - Linha 29
async function getCompanies() {
  const { data } = await api.get(UrlsEnum.COMPANIES);
  const companiesData = data.content;
  
  if (companiesData.length > 0) {
    setCompanies(companiesData);
    // ❌ PROBLEMA: Seleciona apenas a empresa do usuário
    if (profile) {
      setSelectedCompanyLocally(profile?.companyId);
    }
  }
}
```

**Problema**: O menu "Petshop" não mostra uma **lista de empresas** para o ADMIN, apenas permite **editar a empresa atual**.

### **2. Falta de Listagem de Empresas**
- **Esperado**: ADMIN deveria ver lista de todas as empresas
- **Atual**: Apenas formulário de edição da empresa selecionada
- **Impacto**: ADMIN não consegue gerenciar múltiplas empresas

### **3. Criação de Petshop**
- **Status**: ❌ **Não implementado** no frontend
- **Backend**: ✅ Funcionando (testado via API)
- **Frontend**: Falta interface de criação

---

## 🛠️ **CORREÇÕES NECESSÁRIAS**

### **1. Criar Página de Listagem de Empresas**
```typescript
// Novo arquivo: /app/(admin-routes)/company/list/page.tsx
// Função: Listar todas as empresas para ADMIN
// Ações: Ver, Editar, Ativar/Desativar, Criar Nova
```

### **2. Ajustar Rota do Menu**
```typescript
// SideBarRoutes.tsx
{
  to: "/company/list",  // ← Mudar para listagem
  label: "Petshops",    // ← Plural
  resource: ResourcesEnum.COMPANY
}
```

### **3. Implementar Botão "Novo Petshop"**
```typescript
// Na página de listagem
<HeaderContent
  title="Petshops"
  buttonLabel="Novo Petshop"
  onButtonClick={() => route.push('/company/0?action=add')}
/>
```

### **4. Ajustar CompanyContext**
```typescript
// Para ADMIN: buscar todas as empresas
// Para outros perfis: apenas empresas do usuário
async function getCompanies() {
  const { data } = await api.get(UrlsEnum.COMPANIES);
  
  if (profile?.role === 'ADMIN') {
    // ADMIN vê todas as empresas
    setCompanies(data.content);
  } else {
    // Outros perfis veem apenas suas empresas
    const userCompanies = data.content.filter(
      company => profile?.companyIds?.includes(company.id)
    );
    setCompanies(userCompanies);
  }
}
```

---

## 🎯 **FLUXO IDEAL PARA ADMIN**

### **1. Login → Dashboard**
- ADMIN faz login
- Acessa dashboard com visão geral

### **2. Menu "Petshops" → Listagem**
- Clica em "Petshops" no menu
- Vê **lista de todas as empresas** cadastradas
- Ações: Ver, Editar, Ativar/Desativar

### **3. Criar Novo Petshop**
- Clica em "Novo Petshop"
- Preenche formulário (nome, CNPJ, endereço)
- Salva → Petshop criado + Categorias automáticas

### **4. Menu "Usuários" → Criar Owner**
- Clica em "Usuários" → "Novo Usuário"
- Preenche dados do owner
- **Seleciona perfil "Owner"** (quando implementado)
- **Vincula ao petshop** criado
- Salva → Owner criado e vinculado

---

## 📊 **STATUS ATUAL vs ESPERADO**

| Funcionalidade | Status Atual | Esperado | Prioridade |
|----------------|--------------|----------|------------|
| **Login ADMIN** | ✅ Funcionando | ✅ OK | - |
| **Menu Petshops** | ❌ Só edição | ✅ Listagem | 🔴 Alta |
| **Listar Empresas** | ❌ Não existe | ✅ Todas empresas | 🔴 Alta |
| **Criar Petshop** | ❌ Não implementado | ✅ Formulário | 🔴 Alta |
| **Criar Owner** | ✅ Funcionando | ✅ OK | 🟡 Média |
| **Vincular Owner** | ✅ Funcionando | ✅ OK | 🟡 Média |
| **Perfil Owner** | ❌ Não existe | ✅ Implementar | 🟡 Média |

---

## 🚀 **PLANO DE IMPLEMENTAÇÃO**

### **Fase 1 - Correções Críticas (2-3 horas)**
1. ✅ Criar página de listagem de empresas
2. ✅ Ajustar rota do menu "Petshops"
3. ✅ Implementar botão "Novo Petshop"
4. ✅ Ajustar CompanyContext para ADMIN

### **Fase 2 - Melhorias (1-2 horas)**
5. ✅ Criar perfil "Owner" no backend
6. ✅ Ajustar formulário de usuário
7. ✅ Implementar seleção de perfil

### **Fase 3 - Testes (30 min)**
8. ✅ Testar fluxo completo
9. ✅ Validar no banco de dados
10. ✅ Documentar resultado

---

## 🎯 **CONCLUSÃO**

### **Problema Principal:**
O frontend **não está preparado** para o perfil ADMIN gerenciar múltiplas empresas. O menu "Petshop" apenas permite editar a empresa atual, não listar/criar novas.

### **Solução:**
Implementar **página de listagem de empresas** com funcionalidades completas de CRUD para o perfil ADMIN.

### **Impacto:**
Após as correções, o ADMIN poderá:
- ✅ Ver lista de todos os petshops
- ✅ Criar novos petshops
- ✅ Criar owners e vincular aos petshops
- ✅ Gerenciar múltiplas empresas

### **Próximo Passo:**
Implementar as correções identificadas para completar o fluxo do ADMIN no frontend.