# Script de Backup Completo - Curso TJPE
$timestamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
$origem = "C:\Users\renat\TJPE"
$destino = "D:\tjpe backup\TJPE-COMPLETO-$timestamp.zip"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "CRIANDO BACKUP COMPLETO DO CURSO TJPE" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Origem: $origem" -ForegroundColor Yellow
Write-Host "Destino: $destino" -ForegroundColor Yellow
Write-Host ""
Write-Host "Criando arquivo ZIP..." -ForegroundColor Green

# Criar backup ZIP
Compress-Archive -Path "$origem\*" -DestinationPath $destino -Force

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "[OK] BACKUP COMPLETO CRIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Arquivo: $destino" -ForegroundColor Yellow
Write-Host ""

# Mostrar tamanho do arquivo
$tamanho = (Get-Item $destino).Length / 1MB
Write-Host "Tamanho: $([math]::Round($tamanho, 2)) MB" -ForegroundColor Cyan
