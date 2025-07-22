// File: public/js/features/headers.js
// Berisi semua fungsionalitas untuk fitur Security Headers Analyzer.

/**
 * Menghasilkan string HTML untuk antarmuka Security Headers Analyzer.
 * @returns {string} Markup HTML untuk fitur tersebut.
 */
function getHeadersAnalyzerHtml() {
    return `
        <div class="feature-content-card">
            <h2><i class="fas fa-shield-alt"></i> Analisis Security Headers</h2>
            <p>Masukkan URL lengkap (dengan http:// atau https://) untuk memeriksa header keamanannya.</p>
            <form id="headersForm" class="feature-form">
                <input type="url" id="headersUrl" placeholder="https://contoh.com" required>
                <button type="submit"><i class="fas fa-search"></i> Analisis</button>
            </form>
            <div id="headersResults" class="results-area" style="display:none;"></div>
        </div>
    `;
}

/**
 * Mengatur event listener untuk form Security Headers setelah HTML-nya dimuat ke dalam DOM.
 */
function setupHeadersAnalyzerListeners() {
    const form = document.getElementById('headersForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = document.getElementById('headersUrl').value;
        const resultsDiv = document.getElementById('headersResults');
        const token = localStorage.getItem('authToken');

        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menganalisis, mohon tunggu...';

        try {
            const response = await fetch('/api/headers/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ url })
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Gagal mengambil data dari server.');
            }
            
            let headersReport = `<strong>Laporan untuk ${result.data.url}:</strong>\n\n`;
            result.data.headers.forEach(h => {
                const statusIcon = h.status === 'Found' ? '✅' : '❌';
                headersReport += 
                    `${statusIcon} Header: ${h.name}\n` +
                    `   Status: ${h.status}\n` + 
                    (h.value ? `   Value: ${h.value}\n` : '') +
                    (h.recommendation ? `   Rekomendasi: ${h.recommendation}\n\n` : '\n');
            });

            resultsDiv.innerHTML = headersReport;

        } catch (error) {
            resultsDiv.innerHTML = `Error: ${error.message}`;
        }
    });
}
