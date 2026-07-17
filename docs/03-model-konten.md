# 03 — Model Konten

Semua konten dikelola dari Control Panel (`/cp`). Berikut struktur tiap bagian, field-nya, dan di mana file-nya disimpan.

---

## 1. Konfigurasi Web (Global)

**CP:** Globals → Konfigurasi Web
**File:** `content/globals/default/settings.yaml`
**Blueprint:** `resources/blueprints/globals/settings.yaml`

Data yang tampil di seluruh situs (header, footer, meta). Tab-tabnya:

### Tab Umum
| Field | Fungsi |
| --- | --- |
| Nama Situs | Judul, dipakai di `<title>` dan alt logo |
| Brand — Bagian Putih / Hijau | Nama di navbar dengan dua warna (mis. **Pasaman**Dev) |
| Tagline | Kalimat pendek di footer |
| Deskripsi Situs | Meta description default (SEO) |
| Logo | Gambar logo (navbar & footer) |
| Favicon | Ikon tab browser |
| Gambar Share (OG Image) | Gambar saat link dibagikan ke sosmed (1200×630) |

### Tab Kontak
Email, Telepon/WhatsApp, Link Grup WhatsApp, Alamat, Link Google Maps.
Link Grup WhatsApp dipakai tombol "Gabung" dan CTA. Bila kosong, tombol jatuh ke email.

### Tab Sosial Media
Daftar akun (Nama, Kode 2 huruf, URL). Kode ditampilkan sebagai ikon lingkaran di footer (mis. `IG`, `WA`, `GH`).

### Tab Footer
Teks copyright (tahun otomatis ditambahkan di depan).

---

## 2. Project

**CP:** Collections → Project
**File:** `content/collections/projects/{tanggal}.{slug}.md`
**Blueprint:** `resources/blueprints/collections/projects/project.yaml`
**URL:** `/project` (semua) & `/project/{slug}` (detail)

### Tab Konten
| Field | Fungsi |
| --- | --- |
| Judul Project | Judul |
| Slug | Bagian URL (otomatis dari judul) |
| Deskripsi Singkat | Tampil di kartu (beranda & halaman project) |
| Gambar Cover | Gambar kartu & hero detail |
| Ringkasan | Isi lengkap (editor Bard: heading, gambar, list, dll.) |
| Fitur yang Direncanakan | Daftar poin fitur (1 baris = 1 fitur) |

### Tab Detail
| Field | Fungsi |
| --- | --- |
| Tipe Project | Taxonomy (Web App, Mobile App, dll.) — bisa buat baru |
| Status Project | Perencanaan / Pengembangan / Selesai / Pemeliharaan |
| Link Repository, Link Demo | Opsional, tampil di panel info detail |
| Tampilkan di Halaman Depan | Kontrol tampil-tidaknya di beranda |

> **Catatan teknis:** field status diberi handle `project_status` (bukan `status`) agar tidak bentrok dengan status publikasi bawaan Statamic.

---

## 3. Artikel

**CP:** Collections → Artikel
**File:** `content/collections/articles/{tanggal}.{slug}.md`
**Blueprint:** `resources/blueprints/collections/articles/article.yaml`
**URL:** `/artikel` & `/artikel/{slug}`

| Field | Fungsi |
| --- | --- |
| Judul Artikel, Slug | Judul & URL |
| Ringkasan | Tampil di kartu & sebagai paragraf pembuka |
| Gambar Utama | Cover artikel |
| Isi Artikel | Konten Bard |
| Kategori | Taxonomy (Karier, Belajar, Produk) |
| Penulis | Nama penulis (default "Tim Pasaman Dev") |
| Tanggal Terbit | Menentukan urutan (terbaru di atas) |
| Tampilkan di Halaman Depan | Kontrol tampil di beranda |

Halaman detail otomatis menampilkan **3 artikel terkait** di bawahnya.

---

## 4. Galeri

**CP:** Collections → Galeri
**File:** `content/collections/gallery/{tanggal}.{slug}.md`
**Blueprint:** `resources/blueprints/collections/gallery/gallery.yaml`
**URL:** `/galeri`

| Field | Fungsi |
| --- | --- |
| Judul | Nama kegiatan |
| Foto | Gambar (wajib) |
| Keterangan | Muncul saat foto di-hover |
| Tampilkan di Halaman Depan | 5 foto teratas tampil di beranda (yang pertama jadi tile besar) |
| Tanggal Kegiatan | Urutan tampil |

---

## 5. Halaman Depan & Halaman Statis

**CP:** Collections → Halaman
**Blueprint home:** `resources/blueprints/collections/pages/home.yaml`

Halaman **"Halaman Depan"** (`home`) punya tab yang bisa diedit tanpa kode:

- **Hero** — judul, kata berganti animasi, deskripsi, label tombol, kata marquee.
- **Tentang** — judul section + kartu pilar komunitas (judul, deskripsi, warna aksen).
- **Kerjasama** — judul, deskripsi, kartu jenis kerjasama, logo partner.
- **CTA Gabung** — judul, deskripsi, teks tombol.

Halaman `project`, `artikel`, `galeri` (blueprint `page.yaml`) hanya menyimpan judul + teks pengantar; daftar isinya diambil otomatis dari collection masing-masing.

---

## Tentang editor "Bard"

Field Ringkasan/Isi memakai **Bard** — editor rich text Statamic. Mendukung heading (H2/H3), bold/italic, list, kutipan, gambar (upload langsung), dan blok kode. Output-nya dirender oleh class `.pd-prose` di CSS agar konsisten dengan tema situs.

## Menambahkan konten baru — langkah singkat

1. Login `/cp`.
2. Pilih collection (mis. Project) → **Create**.
3. Isi field, upload gambar.
4. **Save & Publish**.
5. Konten langsung muncul di situs. (Jika mengedit file langsung tanpa CP, jalankan `php please stache:clear`.)
