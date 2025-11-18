#!/bin/bash

# 🔧 CONFIGURAÇÕES GLOBAIS DOS TESTES

# URLs da API
export BASE_URL="http://localhost:5000"
export API_BASE="$BASE_URL/api/v1/pet"

# Credenciais de teste
export ADMIN_CPF="12345678900"
export ADMIN_PASSWORD="123456"

# Arquivos de dados
export DATA_DIR="$(dirname "$0")/../../data"
export FIXTURES_DIR="$DATA_DIR/fixtures"
export GENERATED_DIR="$DATA_DIR/generated"
export REPORTS_DIR="$(dirname "$0")/../../reports"

# Cores para output
export RED='\033[0;31m'
export GREEN='\033[0;32m'
export YELLOW='\033[1;33m'
export BLUE='\033[0;34m'
export NC='\033[0m' # No Color

# Funções utilitárias
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Função para fazer login e obter token
get_auth_token() {
    local response=$(curl -s -X POST "$API_BASE/sys/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"username\": \"$ADMIN_CPF\", \"password\": \"$ADMIN_PASSWORD\"}")
    
    echo "$response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4
}

# Função para fazer requisição autenticada
api_request() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    local token="$4"
    
    if [ -n "$data" ]; then
        curl -s -X "$method" "$API_BASE$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d "$data"
    else
        curl -s -X "$method" "$API_BASE$endpoint" \
            -H "Authorization: Bearer $token"
    fi
}

# Função para verificar se API está rodando
check_api_health() {
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/actuator/health")
    if [ "$status_code" = "403" ] || [ "$status_code" = "200" ]; then
        return 0
    else
        return 1
    fi
}