# 05 — Kebijakan Operasional Konten

Dokumen ini adalah **aturan resmi** cara mengelola konten Pasaman Dev. Tujuannya: konten aman, tidak pernah hilang, dan tidak saling menimpa.

---

## Aturan utama

> ### 🔒 Konten hanya dibuat & diedit lewat Control Panel (`/cp`) di server produksi.
> ### 🚫 Konten TIDAK dibuat lewat commit Git.

Artinya:

1. **Semua konten** (project, artikel, galeri, konfigurasi web) dibuat/diedit **hanya** melalui `/cp` di server produksi.
2. **Semua gambar** di-upload lewat `/cp` dan otomatis tersimpan di **Cloudflare R2** (bukan di server).
3. **Developer tidak menyentuh folder `content/`** secara manual di repo untuk mengubah konten produksi.
4. Repo Git hanya untuk **kode** (view, blueprint, CSS, konfigurasi) — bukan konten.

### Kenapa aturan ini?

Statamic menyimpan konten sebagai file. Kalau konten diedit di dua tempat (lokal via Git **dan** produksi via CP), file akan **bentrok / saling menimpa** dan konten bisa hilang. Dengan menetapkan **satu sumber kebenaran = CP produksi**, masalah itu hilang sepenuhnya.

---

## Di mana setiap hal disimpan

| Jenis data | Lokasi di produksi | Sifat |
| --- | --- | --- |
| Teks konten (YAML/MD) | **Volume persisten** `/var/www/html/content` | Kecil, di-backup rutin |
| Akun user | **Volume persisten** `/var/www/html/users` | Kecil, di-backup rutin |
| Gambar upload | **Cloudflare R2** (object storage) | Besar, durable, dilayani CDN |
| Cache & log | Volume `/var/www/html/storage` | Sementara |
| Kode (view, blueprint, CSS) | **Git → image Docker** | Dari repo |

Prinsipnya: **teks kecil di volume, gambar besar di R2, kode di Git.** Detail R2 ada di [06 — Penyimpanan Gambar R2](06-penyimpanan-gambar-r2.md).

---

## Alur kerja

### Mengelola konten (editor / admin)
```
Buka https://domain-anda.com/cp
   → buat/edit Project, Artikel, Galeri, Konfigurasi Web
   → upload gambar (otomatis ke R2)
   → Save & Publish
Selesai. Tidak ada Git, tidak ada deploy.
```

### Mengubah tampilan / fitur (developer)
```
Edit kode di lokal (resources/, config/, dst.)
   → git commit & push
   → Dokploy build ulang & deploy
Konten produksi TIDAK tersentuh (ada di volume, bukan di image).
```

Dua alur ini **tidak pernah bertabrakan** karena bekerja di area berbeda (volume vs image).

---

## Bagaimana konten awal (seed) berperilaku

Image Docker berisi salinan `content/` dari repo (data contoh: 6 project, 3 artikel, 5 galeri).

- **Deploy pertama:** volume `content` masih kosong → Docker menyalin konten seed dari image ke volume. Situs langsung terisi contoh.
- **Setelah itu:** semua edit dari CP menulis ke **volume**. Deploy berikutnya (image baru) **tidak** menimpa volume — konten produksi Anda aman.

Konsekuensi yang harus dipahami: setelah deploy pertama, **mengubah data contoh di repo tidak berpengaruh** ke produksi (volume yang menang). Itu memang perilaku yang diinginkan pada model ini. Setelah go-live, hapus data contoh lewat CP dan isi dengan konten asli.

---

## Analisa keamanan konten — best practice

Pertanyaannya: *"bagaimana supaya konten (termasuk gambar) aman?"* Berikut lapis-lapis pengamanannya, dari wajib sampai pelengkap.

### Lapis 1 — Volume persisten (wajib)
Tanpa volume, semua konten hilang setiap kali kontainer di-redeploy. Empat volume wajib dipasang di Dokploy (lihat [07](07-deployment-dokploy.md)). Ini syarat minimum, **bukan** backup.

### Lapis 2 — Backup terjadwal volume (wajib)
Volume bisa rusak/terhapus. Backup rutin folder:
- `content/` (semua teks konten)
- `users/` (akun)

Opsi backup:
- **Dokploy Backups** — Dokploy punya fitur backup terjadwal ke S3/R2. Aktifkan, jadwalkan harian.
- **Cron manual** — `tar` folder lalu upload ke bucket backup.

> Teks konten kecil (biasanya beberapa MB), jadi backup **harian** murah dan cepat.

### Lapis 3 — Git automation sebagai audit & backup kedua (sangat disarankan)
Statamic bisa **otomatis commit** setiap perubahan konten dari CP ke repo Git privat. Manfaatnya:
- **Riwayat versi** konten (siapa mengubah apa, kapan) — tanpa developer commit manual.
- **Backup kedua** teks konten di remote Git.
- **Rollback** konten ke versi sebelumnya.

Aktifkan di `.env` produksi:
```env
STATAMIC_GIT_ENABLED=true
STATAMIC_GIT_PUSH=true          # auto-push ke remote
```
Konfigurasi lengkap: `config/statamic/git.php`. Dokumentasi: <https://statamic.dev/git-automation>.

> **Penting:** Git automation ini **satu arah** (CP → Git, sebagai cermin/backup). Anda tetap **tidak** mengedit konten dengan commit manual. Aturan utama tidak berubah — ini hanya jaring pengaman.

### Lapis 4 — Keamanan gambar (R2)
Gambar aman karena berada di object storage terpisah dari server:
- **Durability tinggi** — R2 menyimpan banyak replika otomatis.
- **Bucket versioning** — aktifkan agar file yang tertimpa/terhapus bisa dipulihkan.
- **Terpisah dari kontainer** — redeploy atau kerusakan server tidak menyentuh gambar.

Detail di [06 — Penyimpanan Gambar R2](06-penyimpanan-gambar-r2.md).

### Lapis 5 — APP_KEY stabil
`APP_KEY` dipakai mengenkripsi sebagian data & sesi. **Jangan pernah menggantinya** setelah produksi berjalan. Simpan salinannya di tempat aman (password manager).

---

## Ringkasan checklist keamanan

- [ ] 4 volume persisten terpasang di Dokploy
- [ ] Backup harian untuk volume `content` & `users`
- [ ] `STATAMIC_GIT_ENABLED=true` (audit + backup kedua)
- [ ] Gambar di R2 dengan **bucket versioning** aktif
- [ ] `APP_KEY` disimpan aman & tidak pernah diubah
- [ ] Uji **restore** backup minimal sekali (backup yang belum pernah diuji = belum tentu berhasil)

---

## Yang TIDAK boleh dilakukan

| ❌ Jangan | ✅ Lakukan |
| --- | --- |
| Edit file `content/` lalu commit untuk mengubah konten produksi | Edit lewat `/cp` |
| Menaruh gambar besar di repo Git | Upload lewat `/cp` → masuk R2 |
| Ganti `APP_KEY` di produksi | Simpan & pertahankan APP_KEY awal |
| Deploy tanpa volume persisten | Pastikan 4 volume terpasang |
| Andalkan volume saja tanpa backup | Backup terjadwal + Git automation |
