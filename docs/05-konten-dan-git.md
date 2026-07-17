# 05 — Mengelola Konten dengan Git

> **Pertanyaan inti:** "Statamik membuat *file*, bukan database. Bagaimana mengelola konten kalau pakai Git?"

Jawaban singkat: **karena konten adalah file, konten diperlakukan seperti kode** — di-commit, di-branch, di-review, di-rollback. Tapi ada satu jebakan khas: **siapa yang boleh mengedit konten di mana** (lokal vs produksi). Bab ini membahasnya tuntas.

---

## Apa yang masuk Git dan apa yang tidak

| Path | Masuk Git? | Kenapa |
| --- | --- | --- |
| `content/**` | ✅ Ya | Ini konten (project, artikel, galeri, konfigurasi). Inti dari version control konten. |
| `users/**` | ✅ Ya | Akun user juga file. (Password sudah ter-hash.) |
| `resources/**` | ✅ Ya | Blueprint, view, CSS, JS. |
| `public/assets/**` | ⚠️ Tergantung | Gambar upload. Lihat bagian [Aset/Gambar](#asetgambar) di bawah. |
| `public/build/**` | ❌ Tidak | Hasil compile Vite, dibuat ulang saat build. Sudah di-`.gitignore`. |
| `.env` | ❌ Tidak | Rahasia (APP_KEY, dll.). Sudah di-`.gitignore`. |
| `vendor/`, `node_modules/` | ❌ Tidak | Dependency, di-install ulang. |
| `storage/`, `bootstrap/cache/` | ❌ Tidak | Cache & log. |

Konsekuensi penting: **`content/` sengaja TIDAK di-ignore.** Setiap perubahan konten harus di-commit agar tercatat.

---

## Dua model kerja

Pilih satu sesuai kebutuhan tim.

### Model A — Konten diedit lokal, lalu di-deploy (paling aman)

Cocok bila yang mengelola konten adalah orang teknis / punya akses ke repo.

```
Editor buka /cp di komputer LOKAL
        │  (Statamic menulis file di content/)
        ▼
git add content/ && git commit -m "artikel: ..."
        │
        ▼
git push  →  CI/Dokploy build & deploy  →  konten muncul di produksi
```

- **Kelebihan**: produksi selalu = isi Git. Tidak ada konten "hilang". Riwayat rapi.
- **Kekurangan**: editor non-teknis tidak bisa langsung ubah produksi.
- **Aturan**: **jangan** mengedit konten langsung di produksi. Produksi read-only untuk konten.

### Model B — Konten diedit di produksi (butuh volume persisten)

Cocok bila editor non-teknis mengelola konten lewat CP produksi.

```
Editor buka /cp di server PRODUKSI
        │  (Statamic menulis file ke VOLUME persisten)
        ▼
Konten hidup di volume, TIDAK otomatis kembali ke Git
```

- **Kelebihan**: editor bebas, tanpa Git.
- **Kekurangan**: konten produksi **menyimpang** dari Git. Deploy kode baru tidak menyentuh konten (karena beda volume), tapi kalau volume hilang, konten hilang.
- **Wajib**: pasang **volume persisten** untuk `content/`, `users/`, `public/assets/` (lihat [Bab 06](06-deployment.md)) **dan** backup rutin volume itu.
- **Opsional**: aktifkan **Git Automation** Statamic agar setiap edit di CP otomatis commit (lihat bawah).

> **Rekomendasi untuk Pasaman Dev:** mulai dengan **Model A** (konten via Git) selama tim masih teknis. Pindah ke Model B + Git Automation kalau nanti ada editor non-teknis.

---

## Statamic Git Automation (jembatan Model B → Git)

Statamic punya fitur bawaan yang otomatis `git commit` setiap kali konten berubah lewat CP. Ini menyatukan kemudahan Model B dengan riwayat Model A.

Aktifkan di `.env`:

```env
STATAMIC_GIT_ENABLED=true
```

Konfigurasi lengkap ada di `config/statamic/git.php` (pesan commit, user, apakah otomatis push, path yang dipantau). Dokumentasi: <https://statamic.dev/git-automation>.

Dengan ini, editor mengedit di `/cp` produksi → Statamic membuat commit otomatis di repo server → (opsional) push ke remote. Konten produksi tetap tercatat di Git.

---

## Aset/Gambar

Gambar yang di-upload lewat CP tersimpan di `public/assets/`. Dua pilihan:

1. **Ikutkan ke Git** (default project ini) — gambar ikut ter-commit. Sederhana, cocok untuk situs kecil. Kekurangan: repo membengkak bila banyak gambar besar.
2. **Kecualikan dari Git + pakai volume/backup** — tambahkan `public/assets/` ke `.gitignore`, andalkan volume persisten + backup. Cocok bila galeri besar.

Untuk komunitas dengan galeri foto yang tumbuh, pertimbangkan opsi 2 di kemudian hari.

---

## Menyelesaikan konflik merge pada konten

Karena konten = file teks (YAML/Markdown), konflik Git ditangani seperti biasa. Yang perlu diperhatikan:

- File entry punya blok frontmatter YAML di antara `---`. Saat konflik, **jaga agar `id:` dan struktur YAML tetap valid**.
- Bila dua orang mengedit entry berbeda, tidak akan konflik (file berbeda).
- Bila dua orang mengedit entry yang sama, selesaikan seperti konflik kode biasa, lalu:
  ```bash
  php please stache:clear
  ```
  untuk memastikan index Statamic terbarui.

---

## Alur commit yang disarankan

Perlakukan konten dan kode dengan pesan commit yang jelas terpisah:

```bash
# menambah konten
git add content/
git commit -m "content(artikel): tambah 'Tips Belajar Coding'"

# mengubah tampilan
git add resources/
git commit -m "ui: perbesar kartu project di beranda"
```

Gunakan branch untuk perubahan besar (mis. menyiapkan banyak artikel sebelum peluncuran), lalu merge/PR seperti biasa. Inilah keunggulan utama flat-file: **konten bisa di-review sebelum tayang**.

---

## Ringkasan keputusan

| Situasi | Pakai |
| --- | --- |
| Tim teknis, ingin riwayat & review konten | Model A (edit lokal → Git → deploy) |
| Ada editor non-teknis | Model B + volume persisten + backup |
| Ingin keduanya (edit di CP tapi tetap tercatat Git) | Model B + `STATAMIC_GIT_ENABLED=true` |
| Galeri foto besar | Kecualikan `public/assets/` dari Git, andalkan volume+backup |
