# Dokumentasi Pasaman Dev

Dokumentasi lengkap website company profile **Pasaman Dev** yang dibangun dengan Statamic 6 (flat-file CMS).

## Daftar Isi

| Dokumen | Isi |
| --- | --- |
| [01 — Arsitektur](01-arsitektur.md) | Bagaimana project ini disusun, kenapa flat-file, alur request |
| [02 — Instalasi & Menjalankan](02-instalasi.md) | Setup lokal dari nol, membuat admin, troubleshooting |
| [03 — Model Konten](03-model-konten.md) | Struktur Konfigurasi Web, Project, Artikel, Galeri, dan cara mengeditnya |
| [04 — Pengembangan](04-pengembangan.md) | Mengubah tampilan, menambah field, membuat blueprint & view |
| [05 — Konten dengan Git](05-konten-dan-git.md) | **Cara mengelola konten flat-file lewat version control** |
| [06 — Deployment (Docker/Dokploy)](06-deployment.md) | Deploy produksi, volume persisten, env |

## Ringkasan singkat

- **Framework**: Statamic 6 di atas Laravel 13, PHP 8.3+.
- **Penyimpanan konten**: file YAML/Markdown di folder `content/` — **bukan database**. Inilah yang membuat konten bisa masuk Git.
- **Frontend**: Antlers templating + satu file design-system CSS (`resources/css/site.css`), diekstrak dari template desain di folder `template/`.
- **Fitur**: Konfigurasi Web (global), Project, Artikel, Galeri — semua dikelola dari Control Panel di `/cp`.

## Konsep paling penting untuk dipahami

Statamic **menyimpan semua konten sebagai file**, bukan di database. Konsekuensinya:

1. Setiap kali Anda mengedit konten di Control Panel, Statamic menulis/mengubah file di `content/`.
2. File itu bisa (dan sebaiknya) di-commit ke Git seperti kode biasa.
3. Tidak ada langkah "export/import database" atau "migrasi" untuk konten.

Bab [05 — Konten dengan Git](05-konten-dan-git.md) membahas tuntas konsekuensi ini untuk kerja tim.
