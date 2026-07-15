# 02 — Instalasi & Menjalankan

## Kebutuhan

- PHP **8.3+** dengan ekstensi `gd`, `intl`, `zip` (umumnya sudah ada)
- Composer 2.x
- Node.js 20+ dan npm

Cek versi:

```bash
php -v
composer -V
node -v
```

## Setup dari nol

```bash
# 1. Dependency PHP
composer install

# 2. Dependency & build aset frontend
npm install
npm run build

# 3. Environment
cp .env.example .env
php artisan key:generate

# 4. Jalankan
php artisan serve
```

Buka:

- Situs → <http://localhost:8000>
- Control Panel → <http://localhost:8000/cp>

> **Port 8000 dipakai aplikasi lain?** (mis. Kong, Laravel lain). Jalankan di port lain:
> ```bash
> php artisan serve --port=8010
> ```
> dan sesuaikan `APP_URL=http://localhost:8010` di `.env`.

## Membuat user admin

```bash
php please make:user
```

Isi email, nama, password, dan jawab **yes** untuk super admin. User disimpan sebagai file di `users/`.

## Mode pengembangan tampilan

Saat mengedit CSS/JS/view, jalankan Vite dengan hot reload berdampingan dengan server:

```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

Perubahan pada `resources/css/site.css` dan `resources/js/site.js` langsung ter-refresh di browser.

Untuk produksi (build sekali):

```bash
npm run build
```

## Troubleshooting

### "no Route matched with those values" / halaman 404 aneh berwarna putih
Bukan error Statamic — biasanya **ada aplikasi/kontainer lain menempati port** yang sama. Cek:
```bash
lsof -nP -iTCP:8000 -sTCP:LISTEN
docker ps   # apakah ada container publish port 8000?
```
Jalankan Statamic di port yang bebas.

### Perubahan konten tidak muncul
```bash
php please stache:clear
```

### 500 Internal Server Error setelah mengubah blueprint
Biasanya **field duplikat** atau YAML salah indentasi. Cek log:
```bash
tail -50 storage/logs/laravel.log
```
Catatan: collection `projects`, `articles`, `gallery` sudah punya field tanggal otomatis — jangan menambah field bernama `date`.

### Aset (CSS) tidak termuat / tampilan polos
Pastikan sudah `npm run build` (atau `npm run dev` berjalan). File hasil build ada di `public/build/`.

### Izin file (di server)
Folder yang harus bisa ditulis web server: `storage/`, `bootstrap/cache/`, `content/`, `users/`, `public/assets/`.
