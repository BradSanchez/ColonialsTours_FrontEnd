@echo off
echo ========================================
echo    COLONIALS TOURS - CONFIGURACION
echo ========================================
echo.

echo 1. Instalando dependencias...
call npm install

echo.
echo 2. Verificando configuracion...
if not exist .env (
    echo Creando archivo .env...
    echo VITE_API_URL=http://localhost:3001/api > .env
    echo VITE_CLOUDINARY_CLOUD_NAME=drxaxh9cr >> .env
)

echo.
echo 3. Iniciando servidor de desarrollo...
echo IMPORTANTE: Asegurate de que tu backend este corriendo en http://localhost:3001
echo.
pause
call npm run dev