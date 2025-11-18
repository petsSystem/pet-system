#!/bin/bash

# 📋 TESTES CRUD - CATEGORIAS

source "$(dirname "$0")/../utils/config.sh"

log_info "Iniciando testes CRUD de Categorias..."

# Obter token de autenticação
token=$(get_auth_token)
if [ -z "$token" ]; then
    log_error "Falha ao obter token de autenticação"
    exit 1
fi

# Obter company ID
company_id=$(cat "$GENERATED_DIR/admin_user_data.json" | grep -o '"companyId":"[^"]*"' | cut -d'"' -f4)
if [ -z "$company_id" ]; then
    log_error "Company ID não encontrado"
    exit 1
fi

log_info "Usando Company ID: $company_id"

# Teste 1: Listar categorias (inicialmente vazio)
log_info "Teste 1: Listar categorias"
response=$(api_request "GET" "/categories?companyId=$company_id" "" "$token")
if echo "$response" | grep -q '\['; then
    log_success "Categorias listadas com sucesso"
else
    log_error "Falha ao listar categorias"
    echo "$response"
fi

# Teste 2: Criar categorias
log_info "Teste 2: Criar categorias"
categories=$(cat "$FIXTURES_DIR/categories.json")
created_ids=()

echo "$categories" | jq -c '.[]' | while read category; do
    category_with_company=$(echo "$category" | jq ". + {\"companyId\": \"$company_id\"}")
    
    response=$(api_request "POST" "/categories" "$category_with_company" "$token")
    
    if echo "$response" | jq . > /dev/null 2>&1; then
        category_id=$(echo "$response" | jq -r '.id')
        category_name=$(echo "$response" | jq -r '.name')
        
        if [ "$category_id" != "null" ]; then
            log_success "Categoria criada: $category_name (ID: $category_id)"
            echo "$category_id" >> "$GENERATED_DIR/category_ids.txt"
        else
            log_error "Falha ao criar categoria: $category_name"
            echo "$response"
        fi
    else
        log_error "Resposta inválida ao criar categoria"
        echo "$response"
    fi
done

# Aguardar um pouco para garantir que todas as categorias foram criadas
sleep 2

# Teste 3: Listar categorias após criação
log_info "Teste 3: Listar categorias após criação"
response=$(api_request "GET" "/categories?companyId=$company_id" "" "$token")
if echo "$response" | jq . > /dev/null 2>&1; then
    count=$(echo "$response" | jq 'length')
    log_success "Categorias após criação. Total: $count"
    echo "$response" > "$GENERATED_DIR/categories_list.json"
else
    log_error "Falha ao listar categorias após criação"
    echo "$response"
fi

# Teste 4: Buscar categoria específica
if [ -f "$GENERATED_DIR/category_ids.txt" ]; then
    first_id=$(head -n1 "$GENERATED_DIR/category_ids.txt")
    if [ -n "$first_id" ]; then
        log_info "Teste 4: Buscar categoria específica (ID: $first_id)"
        response=$(api_request "GET" "/categories/$first_id" "" "$token")
        
        if echo "$response" | jq . > /dev/null 2>&1; then
            name=$(echo "$response" | jq -r '.name')
            log_success "Categoria encontrada: $name"
        else
            log_error "Falha ao buscar categoria específica"
            echo "$response"
        fi
    fi
fi

# Teste 5: Atualizar categoria
if [ -f "$GENERATED_DIR/category_ids.txt" ]; then
    first_id=$(head -n1 "$GENERATED_DIR/category_ids.txt")
    if [ -n "$first_id" ]; then
        log_info "Teste 5: Atualizar categoria (ID: $first_id)"
        update_data='{
            "name": "Banho e Tosa Premium",
            "description": "Serviços premium de higiene e estética",
            "active": true,
            "companyId": "'$company_id'"
        }'
        
        response=$(api_request "PUT" "/categories/$first_id" "$update_data" "$token")
        
        if echo "$response" | jq . > /dev/null 2>&1; then
            name=$(echo "$response" | jq -r '.name')
            log_success "Categoria atualizada: $name"
        else
            log_error "Falha ao atualizar categoria"
            echo "$response"
        fi
    fi
fi

# Teste 6: Desativar categoria
if [ -f "$GENERATED_DIR/category_ids.txt" ]; then
    last_id=$(tail -n1 "$GENERATED_DIR/category_ids.txt")
    if [ -n "$last_id" ]; then
        log_info "Teste 6: Desativar categoria (ID: $last_id)"
        patch_data='[{"op": "replace", "path": "/active", "value": false}]'
        
        response=$(curl -s -X PATCH "$API_BASE/categories/$last_id" \
            -H "Content-Type: application/json-patch+json" \
            -H "Authorization: Bearer $token" \
            -d "$patch_data")
        
        if echo "$response" | jq . > /dev/null 2>&1; then
            active=$(echo "$response" | jq -r '.active')
            log_success "Categoria desativada. Status: $active"
        else
            log_error "Falha ao desativar categoria"
            echo "$response"
        fi
    fi
fi

log_success "Testes CRUD de Categorias concluídos!"