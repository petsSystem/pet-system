#!/bin/bash

# 📅 TESTE DE FLUXO COMPLETO - AGENDAMENTO (7 ETAPAS)

source "$(dirname "$0")/../utils/config.sh"

log_info "Iniciando teste de fluxo completo de agendamento..."

# Obter token e dados necessários
token=$(get_auth_token)
if [ -z "$token" ]; then
    log_error "Falha ao obter token de autenticação"
    exit 1
fi

company_id=$(cat "$GENERATED_DIR/admin_user_data.json" | jq -r '.companyId // empty')

# Verificar se temos dados necessários
if [ ! -f "$GENERATED_DIR/category_ids.txt" ] || [ ! -f "$GENERATED_DIR/product_ids.txt" ]; then
    log_error "Dados de categorias e produtos não encontrados. Execute primeiro os testes CRUD."
    exit 1
fi

category_id=$(head -n1 "$GENERATED_DIR/category_ids.txt")
product_id=$(head -n1 "$GENERATED_DIR/product_ids.txt")

log_info "Usando dados:"
log_info "- Company ID: $company_id"
log_info "- Category ID: $category_id"
log_info "- Product ID: $product_id"

# ETAPA 1: Listar categorias ativas
log_info "ETAPA 1: Listar categorias ativas"
response=$(api_request "GET" "/categories?companyId=$company_id&active=true" "" "$token")
if echo "$response" | jq . > /dev/null 2>&1; then
    count=$(echo "$response" | jq 'length')
    log_success "✅ Etapa 1: $count categorias ativas encontradas"
else
    log_error "❌ Etapa 1: Falha ao listar categorias"
    exit 1
fi

# ETAPA 2: Listar produtos/serviços da categoria
log_info "ETAPA 2: Listar produtos da categoria selecionada"
response=$(api_request "GET" "/products?categoryId=$category_id&active=true" "" "$token")
if echo "$response" | jq . > /dev/null 2>&1; then
    count=$(echo "$response" | jq 'length')
    log_success "✅ Etapa 2: $count produtos encontrados na categoria"
else
    log_error "❌ Etapa 2: Falha ao listar produtos da categoria"
    exit 1
fi

# ETAPA 3: Criar cliente e pet para o agendamento
log_info "ETAPA 3: Criar cliente e pet"

# Criar cliente
customer_data='{
    "name": "Cliente Teste Agendamento",
    "cpf": "12312312312",
    "email": "cliente.teste@email.com",
    "phone": "(11) 99999-9999",
    "address": {
        "street": "Rua Teste, 123",
        "neighborhood": "Bairro Teste",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "12345-678"
    },
    "companyId": "'$company_id'"
}'

response=$(api_request "POST" "/customers" "$customer_data" "$token")
if echo "$response" | jq . > /dev/null 2>&1; then
    customer_id=$(echo "$response" | jq -r '.id')
    customer_name=$(echo "$response" | jq -r '.name')
    log_success "✅ Cliente criado: $customer_name (ID: $customer_id)"
    echo "$customer_id" > "$GENERATED_DIR/test_customer_id.txt"
else
    log_error "❌ Etapa 3: Falha ao criar cliente"
    echo "$response"
    exit 1
fi

# Criar pet
pet_data='{
    "name": "Pet Teste",
    "specie": "DOG",
    "breed": "MIXED",
    "gender": "MALE",
    "size": "MEDIUM",
    "coat": "SHORT",
    "temper": "DOCILE",
    "birthDate": "2022-01-15",
    "weight": 15.0,
    "observations": "Pet criado para teste de agendamento",
    "customerId": "'$customer_id'"
}'

response=$(api_request "POST" "/pets" "$pet_data" "$token")
if echo "$response" | jq . > /dev/null 2>&1; then
    pet_id=$(echo "$response" | jq -r '.id')
    pet_name=$(echo "$response" | jq -r '.name')
    log_success "✅ Pet criado: $pet_name (ID: $pet_id)"
    echo "$pet_id" > "$GENERATED_DIR/test_pet_id.txt"
else
    log_error "❌ Etapa 3: Falha ao criar pet"
    echo "$response"
    exit 1
fi

# ETAPA 4: Verificar disponibilidade mensal
log_info "ETAPA 4: Verificar disponibilidade mensal"
current_month=$(date +%Y-%m)
response=$(api_request "GET" "/appointments/month?companyId=$company_id&productId=$product_id&month=$current_month" "" "$token")
if echo "$response" | jq . > /dev/null 2>&1; then
    log_success "✅ Etapa 4: Disponibilidade mensal consultada"
else
    log_error "❌ Etapa 4: Falha ao consultar disponibilidade mensal"
    echo "$response"
fi

# ETAPA 5: Verificar disponibilidade diária
log_info "ETAPA 5: Verificar disponibilidade diária"
tomorrow=$(date -d "+1 day" +%Y-%m-%d)
response=$(api_request "GET" "/appointments/day?date=$tomorrow&companyId=$company_id&productId=$product_id" "" "$token")
if echo "$response" | jq . > /dev/null 2>&1; then
    log_success "✅ Etapa 5: Disponibilidade diária consultada para $tomorrow"
    # Pegar primeiro horário disponível
    first_time=$(echo "$response" | jq -r '.[0].time // "09:00"')
    echo "$first_time" > "$GENERATED_DIR/selected_time.txt"
else
    log_error "❌ Etapa 5: Falha ao consultar disponibilidade diária"
    echo "$response"
    first_time="09:00"
fi

# ETAPA 6: Listar funcionários disponíveis
log_info "ETAPA 6: Listar funcionários disponíveis"
response=$(api_request "GET" "/users?companyId=$company_id" "" "$token")
if echo "$response" | jq . > /dev/null 2>&1; then
    count=$(echo "$response" | jq '.content | length')
    if [ "$count" -gt 0 ]; then
        employee_id=$(echo "$response" | jq -r '.content[0].id')
        log_success "✅ Etapa 6: $count funcionários encontrados. Selecionado: $employee_id"
        echo "$employee_id" > "$GENERATED_DIR/selected_employee_id.txt"
    else
        log_warning "⚠️ Etapa 6: Nenhum funcionário encontrado, continuando sem funcionário específico"
        employee_id=""
    fi
else
    log_error "❌ Etapa 6: Falha ao listar funcionários"
    echo "$response"
    employee_id=""
fi

# ETAPA 7: Criar agendamento
log_info "ETAPA 7: Criar agendamento"
appointment_datetime="${tomorrow}T${first_time}:00"

appointment_data='{
    "customerId": "'$customer_id'",
    "petId": "'$pet_id'",
    "productId": "'$product_id'",
    "companyId": "'$company_id'",
    "dateTime": "'$appointment_datetime'",
    "observations": "Agendamento criado via teste automatizado"'

if [ -n "$employee_id" ]; then
    appointment_data=$(echo "$appointment_data" | sed 's/}$/,"employeeId": "'$employee_id'"}/')
else
    appointment_data="${appointment_data}}"
fi

response=$(api_request "POST" "/appointments" "$appointment_data" "$token")
if echo "$response" | jq . > /dev/null 2>&1; then
    appointment_id=$(echo "$response" | jq -r '.id')
    appointment_status=$(echo "$response" | jq -r '.status')
    log_success "✅ Etapa 7: Agendamento criado com sucesso!"
    log_success "   - ID: $appointment_id"
    log_success "   - Status: $appointment_status"
    log_success "   - Data/Hora: $appointment_datetime"
    echo "$appointment_id" > "$GENERATED_DIR/test_appointment_id.txt"
else
    log_error "❌ Etapa 7: Falha ao criar agendamento"
    echo "$response"
    exit 1
fi

# TESTE ADICIONAL: Listar agendamentos
log_info "TESTE ADICIONAL: Listar agendamentos criados"
response=$(api_request "GET" "/appointments/schedule?companyId=$company_id" "" "$token")
if echo "$response" | jq . > /dev/null 2>&1; then
    count=$(echo "$response" | jq 'length')
    log_success "✅ $count agendamentos encontrados na agenda"
else
    log_error "❌ Falha ao listar agendamentos"
    echo "$response"
fi

# TESTE ADICIONAL: Atualizar status do agendamento
log_info "TESTE ADICIONAL: Atualizar status do agendamento"
status_update='[{"op": "replace", "path": "/status", "value": "CONFIRMED"}]'

response=$(curl -s -X PATCH "$API_BASE/appointments/$appointment_id/status" \
    -H "Content-Type: application/json-patch+json" \
    -H "Authorization: Bearer $token" \
    -d "$status_update")

if echo "$response" | jq . > /dev/null 2>&1; then
    new_status=$(echo "$response" | jq -r '.status')
    log_success "✅ Status do agendamento atualizado para: $new_status"
else
    log_error "❌ Falha ao atualizar status do agendamento"
    echo "$response"
fi

log_success "🎉 FLUXO COMPLETO DE AGENDAMENTO CONCLUÍDO COM SUCESSO!"
log_info "Dados criados para teste:"
log_info "- Cliente: $customer_id"
log_info "- Pet: $pet_id"
log_info "- Agendamento: $appointment_id"