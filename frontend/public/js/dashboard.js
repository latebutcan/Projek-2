document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));

    // Jika tidak ada token atau data pengguna, paksa kembali ke halaman login.
    if (!token || !user) {
        // Hapus sisa data jika ada yang tidak konsisten.
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/?showLogin=true';
        return;
    }

    // Jika otentikasi berhasil, siapkan dashboard.
    setupDashboard(user);
    setupNavigation();
    // Muat konten default (halaman utama dashboard).
    loadFeature('dashboard-home');
});

/**
 * Mengatur informasi pengguna dan tombol logout.
 * @param {object} user - Objek data pengguna dari localStorage.
 */
function setupDashboard(user) {
    document.getElementById('userName').textContent = user.name || 'Pengguna';
    document.getElementById('userEmail').textContent = user.email;

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/';
    });
}

/**
 * Mengatur event listener untuk navigasi sidebar.
 */
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Atur status 'active' pada item menu yang diklik.
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Muat konten fitur yang sesuai.
            const featureName = item.dataset.feature;
            loadFeature(featureName);
        });
    });
}

/**
 * Memuat konten fitur yang dipilih ke dalam area konten utama.
 * @param {string} featureName - Nama fitur dari atribut data-feature.
 */
function loadFeature(featureName) {
    const contentArea = document.getElementById('contentArea');
    const featureTitle = document.getElementById('featureTitle');
    let content = '';
    let title = '';

    // Switch-case untuk menentukan konten dan judul berdasarkan fitur.
    switch (featureName) {
        case 'ssl':
            title = 'SSL Certificate Checker';
            content = getSslCheckerHtml(); // Fungsi dari js/features/ssl.js
            break;
        case 'headers':
            title = 'Security Headers Analyzer';
            content = getHeadersAnalyzerHtml(); // Fungsi dari js/features/headers.js
            break;
        case 'fileManager':
            title = 'Secure File Manager';
            content = getFileManagerHtml(); // Fungsi dari js/features/fileManager.js
            break;
        default: // 'dashboard-home'
            title = 'Selamat Datang!';
            const userName = JSON.parse(localStorage.getItem('user')).name;
            content = `
                <div class="feature-content-card">
                    <h2>Dashboard Utama</h2>
                    <p>Selamat datang kembali, <strong>${userName}</strong>!</p>
                    <p>Gunakan menu di sebelah kiri untuk mengakses berbagai fitur keamanan yang tersedia. Anda dapat memeriksa sertifikat SSL, menganalisis header keamanan website Anda, dan mengelola file dengan aman.</p>
                </div>
            `;
            break;
    }

    // Perbarui judul dan konten di halaman.
    featureTitle.innerHTML = title;
    contentArea.innerHTML = content;

    // Setelah konten dimuat, panggil fungsi setup yang relevan untuk menambahkan event listener.
    if (featureName === 'ssl') {
        setupSslCheckerListeners();
    }
    if (featureName === 'headers') {
        setupHeadersAnalyzerListeners();
    }
    // Tambahkan setup listener untuk fitur lain di sini jika ada.
}
