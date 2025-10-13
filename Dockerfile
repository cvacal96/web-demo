FROM registry.access.redhat.com/ubi9/httpd-24:latest

# Copiar archivos al directorio web
COPY . /var/www/html/

# No es necesario modificar permisos en OpenShift
EXPOSE 8080
