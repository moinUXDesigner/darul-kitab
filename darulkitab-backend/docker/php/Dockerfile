FROM php:8.2-apache

# Enable required Apache modules
RUN a2enmod rewrite headers setenvif

# Explicitly allow access to document root and pass Authorization header
RUN printf '<Directory /var/www/html>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>\n\
\n\
# Ensure Authorization header reaches PHP\n\
SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1\n' >> /etc/apache2/apache2.conf

# PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Upload limits
RUN echo "upload_max_filesize=50M" > /usr/local/etc/php/conf.d/uploads.ini \
 && echo "post_max_size=50M" >> /usr/local/etc/php/conf.d/uploads.ini

WORKDIR /var/www/html
