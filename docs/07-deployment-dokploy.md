# 07 — Deployment dengan Dokploy

Panduan deploy produksi memakai **Dokploy** dengan model: **konten dikelola lewat admin (CP), bukan commit** — sesuai [Kebijakan Operasional Konten](05-operasional-konten.md).

Project sudah menyertakan `Dockerfile` multi-stage dan konfigurasi pendukung di `docker/`, dan **sudah diuji build & jalan**.

---

## Model deployment

```
             ┌─────────────── Dokploy (server) ───────────────┐
  Git push → │  build Dockerfile → kontainer (nginx+php-fpm)   │
   (kode)    │                                                  │
             │   Volume persisten:                              │
             │     /content   ← teks konten (via CP)            │
             │     /users     ← akun (via CP)                   │
             │     /storage   ← cache & log                     │
             │     /assets    ← fallback lokal (jarang dipakai) │
             └──────────────────────┬──────────────────────────┘
                                     │ gambar via CP
                                     ▼
                        Cloudflare R2 (object storage)
```

**Kode** datang dari Git (image). **Konten** hidup di volume + R2, dikelola lewat `/cp`. Keduanya tidak bertabrakan.

---

## Langkah deploy

### 1. Buat aplikasi di Dokploy
- Buat aplikasi baru → sumber dari repository ini.
- **Build Type: Dockerfile** (Dokploy otomatis memakai `Dockerfile` di root).
- Kontainer mendengarkan di **port 80** — arahkan domain ke sini.

### 2. Environment variables

```env
APP_NAME=Pasaman Dev
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:...              # dari: php artisan key:generate --show
APP_URL=https://domain-anda.com
STATAMIC_PRO_ENABLED=false

# Log ke stdout/stderr agar error terlihat di log viewer Dokploy.
# Tanpa ini, error masuk ke storage/logs/laravel.log di dalam volume.
LOG_CHANNEL=stderr

# Konten flat-file di disk — file watcher tidak ada gunanya di produksi.
STATAMIC_STACHE_WATCHER=false
STATAMIC_STATIC_CACHING_STRATEGY=null

# Gambar → Cloudflare R2 (lihat doc 06)
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_DEFAULT_REGION=auto
R2_BUCKET=pasaman-media
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
R2_URL=https://media.pasamandev.id
```

> **APP_KEY** dibuat sekali dengan `php artisan key:generate --show`, lalu **jangan diubah**. Tanpa APP_KEY valid, aplikasi tidak boot.

### 3. Volume persisten (WAJIB)

Tanpa volume, konten hilang setiap redeploy. Pasang di Dokploy → tab **Volumes/Mounts**:

> ⚠️ **Pilih tipe "Volume Mount", bukan "Bind Mount".** Seeding konten dari image (lihat bagian di bawah) **hanya** terjadi pada named volume. Bind Mount ke path host akan menutupi isi image dengan direktori kosong — situs tanpa konten, dan `users/` kosong sehingga Anda tidak bisa login ke `/cp` sama sekali.

| Nama volume | Mount path | Isi |
| --- | --- | --- |
| `pd_content` | `/var/www/html/content` | Semua teks konten |
| `pd_users` | `/var/www/html/users` | Akun user |
| `pd_storage` | `/var/www/html/storage` | Cache & log |
| `pd_assets` | `/var/www/html/public/assets` | Fallback aset lokal |

> Gambar konten tidak butuh volume karena sudah di R2 — tapi `public/assets` tetap dipasang untuk keamanan (mis. bila R2 belum aktif).

### 4. Deploy
Klik deploy. Saat start, entrypoint menyiapkan folder writable, meng-cache config/route (dengan env yang sudah ada, termasuk R2), dan menghangatkan index Statamic.

### 5. Setup awal setelah deploy pertama (sekali saja)

```bash
# buat user admin (via terminal Dokploy / docker exec)
docker exec -it <nama-container> php please make:user
```

Lalu login `/cp` dan:
1. **Konfigurasi Web → Logo**: upload ulang logo (agar tersimpan di R2).
2. Hapus data contoh (project/artikel/galeri seed), isi konten asli.

---

## Perilaku konten seed pada volume

- **Deploy pertama**: volume `content` kosong → Docker menyalin konten seed dari image → situs terisi contoh.
- **Deploy berikutnya**: volume sudah berisi → **tidak ditimpa**. Konten yang Anda kelola di CP aman.

Artinya perubahan data contoh di repo **tidak** memengaruhi produksi setelah deploy pertama. Ini disengaja (lihat [05](05-operasional-konten.md)).

---

## Backup (wajib untuk keamanan)

Karena konten hidup di volume, **backup adalah tanggung jawab Anda**:

1. **Volume `content` & `users`** — jadwalkan backup harian:
   - Lewat **Dokploy Backups** (ke S3/R2), atau
   - Cron: `tar` folder volume lalu upload ke bucket backup.
2. **Gambar R2** — aktifkan **bucket versioning** (lihat [06](06-penyimpanan-gambar-r2.md)).

> Uji **restore** minimal sekali. Backup yang belum pernah diuji belum tentu berhasil.

> **Catatan soal `STATAMIC_GIT_ENABLED`.** Versi sebelumnya dokumen ini menyarankan mengaktifkannya sebagai backup kedua. **Jangan aktifkan** — pada image sekarang addon-nya akan error setiap kali Anda save di CP. Tiga alasan: binary `git` tidak diinstal di runtime stage, `.git` di-exclude oleh `.dockerignore`, dan volume `content` bukan repo git. Mengaktifkannya butuh ketiganya diperbaiki plus deploy key dengan akses tulis. Sampai itu dikerjakan, **backup volume adalah satu-satunya lapisan durabilitas Anda** — jadwalkan sungguhan.

---

## Uji image di lokal sebelum deploy

`docker-compose.yml` menyiapkan volume setara:

```bash
export APP_KEY=$(php artisan key:generate --show)
export APP_URL=http://localhost:8080
docker compose up --build
# buka http://localhost:8080
```

Buat admin di kontainer:
```bash
docker compose exec web php please make:user
```

---

## Isi image & konfigurasi Docker

`Dockerfile` punya 3 stage:
1. **assets** (`node:22-alpine`) — build CSS/JS (`npm run build`).
2. **vendor** (`composer:2`) — dependency PHP produksi (`--no-dev`).
3. **runtime** (`php:8.4-fpm-alpine`) — nginx + php-fpm + supervisor.

Stage `vendor` memasang dependency dengan `--no-scripts` (karena `package:discover` butuh ekstensi GD yang tidak ada di image composer), jadi stage `runtime` **wajib** menjalankan sendiri apa yang normalnya dijalankan composer lewat `post-autoload-dump`:

```dockerfile
RUN php artisan package:discover --ansi \
    && php artisan statamic:install --ansi
```

`statamic:install` mempublish aset Control Panel ke `public/vendor/statamic/cp`. Direktori itu ada di `.gitignore`, jadi clone git yang di-build Dokploy tidak membawanya. **Tanpa baris ini setiap route `/cp` akan 500** dengan `ViteManifestNotFoundException: Vite manifest not found at .../public/vendor/statamic/cp/build/manifest.json`, sementara halaman depan tetap normal (dia pakai `public/build` dari stage `assets`).

Konfigurasi pendukung di `docker/`: `nginx.conf`, `php.ini`, `supervisord.conf`, `entrypoint.sh`. Entry-point menjalankan perintah cache sebagai user `www-data` agar tetap writable.

---

## Checklist produksi

- [ ] `APP_ENV=production`, `APP_DEBUG=false`
- [ ] `APP_KEY` di-set & disimpan aman
- [ ] `APP_URL` = domain HTTPS final
- [ ] `LOG_CHANNEL=stderr` (tanpa ini error tidak terlihat di log Dokploy)
- [ ] 4 volume persisten terpasang, semuanya bertipe **Volume Mount**
- [ ] Env R2 lengkap + bucket versioning aktif
- [ ] `/cp/auth/login` membuka halaman login (bukan 500)
- [ ] Backup harian volume terjadwal & **diuji restore**
- [ ] User admin dibuat, logo di-upload ulang lewat CP
- [ ] Data contoh dihapus, konten asli diisi lewat CP
