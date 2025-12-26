# Azure DevOps Pipeline Setup Script (PowerShell)
# Script para configurar el pipeline de CI/CD en Azure DevOps
# Autor: Pedro Abel Rivera Vera
# Fecha: 26/12/2025
# Uso: .\setup-pipeline.ps1

param(
    [string]$Organization = "",
    [string]$Project = "",
    [string]$SubscriptionId = "",
    [string]$ResourceGroup = "rg-fullstack-test",
    [string]$Location = "East US",
    [string]$AcrName = "acrfullstacktest",
    [switch]$SkipAzureResources = $false
)

# ============================================================================
# Configuration
# ============================================================================
$ProjectName = "Fullstack_Test_01"
$ErrorActionPreference = "Stop"

# Colors
$Colors = @{
    Reset  = "`e[0m"
    Red    = "`e[31m"
    Green  = "`e[32m"
    Yellow = "`e[33m"
    Blue   = "`e[34m"
}

# ============================================================================
# Helper Functions
# ============================================================================

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  $($Text.PadRight(56))║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Step {
    param([string]$Step, [string]$Text)
    Write-Host "[$($Colors.Yellow)STEP $Step$($Colors.Reset)] $Text"
    Write-Host ""
}

function Write-Success {
    param([string]$Text)
    Write-Host "$($Colors.Green)✓$($Colors.Reset) $Text"
}

function Write-Error {
    param([string]$Text)
    Write-Host "$($Colors.Red)✗$($Colors.Reset) $Text" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Text)
    Write-Host "$($Colors.Yellow)⚠$($Colors.Reset) $Text" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Text)
    Write-Host "$($Colors.Blue)ℹ$($Colors.Reset) $Text" -ForegroundColor Cyan
}

function Test-CommandExists {
    param([string]$Command)
    $exists = $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
    return $exists
}

# ============================================================================
# Main Script
# ============================================================================

Write-Header "Azure DevOps Pipeline Setup Script"
Write-Host "Fullstack_Test_01 - CI/CD Pipeline Configuration" -ForegroundColor Cyan
Write-Host "Autor: Pedro Abel Rivera Vera" -ForegroundColor Gray
Write-Host ""

# ============================================================================
# Step 1: Validate Prerequisites
# ============================================================================
Write-Step "1/6" "Validando prerequisitos..."

$requiredCommands = @("az", "git", "docker")
$allCommandsExist = $true

foreach ($cmd in $requiredCommands) {
    if (Test-CommandExists $cmd) {
        Write-Success "$cmd encontrado"
    } else {
        Write-Error "$cmd no encontrado"
        $allCommandsExist = $false
    }
}

if (-not $allCommandsExist) {
    Write-Error "Por favor instala los comandos faltantes"
    exit 1
}

Write-Host ""

# ============================================================================
# Step 2: Get User Input
# ============================================================================
Write-Step "2/6" "Configuración de Azure DevOps..."

if ([string]::IsNullOrEmpty($Organization)) {
    $Organization = Read-Host "Azure DevOps Organization (ej: myorg)"
}

if ([string]::IsNullOrEmpty($Project)) {
    $Project = Read-Host "Azure DevOps Project (ej: myproject)"
}

if ([string]::IsNullOrEmpty($SubscriptionId)) {
    $SubscriptionId = Read-Host "Azure Subscription ID"
}

$RgInput = Read-Host "Azure Resource Group (default: $ResourceGroup)"
if (-not [string]::IsNullOrEmpty($RgInput)) {
    $ResourceGroup = $RgInput
}

Write-Host ""
Write-Info "Configuración:"
Write-Host "  Organization: $Organization"
Write-Host "  Project: $Project"
Write-Host "  Subscription: $($SubscriptionId.Substring(0, [Math]::Min(10, $SubscriptionId.Length)))..."
Write-Host "  Resource Group: $ResourceGroup"
Write-Host "  ACR Name: $AcrName"
Write-Host ""

# ============================================================================
# Step 3: Authenticate to Azure
# ============================================================================
Write-Step "3/6" "Autenticación con Azure..."

Write-Host "Ejecutando: az login" -ForegroundColor Yellow
az login

Write-Host ""
Write-Host "Configurando subscription..." -ForegroundColor Yellow
az account set --subscription $SubscriptionId
Write-Success "Subscription configurada"

Write-Host ""

# ============================================================================
# Step 4: Create Azure Resources (Optional)
# ============================================================================
if (-not $SkipAzureResources) {
    Write-Step "4/6" "Creando recursos en Azure..."
    
    Write-Host "Verificando Resource Group..."
    $rgExists = (az group exists --name $ResourceGroup) -eq "true"
    
    if (-not $rgExists) {
        Write-Host "Creando Resource Group: $ResourceGroup" -ForegroundColor Yellow
        az group create `
            --name $ResourceGroup `
            --location $Location | Out-Null
        Write-Success "Resource Group creado"
    } else {
        Write-Success "Resource Group ya existe"
    }
    
    Write-Host ""
    Write-Host "Verificando Azure Container Registry..."
    $acrExists = $null -ne (az acr show --resource-group $ResourceGroup --name $AcrName -ErrorAction SilentlyContinue)
    
    if (-not $acrExists) {
        Write-Host "Creando ACR: $AcrName" -ForegroundColor Yellow
        az acr create `
            --resource-group $ResourceGroup `
            --name $AcrName `
            --sku Standard `
            --admin-enabled true | Out-Null
        Write-Success "ACR creado"
    } else {
        Write-Success "ACR ya existe"
    }
    
    Write-Host ""
}

# ============================================================================
# Step 5: Configure Service Connections
# ============================================================================
Write-Step "5/6" "Configurando Service Connections en Azure DevOps..."

Write-Info "Para crear Service Connection manualmente:"
Write-Host ""

Write-Host -ForegroundColor Cyan "1. Service Connection para Azure"
Write-Host "   - Azure DevOps > Project Settings > Service Connections"
Write-Host "   - New Service Connection > Azure Resource Manager"
Write-Host "   - Service Principal (automatic)"
Write-Host "   - Seleccionar Subscription: $SubscriptionId"
Write-Host "   - Nombrar: 'AzureSubscription'"
Write-Host ""

Write-Host -ForegroundColor Cyan "2. Service Connection para Docker Registry (ACR)"
Write-Host "   - Azure DevOps > Project Connections > Service Connections"
Write-Host "   - New Service Connection > Docker Registry"
Write-Host "   - Registry Type: Azure Container Registry"
Write-Host "   - Azure Subscription: AzureSubscription"
Write-Host "   - Azure Container Registry: $AcrName"
Write-Host "   - Nombrar: 'AzureContainerRegistry'"
Write-Host ""

$connectionsCreated = Read-Host "¿Has creado las Service Connections? (s/n)"

if ($connectionsCreated -ne "s" -and $connectionsCreated -ne "S") {
    Write-Error "Por favor crea las Service Connections antes de continuar"
    exit 1
}

Write-Host ""

# ============================================================================
# Step 6: Update Pipeline Configuration
# ============================================================================
Write-Step "6/6" "Configurando variables del pipeline..."

Write-Host "Actualizando azure-pipelines.yml con valores específicos de tu entorno..."

$pipelineFile = "azure-pipelines.yml"

if (Test-Path $pipelineFile) {
    $content = Get-Content $pipelineFile -Raw
    
    $content = $content -replace "REGISTRY_NAME: 'acrfullstacktest'", "REGISTRY_NAME: '$AcrName'"
    $content = $content -replace "AZURE_RESOURCE_GROUP: 'rg-fullstack-test'", "AZURE_RESOURCE_GROUP: '$ResourceGroup'"
    
    Set-Content $pipelineFile -Value $content
    Write-Success "Variables actualizadas en azure-pipelines.yml"
} else {
    Write-Error "azure-pipelines.yml no encontrado en el directorio actual"
    exit 1
}

Write-Host ""

# ============================================================================
# Final Summary
# ============================================================================
Write-Header "SETUP COMPLETADO"

Write-Success "Azure DevOps Pipeline está configurado"
Write-Host ""

Write-Info "Próximos pasos:"
Write-Host ""
Write-Host "1. Commit y push de los archivos:"
Write-Host ""
Write-Host -ForegroundColor Yellow "   git add azure-pipelines.yml PIPELINE_SETUP.md .azure/"
Write-Host -ForegroundColor Yellow "   git commit -m ""ci: Add Azure DevOps pipeline configuration"""
Write-Host -ForegroundColor Yellow "   git push"
Write-Host ""

Write-Host "2. En Azure DevOps:"
Write-Host -ForegroundColor Yellow "   - Pipelines > Create Pipeline"
Write-Host -ForegroundColor Yellow "   - Seleccionar GitHub (o tu repositorio)"
Write-Host -ForegroundColor Yellow "   - Seleccionar 'azure-pipelines.yml' existente"
Write-Host -ForegroundColor Yellow "   - Nombrar: 'Fullstack_Test_01 - CI/CD Pipeline'"
Write-Host ""

Write-Host "3. Configurar variable de secreto (si es necesario):"
Write-Host -ForegroundColor Yellow "   - Pipelines > Library > Secure files"
Write-Host -ForegroundColor Yellow "   - Upload files si necesitas credenciales adicionales"
Write-Host ""

Write-Host "4. Configurar Environment para Production:"
Write-Host -ForegroundColor Yellow "   - Pipelines > Environments > New environment"
Write-Host -ForegroundColor Yellow "   - Nombre: 'Production'"
Write-Host -ForegroundColor Yellow "   - Approvers: Tu usuario/grupo"
Write-Host ""

Write-Info "Recursos útiles:"
Write-Host "- Pipeline Setup Guide: PIPELINE_SETUP.md"
Write-Host "- Pipeline Variables: .azure\pipeline-variables.yml"
Write-Host "- Azure Pipelines Docs: https://docs.microsoft.com/en-us/azure/devops/pipelines"
Write-Host ""

Write-Host -ForegroundColor Green "¡Pipeline configurado exitosamente!"
Write-Host ""

# ============================================================================
# Interactive Menu (Optional)
# ============================================================================
$showMenu = Read-Host "¿Deseas ejecutar comandos adicionales? (s/n)"

if ($showMenu -eq "s" -or $showMenu -eq "S") {
    Write-Host ""
    Write-Host -ForegroundColor Cyan "Opciones disponibles:"
    Write-Host "1. Verificar ACR creado"
    Write-Host "2. Verificar Azure Subscription"
    Write-Host "3. Ver Resource Group"
    Write-Host "4. Ver Containers en ACR"
    Write-Host "0. Salir"
    Write-Host ""
    
    $option = Read-Host "Selecciona una opción"
    
    switch ($option) {
        "1" {
            az acr show --resource-group $ResourceGroup --name $AcrName
        }
        "2" {
            az account show
        }
        "3" {
            az group show --name $ResourceGroup
        }
        "4" {
            az acr repository list --name $AcrName
        }
    }
}

Write-Host ""
