# 04 — Pengembangan

Panduan untuk developer yang mengubah tampilan atau struktur data.

## Mengubah tampilan (CSS)

Seluruh gaya ada di **satu file**: [`resources/css/site.css`](../resources/css/site.css).

- **Token warna, font, ukuran** ada di blok `:root` paling atas:
  ```css
  :root {
    --green: #33D6A6;
    --orange: #FF8A3D;
    --bg: #060B0A;
    --font-display: 'Sora', sans-serif;
    ...
  }
  ```
  Ubah nilai di sini untuk mengganti tema seluruh situs.
- Semua class diawali `pd-` (mis. `.pd-card`, `.pd-hero`, `.pd-btn`) agar tidak bentrok.
- Setelah mengubah, jalankan `npm run build` (atau biarkan `npm run dev`).

## Mengubah interaksi (JS)

[`resources/js/site.js`](../resources/js/site.js) berisi fungsi kecil tanpa dependency:
- `initRotator()` — kata berganti di hero (baca `data-rotator`).
- `initReveal()` — animasi muncul saat scroll (class `.pd-reveal`).
- `initSpotlight()` — glow mengikuti kursor di hero.
- `initNav()` — menu mobile.
- `initAnchors()` — smooth scroll anchor `#`.

## Struktur view (Antlers)

```
views/
├── layout.antlers.html        # <head>, SEO, wrapper, panggil header+footer
├── home.antlers.html          # semua section beranda
├── projects/index.antlers.html + show.antlers.html
├── articles/index.antlers.html + show.antlers.html
├── gallery/index.antlers.html
└── _partials/
    ├── header.antlers.html     # navbar
    ├── footer.antlers.html      # footer + kontak + sosmed
    ├── brand_name.antlers.html
    ├── roofline.antlers.html    # SVG atap gonjong
    ├── eyebrow.antlers.html     # label kecil di atas heading
    ├── project_card.antlers.html
    ├── article_card.antlers.html
    └── gallery_item.antlers.html
```

### Dasar sintaks Antlers yang dipakai

```antlers
{{ title }}                       {{-- tampilkan field --}}
{{ settings:email }}              {{-- field dari global "settings" --}}
{{ if cover }} ... {{ /if }}      {{-- kondisi --}}
{{ collection:projects limit="3" }} ... {{ /collection:projects }}   {{-- loop entry --}}
{{ partial:_partials/header }}    {{-- sisipkan partial --}}
{{ nilai ?? 'default' }}          {{-- fallback --}}
```

Beberapa hal penting yang ditemukan saat membangun project ini:

- **Parameter partial tidak boleh berisi `{{ }}` bersarang.** Gunakan sintaks ekspresi:
  ```antlers
  {{ partial:_partials/project_card :delay="index * 0.08" }}
  ```
  (`:param` = evaluasi ekspresi; `index` = indeks loop 0-based, `count` = 1-based).
- **Field taxonomy `max_items: 1` mengembalikan satu term, bukan array** — jangan pakai `limit` padanya; cukup loop `{{ project_types }}...{{ /project_types }}`.

## Menambah field baru

1. Edit blueprint terkait, mis. [`resources/blueprints/collections/projects/project.yaml`](../resources/blueprints/collections/projects/project.yaml):
   ```yaml
   -
     handle: client_name
     field:
       type: text
       display: 'Nama Klien'
   ```
2. Tampilkan di view, mis. `projects/show.antlers.html`:
   ```antlers
   {{ if client_name }}<span>{{ client_name }}</span>{{ /if }}
   ```
3. `php please stache:clear` bila perlu, lalu isi nilainya di CP.

> Jangan menamai field `date` di collection `projects`/`articles`/`gallery` — sudah ada field tanggal bawaan (collection ber-`date: true`), akan memicu "Duplicate field".

## Membuat collection baru

Contoh menambah "Event":

1. `content/collections/events.yaml`:
   ```yaml
   title: Event
   route: '/event/{slug}'
   template: events/show
   date: true
   sort_by: date
   sort_dir: desc
   ```
2. Blueprint `resources/blueprints/collections/events/event.yaml` (lihat blueprint lain sebagai contoh).
3. View `resources/views/events/show.antlers.html`.
4. `php please stache:clear`.

## Referensi resmi

- Antlers: <https://statamic.dev/antlers>
- Fieldtypes: <https://statamic.dev/fieldtypes>
- Collections: <https://statamic.dev/collections>
