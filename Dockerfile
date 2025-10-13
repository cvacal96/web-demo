FROM registry.access.redhat.com/ubi9/httpd-24:latest

# Copiar los archivos de la web
COPY . /var/www/html/

# Ajustar permisos
RUN chmod -R g+rwX /var/www/html

EXPOSE 8080
