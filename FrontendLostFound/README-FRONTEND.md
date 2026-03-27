
# Finder by KAI — Frontend User/Pelapor

Paket ini adalah frontend user/pelapor yang dibuat mengikuti desain yang diberikan, tetapi tetap diselaraskan dengan backend PHP Native MVC yang sudah ada.

## Fokus paket ini
- Login
- Register
- Home / landing user
- Found items untuk pelapor
- Report lost untuk pelapor
- Profile + status laporan kehilangan
- Edit profile
- Ganti password
- Logout

## Sudah sinkron dengan backend
Endpoint yang dipakai:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `PUT /api/auth/change-password`
- `GET /api/found-items`
- `GET /api/found-items/{id}`
- `GET /api/lost-reports`
- `POST /api/lost-reports`
- `PUT /api/lost-reports/{id}`

## Penyesuaian dari desain agar tetap cocok dengan backend
Karena backend saat ini tidak memiliki field/fitur berikut, maka UI tidak memaksa fitur tersebut aktif:
- No. Telp user
- Gender user
- Forgot password OTP
- Notifikasi/pesan otomatis
- Upload gambar pada laporan kehilangan
- Detail penuh barang temuan untuk pelapor

## Cara pakai
1. Copy folder `LOSTANDFOUND` ini ke dalam `htdocs`.
2. Pastikan backend berada di `htdocs/LOSTANDFOUND/BackendLostFound`.
3. Jika URL folder diubah, sesuaikan file frontend `config.php` dan backend `BackendLostFound/config/config.php`.
4. Buka di browser:
   - `http://localhost/LOSTANDFOUND/`

## Catatan penting
- Paket ini khusus untuk sisi user/pelapor.
- Jika login menggunakan akun petugas, autentikasi tetap berhasil, tetapi tampilan tetap berfokus pada flow user.
- Paket ini tidak mengubah kontrak endpoint backend.


## UI Petugas tambahan
Halaman petugas yang ditambahkan:
- officer-home.php
- officer-report-lost.php
- officer-report-found.php
- officer-list-lost.php
- officer-list-found.php
- officer-match.php
- officer-profile.php

Catatan: halaman reservation petugas disiapkan sebagai placeholder visual karena backend saat ini belum memiliki endpoint reservation.
