#!/bin/bash
APP_NAME="so-login-app"
APP_DIR="/opt/$APP_NAME"

echo "=== Iniciando deploy de $APP_NAME ==="

# Ir al directorio de la aplicación
cd $APP_DIR

# Detener PM2 si está corriendo
if pm2 show $APP_NAME &> /dev/null; then
    echo "Deteniendo $APP_NAME..."
    pm2 stop $APP_NAME
fi

# Actualizar código desde GitHub
echo "Actualizando repositorio..."
git pull origin main

# Instalar dependencias del backend
echo "Instalando dependencias del backend..."
cd login-back
npm install
cd ..

# Instalar dependencias del frontend y buildear
echo "Instalando dependencias del frontend..."
cd login-front
npm install

echo "Construyendo frontend para producción..."
npm run build

# Verificar que el build se generó correctamente
if [ ! -d "dist" ]; then
    echo "ERROR: No se generó la carpeta dist del frontend"
    exit 1
fi

echo "Build del frontend completado ✓"
cd ..

# Crear carpeta de logs si no existe
mkdir -p logs

# Reiniciar con PM2
if pm2 show $APP_NAME &> /dev/null; then
    echo "Reiniciando $APP_NAME..."
    pm2 restart $APP_NAME
else
    echo "Iniciando $APP_NAME por primera vez..."
    pm2 start ecosystem.config.js --env production
fi

# Guardar configuración PM2
pm2 save

echo "=== Deploy completado exitosamente ==="
echo "La aplicación está corriendo en:"
echo "- Backend API: http://localhost:3001/login-data"
echo "- Frontend: http://localhost:3001"
echo ""

# Mostrar estado de PM2
pm2 list
echo ""
echo "Para ver los logs: pm2 logs $APP_NAME"