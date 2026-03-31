FROM php:8.2-apache

# Enable rewrite
RUN a2enmod rewrite

# Explicitly allow access to document root
RUN printf '<Directory /var/www/html>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>\n' >> /etc/apache2/apache2.conf

# PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mysqli

RUN a2enmod headers rewrite

# Upload limits
RUN echo "upload_max_filesize=50M" > /usr/local/etc/php/conf.d/uploads.ini \
 && echo "post_max_size=50M" >> /usr/local/etc/php/conf.d/uploads.ini

WORKDIR /var/www/html
