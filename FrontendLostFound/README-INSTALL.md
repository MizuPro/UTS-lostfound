
# LOSTANDFOUND Ready Package

Struktur folder paket ini sudah disiapkan untuk:

```
htdocs/
└── LOSTANDFOUND/
    ├── BackendLostFound/
    ├── index.php
    ├── login.php
    ├── register.php
    ├── found.php
    ├── report-lost.php
    ├── profile.php
    ├── assets/
    ├── partials/
    ├── includes/
    └── config.php
```

## URL yang dipakai
- Frontend: `http://localhost/LOSTANDFOUND/`
- Backend API: `http://localhost/LOSTANDFOUND/BackendLostFound/`

## Langkah pakai
1. Salin folder `LOSTANDFOUND` ini ke `htdocs`.
2. Jalankan Apache dan MySQL di XAMPP.
3. Import `BackendLostFound/database.sql` ke MySQL.
4. Pastikan `BackendLostFound/config/config.php` sudah sesuai.
5. Buka `http://localhost/LOSTANDFOUND/`.

## Seed account
- Petugas: `petugas@commuterlink.id`
- Pelapor: `budi@gmail.com`
- Password seed: `password`

## Catatan integrasi
- Frontend mengikuti field backend yang ada sekarang.
- No. Telp, gender, OTP forgot password, dan upload gambar pada laporan kehilangan belum diaktifkan karena API saat ini belum menyediakannya.
