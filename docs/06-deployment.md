# 06 — Deployment (Docker / Dokploy)

Project ini menyertakan `Dockerfile` multi-stage dan `docker-compose.yml` yang **sudah diuji build dan dijalankan**.

## Isi image Docker

`Dockerfile` punya 3 stage:

1. **assets** (`node:22-alpine`) — `npm ci` + `npm run build` → menghasilkan `public/build/`.
2. **vendor** (`composer:2`) — install dependency PHP produksi (`--no-dev`).
3. **runtime** (`php:8.4-fpm-alpine`) — nginx + php-fpm + supervisor, menyatukan hasil kedua stage.

Kontainer mendengarkan di **port 80**. Konfigurasi pendukung ada di `docker/` (`nginx.conf`, `php.ini`, `supervisord.conf`, `entrypoint.sh`).

`entrypoint.sh` saat start: menyiapkan folder writable, `config:cache` + `route:cache`, dan menghangatkan index Statamic — semuanya dijalankan sebagai user `www-data` agar cache tetap bisa ditulis.

---

## Deploy di Dokploy

1. **Buat aplikasi** → sumber dari repository ini.
2. **Build Type: Dockerfile** (Dokploy otomatis mendeteksi `Dockerfile` di root).
3. **Port**: kontainer expose **80**. Arahkan domain Dokploy ke port ini.
4. **Environment variables**:

   ```env
   APP_NAME=Pasaman Dev
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=base64:...          # dari: php artisan key:generate --show
   APP_URL=https://domain-anda.com
   STATAMIC_PRO_ENABLED=false
   ```

5. **Volume persisten** — **wajib**, agar konten & upload tidak hilang tiap deploy:

   | Mount path | Isi |
   | --- | --- |
   | `/var/www/html/content` | Semua konten |
   | `/var/www/html/users` | Akun user |
   | `/var/www/html/public/assets` | Gambar upload |
   | `/var/www/html/storage` | Cache & log |

6. **Deploy.**

> **APP_KEY**: hasilkan sekali dengan `php artisan key:generate --show`, tempel ke env Dokploy, dan **jangan pernah diubah** setelah ada data terenkripsi. Tanpa APP_KEY valid, aplikasi tidak boot.

---

## Hubungan volume dengan strategi Git (Bab 05)

- **Model A** (konten via Git): volume tetap dipasang, tapi sumber kebenaran adalah Git. Deploy membawa konten terbaru dari image; volume hanya menyimpan yang ditulis runtime.
- **Model B** (edit di produksi): volume adalah satu-satunya tempat konten hidup → **backup volume `content` dan `assets` secara rutin.**

Karena image sudah berisi salinan `content/` dari repo, pada Model B pastikan strategi jelas agar konten yang diedit di volume tidak tertimpa konten dari image. Cara paling aman: setelah pertama kali konten diedit di produksi, kelola konten hanya lewat CP (dan aktifkan `STATAMIC_GIT_ENABLED=true`), atau gunakan Model A sepenuhnya.

---

## Uji image di lokal sebelum deploy

`docker-compose.yml` sudah menyiapkan volume yang setara:

```bash
export APP_KEY=$(php artisan key:generate --show)
export APP_URL=http://localhost:8080
docker compose up --build
# buka http://localhost:8080
```

Membuat admin di kontainer:

```bash
docker compose exec web php please make:user
```

---

## Build & jalankan manual (tanpa compose)

```bash
docker build -t pasamandev .

docker run -d --name pasamandev -p 8080:80 \
  -e APP_KEY="base64:..." \
  -e APP_ENV=production \
  -e APP_URL=https://domain-anda.com \
  -v pd_content:/var/www/html/content \
  -v pd_users:/var/www/html/users \
  -v pd_assets:/var/www/html/public/assets \
  -v pd_storage:/var/www/html/storage \
  pasamandev
```

---

## Checklist produksi

- [ ] `APP_ENV=production`, `APP_DEBUG=false`
- [ ] `APP_KEY` di-set dan disimpan aman
- [ ] `APP_URL` = domain HTTPS final
- [ ] 4 volume persisten terpasang
- [ ] Backup terjadwal untuk volume `content` & `assets`
- [ ] User admin dibuat
- [ ] Strategi konten (Model A/B dari Bab 05) sudah diputuskan
