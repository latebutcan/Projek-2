const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Dapatkan token dari header
    const token = req.header('x-auth-token');

    // Cek jika tidak ada token
    if (!token) {
        return res.status(401).json({ message: 'Tidak ada token, otorisasi ditolak' });
    }

    // Verifikasi token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token tidak valid' });
    }
};
