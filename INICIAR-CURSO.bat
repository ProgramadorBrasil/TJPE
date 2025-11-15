@echo off
title Curso Leilao Judicial TJPE
color 0A

echo ========================================================
echo   CURSO DE LEILAO JUDICIAL - TJPE
echo   Por Renato Gracie - Leiloeiro Oficial JUCEPE 366
echo ========================================================
echo.
echo Iniciando servidor local...
echo.
echo Aguarde... O navegador ira abrir automaticamente!
echo.

:: Iniciar servidor HTTP Python
start /min python -m http.server 8080

:: Aguardar 2 segundos
timeout /t 2 /nobreak >nul

:: Abrir navegador
start http://localhost:8080/index.html

echo.
echo ========================================================
echo   CURSO INICIADO COM SUCESSO!
echo ========================================================
echo.
echo Acesse: http://localhost:8080
echo.
echo Para FECHAR o curso, feche esta janela.
echo.
pause
