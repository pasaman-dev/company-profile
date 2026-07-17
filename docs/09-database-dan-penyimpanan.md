# 09 — Database & Penyimpanan Data

Dokumen ini menjawab dua pertanyaan:
1. Apakah project ini berinteraksi dengan database? (mis. saat menambah user / mengubah pengaturan)
2. Bisakah data disimpan di **SQLite** (database) alih-alih file, kalau tidak ingin mengurusi file konten sama sekali?

---

## 1. Apakah ada interaksi database? — Secara default: TIDAK

Statamic adalah **flat-file CMS**. Di konfigurasi project ini, **tidak ada satu pun data yang masuk database**. Semuanya file:

| Yang Anda kelola | Disimpan sebagai | Lokasi |
| --- | --- | --- |
| **User** (tambah/hapus akun) | File YAML | `users/*.yaml` |
| **Konfigurasi Web** (pengaturan) | File YAML | `content/globals/default/settings.yaml` |
| **Role & izin** | File YAML | `resources/users/roles.yaml` |
| Project, Artikel, Galeri | File Markdown | `content/collections/...` |
| Struktur field (blueprint) | File YAML | `resources/blueprints/...` |

Jadi **menambah user atau mengubah pengaturan = menulis file**, bukan query database. Tidak ada tabel, migrasi, atau koneksi DB yang terlibat untuk operasi ini.

### Lalu kenapa ada `database/database.sqlite` dan `DB_CONNECTION=sqlite`?

File `database/database.sqlite` memang ada (bawaan Laravel) tapi **kosong dan tidak dipakai**. Di project ini:

```
SESSION_DRIVER=file      → sesi login disimpan sebagai file
CACHE_STORE=file         → cache disimpan sebagai file
QUEUE_CONNECTION=sync    → tidak pakai antrian/DB
```

`DB_CONNECTION=sqlite` hanya nilai default Laravel; **tidak ada yang menyentuhnya**. Anda boleh mengabaikannya. Laravel *bisa* memakai database untuk hal-hal framework (sesi, cache, antrian, jadwal) kalau driver-nya diganti ke `database`, tapi di sini semua memakai `file`/`sync`.

**Kesimpulan:** dengan setup sekarang, Anda tidak perlu memikirkan database sama sekali. Backup = salin folder `content/`, `users/`, dan (gambar) R2.

---

## 2. Bisakah pakai SQLite/database untuk konten? — BISA

Kalau Anda **sama sekali tidak ingin ada file konten** (tidak di Git, tidak di volume), Statamic mendukung penyimpanan konten di database lewat **[Eloquent Driver](https://statamic.dev/tips/eloquent-driver)** resmi. Dengan ini, entry/user/global/taxonomy disimpan sebagai **baris di database** (SQLite atau MySQL/Postgres), bukan file.

### Perbandingan pilihan

| Aspek | Flat-file + Volume (sekarang) | Eloquent + SQLite | Eloquent + MySQL |
| --- | --- | --- | --- |
| Konten disimpan | File di volume | 1 file `.sqlite` | Server database |
| File konten di Git? | Tidak (via CP) | Tidak ada file konten | Tidak ada file konten |
| Backup | Salin folder/volume | Salin 1 file `.sqlite` | Dump database |
| Infra tambahan | — | — | Perlu container MySQL |
| Bisa di-*diff*/audit | Ya (teks) | Tidak (biner) | Tidak (biner) |
| Cocok untuk | Situs kecil–menengah | "Satu file DB", tanpa file konten | Banyak editor, skala besar |
| Setup | Sudah jalan | Perlu install & migrasi | Perlu install & DB server |

### Apakah SQLite lebih baik untuk kasus Anda?

Anda sudah memutuskan **konten dikelola via CP dan tidak masuk Git** (lihat [05](05-operasional-konten.md)). Dua cara memenuhi itu:

- **Flat-file di volume (sekarang)** — konten berupa file di volume server, tidak pernah di-commit. **Sudah berjalan**, tanpa perubahan.
- **SQLite (Eloquent)** — konten jadi baris di satu file `.sqlite`. Benar-benar tidak ada file konten.

Keduanya sama-sama membuat Anda **tidak mengurusi file konten di Git**. Perbedaan praktis:

- SQLite: backup = 1 file, tapi isinya **biner** (tidak bisa dibaca/di-audit langsung, tidak bisa Git automation untuk riwayat per-perubahan).
- Flat-file: backup = folder kecil berisi teks, **bisa di-audit** dan bisa dicermin ke Git privat otomatis sebagai riwayat.

> **Rekomendasi:** untuk company profile ini, **flat-file + volume (setup sekarang) sudah paling sederhana dan aman** — tidak ada database untuk diurus, backup mudah, dan ada opsi audit/riwayat. Pilih **SQLite** hanya jika Anda benar-benar ingin model "satu file database" tanpa file konten. Pilih **MySQL** kalau nanti ada banyak editor bersamaan atau butuh query kompleks.

---

## Cara beralih ke SQLite (Eloquent Driver) — bila diinginkan

> Ini mengubah arsitektur penyimpanan. Lakukan pada branch terpisah dan uji dulu. Minta bantuan bila perlu — belum diaktifkan di project ini.

Garis besar langkahnya:

```bash
# 1. Install driver resmi
composer require statamic/eloquent-driver

# 2. Publish konfigurasi
php artisan vendor:publish --tag=statamic-eloquent-config

# 3. Pilih repository mana yang pindah ke database
#    di config/statamic/eloquent-driver.php
#    (entries, taxonomies, globals, users, dst. — bisa sebagian atau semua)

# 4. Jalankan migrasi tabel Statamic
php artisan migrate

# 5. Impor konten file yang sudah ada ke database
php please eloquent:import-entries
php please eloquent:import-globals
php please eloquent:import-users
#    (perintah tersedia sesuai repository yang diaktifkan)
```

Untuk **SQLite** di produksi Docker/Dokploy:
- Pastikan `DB_CONNECTION=sqlite` dan file `database/database.sqlite` berada di **volume persisten** (mount `/var/www/html/database`), agar data tidak hilang saat redeploy.

Untuk **MySQL**:
- Tambahkan service database di Dokploy, set `DB_CONNECTION=mysql` + kredensialnya. Tidak perlu volume file DB (data di server MySQL, yang punya volumenya sendiri).

### Konsekuensi setelah beralih ke database

- **Gambar tetap bisa di R2** — Eloquent driver hanya memindahkan konten teks; penyimpanan aset (R2) tidak berubah.
- **Volume `content` & `users` tidak lagi dipakai** untuk konten (diganti volume database / server DB).
- **Backup** berubah jadi backup file `.sqlite` atau dump MySQL.
- **Git automation konten tidak berlaku** (tidak ada file teks untuk di-commit) — riwayat mengandalkan revisi database / backup.

---

## Ringkasan

- **Sekarang**: nol database. User & pengaturan = file. Tidak ada yang perlu diurus soal DB.
- **Ingin tanpa file konten sama sekali?** Bisa pakai **SQLite** (atau MySQL) via Eloquent Driver — tapi untuk skala ini flat-file + volume tetap paling simpel.
- Apa pun pilihannya, **gambar tetap di Cloudflare R2**.
