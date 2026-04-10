# Indonesian Cyber Threat Intelligence Dashboard 🛡️

Sebuah interaktif *dashboard* real-time yang dirancang untuk mengumpulkan dan memonitor ancaman keamanan siber. Didesain secara khusus untuk kebutuhan *Security Operations Centers (SOC)* dan praktisi pertahanan siber, web aplikasi ini menarik data kerentanan langsung dari API NIST NVD secara *live*, memindai *Domain/IP/Hash* menggunakan batas kekuatan VirusTotal, serta memanfaatkan kecerdasan buatan canggih (Groq Llama-3.1) untuk menelaah dan merangkum setiap ancaman tersebut dalam Bahasa Indonesia.

![Built with React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Built with Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

> **Dikembangkan oleh:** Muh Syahrir Hamdani &copy; 2026.  
> Dirumuskan sebagai proyek portofolio kompetitif untuk berlaga di ajang AILeap, GEMASTIK, dan berbagai kompetisi hackathon ternama.

---

## 🌟 Fitur Utama

1. **Live CVE Threat Feed (Lini Masa Ancaman)**
   - Tersinkronisasi secara otomatis dengan *National Vulnerability Database (NVD)* untuk menarik 50-100 publikasi kerentanan keamanan siber (CVE) paling baru.
   - Pengekstrak Universal metrik CVSS level Severity secara cerdas yang mendukung V3.1, V3.0, maupun V2.0.
   - Visualisasi distribusi global melalui grafik donat dan panel statistik.

2. **Universal Threat Scanner (Alat Pindai Taktis)**
   - Bar pencarian terpadu yang menelusuri rekam jejak digital suatu entri jaringan. Masukkan **Alamat IP**, **Domain**, ataupun **File Hash** (MD5/SHA256).
   - Menghasilkan luaran Skoring Risiko visual (*Clean, Suspicious, Malicious*) yang terintegrasi secara fundamental bersama ekosistem VirusTotal.
   
3. **Integrasi Analis AI Groq**
   - Mengimplementasikan model bahasa **Llama-3.1-8b** bersutradara mesin Groq untuk menyajikan ringkasan solusi yang presisi.
   - AI ini bekerja otomatis membongkar dan menerjemahkan jargon teknis rumit ke dalam format mitigasi berdampak, khusus dituliskan dengan bahasa penutur lokal Indonesia.
   
4. **Database Historis & Pencarian Arsip**
   - Penjelajahan repositori arsip tua NVD berbasis kata kunci spesifik *(keywords)* yang dipadupadankan saringan *severity*.
   - Halaman detail yang mendalam per entri kerentanan (`/cve/:id`) berisikan rincian sumber vendor, tautan referensi, hingga paparan *vector breakdown* metrik CVSS lengkap.

5. **Sistem Keamanan Sisi-Klien (*Client-Side Security*)**
   - API Keys sangat disembunyikan menggunakan pelestarian ke *Browser Local Storage* perangkat masing-masing pengguna.
   - Alur transportasi rahasia disalurkan melewati perantara proksi *Next/Vercel Serverless* yang dirancang tahan-*intercept*. Terjamin tidak ada kebocoran header lewat sistem *Payload bridging*.
   - Tracker Global Hit harian otomatis memperbarui level bar demi memandu pemakaian yang tidak melewati wates limit *free-tier*.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

- **Frontend Core:** React.js 18 + Vite
- **Styling & UI:** TailwindCSS, Lucide-React Icons
- **Visualisasi Data:** Recharts
- **Aturan Rute (Routing):** React Router v6
- **Serverless Backend:** Node.js Vercel Functions (`/api/*`)
- **HTTP Client:** Axios
- **Penyedia Eskternal:** NIST NVD API, VirusTotal API v3, Groq API

---

## 🚀 Panduan Memulai (Development Lokal)

### Persyaratan Awal

Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) berdampingan dengan package manager `npm` pada komputer Anda. 

### 1. Kloning & Mengunduh
```bash
git clone https://github.com/your-username/cyber-threat-dashboard.git
cd cyber-threat-dashboard
npm install
```

### 2. Mengkonfigurasi Rahasia Environment (Opsional)
Untuk menjalankan sisi server Vercel di komputer secara lokal yang sukses, buatlah salinan ke file bernama `.env` mengadopsi kerangka dari `.env.example`:

```env
VT_API_KEY=kunci_virustotal_anda
GROQ_API_KEY=kunci_groq_anda
NVD_API_KEY=kunci_nvd_anda
```
*Catatan: Jika dikosongkan, pengunjung atau Anda sendiri secara dinamis dapat mem-pasted Key milik masing-masing secara langsung melalui panel **Settings** di halaman web saat telah berjalan.*

### 3. Menyalakan Server Development
Dikarenakan arsitektur ini memeluk *Vercel Serverless Functions* (`/api`), sangat direkomendasikan menjalankan *build* ini melewati CLI Vercel agar lingkungan perantara sinkron berjalan sebagaimana mestinya.

```bash
npm install -g vercel
vercel dev
```
Buka aplikasi web ini secara lokal di alamat `http://localhost:3000`.

---

## 🌐 Menerbitkan (*Deployment*) ke Skala Vercel

Arsitektur aplikasi dioptimalkan sepenuhnya untuk dirilis langsung melampaui peladen Vercel secara integratif via GitHub.
1. Dorong (*Commit & Push*) direktori kode Anda ke repositori *public/private* di GitHub.
2. Log-in masuk ke [Vercel](https://vercel.com/) dan ketuk tombol **Add New Project**.
3. Muat atau impor repositori yang dituju tadi. Sistem Vercel akan otomatis menyadari fondasi `Vite`.
4. Menyuntikkan rahasia *Environment Variables* Anda (*VT_API_KEY*, dll) ke dalam konfigurasi tapak Vercel Settings sebelum melanjutkan.
5. Klik **Deploy** dan amati hasil akhirnya mengudara!

---

## ⚠️ Pernyataan Sangkalan (Disclaimer)
Panel kontrol dashboard ini benar-benar mencegat lalu-lintas arsip *threat intelligence* data secara langsung dan tajam. Mohon pastikan kepemimpinan *API keys* yang Anda taruh lokal dan diproyeksikan dikelola dalam tanggung jawab penuh. Setiap tindakan eksploitatif yang menyalahgunakan pemindaian ancaman otomatis lewat fasilitas yang terbangun disini merupakan melanggar etika tata layanan dan kebijakan Terms of Service bawaan agen milik NIST dan VirusTotal.

*Dikembangkan absolut demi melengkapi tujuan riset keilmuan pendidikan serta penindakan operasional sekuriti bertahan (*Defensive Security*).*