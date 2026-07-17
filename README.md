# Pasaman Dev — Website Company Profile

Website company profile komunitas **Pasaman Dev** yang dibangun dengan [Statamic 6](https://statamic.com) (flat-file CMS di atas Laravel 13). Seluruh konten — konfigurasi web, project, artikel, dan galeri — dikelola lewat Control Panel tanpa perlu menyentuh kode.

Penyimpanan: **teks konten** sebagai file di `content/` (volume persisten di produksi), **gambar** di **Cloudflare R2**, **kode** di Git. Konten dikelola **hanya lewat Control Panel**, bukan lewat commit — lihat [Kebijakan Operasional Konten](docs/05-operasional-konten.md).

Frontend memakai desain dari template landing page yang sudah disiapkan (tema gelap dengan aksen hijau/oranye dan motif atap gonjong Minangkabau), diekstrak menjadi Antlers view + satu file CSS design-system.

> 📚 **Dokumentasi lengkap ada di folder [`docs/`](docs/README.md)** — arsitektur, model konten, pengembangan, kebijakan konten, penyimpanan gambar R2, deployment Dokploy, dan manajemen user.

---

## Fitur

| Fitur | Lokasi di CMS | Keterangan |
| --- | --- | --- |
| **Konfigurasi Web** | Globals → Konfigurasi Web | Nama situs, brand, tagline, deskripsi/SEO, logo, favicon, OG image, kontak (email, telepon/WA, alamat, maps), sosial media, copyright |
| **Project** | Collections → Project | Portfolio komunitas dengan cover, ringkasan (Bard), daftar fitur, tipe, status, link repo/demo. Punya halaman index + halaman detail sendiri |
| **Artikel** | Collections → Artikel | Blog dengan gambar utama, isi (Bard), kategori, penulis, tanggal. Index + detail + artikel terkait |
| **Galeri** | Collections → Galeri | Foto kegiatan dengan judul & keterangan. Tampil sebagai grid mosaic |
| **Halaman Depan** | Collections → Halaman → Halaman Depan | Hero, marquee, pilar "Tentang", section kerjasama, dan CTA semuanya bisa diedit |

Item yang ditandai **"Tampilkan di Halaman Depan"** akan muncul di beranda (3 project, 3 artikel, 5 foto teratas).

---

## Kebutuhan

- PHP **8.3+** (dengan ekstensi `gd`, `intl`, `zip` — sudah standar di kebanyakan instalasi)
- [Composer](https://getcomposer.org) 2.x
- [Node.js](https://nodejs.org) 20+ dan npm (untuk build aset frontend)

---

## Menjalankan secara lokal

```bash
# 1. Install dependency PHP & Node
composer install
npm install

# 2. Siapkan environment
cp .env.example .env
php artisan key:generate

# 3. Build aset frontend (CSS/JS)
npm run build        # sekali build, atau:
npm run dev          # mode watch saat mengembangkan tampilan

# 4. Jalankan server
php artisan serve
```

Buka:

- Situs publik → <http://localhost:8000>
- Control Panel → <http://localhost:8000/cp>

### Membuat user admin

```bash
php please make:user
```

Ikuti prompt (email, nama, password) dan jawab **yes** saat ditanya super admin.

> Saat pengembangan tampilan, jalankan `npm run dev` (Vite, hot reload) berdampingan dengan `php artisan serve`.

---

## Struktur project

```
content/                 # SEMUA KONTEN (flat-file, versionable lewat git)
  globals/               # Konfigurasi Web
  collections/           # projects, articles, gallery, pages
  taxonomies/            # tipe project & kategori artikel
  trees/                 # urutan halaman
resources/
  blueprints/            # definisi field tiap collection/global
  css/site.css           # design system (hasil ekstraksi template)
  js/site.js             # rotator hero, scroll-reveal, spotlight, menu mobile
  views/
    layout.antlers.html  # kerangka HTML + <head>/SEO
    home.antlers.html    # halaman depan
    projects/            # index.antlers.html + show.antlers.html
    articles/            # index.antlers.html + show.antlers.html
    gallery/             # index.antlers.html
    _partials/           # header, footer, kartu, dsb.
public/assets/           # file upload (logo, foto) — disk "assets"
docker/                  # konfigurasi nginx, php, supervisor, entrypoint
template/                # template HTML asli (referensi desain, tidak dipakai runtime)
```

### Peta URL

| URL | Konten |
| --- | --- |
| `/` | Halaman depan |
| `/project` | Semua project |
| `/project/{slug}` | Detail project |
| `/artikel` | Semua artikel |
| `/artikel/{slug}` | Detail artikel |
| `/galeri` | Galeri |
| `/cp` | Control Panel |

---

## Alur pengembangan

### Mengubah konten (tanpa kode)

Login ke `/cp`, semua field sudah berlabel Bahasa Indonesia. Perubahan tersimpan sebagai file di `content/` — bisa di-commit ke git.

### Menambah/mengubah field

Field diatur di `resources/blueprints/`. Contoh menambah field ke project: edit [resources/blueprints/collections/projects/project.yaml](resources/blueprints/collections/projects/project.yaml), lalu tampilkan nilainya di [resources/views/projects/show.antlers.html](resources/views/projects/show.antlers.html) dengan `{{ nama_field }}`.

> Collection `projects`, `articles`, dan `gallery` memakai tanggal otomatis, jadi **jangan** menambahkan field bernama `date` di blueprint (akan bentrok).

### Mengubah tampilan

- Warna, font, spacing, animasi → variabel & class di [resources/css/site.css](resources/css/site.css) (semua diawali `pd-`, token warna di `:root`).
- Struktur halaman → file `.antlers.html` di `resources/views/`.
- Setelah mengubah CSS/JS jalankan `npm run build` (atau biarkan `npm run dev` berjalan).

### Bila konten tidak muncul / berubah

Statamic melakukan cache index. Jika ada yang tampak usang:

```bash
php please stache:clear
```

---

## Deploy dengan Docker (Dokploy)

Project ini sudah menyertakan `Dockerfile` multi-stage (build aset via Node → dependency via Composer → runtime nginx + php-fpm) yang **sudah diuji build & jalan**.

### Di Dokploy

1. Buat aplikasi baru → sumber dari repository ini.
2. **Build Type: Dockerfile** (Dokploy otomatis memakai `Dockerfile` di root). Kontainer mendengarkan di **port 80**.
3. Set **environment variable** berikut:

   ```env
   APP_NAME=Pasaman Dev
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=base64:...        # hasil `php artisan key:generate --show`
   APP_URL=https://domain-anda.com
   STATAMIC_PRO_ENABLED=false
   ```

4. **Wajib** buat **persistent volume** agar konten & upload tidak hilang setiap deploy (Statamic menyimpan data sebagai file, bukan di database):

   | Mount path dalam kontainer | Isi |
   | --- | --- |
   | `/var/www/html/content` | Semua konten (project, artikel, dll.) |
   | `/var/www/html/users` | Akun user |
   | `/var/www/html/public/assets` | File upload (logo, foto) |
   | `/var/www/html/storage` | Cache & log |

5. Deploy. Saat kontainer start, entrypoint otomatis menyiapkan folder, meng-cache config/route, dan menghangatkan index Statamic.

> Menghasilkan `APP_KEY`: jalankan `php artisan key:generate --show` di lokal dan tempel nilainya ke env Dokploy. Tanpa `APP_KEY` yang valid, aplikasi tidak akan boot.

### Uji image secara lokal

`docker-compose.yml` sudah menyiapkan volume yang sama untuk uji coba:

```bash
export APP_KEY=$(php artisan key:generate --show)
export APP_URL=http://localhost:8080
docker compose up --build
# buka http://localhost:8080
```

### Membuat admin di server produksi

Karena volume `users` persisten, cukup sekali:

```bash
docker exec -it <nama-container> php please make:user
```

---

## Catatan

- **Statamic Free**: fitur yang dipakai (collections, taxonomies, globals, Bard) tersedia di edisi gratis. `STATAMIC_PRO_ENABLED=false`.
- **Folder `template/`**: HTML desain asli, hanya sebagai referensi. Tidak dipakai saat runtime dan boleh dihapus jika tidak diperlukan.
- **Font**: Sora, Inter, JetBrains Mono di-load dari Google Fonts di `<head>`.
