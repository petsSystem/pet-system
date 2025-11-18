#!/bin/bash

# 🚀 EXECUTAR TODOS OS TESTES

source "$(dirname "$0")/api/utils/config.sh"

# Criar diretórios necessários
mkdir -p "$GENERATED_DIR" "$REPORTS_DIR"

# Limpar dados gerados anteriormente
rm -f "$GENERATED_DIR"/*

log_info "🧪 INICIANDO SUITE COMPLETA DE TESTES"
log_info "======================================"

# Verificar se API está rodando
if ! check_api_health; then
    log_error "❌ API não está respondendo em $BASE_URL"
    log_error "Certifique-se de que o backend está rodando"
    exit 1
fi

log_success "✅ API está respondendo"

# Executar testes em ordem
tests_passed=0
tests_failed=0

# 1. Testes de Autenticação
log_info "🔐 Executando testes de autenticação..."
if bash "$(dirname "$0")/api/auth/test-auth.sh"; then
    ((tests_passed++))
    log_success "✅ Testes de autenticação: PASSOU"
else
    ((tests_failed++))
    log_error "❌ Testes de autenticação: FALHOU"
fi

echo ""

# 2. Testes CRUD - Categorias
log_info "📋 Executando testes CRUD de categorias..."
if bash "$(dirname "$0")/api/crud/test-categories.sh"; then
    ((tests_passed++))
    log_success "✅ Testes CRUD de categorias: PASSOU"
else
    ((tests_failed++))
    log_error "❌ Testes CRUD de categorias: FALHOU"
fi

echo ""

# 3. Testes CRUD - Produtos (se existir)
if [ -f "$(dirname "$0")/api/crud/test-products.sh" ]; then
    log_info "🛍️ Executando testes CRUD de produtos..."
    if bash "$(dirname "$0")/api/crud/test-products.sh"; then
        ((tests_passed++))
        log_success "✅ Testes CRUD de produtos: PASSOU"
    else
        ((tests_failed++))
        log_error "❌ Testes CRUD de produtos: FALHOU"
    fi
    echo ""
fi

# 4. Testes CRUD - Clientes (se existir)
if [ -f "$(dirname "$0")/api/crud/test-customers.sh" ]; then
    log_info "👤 Executando testes CRUD de clientes..."
    if bash "$(dirname "$0")/api/crud/test-customers.sh"; then
        ((tests_passed++))
        log_success "✅ Testes CRUD de clientes: PASSOU"
    else
        ((tests_failed++))
        log_error "❌ Testes CRUD de clientes: FALHOU"
    fi
    echo ""
fi

# 5. Testes de Fluxo Completo (se existir)
if [ -f "$(dirname "$0")/api/flows/test-appointment-flow.sh" ]; then
    log_info "📅 Executando testes de fluxo de agendamento..."
    if bash "$(dirname "$0")/api/flows/test-appointment-flow.sh"; then
        ((tests_passed++))
        log_success "✅ Testes de fluxo de agendamento: PASSOU"
    else
        ((tests_failed++))
        log_error "❌ Testes de fluxo de agendamento: FALHOU"
    fi
    echo ""
fi

# Relatório final
total_tests=$((tests_passed + tests_failed))
log_info "📊 RELATÓRIO FINAL"
log_info "=================="
log_info "Total de testes: $total_tests"
log_success "Testes que passaram: $tests_passed"
if [ $tests_failed -gt 0 ]; then
    log_error "Testes que falharam: $tests_failed"
else
    log_success "Testes que falharam: $tests_failed"
fi

# Gerar relatório em arquivo
report_file="$REPORTS_DIR/test-report-$(date +%Y%m%d-%H%M%S).txt"
{
    echo "RELATÓRIO DE TESTES - PET SYSTEM"
    echo "================================"
    echo "Data: $(date)"
    echo "Total de testes: $total_tests"
    echo "Testes que passaram: $tests_passed"
    echo "Testes que falharam: $tests_failed"
    echo ""
    echo "Arquivos gerados em: $GENERATED_DIR"
    ls -la "$GENERATED_DIR"
} > "$report_file"

log_info "📄 Relatório salvo em: $report_file"

# Status de saída
if [ $tests_failed -eq 0 ]; then
    log_success "🎉 TODOS OS TESTES PASSARAM!"
    exit 0
else
    log_error "💥 ALGUNS TESTES FALHARAM!"
    exit 1
fi