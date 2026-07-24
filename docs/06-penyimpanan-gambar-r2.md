# 06 — Penyimpanan Gambar: Cloudflare R2

Semua gambar yang di-upload lewat Control Panel disimpan di **Cloudflare R2** (object storage S3-compatible), **bukan** di server. Ini membuat gambar aman, awet, dan cepat dilayani.

> Konfigurasi teknisnya **sudah terpasang** di project ini (`config/filesystems.php` disk `assets` + `r2`, adapter S3 sudah di-install). Anda tinggal membuat bucket R2 dan mengisi env.

---

## Kenapa R2 untuk gambar?

| Alasan | Penjelasan |
| --- | --- |
| **Aman & awet** | Object storage dengan durability tinggi, replika otomatis |
| **Terpisah dari server** | Redeploy / kontainer rusak tidak menyentuh gambar |
| **Volume tetap ramping** | Gambar besar tidak membebani volume server |
| **Cepat** | Dilayani lewat CDN Cloudflare / custom domain |
| **Murah** | R2 **tanpa biaya egress** (transfer keluar gratis) |

Pembagian tanggung jawab: **teks konten → volume server**, **gambar → R2**. (Lihat [05 — Operasional Konten](05-operasional-konten.md).)

---

## Cara kerja di project ini

Disk `assets` (yang dipakai container aset Statamic) sudah dibuat **pintar**:

- Jika env **`R2_BUCKET` terisi** → disk memakai **R2** (driver `s3`). Dipakai di **produksi**.
- Jika **kosong** → disk memakai **folder lokal** `public/assets/`. Dipakai saat **development**.

Jadi Anda bisa membangun tampilan di lokal tanpa kredensial R2, lalu produksi otomatis memakai R2 begitu env-nya di-set. Tidak perlu ubah kode.

Referensi kode: `config/filesystems.php` (disk `assets` & `r2`).

---

## Langkah setup R2

### 1. Buat bucket
1. Masuk **Cloudflare Dashboard → R2**.
2. **Create bucket**, mis. `pasaman-media`. Pilih lokasi (auto/otomatis).

### 2. Buat API Token (kredensial S3)
1. **R2 → Manage R2 API Tokens → Create API Token**.
2. Permission: **Object Read & Write**, batasi ke bucket `pasaman-media`.
3. Simpan **Access Key ID**, **Secret Access Key**, dan **Endpoint** (bentuknya `https://<account_id>.r2.cloudflarestorage.com`).

### 3. Aktifkan akses publik untuk gambar
Gambar harus bisa diakses pengunjung. Dua pilihan:

- **Custom domain (WAJIB untuk produksi)** — di **R2 → Settings → Custom Domains**, hubungkan mis. `media.pasamandev.id`. URL gambar jadi rapi, di-cache CDN, dan **tanpa rate limit**.
- **R2.dev public URL** (`https://pub-xxxx.r2.dev`) — **hanya untuk pengembangan.**

> ⚠️ **Jangan pakai URL `r2.dev` di produksi.** Dua alasan:
>
> 1. **Sertifikat / trust di sebagian perangkat.** Gejala nyata di lapangan: gambar tidak muncul di HP dengan error `net::ERR_CERT_AUTHORITY_INVALID`. Sertifikat `*.r2.dev` sendiri valid (Let's Encrypt) dan dipercaya perangkat yang up-to-date — tapi perangkat lama atau HP dengan VPN / aplikasi keamanan / ad-blocker yang menyadap HTTPS bisa menolak rantai sertifikatnya. Karena domainnya milik Cloudflare (bukan Anda), Anda tidak bisa mengendalikan hal ini.
> 2. **Rate limit.** Cloudflare juga membatasi akses lewat `r2.dev` dan menyatakannya khusus development.
>
> **Solusinya custom domain** — bukan pengaturan di kode. Domain di bawah Cloudflare mendapat sertifikat yang dipercaya luas dan berada di domain Anda sendiri. Setelah custom domain aktif, ganti `R2_URL` ke domain tersebut lalu redeploy.
>
> **Cek cepat sebelum setup domain** (untuk memastikan ini memang soal perangkat): buka salah satu URL gambar `r2.dev` langsung di HP yang bermasalah. Kalau muncul peringatan sertifikat, coba (a) matikan VPN/ad-blocker/aplikasi keamanan, (b) buka di jaringan lain (data seluler vs wifi), (c) periksa jam & tanggal HP sudah otomatis/benar. Ini mempersempit apakah penyebabnya perangkat tertentu atau menyeluruh.

### 4. Isi environment variable
Di **Dokploy** (produksi) atau `.env` (uji lokal):

```env
R2_ACCESS_KEY_ID=xxxxxxxxxxxxxxxx
R2_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
R2_DEFAULT_REGION=auto
R2_BUCKET=pasaman-media
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
R2_URL=https://media.pasamandev.id
```

- `R2_ENDPOINT` — untuk API (upload/hapus).
- `R2_URL` — untuk menampilkan gambar ke pengunjung (custom domain / r2.dev).

### 5. (Produksi Docker) refresh config
Entry-point kontainer sudah menjalankan `config:cache` saat start, jadi cukup **redeploy** setelah mengisi env. Untuk uji lokal: `php artisan config:clear`.

### 6. Uji
Login `/cp` → Assets atau upload gambar di sebuah project → pastikan file muncul di bucket R2 dan tampil di situs lewat `R2_URL`.

---

## Best practice keamanan gambar

### ✅ Aktifkan bucket versioning
Di pengaturan bucket, aktifkan **versioning**. Bila file tertimpa atau terhapus tak sengaja, versi lama masih bisa dipulihkan. Ini pengaman terpenting untuk gambar.

### ✅ Batasi kredensial (least privilege)
API Token dibatasi **hanya** ke bucket ini, permission **Object Read & Write** saja (bukan admin akun). Kalau token bocor, dampaknya terbatas.

### ✅ Pisahkan bucket dev & produksi
Pakai bucket berbeda (mis. `pasaman-media-dev`) agar uji coba tidak mengotori gambar produksi.

### ✅ Custom domain + cache
Layani lewat custom domain Cloudflare agar dapat CDN + cache. Gratis egress, cepat, dan URL tidak bergantung pada endpoint mentah.

### ✅ Jangan commit kredensial
`R2_*` hanya di `.env` / env Dokploy. `.env` sudah masuk `.gitignore`. Yang di repo hanya `.env.example` (kosong).

### ✅ Lifecycle & backup lintas-region (opsional)
Untuk galeri yang bertumbuh besar, pertimbangkan lifecycle rule dan/atau replikasi/backup berkala bucket ke bucket lain.

---

## Catatan teknis

### Manipulasi gambar (Glide)
Statamic memakai **Glide** untuk resize/crop (`{{ asset:width="..." }}`). Saat aset di R2, Glide mengambil dari R2, memproses, lalu menyajikan. Untuk performa produksi, pertimbangkan mengaktifkan cache Glide di `config/statamic/assets.php` (`image_manipulation.cache`). Untuk situs company profile skala ini, default sudah memadai.

### Logo & aset brand setelah pindah ke R2
Data contoh menaruh logo di `public/assets/brand/logo.jpg` (lokal). Di produksi dengan R2 aktif, container aset menunjuk ke R2 — jadi setelah deploy pertama, **upload ulang logo lewat `/cp`** (Konfigurasi Web → Logo) agar tersimpan di R2. Sekali saja.

### Migrasi gambar lama ke R2 (bila ada)
Kalau sebelumnya sudah ada gambar di `public/assets/` yang ingin dipindah, salin ke bucket R2 dengan struktur folder yang sama memakai `rclone` atau AWS CLI (arahkan ke endpoint R2), lalu `php please stache:clear`.

---

## Ringkasan env R2

| Env | Isi | Untuk |
| --- | --- | --- |
| `R2_ACCESS_KEY_ID` | Access Key dari API Token | API |
| `R2_SECRET_ACCESS_KEY` | Secret Key dari API Token | API |
| `R2_DEFAULT_REGION` | `auto` | API |
| `R2_BUCKET` | Nama bucket | API |
| `R2_ENDPOINT` | `https://<account_id>.r2.cloudflarestorage.com` | API |
| `R2_URL` | Custom domain / r2.dev URL | Tampilan publik |

Kosongkan `R2_BUCKET` → otomatis kembali ke penyimpanan lokal (development).
