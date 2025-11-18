#!/bin/bash

# 🔐 TESTES DE AUTENTICAÇÃO

source "$(dirname "$0")/../utils/config.sh"

log_info "Iniciando testes de autenticação..."

# Verificar se API está rodando
if ! check_api_health; then
    log_error "API não está respondendo em $BASE_URL"
    exit 1
fi

# Teste 1: Login com credenciais válidas
log_info "Teste 1: Login com credenciais válidas"
response=$(curl -s -X POST "$API_BASE/sys/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\": \"$ADMIN_CPF\", \"password\": \"$ADMIN_PASSWORD\"}" \
    -w "\n%{http_code}")

status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$status_code" = "200" ]; then
    token=$(echo "$body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$token" ]; then
        log_success "Login realizado com sucesso. Token obtido."
        echo "$token" > "$GENERATED_DIR/auth_token.txt"
    else
        log_error "Token não encontrado na resposta"
        echo "Resposta: $body"
        exit 1
    fi
else
    log_error "Falha no login. Status: $status_code"
    echo "$body"
    exit 1
fi

# Teste 2: Login com credenciais inválidas
log_info "Teste 2: Login com credenciais inválidas"
response=$(curl -s -X POST "$API_BASE/sys/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username": "invalid", "password": "invalid"}' \
    -w "\n%{http_code}")

status_code=$(echo "$response" | tail -n1)
if [ "$status_code" = "403" ] || [ "$status_code" = "401" ]; then
    log_success "Credenciais inválidas rejeitadas corretamente"
else
    log_warning "Status inesperado para credenciais inválidas: $status_code"
fi

# Teste 3: Endpoint protegido sem token
log_info "Teste 3: Acesso a endpoint protegido sem token"
response=$(curl -s -X GET "$API_BASE/users/me" -w "\n%{http_code}")
status_code=$(echo "$response" | tail -n1)

if [ "$status_code" = "403" ] || [ "$status_code" = "401" ]; then
    log_success "Acesso negado corretamente sem token"
else
    log_warning "Status inesperado sem token: $status_code"
fi

# Teste 4: Endpoint protegido com token válido
log_info "Teste 4: Acesso a endpoint protegido com token válido"
response=$(curl -s -X GET "$API_BASE/users/me" \
    -H "Authorization: Bearer $token" \
    -w "\n%{http_code}")

status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$status_code" = "200" ]; then
    user_id=$(echo "$body" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$user_id" ]; then
        log_success "Acesso autorizado com token válido. User ID: $user_id"
        echo "$user_id" > "$GENERATED_DIR/admin_user_id.txt"
        echo "$body" > "$GENERATED_DIR/admin_user_data.json"
    else
        log_error "Dados do usuário não encontrados na resposta"
        echo "Resposta: $body"
    fi
else
    log_error "Falha no acesso com token válido. Status: $status_code"
    echo "$body"
fi

# Teste 5: Token inválido
log_info "Teste 5: Acesso com token inválido"
response=$(curl -s -X GET "$API_BASE/users/me" \
    -H "Authorization: Bearer invalid_token" \
    -w "\n%{http_code}")

status_code=$(echo "$response" | tail -n1)
if [ "$status_code" = "403" ] || [ "$status_code" = "401" ]; then
    log_success "Token inválido rejeitado corretamente"
else
    log_warning "Status inesperado para token inválido: $status_code"
fi

log_success "Testes de autenticação concluídos!"