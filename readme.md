�

�
￼
🛡️ Indonesian Cyber Threat Intelligence Dashboard
Platform pemantau ancaman siber real-time berbasis AI untuk ekosistem digital Indonesia
�
�
�
�
�
�
Muat gambar
Muat gambar
Muat gambar
Muat gambar
Muat gambar
Muat gambar
Dikembangkan oleh Muh Syahrir Hamdani © 2026
Proyek portofolio kompetitif — dirancang untuk AILeap, GEMASTIK, dan hackathon keamanan siber nasional.
�

📋 Daftar Isi
Tentang Proyek
Fitur Utama
Demo & Screenshot
Tech Stack
Arsitektur Sistem
Cara Menjalankan Lokal
Deployment ke Vercel
Struktur Folder
Roadmap
Disclaimer
🔍 Tentang Proyek
ICTID adalah platform threat intelligence open-source pertama yang dirancang khusus untuk ekosistem digital Indonesia. Berbeda dari tool sejenis yang berbahasa Inggris dan berbayar, ICTID menyajikan analisis ancaman siber secara real-time, gratis, dan dalam Bahasa Indonesia — cocok untuk:
🏛️ Tim IT Pemerintah yang memantau infrastruktur .go.id / .id
🔬 Security Researcher dan Bug Hunter lokal
🎓 Pelajar dan praktisi keamanan siber Indonesia
🏢 SOC Analyst yang butuh tool ringan tanpa lisensi mahal
Mengapa ICTID?
Fitur
ICTID
Tool Komersial
Bahasa Indonesia
✅
❌
Gratis / Open Source
✅
❌
Fokus infrastruktur .id
✅
❌
AI Analysis real-time
✅
Terbatas
Deploy mandiri
✅
❌
✨ Fitur Utama
1. 📊 Live CVE Threat Feed
Sinkronisasi otomatis dengan NIST National Vulnerability Database (NVD) — menampilkan 50–100 CVE terbaru setiap hari
Ekstraktor CVSS Score universal yang mendukung V3.1, V3.0, dan V2.0
Visualisasi distribusi severity melalui grafik donat dan panel statistik interaktif
Filter berdasarkan tingkat keparahan: Critical, High, Medium, Low
2. 🔍 Universal Threat Scanner
Satu input bar untuk memindai IP Address, Domain/URL, maupun File Hash (MD5/SHA256)
Hasil scoring risiko visual: CLEAN 🟢 / SUSPICIOUS 🟡 / MALICIOUS 🔴
Data ISP, geolokasi negara, dan reputasi jaringan langsung dari ekosistem VirusTotal
API usage tracker harian agar tidak melewati batas free-tier
3. 🤖 AI Analysis via Groq
Menggunakan model Llama-3.1-8b di atas mesin inferensi Groq (LPU) — respons sub-detik
Secara otomatis menerjemahkan jargon teknis CVE dan threat data ke ringkasan mitigasi Bahasa Indonesia
Analisis kontekstual yang menyesuaikan output berdasarkan tipe ancaman (CVE vs IP vs Hash)
4. 🗄️ Database & Pencarian Arsip
Penelusuran arsip NVD historis berbasis keyword dan filter severity
Halaman detail per CVE (/cve/:id) dengan breakdown lengkap: CVSS vector, referensi vendor, dan deskripsi teknis
5. 🔒 Keamanan Sisi Klien
API Keys disimpan di Browser Local Storage perangkat masing-masing pengguna — tidak pernah dikirim ke server pihak ketiga
Seluruh request ke API eksternal diproksikan melalui Vercel Serverless Functions (/api/*) untuk mencegah kebocoran header
Tracker hit harian otomatis memperbarui progress bar pemakaian
🖼️ Demo & Screenshot
🔗 Live Demo
👉 https://indonesian-cyber-threat-intelligenc.vercel.app/
Universal Threat Scanner
Scan IP 8.8.8.8 (Google DNS) — terdeteksi CLEAN dengan reputasi tinggi, ISP Google LLC, lokasi US.
Sidebar Navigasi
Navigasi 5 halaman: Dashboard · Threat Feed · Scanner · Database · Settings — dengan live API usage tracker di bagian bawah.
Screenshot lengkap dapat dilihat langsung di Live Demo
🛠️ Tech Stack
Layer
Teknologi
Frontend Core
React.js 18 + Vite
Styling & UI
TailwindCSS + Lucide React Icons
Visualisasi Data
Recharts
Routing
React Router v6
Serverless Backend
Node.js Vercel Functions (/api/*)
HTTP Client
Axios
CVE Data
NIST NVD API v2.0
Threat Reputation
VirusTotal API v3
AI Analysis
Groq API (Llama-3.1-8b)
Deployment
Vercel
🏗️ Arsitektur Sistem
┌─────────────────────────────────────────────┐
│              ICTID Frontend (React)          │
│  Dashboard │ Threat Feed │ Scanner │ DB      │
└────────────────────┬────────────────────────┘
                     │ HTTP Request
┌────────────────────▼────────────────────────┐
│         Vercel Serverless Functions          │
│   /api/nvd   /api/virustotal   /api/groq     │
└──────┬──────────────┬──────────────┬────────┘
       │              │              │
┌──────▼──────┐ ┌─────▼──────┐ ┌───▼────────┐
│  NIST NVD   │ │ VirusTotal │ │  Groq LPU  │
│  CVE Data   │ │ Reputation │ │ Llama-3.1  │
└─────────────┘ └────────────┘ └────────────┘
🚀 Cara Menjalankan Lokal
Prasyarat
Pastikan sudah terinstall: Node.js v18+ dan npm
1. Clone Repositori
git clone https://github.com/arill2/Indonesian-Cyber-Threat-Intelligence-Dashboard.git
cd Indonesian-Cyber-Threat-Intelligence-Dashboard
npm install
2. Konfigurasi Environment Variables
Buat file .env di root project:
VT_API_KEY=your_virustotal_api_key
GROQ_API_KEY=your_groq_api_key
NVD_API_KEY=your_nvd_api_key
💡 Catatan: Jika tidak ingin mengatur .env, API key juga bisa dimasukkan langsung melalui halaman Settings di dalam aplikasi. Key akan tersimpan aman di Browser Local Storage.
3. Jalankan dengan Vercel CLI (Direkomendasikan)
npm install -g vercel
vercel dev
Buka di browser: http://localhost:3000
4. Atau Jalankan dengan Vite (Frontend Only)
npm run dev
⚠️ Mode ini tidak menjalankan Serverless Functions. Fitur Scanner dan AI Analysis tidak akan berfungsi tanpa Vercel CLI.
🌐 Deployment ke Vercel
Push kode ke repositori GitHub
Login ke vercel.com → Add New Project → Import repo ini
Vercel akan otomatis mendeteksi konfigurasi Vite
Tambahkan Environment Variables di Vercel Settings:
VT_API_KEY
GROQ_API_KEY
NVD_API_KEY
Klik Deploy 🚀
📁 Struktur Folder
├── api/                  # Vercel Serverless Functions (proxy ke API eksternal)
│   ├── nvd.js
│   ├── virustotal.js
│   └── groq.js
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Dashboard, ThreatFeed, Scanner, Database, Settings
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Helper functions
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
🗺️ Roadmap
[x] Live CVE Threat Feed dari NVD
[x] Universal Threat Scanner (IP/Domain/Hash)
[x] AI Analysis dalam Bahasa Indonesia via Groq
[x] Database pencarian arsip CVE historis
[x] API Usage Tracker di sidebar
[ ] Integrasi feed dari BSSN (Badan Siber dan Sandi Negara)
[ ] Alert notifikasi CVE baru untuk teknologi populer di Indonesia (WordPress, Mikrotik)
[ ] Export laporan ancaman ke PDF
[ ] Threat history timeline untuk domain .go.id
[ ] Support multi-bahasa (EN/ID toggle)
⚠️ Disclaimer
Dashboard ini mengakses data threat intelligence secara langsung dari API pihak ketiga. Pastikan API key yang digunakan dikelola dengan tanggung jawab penuh. Setiap penyalahgunaan fasilitas pemindaian ancaman otomatis melanggar Terms of Service NIST dan VirusTotal.
Dikembangkan sepenuhnya untuk tujuan riset akademik dan defensive security.
�

⭐ Jika proyek ini bermanfaat, berikan star di GitHub!
Dibuat dengan ❤️ oleh Muh Syahrir Hamdani · Indonesia 🇮🇩
�