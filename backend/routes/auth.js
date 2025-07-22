const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// --- Database Pengguna Sederhana (dalam memori) ---
// Di aplikasi nyata, ini akan diganti dengan koneksi ke database seperti MongoDB atau PostgreSQL.
const users = [
    {
        id: 1,
        name: 'User Demo',
        email: 'user@example.com',
        passwordHash: bcrypt.hashSync('password123', 10) // Password di-hash
    },
    {
        id: 2,
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: bcrypt.hashSync('testpass123', 10)
    }
];
let nextUserId = 3;

// --- Rute Registrasi ---
// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Validasi input dasar
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Mohon isi semua field' });
    }

    // Cek apakah email sudah terdaftar
    if (users.some(user => user.email === email)) {
        return res.status(409).json({ success: false, message: 'Email sudah terdaftar' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Buat pengguna baru
    const newUser = {
        id: nextUserId++,
        name,
        email,
        passwordHash
    };
    users.push(newUser);
    console.log('Pengguna baru terdaftar:', newUser);

    res.status(201).json({ success: true, message: 'Registrasi berhasil! Silakan login.' });
});


// --- Rute Login ---
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Cari pengguna berdasarkan email
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    // Buat JSON Web Token (JWT)
    const payload = {
        user: {
            id: user.id,
            email: user.email,
            name: user.name
        }
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }, // Token berlaku selama 1 jam
        (err, token) => {
            if (err) throw err;
            res.json({
                success: true,
                token,
                user: {
                    name: user.name,
                    email: user.email
                }
            });
        }
    );
});

module.exports = router;
