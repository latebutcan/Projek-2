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

// Menyajikan file statis dari folder 'frontend/public'
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

// --- Rute API ---
// Rute untuk otentikasi (login/register)
app.use('/api/auth', require('./routes/auth'));

// Rute untuk fitur yang dilindungi
const authMiddleware = require('./middleware/auth');
app.use('/api/ssl', authMiddleware, require('./routes/ssl'));
app.use('/api/headers', authMiddleware, require('./routes/headers'));

// --- Rute Halaman ---
// Rute ini menangani permintaan ke halaman utama secara langsung
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'html', 'index.html'));
});

// Rute fallback untuk mengarahkan ke halaman utama jika halaman tidak ditemukan
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'html', 'index.html'));
});


// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});