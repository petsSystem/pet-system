# 🧪 TESTES AUTOMATIZADOS - PET SYSTEM

## 📋 **VISÃO GERAL**

Suite completa de testes para validar todos os endpoints e fluxos da API do sistema Pet Shop.

## 🏗️ **ESTRUTURA**

```
tests/
├── api/                    # Scripts de teste da API
│   ├── auth/              # Testes de autenticação
│   ├── crud/              # Testes CRUD básicos  
│   ├── flows/             # Testes de fluxos completos
│   └── utils/             # Utilitários e helpers
├── data/                  # Dados de teste
│   ├── fixtures/          # Dados fixos para testes
│   └── generated/         # Dados gerados dinamicamente
└── reports/               # Relatórios de execução
```

## 🚀 **COMO EXECUTAR**

### **Todos os Testes**
```bash
./run-all-tests.sh
```

### **Testes Específicos**
```bash
./run-auth-tests.sh      # Apenas autenticação
./run-crud-tests.sh      # Apenas CRUD
./run-flow-tests.sh      # Apenas fluxos
```

## 📊 **RELATÓRIOS**

Os relatórios são gerados em `reports/` com:
- Resultados detalhados por endpoint
- Tempos de resposta
- Status de sucesso/falha
- Logs de erro detalhados

## 🎯 **COBERTURA DE TESTES**

- ✅ Autenticação e autorização
- ✅ CRUD completo de todas entidades
- ✅ Fluxo de agendamento (7 etapas)
- ✅ Validações de negócio
- ✅ Tratamento de erros
- ✅ Performance básica