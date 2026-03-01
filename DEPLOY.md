# Despliegue: Impostor de Fútbol en VPS

## Instrucciones para Claude Code en la VPS

Ejecutá estos pasos en orden para desplegar el juego "Impostor de Fútbol" en esta VPS.

---

## Paso 1: Instalar Docker (si no está instalado)

```bash
# Verificar si Docker está instalado
docker --version

# Si no está instalado, ejecutar:
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

> Si acabás de agregar el usuario al grupo docker, cerrá sesión y volvé a entrar para que tome efecto.

---

## Paso 2: Clonar el repositorio

```bash
cd ~
git clone https://github.com/lukmarroni-source/impostor-de-futbol.git
cd impostor-de-futbol
```

> Reemplazá `lukmarroni-source` con el nombre de usuario de GitHub real.

---

## Paso 3: Configurar para producción

Editar `docker-compose.yml` y cambiar el puerto de `8080:80` a `80:80` para que sea accesible sin puerto:

```bash
sed -i 's/"8080:80"/"80:80"/' docker-compose.yml
```

---

## Paso 4: Levantar el juego

```bash
docker compose up -d --build
```

---

## Paso 5: Verificar que funciona

```bash
curl http://localhost
```

Debería mostrar el HTML del juego.

---

## Paso 6: Abrir el puerto en el firewall (si es necesario)

```bash
# UFW (Ubuntu/Debian)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# O con iptables
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
```

---

## Paso 7: Acceder al juego

El juego estará disponible en:

```
http://IP_DE_TU_VPS
```

Reemplazá `IP_DE_TU_VPS` con la IP pública de tu servidor.

---

## (Opcional) Paso 8: Agregar dominio con HTTPS

Si tenés un dominio, podés agregar HTTPS con Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Crear archivo `docker-compose.yml` actualizado con Nginx reverse proxy y certbot, o instalar Nginx directamente en la VPS como reverse proxy:

```bash
sudo apt install -y nginx
```

Crear config en `/etc/nginx/sites-available/impostor`:

```nginx
server {
    listen 80;
    server_name tudominio.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Activar y obtener certificado SSL:

```bash
sudo ln -s /etc/nginx/sites-available/impostor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d tudominio.com
```

---

## Comandos útiles

```bash
# Ver logs del contenedor
docker compose logs -f

# Reiniciar el juego
docker compose restart

# Parar el juego
docker compose down

# Actualizar (después de un git pull)
docker compose down && docker compose up -d --build
```

---

## Resumen rápido (copiar y pegar)

```bash
cd ~
git clone https://github.com/lukmarroni-source/impostor-de-futbol.git
cd impostor-de-futbol
sed -i 's/"8080:80"/"80:80"/' docker-compose.yml
docker compose up -d --build
curl http://localhost
```
