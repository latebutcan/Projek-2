// File: public/js/features/ssl.js
// Berisi semua fungsionalitas untuk fitur SSL Checker.

/**
 * Menghasilkan string HTML untuk antarmuka SSL Checker.
 * @returns {string} Markup HTML untuk fitur tersebut.
 */
function getSslCheckerHtml() {
    return `
        <div class="feature-content-card">
            <h2><i class="fas fa-lock"></i> Cek Sertifikat SSL</h2>
            <p>Masukkan nama domain (tanpa http/https) untuk menganalisis sertifikat SSL-nya.</p>
            <form id="sslForm" class="feature-form">
                <input type="text" id="sslDomain" placeholder="contoh: google.com" required>
                <button type="submit"><i class="fas fa-search"></i> Cek Sekarang</button>
            </form>
            <div id="sslResults" class="results-area" style="display:none;"></div>
        </div>
    `;
}

/**
 * Mengatur event listener untuk form SSL Checker setelah HTML-nya dimuat ke dalam DOM.
 */
function setupSslCheckerListeners() {
    const form = document.getElementById('sslForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const domain = document.getElementById('sslDomain').value;
        const resultsDiv = document.getElementById('sslResults');
        const token = localStorage.getItem('authToken');

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menganalisis, mohon tunggu...';

        try {
            const response = await fetch('/api/ssl/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ domain })
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Gagal mengambil data dari server.');
            }

            // Format dan tampilkan hasil yang diterima dari backend.
            const data = result.data;
            resultsDiv.innerHTML = 
                `<strong>Hasil untuk ${data.domain}:</strong>\n\n` +
                `Status          : ${data.status}\n` +
                `Penerbit        : ${data.issuer}\n` +
                `Berlaku Dari    : ${new Date(data.validFrom).toLocaleString('id-ID')}\n` +
                `Berlaku Hingga  : ${new Date(data.validTo).toLocaleString('id-ID')}`;

        } catch (error) {
            resultsDiv.innerHTML = `Error: ${error.message}`;
        }
    });
}
