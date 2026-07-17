# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1 — build frontend assets (Vite)
# ---------------------------------------------------------------------------
FROM node:22-alpine AS assets

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY vite.config.js ./
COPY resources ./resources
COPY content ./content
RUN npm run build


# ---------------------------------------------------------------------------
# Stage 2 — install PHP dependencies
# ---------------------------------------------------------------------------
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
        --no-dev \
        --no-scripts \
        --no-autoloader \
        --prefer-dist \
        --no-interaction

COPY . .
# Scripts stay off here: package:discover needs the GD extension, which this
# image doesn't have. It runs in the runtime stage instead.
RUN composer dump-autoload --optimize --no-dev --no-scripts


# ---------------------------------------------------------------------------
# Stage 3 — runtime (nginx + php-fpm)
# ---------------------------------------------------------------------------
FROM php:8.4-fpm-alpine AS runtime

RUN apk add --no-cache \
        nginx \
        supervisor \
        libpng \
        libjpeg-turbo \
        freetype \
        libzip \
        icu-libs \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        libzip-dev \
        icu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        gd \
        zip \
        intl \
        opcache \
        pcntl \
    && apk del .build-deps

WORKDIR /var/www/html

COPY --from=vendor /app /var/www/html
COPY --from=assets /app/public/build /var/www/html/public/build

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/99-app.ini
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

# Composer runs both of these via post-autoload-dump, but the vendor stage
# installs with --no-scripts (package:discover needs GD). statamic:install
# publishes the CP assets to public/vendor/statamic — without it every /cp
# route 500s on a missing Vite manifest.
RUN php artisan package:discover --ansi \
    && php artisan statamic:install --ansi

# Flat-file CMS: these directories are written to at runtime.
RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache content users public/assets

EXPOSE 80

ENTRYPOINT ["entrypoint"]
CMD ["supervisord", "-c", "/etc/supervisord.conf"]
