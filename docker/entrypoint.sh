#!/bin/sh
set -e

# Persistent volumes are mounted empty on first deploy — make sure the flat-file
# CMS still has the directories it expects, with the right ownership.
mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    content \
    users \
    public/assets

chown -R www-data:www-data storage bootstrap/cache content users public/assets

if [ -z "${APP_KEY}" ]; then
    echo "WARNING: APP_KEY is not set. Generate one with: php artisan key:generate --show"
fi

# Run as www-data so the caches these write stay writable by php-fpm.
su -s /bin/sh www-data -c 'php artisan config:cache'
su -s /bin/sh www-data -c 'php artisan route:cache'
su -s /bin/sh www-data -c 'php please stache:warm' || true

exec "$@"
