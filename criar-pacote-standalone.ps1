# Criar Pacote Standalone do Curso
$timestamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
$origem = "C:\Users\renat\TJPE"
$destino = "D:\tjpe backup\Curso-Leilao-Judicial-TJPE-v1.0.0-Standalone.zip"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "CRIANDO PACOTE STANDALONE DO CURSO" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Origem: $origem" -ForegroundColor Yellow
Write-Host "Destino: $destino" -ForegroundColor Yellow
Write-Host ""
Write-Host "Criando arquivo ZIP (pode demorar...)..." -ForegroundColor Green

# Criar backup ZIP
Compress-Archive -Path "$origem\*" -DestinationPath $destino -Force -CompressionLevel Optimal

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "[OK] PACOTE STANDALONE CRIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Arquivo: $destino" -ForegroundColor Yellow
Write-Host ""

# Mostrar tamanho do arquivo
$tamanho = (Get-Item $destino).Length / 1MB
Write-Host "Tamanho: $([math]::Round($tamanho, 2)) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "CONTEUDO DO PACOTE:" -ForegroundColor Yellow
Write-Host "- LEIA-ME.txt (instruções de uso)" -ForegroundColor White
Write-Host "- INICIAR-CURSO.bat (executável para iniciar)" -ForegroundColor White
Write-Host "- Todos os arquivos do curso completo" -ForegroundColor White
Write-Host ""
Write-Host "Para usar: Descompacte e execute INICIAR-CURSO.bat" -ForegroundColor Green
