# Dokumentasi Pasaman Dev

Dokumentasi lengkap website company profile **Pasaman Dev** yang dibangun dengan Statamic 6 (flat-file CMS).

## Daftar Isi

| Dokumen | Isi |
| --- | --- |
| [01 — Arsitektur](01-arsitektur.md) | Bagaimana project ini disusun, kenapa flat-file, alur request |
| [02 — Instalasi & Menjalankan](02-instalasi.md) | Setup lokal dari nol, membuat admin, troubleshooting |
| [03 — Model Konten](03-model-konten.md) | Struktur Konfigurasi Web, Project, Artikel, Galeri, dan cara mengeditnya |
| [04 — Pengembangan](04-pengembangan.md) | Mengubah tampilan, menambah field, membuat blueprint & view |
| [05 — Kebijakan Operasional Konten](05-operasional-konten.md) | **Aturan: konten hanya via CP, bukan commit + analisa keamanan** |
| [06 — Penyimpanan Gambar R2](06-penyimpanan-gambar-r2.md) | **Cloudflare R2 untuk gambar + best practice keamanan** |
| [07 — Deployment Dokploy](07-deployment-dokploy.md) | Deploy produksi, volume persisten, konten via admin, R2 |
| [08 — Manajemen User](08-manajemen-user.md) | **Menambah/hapus user, role, reset password, 2FA** |

## Ringkasan singkat

- **Framework**: Statamic 6 di atas Laravel 13, PHP 8.3+.
- **Penyimpanan**: teks konten sebagai file YAML/Markdown di `content/`; **gambar** di **Cloudflare R2**; **bukan** database.
- **Frontend**: Antlers templating + satu file design-system CSS (`resources/css/site.css`), diekstrak dari template desain di folder `template/`.
- **Fitur**: Konfigurasi Web (global), Project, Artikel, Galeri — semua dikelola dari Control Panel di `/cp`.

## Konsep paling penting untuk dipahami

Statamic **menyimpan konten sebagai file**, bukan database. Kebijakan project ini:

1. **Konten (teks) hanya dikelola lewat Control Panel `/cp`** di produksi → tersimpan di **volume persisten**.
2. **Gambar di-upload lewat CP → tersimpan di Cloudflare R2** (object storage).
3. **Git hanya untuk kode** (view, blueprint, CSS). Konten **tidak** dibuat lewat commit.

Aturan lengkap dan alasannya ada di [05 — Kebijakan Operasional Konten](05-operasional-konten.md). Ini penting agar konten aman dan tidak saling menimpa.

## Alur cepat

- **Mau mengisi konten?** → login `/cp`. Lihat [03](03-model-konten.md).
- **Mau ubah tampilan/fitur?** → edit kode, commit, deploy. Lihat [04](04-pengembangan.md).
- **Mau deploy?** → [07](07-deployment-dokploy.md).
- **Mau atur user?** → [08](08-manajemen-user.md).
