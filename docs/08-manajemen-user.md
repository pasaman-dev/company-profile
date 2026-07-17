# 08 — Manajemen User

Panduan lengkap mengelola akun pengguna Control Panel: menambah, menghapus, mengatur peran (role), reset password, dan best practice.

Di Statamic, **user juga file** — disimpan di folder `users/` (mis. `users/nama@email.com.yaml`). Di produksi, folder ini ada di **volume persisten** (lihat [07](07-deployment-dokploy.md)), jadi akun tidak hilang saat redeploy.

> Menambah/menghapus user **tidak menyentuh database** — hanya menulis/menghapus file. Penjelasan lengkap soal database (dan opsi SQLite) ada di [09 — Database & Penyimpanan](09-database-dan-penyimpanan.md).

---

## Konsep: User, Role, Group

| Istilah | Arti |
| --- | --- |
| **User** | Satu akun login (email + password) |
| **Role** | Kumpulan izin (permission). Contoh: "Editor" boleh kelola artikel tapi tidak boleh ubah pengaturan |
| **Group** | Kumpulan user yang berbagi role yang sama (opsional, untuk tim besar) |
| **Super Admin** | User dengan izin **penuh** ke semuanya. Abaikan role — bisa apa saja |

Untuk komunitas kecil, biasanya cukup: **1–2 Super Admin** + beberapa **Editor**.

---

## Menambah user

### Cara 1 — Lewat Control Panel (paling mudah, disarankan)
1. Login `/cp` sebagai super admin.
2. **Users** (menu kiri) → **Create User**.
3. Isi email & nama.
4. Pilih **Role** (mis. Editor) atau centang **Super Admin**.
5. **Save**. User baru bisa diundang / diberi tautan set password.

### Cara 2 — Lewat terminal (CLI)
Berguna untuk membuat admin pertama di server.

```bash
# interaktif (akan menanyakan email, nama, password, super admin?)
php please make:user

# non-interaktif, langsung super admin
php please make:user admin@pasamandev.id --super --password=rahasia123
```

Di produksi (Docker/Dokploy):
```bash
docker exec -it <nama-container> php please make:user
```

---

## Menghapus user

### Lewat Control Panel (disarankan)
1. **Users** → klik user.
2. Tombol **Delete** (atau menu ⋯ → Delete).

### Lewat file
Hapus file user di `users/`:
```bash
rm users/nama@email.com.yaml
php please stache:clear
```
Di produksi lewat terminal kontainer (karena file ada di volume). **Jangan** menghapus lewat commit repo — akun ada di volume produksi, bukan di repo.

> Selalu sisakan **minimal satu Super Admin** yang bisa login. Jangan hapus akun super admin terakhir.

---

## Mengatur peran (Role)

Secara default project ini belum mendefinisikan role (semua yang dibuat jadi super admin). Untuk membatasi akses (mis. Editor komunitas), buat role.

### Lewat Control Panel (disarankan — ada editor visual izin)
1. **Users → Roles → Create Role**.
2. Beri judul, mis. **Editor**.
3. Centang izin yang relevan, contoh untuk editor konten:
   - **Access CP** (wajib agar bisa login CP)
   - **Collections**: View/Edit/Create/Delete pada `Project`, `Artikel`, `Galeri`
   - **Taxonomies**: kelola `Tipe Project`, `Kategori`
   - **Assets**: upload/edit aset
   - *(Jangan* centang izin Users, Roles, Sites, Updates, Fields/Blueprints — itu ranah developer/super admin)*
4. **Save**. Lalu assign role ini ke user Editor.

### Lewat file (`resources/users/roles.yaml`)
Role berbasis file cocok untuk versi-kontrol (ini **kode**, bukan konten, jadi boleh di-commit). Contoh role Editor:

```yaml
editor:
  title: Editor
  permissions:
    - access cp
    - view articles entries
    - edit articles entries
    - create articles entries
    - delete articles entries
    - view projects entries
    - edit projects entries
    - create projects entries
    - delete projects entries
    - view gallery entries
    - edit gallery entries
    - create gallery entries
    - delete gallery entries
    - configure asset containers
    - upload assets
```

Lalu `php please stache:clear`. Nama izin bisa dilihat/di-generate lewat editor Role di CP (lebih akurat daripada mengetik manual).

### Peran yang disarankan untuk Pasaman Dev
| Role | Untuk | Boleh |
| --- | --- | --- |
| **Super Admin** | Pengelola utama / developer | Semua |
| **Editor** | Anggota yang mengisi konten | Project, Artikel, Galeri, upload gambar |

Konfigurasi Web (global), blueprint, dan user sebaiknya hanya untuk **Super Admin**.

---

## Reset / ganti password

### User mengganti sendiri
Login `/cp` → klik nama di kanan atas → **Profile / Account** → ganti password.

### Admin mereset password user lain
Lewat CP: **Users** → pilih user → set password baru / kirim tautan reset.

### Lewat terminal (bila terkunci)
```bash
php artisan tinker --execute='
use Statamic\Facades\User;
$u = User::findByEmail("nama@email.com");
$u->password("password-baru");
$u->save();
echo "OK";
'
```

> **Catatan hash:** password harus tersimpan sebagai hash **bcrypt `$2y$`**. Selalu set password lewat CP, `make:user`, atau `->password()` di atas — jangan menempel hash mentah dari sumber lain ke file `.yaml` (bisa memicu error *"This password does not use the Bcrypt algorithm"* saat login).

---

## Two-Factor Authentication (2FA)

Statamic mendukung 2FA. Di project ini dinonaktifkan lewat `.env` (`STATAMIC_TWO_FACTOR_ENABLED=false`) agar setup awal mudah.

Untuk keamanan produksi, pertimbangkan mengaktifkannya:
```env
STATAMIC_TWO_FACTOR_ENABLED=true
```
Setelah aktif, tiap user diminta mengatur aplikasi authenticator saat login berikutnya.

---

## Best practice

- **Minimalkan Super Admin** — hanya 1–2 orang. Sisanya Editor.
- **Satu akun per orang** — jangan berbagi akun (agar audit/riwayat jelas).
- **Email valid** — dipakai untuk reset password & notifikasi.
- **Role berbasis file** boleh di-commit (ini kode), tapi **user** dikelola di produksi via CP (ini menyangkut akun/volume).
- **Cabut akses** anggota yang keluar — hapus user-nya.
- Pertimbangkan **2FA** untuk akun super admin.

---

## Ringkasan perintah

| Tugas | Perintah / Lokasi |
| --- | --- |
| Buat admin (CLI) | `php please make:user --super` |
| Buat user (CP) | Users → Create User |
| Hapus user | CP (Delete) atau hapus file `users/*.yaml` |
| Buat role | CP: Users → Roles, atau `resources/users/roles.yaml` |
| Reset password | CP (Profile) atau tinker `->password()->save()` |
| Aktifkan 2FA | `STATAMIC_TWO_FACTOR_ENABLED=true` |
