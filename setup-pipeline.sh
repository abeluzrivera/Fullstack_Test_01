#!/bin/bash
# Azure DevOps Pipeline Setup Script
# Script para configurar el pipeline de CI/CD en Azure DevOps
# Autor: Pedro Abel Rivera Vera
# Fecha: 26/12/2025

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="Fullstack_Test_01"
ORGANIZATION=""
PROJECT=""
RESOURCE_GROUP="rg-fullstack-test"
LOCATION="East US"
ACR_NAME="acrfullstacktest"
AZURE_SUBSCRIPTION=""

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    Azure DevOps Pipeline Setup Script                      ║${NC}"
echo -e "${BLUE}║    Fullstack_Test_01 - CI/CD Pipeline Configuration      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ============================================================================
# Step 1: Validate Prerequisites
# ============================================================================
echo -e "${YELLOW}[STEP 1/6]${NC} Validando prerequisitos..."
echo ""

check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}✗${NC} $1 no encontrado"
        echo -e "${YELLOW}  Instálalo desde: $2${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓${NC} $1 encontrado"
}

check_command "az" "https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
check_command "git" "https://git-scm.com/download"
check_command "docker" "https://docs.docker.com/get-docker"

echo ""

# ============================================================================
# Step 2: Get User Input
# ============================================================================
echo -e "${YELLOW}[STEP 2/6]${NC} Configuración de Azure DevOps..."
echo ""

read -p "Azure DevOps Organization (ej: myorg): " ORGANIZATION
read -p "Azure DevOps Project (ej: myproject): " PROJECT
read -p "Azure Subscription ID: " AZURE_SUBSCRIPTION
read -p "Azure Resource Group (default: $RESOURCE_GROUP): " RG_INPUT
RESOURCE_GROUP="${RG_INPUT:-$RESOURCE_GROUP}"

echo ""
echo -e "${BLUE}Configuración:${NC}"
echo "  Organization: $ORGANIZATION"
echo "  Project: $PROJECT"
echo "  Subscription: ${AZURE_SUBSCRIPTION:0:10}..."
echo "  Resource Group: $RESOURCE_GROUP"
echo ""

# ============================================================================
# Step 3: Authenticate to Azure
# ============================================================================
echo -e "${YELLOW}[STEP 3/6]${NC} Autenticación con Azure..."
echo ""

echo "Ejecutando: az login"
az login

echo ""
echo "Configurando subscription..."
az account set --subscription "$AZURE_SUBSCRIPTION"
echo -e "${GREEN}✓${NC} Subscription configurada"

echo ""

# ============================================================================
# Step 4: Create Azure Resources
# ============================================================================
echo -e "${YELLOW}[STEP 4/6]${NC} Creando recursos en Azure..."
echo ""

echo "Verificando Resource Group..."
if ! az group exists --name "$RESOURCE_GROUP" | grep -q "true"; then
    echo "Creando Resource Group: $RESOURCE_GROUP"
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION"
    echo -e "${GREEN}✓${NC} Resource Group creado"
else
    echo -e "${GREEN}✓${NC} Resource Group ya existe"
fi

echo ""
echo "Verificando Azure Container Registry..."
if ! az acr show --resource-group "$RESOURCE_GROUP" --name "$ACR_NAME" &>/dev/null; then
    echo "Creando ACR: $ACR_NAME"
    az acr create \
        --resource-group "$RESOURCE_GROUP" \
        --name "$ACR_NAME" \
        --sku Standard \
        --admin-enabled true
    echo -e "${GREEN}✓${NC} ACR creado"
else
    echo -e "${GREEN}✓${NC} ACR ya existe"
fi

echo ""

# ============================================================================
# Step 5: Configure Azure DevOps Service Connection
# ============================================================================
echo -e "${YELLOW}[STEP 5/6]${NC} Configurando Service Connections en Azure DevOps..."
echo ""

echo "Para crear Service Connection manualmente:"
echo ""
echo -e "${BLUE}1. Service Connection para Azure${NC}"
echo "   - Azure DevOps > Project Settings > Service Connections"
echo "   - New Service Connection > Azure Resource Manager"
echo "   - Service Principal (automatic)"
echo "   - Seleccionar Subscription: $AZURE_SUBSCRIPTION"
echo "   - Nombrar: 'AzureSubscription'"
echo ""

echo -e "${BLUE}2. Service Connection para Docker Registry (ACR)${NC}"
echo "   - Azure DevOps > Project Connections > Service Connections"
echo "   - New Service Connection > Docker Registry"
echo "   - Registry Type: Azure Container Registry"
echo "   - Azure Subscription: AzureSubscription"
echo "   - Azure Container Registry: $ACR_NAME"
echo "   - Nombrar: 'AzureContainerRegistry'"
echo ""

read -p "¿Has creado las Service Connections? (s/n): " CONNECTIONS_CREATED

if [ "$CONNECTIONS_CREATED" != "s" ] && [ "$CONNECTIONS_CREATED" != "S" ]; then
    echo -e "${YELLOW}⚠${NC} Por favor crea las Service Connections antes de continuar"
    exit 1
fi

echo ""

# ============================================================================
# Step 6: Configure Pipeline Variables
# ============================================================================
echo -e "${YELLOW}[STEP 6/6]${NC} Configurando variables del pipeline..."
echo ""

echo "Actualizando azure-pipelines.yml con valores específicos de tu entorno..."

# Actualizar variables en el archivo
sed -i "s|REGISTRY_NAME: 'acrfullstacktest'|REGISTRY_NAME: '$ACR_NAME'|g" azure-pipelines.yml
sed -i "s|AZURE_RESOURCE_GROUP: 'rg-fullstack-test'|AZURE_RESOURCE_GROUP: '$RESOURCE_GROUP'|g" azure-pipelines.yml

echo -e "${GREEN}✓${NC} Variables actualizadas"

echo ""

# ============================================================================
# Final Summary
# ============================================================================
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    SETUP COMPLETADO                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}✓ Azure DevOps Pipeline está configurado${NC}"
echo ""

echo -e "${BLUE}Próximos pasos:${NC}"
echo "1. Commit y push de los archivos:"
echo ""
echo -e "${YELLOW}   git add azure-pipelines.yml PIPELINE_SETUP.md .azure/${NC}"
echo -e "${YELLOW}   git commit -m \"ci: Add Azure DevOps pipeline configuration\"${NC}"
echo -e "${YELLOW}   git push${NC}"
echo ""

echo "2. En Azure DevOps:"
echo -e "${YELLOW}   - Pipelines > Create Pipeline${NC}"
echo -e "${YELLOW}   - Seleccionar GitHub (o tu repositorio)"${NC}"
echo -e "${YELLOW}   - Seleccionar 'azure-pipelines.yml' existente${NC}"
echo -e "${YELLOW}   - Nombrar: 'Fullstack_Test_01 - CI/CD Pipeline'${NC}"
echo ""

echo "3. Configurar variable de secreto (si es necesario):"
echo -e "${YELLOW}   - Pipelines > Library > Secure files${NC}"
echo -e "${YELLOW}   - Upload files si necesitas credenciales adicionales${NC}"
echo ""

echo "4. Configurar Environment para Production:"
echo -e "${YELLOW}   - Pipelines > Environments > New environment${NC}"
echo -e "${YELLOW}   - Nombre: 'Production'${NC}"
echo -e "${YELLOW}   - Approvers: Tu usuario/grupo${NC}"
echo ""

echo -e "${BLUE}Recursos útiles:${NC}"
echo "- Pipeline Setup Guide: PIPELINE_SETUP.md"
echo "- Pipeline Variables: .azure/pipeline-variables.yml"
echo "- Azure Pipelines Docs: https://docs.microsoft.com/en-us/azure/devops/pipelines"
echo ""

echo -e "${GREEN}¡Pipeline configurado exitosamente!${NC}"
echo ""
