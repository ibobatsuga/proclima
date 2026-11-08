# ProClima - Web App Service & Cleaning AC (Mobile-First)

Aplikasi web mobile-first untuk usaha service & cleaning AC di Indonesia, dibangun berdasarkan **PRD Produksi ProClima v1.4** dan referensi desain visual *"One job, twelve screens, start to finish"*.

Logo: **Thermometer ProClima** (`/public/logo-thermometer.png`).

---

## 🌟 Prinsip Desain ("Built for gloves, sunlight and one thumb")
1. **Target Sentuh Minimum 48px**: Tombol mudah ditekan dengan jari atau sarung tangan saat di lapangan.
2. **Layout Bottom-Heavy**: Aksi utama (Terima Job, Lanjut Laporan, Selesai) berada di lengkung jangkauan jempol bawah.
3. **Offline adalah State**: Status draft lokal ditampilkan jelas (*Saved Locally* / *Syncing*).
4. **Proof by Default**: Foto sebelum/sesudah, hasil ukur freon (PSI) & suhu (°C), serta tanda tangan digital wajib ada.
5. **2 App, 1 Bahasa**: Sisi teknisi dan sisi customer berbagi token dan komponen yang sama. Customer mengakses tautan publik tanpa registrasi/login akun.

---

## 📱 Peta 12 Layar Alur Inti (End-to-End Loop)

### Tahap 1 - Job Intake (Penerimaan Job Teknisi)
- **Layar 1 (Dashboard Teknisi)**: Sapaan nama teknisi, counter metrik (Total, Menunggu, Selesai, Part/Freon), kartu job prioritas aktif, dan tombol scan cepat.
- **Layar 2 (All Jobs)**: Tab *Hari Ini*, *Mendatang*, dan *Selesai*, fitur pencarian & scan.
- **Layar 3 (Job Detail)**: Kontak WhatsApp & peta lokasi pelanggan, rincian keluhan, dan **Blok Riwayat Unit AC** (merek, PK, lokasi, servis terakhir).
- **Layar 4 (Scan & Check-In)**: Scanner stiker QR kode unit AC (`PRO-YK-xxx`) dan GPS check-in waktu kedatangan.

### Tahap 2 - Service Execution (Pengerjaan di Lokasi)
- **Layar 5 (Service Report)**: Checklist pembersihan AC (filter, evaporator, talang drainase, kondensor outdoor, kelistrikan), input tekanan Freon (PSI), suhu hembusan dingin (°C), dan foto bukti Sebelum/Sesudah.
- **Layar 6 (Parts Requisition)**: Tambahan freon R32/R410A dan sparepart berbiaya dengan validasi persetujuan pelanggan jika melebihi batas.
- **Layar 7 (Signature & Sign-Off)**: Ringkasan tagihan transparan & canvas tanda tangan digital langsung di layar HP.
- **Layar 8 (Job Complete)**: Penutupan job, terbitnya **Same-day Invoice**, dan **Otomatisasi Pengingat Servis Ulang 90 Hari** (Pembeda Utama ProClima).

### Tahap 3 - Client Proof (Sisi Pelanggan via Link Publik)
- **Layar 9 (Client Dashboard)**: Status pengerjaan real-time dalam bahasa awam tanpa perlu login/instalasi aplikasi.
- **Layar 10 (Job History Client)**: Riwayat semua kunjungan servis per unit AC pelanggan.
- **Layar 11 (Service Report Client)**: Laporan servis transparan, foto perbandingan, hasil ukur teknis, tanda tangan, tombol Cetak/PDF, dan bagikan WhatsApp.
- **Layar 12 (Give Review)**: Rating bintang 1-5, aspek layanan (Ketepatan waktu, Kebersihan, Suhu Dingin, Keramahan), dan testimoni.

---

## 🛡️ Fitur Tambahan Admin / Owner (PRD v1.4)
- **Kalender & Anti Double-Booking (FR-09)**: Sistem server-level otomatis memblokir jadwal jika teknisi ditugaskan pada jam yang bentrok/tumpang tindih, serta menyarankan teknisi yang kosong.
- **Manajemen Invoice & Piutang (FR-13)**: Monitoring tagihan Belum Bayar vs Lunas, tombol pembayaran manual QRIS, Transfer Bank, atau Tunai.
- **Pengingat Servis Otomatis WhatsApp (FR-15 & FR-16)**: Kuota pesan WhatsApp per paket, template resmi ramah UU PDP dengan tombol Opt-Out.
- **Generator Stiker QR Unit AC (FR-05)**: Label stiker unik per unit AC pelanggan yang siap dicetak dan ditempel di bodi AC.
- **Limit Paket & Kuota (FR-17)**: Penegakan limit paket Basic gratis vs Paket Pro Rp149.000/bln.
- **Audit Log (FR-19) & Ekspor CSV (FR-18)**: Jejak rekam aktivitas dan pengunduhan CSV pelanggan, job, dan invoice.
- **Booking Mandiri Link Publik (FR-08)**: Pelanggan dapat memesan jadwal servis langsung dari web tanpa perlu login.

---

## 🚀 Menjalankan Aplikasi
```bash
cd /Users/ibobatsuga/.gemini/antigravity/scratch/proclima
npm run dev
```
Akses di browser:
- Local: `http://localhost:3000`
- Mobile LAN: `http://<IP-Lokal>:3000`
