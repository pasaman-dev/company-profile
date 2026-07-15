# 01 — Arsitektur

## Kenapa Statamic (flat-file)

Statamic adalah CMS yang menyimpan konten sebagai **file di disk** (YAML + Markdown), bukan di database seperti WordPress. Untuk company profile komunitas, ini menguntungkan:

- **Konten ikut Git** — perubahan konten punya riwayat, bisa di-review, bisa di-rollback.
- **Deploy sederhana** — tidak perlu server database, tidak perlu migrasi.
- **Backup mudah** — cukup salin folder `content/` dan `public/assets/`.
- **Gratis** — fitur yang dipakai project ini tersedia di Statamic edisi Free.

Kekurangan yang perlu disadari: karena konten adalah file, mengedit konten di produksi berarti mengubah file di server. Kebijakan project ini menanganinya dengan tegas — **konten hanya dikelola lewat Control Panel** dan gambar disimpan di Cloudflare R2. Lihat [05 — Kebijakan Operasional Konten](05-operasional-konten.md) dan [06 — Penyimpanan Gambar R2](06-penyimpanan-gambar-r2.md).

## Susunan folder

```
landing_page/
├── content/                  # SUMBER KEBENARAN KONTEN (masuk Git)
│   ├── globals/
│   │   ├── settings.yaml      # penanda global "Konfigurasi Web"
│   │   └── default/settings.yaml   # NILAI konfigurasi (nama, kontak, sosmed…)
│   ├── collections/
│   │   ├── projects.yaml       # konfigurasi collection (route, urutan)
│   │   ├── projects/*.md       # tiap project = 1 file
│   │   ├── articles.yaml
│   │   ├── articles/*.md       # tiap artikel = 1 file
│   │   ├── gallery.yaml
│   │   ├── gallery/*.md        # tiap foto = 1 file
│   │   ├── pages.yaml
│   │   └── pages/*.md          # home, project, artikel, galeri (halaman index)
│   ├── taxonomies/
│   │   ├── project_types/*.yaml   # Web App, Mobile App, …
│   │   └── categories/*.yaml       # Karier, Belajar, …
│   └── trees/collections/pages.yaml   # urutan & hierarki halaman
│
├── resources/
│   ├── blueprints/            # DEFINISI FIELD (skema tiap konten)
│   │   ├── globals/settings.yaml
│   │   └── collections/{projects,articles,gallery,pages}/*.yaml
│   ├── css/site.css          # design system (token warna, class .pd-*)
│   ├── js/site.js            # rotator hero, scroll-reveal, spotlight, menu mobile
│   └── views/                # TEMPLATE TAMPILAN (Antlers)
│       ├── layout.antlers.html
│       ├── home.antlers.html
│       ├── projects/{index,show}.antlers.html
│       ├── articles/{index,show}.antlers.html
│       ├── gallery/index.antlers.html
│       └── _partials/        # header, footer, kartu, eyebrow, dll.
│
├── public/
│   ├── assets/               # FILE UPLOAD (logo, foto) — disk "assets"
│   └── build/                # hasil compile Vite (tidak masuk Git)
│
├── docker/                   # nginx, php, supervisor, entrypoint
├── template/                 # HTML desain asli (referensi, tidak dipakai runtime)
├── Dockerfile
├── docker-compose.yml
└── docs/                     # dokumentasi ini
```

## Tiga lapis yang perlu dibedakan

Ini konsep kunci Statamic. Jangan tertukar:

| Lapis | Lokasi | Peran | Analogi |
| --- | --- | --- | --- |
| **Blueprint** | `resources/blueprints/` | Mendefinisikan **field apa saja** yang dimiliki sebuah konten | Struktur tabel |
| **Konten** | `content/` | **Nilai** dari field itu | Baris data |
| **View** | `resources/views/` | **Menampilkan** nilai konten jadi HTML | Template |

Contoh alur: blueprint `projects/project.yaml` mendefinisikan field `excerpt`. Editor mengisinya di CP → tersimpan di `content/collections/projects/xxx.md`. View `projects/show.antlers.html` menampilkannya lewat `{{ excerpt }}`.

## Alur sebuah request

1. Browser membuka `/project/nama-project`.
2. Statamic mencocokkan URL dengan route collection `projects` (`/project/{slug}`) dari `content/collections/projects.yaml`.
3. Ditemukan entry yang cocok → dimuat dari file `.md`.
4. Statamic memakai template `projects/show` (ditetapkan di `projects.yaml`).
5. View di-render dengan Antlers, field konten di-"augment" (mis. `cover` jadi objek asset, `date` jadi objek tanggal).
6. `layout.antlers.html` membungkusnya (head, header, footer) → HTML dikirim.

## Peta URL

| URL | Sumber |
| --- | --- |
| `/` | `content/collections/pages/home.md` → view `home` |
| `/project` | `pages/project.md` → view `projects/index` |
| `/project/{slug}` | entry collection `projects` → view `projects/show` |
| `/artikel` | `pages/artikel.md` → view `articles/index` |
| `/artikel/{slug}` | entry collection `articles` → view `articles/show` |
| `/galeri` | `pages/galeri.md` → view `gallery/index` |
| `/cp` | Control Panel Statamic |

## Cache (Stache)

Statamic membangun index dari file konten di memori/disk (disebut **Stache**). Kadang setelah mengubah file konten langsung (bukan lewat CP), tampilan tampak usang. Jalankan:

```bash
php please stache:clear
```
