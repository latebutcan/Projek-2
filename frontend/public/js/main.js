document.addEventListener('DOMContentLoaded', () => {
    // Periksa apakah pengguna sudah login. Jika ya, dan mereka berada di halaman utama,
    // arahkan langsung ke dashboard.
    const token = localStorage.getItem('authToken');
    if (token && window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html')) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Inisialisasi fungsionalitas form login jika ada di halaman
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        setupLoginPopup();
        loginForm.addEventListener('submit', handleLogin);
    }

    // Inisialisasi fungsionalitas form registrasi jika ada di halaman
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

/**
 * Mengatur semua event listener untuk popup login.
 */
function setupLoginPopup() {
    const loginPopup = document.getElementById('loginPopup');
    const openBtn = document.querySelector('.btn-login');
    const closeBtn = loginPopup.querySelector('.popup-close');
    const demoBtns = loginPopup.querySelectorAll('.use-demo-btn');

    const openPopup = () => loginPopup.classList.add('active');
    const closePopup = () => loginPopup.classList.remove('active');

    openBtn.addEventListener('click', openPopup);
    closeBtn.addEventListener('click', closePopup);
    loginPopup.addEventListener('click', (e) => {
        if (e.target === loginPopup) closePopup();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loginPopup.classList.contains('active')) {
            closePopup();
        }
    });

    // Periksa parameter URL untuk membuka popup secara otomatis.
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('showLogin') === 'true') {
        openPopup();
        // Hapus parameter dari URL untuk tampilan yang lebih bersih.
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Atur tombol untuk mengisi kredensial demo.
    demoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            if (type === 'user') {
                emailInput.value = 'user@example.com';
                passwordInput.value = 'password123';
            } else if (type === 'test') {
                emailInput.value = 'test@example.com';
                passwordInput.value = 'testpass123';
            }
        });
    });
}

/**
 * Menangani pengiriman form login.
 * @param {Event} event - Objek event dari form submission.
 */
async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const statusDiv = document.getElementById('loginStatus');
    const submitBtn = form.querySelector('button[type="submit"]');

    setLoading(submitBtn, true, 'Masuk...');
    setStatus(statusDiv, 'Memproses login...', 'loading');

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Login gagal. Periksa kembali email dan password Anda.');
        }

        // Simpan token dan data pengguna ke localStorage.
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setStatus(statusDiv, 'Login berhasil! Mengarahkan ke dashboard...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        setStatus(statusDiv, `Error: ${error.message}`, 'error');
        setLoading(submitBtn, false, '<i class="fas fa-sign-in-alt"></i> Masuk ke Dashboard');
    }
}

/**
 * Menangani pengiriman form registrasi.
 * @param {Event} event - Objek event dari form submission.
 */
async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const statusDiv = document.getElementById('registerStatus');
    const submitBtn = form.querySelector('button[type="submit"]');

    setLoading(submitBtn, true, 'Mendaftar...');
    setStatus(statusDiv, 'Memproses pendaftaran...', 'loading');

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Registrasi gagal. Coba lagi.');
        }

        setStatus(statusDiv, 'Registrasi berhasil! Anda akan diarahkan untuk login.', 'success');
        setTimeout(() => {
            // Arahkan ke halaman utama dengan popup login terbuka.
            window.location.href = '/?showLogin=true';
        }, 2000);

    } catch (error) {
        setStatus(statusDiv, `Error: ${error.message}`, 'error');
        setLoading(submitBtn, false, '<i class="fas fa-check-circle"></i> Daftar');
    }
}

/**
 * Helper function untuk mengatur status loading pada tombol.
 * @param {HTMLButtonElement} button - Tombol yang akan diubah.
 * @param {boolean} isLoading - Status loading.
 * @param {string} text - Teks yang akan ditampilkan pada tombol.
 */
function setLoading(button, isLoading, text) {
    button.disabled = isLoading;
    if (isLoading) {
        button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    } else {
        button.innerHTML = text;
    }
}

/**
 * Helper function untuk menampilkan pesan status.
 * @param {HTMLElement} element - Elemen untuk menampilkan pesan.
 * @param {string} message - Pesan yang akan ditampilkan.
 * @param {'success'|'error'|'loading'} type - Jenis pesan.
 */
function setStatus(element, message, type) {
    element.textContent = message;
    element.style.color = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#667eea';
}
