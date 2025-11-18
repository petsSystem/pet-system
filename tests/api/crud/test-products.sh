#!/bin/bash

# 🛍️ TESTES CRUD - PRODUTOS/SERVIÇOS

source "$(dirname "$0")/../utils/config.sh"

log_info "Iniciando testes CRUD de Produtos/Serviços..."

# Obter token e dados necessários
token=$(get_auth_token)
if [ -z "$token" ]; then
    log_error "Falha ao obter token de autenticação"
    exit 1
fi

company_id=$(cat "$GENERATED_DIR/admin_user_data.json" | grep -o '"companyId":"[^"]*"' | cut -d'"' -f4)
if [ -z "$company_id" ]; then
    log_error "Company ID não encontrado"
    exit 1
fi

# Obter ID da primeira categoria criada
if [ ! -f "$GENERATED_DIR/category_ids.txt" ]; then
    log_error "Nenhuma categoria encontrada. Execute primeiro os testes de categorias."
    exit 1
fi

category_id=$(head -n1 "$GENERATED_DIR/category_ids.txt")
log_info "Usando Category ID: $category_id"

# Teste 1: Listar produtos
log_info "Teste 1: Listar produtos"
response=$(api_request "GET" "/products?companyId=$company_id" "" "$token")
if echo "$response" | jq . > /dev/null 2>&1; then
    count=$(echo "$response" | jq 'length')
    log_success "Produtos listados. Total: $count"
else
    log_error "Falha ao listar produtos"
    echo "$response"
fi

# Teste 2: Criar produtos
log_info "Teste 2: Criar produtos"
products=$(cat "$FIXTURES_DIR/products.json")

echo "$products" | jq -c '.[]' | while read product; do
    product_with_refs=$(echo "$product" | jq ". + {\"companyId\": \"$company_id\", \"categoryId\": \"$category_id\"}")
    
    response=$(api_request "POST" "/products" "$product_with_refs" "$token")
    
    if echo "$response" | jq . > /dev/null 2>&1; then
        product_id=$(echo "$response" | jq -r '.id')
        product_name=$(echo "$response" | jq -r '.name')
        
        if [ "$product_id" != "null" ]; then
            log_success "Produto criado: $product_name (ID: $product_id)"
            echo "$product_id" >> "$GENERATED_DIR/product_ids.txt"
        else
            log_error "Falha ao criar produto: $product_name"
            echo "$response"
        fi
    else
        log_error "Resposta inválida ao criar produto"
        echo "$response"
    fi
done

sleep 2

# Teste 3: Listar produtos após criação
log_info "Teste 3: Listar produtos após criação"
response=$(api_request "GET" "/products?companyId=$company_id" "" "$token")
if echo "$response" | jq . > /dev/null 2>&1; then
    count=$(echo "$response" | jq 'length')
    log_success "Produtos após criação. Total: $count"
    echo "$response" > "$GENERATED_DIR/products_list.json"
else
    log_error "Falha ao listar produtos após criação"
    echo "$response"
fi

# Teste 4: Buscar produto específico
if [ -f "$GENERATED_DIR/product_ids.txt" ]; then
    first_id=$(head -n1 "$GENERATED_DIR/product_ids.txt")
    if [ -n "$first_id" ]; then
        log_info "Teste 4: Buscar produto específico (ID: $first_id)"
        response=$(api_request "GET" "/products/$first_id" "" "$token")
        
        if echo "$response" | jq . > /dev/null 2>&1; then
            name=$(echo "$response" | jq -r '.name')
            price=$(echo "$response" | jq -r '.price')
            log_success "Produto encontrado: $name - R$ $price"
        else
            log_error "Falha ao buscar produto específico"
            echo "$response"
        fi
    fi
fi

# Teste 5: Atualizar produto
if [ -f "$GENERATED_DIR/product_ids.txt" ]; then
    first_id=$(head -n1 "$GENERATED_DIR/product_ids.txt")
    if [ -n "$first_id" ]; then
        log_info "Teste 5: Atualizar produto (ID: $first_id)"
        update_data='{
            "name": "Banho Premium Plus",
            "description": "Banho premium com produtos importados",
            "price": 35.00,
            "duration": 45,
            "active": true,
            "companyId": "'$company_id'",
            "categoryId": "'$category_id'"
        }'
        
        response=$(api_request "PUT" "/products/$first_id" "$update_data" "$token")
        
        if echo "$response" | jq . > /dev/null 2>&1; then
            name=$(echo "$response" | jq -r '.name')
            price=$(echo "$response" | jq -r '.price')
            log_success "Produto atualizado: $name - R$ $price"
        else
            log_error "Falha ao atualizar produto"
            echo "$response"
        fi
    fi
fi

# Teste 6: Filtrar produtos por categoria
log_info "Teste 6: Filtrar produtos por categoria"
response=$(api_request "GET" "/products?companyId=$company_id&categoryId=$category_id" "" "$token")
if echo "$response" | jq . > /dev/null 2>&1; then
    count=$(echo "$response" | jq 'length')
    log_success "Produtos filtrados por categoria. Total: $count"
else
    log_error "Falha ao filtrar produtos por categoria"
    echo "$response"
fi

log_success "Testes CRUD de Produtos/Serviços concluídos!"