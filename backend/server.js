// Import modul yang diperlukan
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Konfigurasi variabel lingkungan dari file .env
dotenv.config();

// Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Mengizinkan Cross-Origin Resource Sharing
app.use(express.json()); // Mem-parsing body request JSON

// Menyajikan file statis dari folder 'public'
// Path diperbaiki untuk mencari folder 'public' satu tingkat di atas direktori saat ini
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- Rute API ---
// Rute untuk otentikasi (login/register)
app.use('/api/auth', require('./routes/auth'));

// Rute untuk fitur (contoh kerangka)
// Middleware 'authMiddleware' akan melindungi rute-rute ini
const authMiddleware = require('./middleware/auth');
app.use('/api/ssl', authMiddleware, require('./routes/ssl'));
app.use('/api/headers', authMiddleware, require('./routes/headers'));

// --- Rute Halaman ---
// Rute ini menangani permintaan ke halaman utama secara langsung
app.get('/', (req, res) => {
  // Path diperbaiki untuk file index.html
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Rute fallback untuk single-page application (SPA)
// Jika ada rute yang tidak cocok dengan API atau file statis,
// kembalikan ke halaman utama. Ini berguna untuk routing di sisi klien.
app.get('*', (req, res) => {
  // Path diperbaiki untuk file index.html
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});