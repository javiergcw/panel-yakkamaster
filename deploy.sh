#!/bin/bash

# Instalar librerías del sistema si estamos en Debian/Ubuntu (por si se necesitan más adelante)
if grep -qi 'debian\|ubuntu' /etc/os-release 2>/dev/null; then
    echo "Comprobando librerías del sistema..."
    # Sin dependencias extra por defecto; descomentar si el proyecto las requiere:
    # sudo apt-get update
    # sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
fi

# Verifica si existe docker-compose.yml
if [ -f docker-compose.yml ]; then
    echo "Usando docker-compose para el despliegue (puerto 7001)..."
    docker-compose down
    docker-compose up -d --build
else
    echo "Construyendo la imagen Docker..."
    docker build -t panel-yakkamaster:latest .

    echo "Deteniendo contenedores anteriores..."
    docker stop panel-yakkamaster || true
    docker rm panel-yakkamaster || true

    echo "Ejecutando el contenedor..."
    docker run -d --name panel-yakkamaster -p 7001:7001 --restart unless-stopped panel-yakkamaster:latest
fi

echo "Panel Yakkamaster desplegado en http://localhost:7001"
