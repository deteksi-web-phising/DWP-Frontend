# Product Requirement Document (PRD)
## Web Analisis & Deteksi Website Phishing Berbasis Machine Learning

- **Nama Dokumen**: Product Requirement Document (PRD) – Sistem Deteksi Phishing Web
- **Versi**: 1.0 (High-Level / Ringkas)
- **Status**: Disetujui
- **Pengembang / Penulis**: Muhammad Fajrul
- **Mata Kuliah**: Workshop Mesin Pembelajaran (PENS)
- **Terakhir Diperbarui**: 2026-11-18

---

## 1. Ringkasan Eksekutif & Latar Belakang (Executive Summary)

### 1.1 Latar Belakang
Serangan siber berbasis *phishing* terus berkembang pesat dengan memanfaatkan manipulasi alamat URL, sertifikat SSL palsu, dan elemen web tipuan untuk mencuri data sensitif pengguna. Pengguna awam sering kali kesulitan membedakan situs resmi dan situs tiruan berbahaya. Di sisi lain, analis keamanan dan mahasiswa membutuhkan sarana terintegrasi untuk mengeksplorasi karakteristik data (*features*) dari serangan phishing serta menguji keandalan berbagai algoritma *Machine Learning*.

### 1.2 Tujuan Produk
Membangun platform aplikasi web analitik cerdas yang menyediakan:
1. **Eksplorasi Data Interaktif (EDA)** terhadap karakteristik fitur website phishing.
2. **Benchmark & Komparasi Kinerja Multi-Model** (Supervised Classification & Unsupervised Clustering).
3. **Mesin Deteksi URL Cepat** berbasis *Single URL Feature Extractor* dengan dukungan *fallback manual* 30 fitur lengkap.

### 1.3 Nilai Manfaat
- **Bagi Pengguna Umum**: Memverifikasi keamanan sebuah URL secara instan sebelum melakukan transaksi atau memasukkan kredensial.
- **Bagi Analis / Peneliti**: Menyediakan transparansi model, perbandingan metrik evaluasi (*Confusion Matrix*, *F1-Score*, *Silhouette Score*), serta analisis korelasi fitur.

---

## 2. Profil Pengguna (Target Personas)

| Persona | Peran | Kebutuhan Utama |
| :--- | :--- | :--- |
| **Security Analyst / Peneliti** | Analis Keamanan Siber, Peneliti ML, Mahasiswa | Melihat visualisasi distribusi data, korelasi fitur, membandingkan performa antar-algoritma ML, serta memeriksa bobot pengaruh fitur (*feature importance*). |
| **Pengguna Umum (Netizen / Guest)** | Pengguna Internet Harian | Memasukkan link URL mencurigakan ke form web dan mendapatkan indikasi keamanan (Aman vs Phishing) beserta tingkat keyakinan sistem secara cepat dan mudah dimengerti. |

---

## 3. Cakupan Fitur Utama (Feature Scope)

Sistem dirancang dalam format **High-Level PRD** yang mencakup 3 modul inti:

### 3.1 Modul 1: Exploratory Data Analysis (EDA) & Visualisasi Dataset
- **Distribusi Kelas**: Visualisasi proporsi website sah (*Legitimate: -1*) vs website penipuan (*Phishing: 1*).
- **Statistik Deskriptif**: Ringkasan frekuensi nilai pada 30 fitur URL.
- **Matriks Korelasi (Heatmap)**: Analisis relasi keterikatan antar fitur URL (misalnya hubungan antara ketiadaan SSL dan keberadaan subdomain mencurigakan).
- **Visualisasi Fitur Kunci**: Grafik batang/radar untuk fitur-fitur kritis seperti `having_IP_Address`, `SSLfinal_State`, `URL_Length`, dan `Prefix_Suffix`.

### 3.2 Modul 2: Komparasi Kinerja Multi-Model (Model Benchmark)
- **Pelatihan & Komparasi 4 Algoritma ML**:
  - **Decision Tree**: Model pohon keputusan klasik yang mudah diinterpretasikan.
  - **Random Forest**: Ensemble model berbasis banyak pohon untuk akurasi dan stabilitas tinggi.
  - **k-Nearest Neighbors (k-NN)**: Model klasifikasi berbasis jarak tetangga terdekat.
  - **K-Means Clustering**: Analisis pengelompokan pola data secara tanpa pengawasan (*unsupervised*).
- **Metrik Evaluasi Komparatif**:
  - Klasifikasi: *Accuracy*, *Precision*, *Recall*, *F1-Score*, dan visualisasi *Confusion Matrix*.
  - Clustering: *Silhouette Score* dan visualisasi sebaran klaster 2D (PCA).
- **Pemilihan Model Aktif**: Pengguna dapat memilih model mana yang dijadikan model referensi default untuk prediksi langsung.

### 3.3 Modul 3: Deteksi URL Interaktif (Inference Engine)
- **Single URL Extractor**:
  - Input tunggal: Pengguna cukup menempelkan string URL (misal: `https://secure-login-bank.xyz`).
  - Sistem backend melakukan ekstraksi otomatis terhadap fitur-fitur URL struktural (panjang URL, penggunaan IP, tanda `@`, keberadaan SSL, dll.).
- **Fallback Manual (30 Fitur Lengkap)**:
  - Tersedia panel inspeksi dengan 30 fitur lengkap yang terisi otomatis hasil ekstraksi.
  - Pengguna/analis dapat mengubah atau menyesuaikan nilai fitur secara manual sebelum menjalankan inferensi ulang.
- **Hasil Deteksi & Visualisasi**:
  - Indikator Visual: **Aman (Hijau / Legitimate)** atau **Bahaya (Merah / Phishing)**.
  - Skor Probabilitas/Keyakinan (*Confidence Score* dalam %).
  - *Highlight* faktor risiko utama yang memicu keputusan model.

---

## 4. Spesifikasi Dataset & Rekayasa Fitur

### 4.1 Sumber Data
- **File Dataset**: `projek/Dataset Phising Website.csv` (Sumber: Kaggle `nitsey/dataset-phising-website`).
- **Dimensi Data**: 22.110 baris rekaman data dengan 32 kolom (1 ID indeks, 30 fitur prediktif, 1 label target).

### 4.2 Struktur Atribut Dataset (Mode Lengkap: 30 Fitur)

| No | Kategori Fitur | Nama Atribut | Nilai Valid | Deskripsi Singkat |
| :---: | :--- | :--- | :---: | :--- |
| 1 | Address Bar | `having_IP_Address` | `{1, -1}` | URL menggunakan alamat IP alih-alih domain. |
| 2 | Address Bar | `URL_Length` | `{1, 0, -1}` | Panjang karakter URL (panjang/sedang/pendek). |
| 3 | Address Bar | `Shortining_Service` | `{1, -1}` | Penggunaan pemendek URL (cth: bit.ly, tinyurl). |
| 4 | Address Bar | `having_At_Symbol` | `{1, -1}` | URL mengandung simbol `@`. |
| 5 | Address Bar | `double_slash_redirecting`| `{1, -1}` | Penggunaan redireksi `//` tidak wajar setelah protokol. |
| 6 | Address Bar | `Prefix_Suffix` | `{1, -1}` | Terdapat karakter `-` pemisah nama domain. |
| 7 | Address Bar | `having_Sub_Domain` | `{1, 0, -1}` | Kompleksitas jumlah subdomain. |
| 8 | Address Bar | `SSLfinal_State` | `{-1, 0, 1}` | Keabsahan dan penerbit sertifikat SSL/HTTPS. |
| 9 | Address Bar | `Domain_registeration_length` | `{1, -1}` | Durasi masa aktif pendaftaran domain. |
| 10 | Address Bar | `Favicon` | `{1, -1}` | Favicon dimuat dari domain eksternal. |
| 11 | Address Bar | `port` | `{1, -1}` | Akses port terbuka non-standar (cth: 8080, 21). |
| 12 | Address Bar | `HTTPS_token` | `{1, -1}` | Kata 'https' dimasukkan dalam nama domain. |
| 13 | Abnormal Request | `Request_URL` | `{1, -1}` | Objek eksternal yang di-load dari luar domain utama. |
| 14 | Abnormal Request | `URL_of_Anchor` | `{1, 0, -1}` | Persentase tag `<a>` yang mengarah ke luar situs. |
| 15 | Abnormal Request | `Links_in_tags` | `{1, 0, -1}` | Persentase link pada tag `<meta>`, `<script>`, `<link>`. |
| 16 | Abnormal Request | `SFH` (Server Form Handler) | `{1, 0, -1}` | Form action kosong, `about:blank`, atau domain lain. |
| 17 | Abnormal Request | `Submitting_to_email` | `{1, -1}` | Fungsi pengiriman data formulir langsung ke email (`mailto:`). |
| 18 | Abnormal Request | `Abnormal_URL` | `{1, -1}` | Host URL tidak sesuai dengan identitas pemilik situs. |
| 19 | HTML & JavaScript | `Redirect` | `{0, 1}` | Jumlah lompatan pengalihan (*redirection*). |
| 20 | HTML & JavaScript | `on_mouseover` | `{1, -1}` | Perubahan status bar palsu via event JavaScript. |
| 21 | HTML & JavaScript | `RightClick` | `{1, -1}` | Penonaktifan fungsi klik kanan halaman. |
| 22 | HTML & JavaScript | `popUpWidnow` | `{1, -1}` | Pop-up palsu untuk meminta kredensial. |
| 23 | HTML & JavaScript | `Iframe` | `{1, -1}` | Penggunaan iframe tersembunyi tanpa bingkai. |
| 24 | Domain Features | `age_of_domain` | `{1, -1}` | Umur domain (baru dibuat vs sudah berusia lama). |
| 25 | Domain Features | `DNSRecord` | `{1, -1}` | Catatan DNS valid atau tidak ditemukan di WHOIS. |
| 26 | Domain Features | `web_traffic` | `{1, 0, -1}` | Peringkat trafik web (berdasarkan Alexa/Similarweb). |
| 27 | Domain Features | `Page_Rank` | `{1, -1}` | Nilai PageRank Google. |
| 28 | Domain Features | `Google_Index` | `{1, -1}` | Situs terindeks oleh mesin pencari Google. |
| 29 | Domain Features | `Links_pointing_to_page` | `{1, 0, -1}` | Jumlah tautan balik (*backlinks*) yang mengarah ke halaman. |
| 30 | Domain Features | `Statistical_report` | `{1, -1}` | Domain masuk dalam daftar hitam PhishTank/StopBadware. |
| **Target** | **Ground Truth** | `Result` | `{-1, 1}` | **-1 = Legitimate (Aman)**, **1 = Phishing (Berbahaya)**. |

---

## 5. Arsitektur Teknis & Spesifikasi Antarmuka

### 5.1 Arsitektur Sistem (Decoupled Client-Server)
Sistem menggunakan pola arsitektur terpisah untuk menjamin modularitas dan performa tinggi:
1. **Frontend**: Single Page Application (SPA) berbasis **React (Vite)** + **Tailwind CSS** + **Lucide Icons** + **Recharts / Chart.js**.
2. **Backend**: RESTful API berbasis **FastAPI (Python 3.10+)** yang menangani logika pemrosesan data, ekstraksi fitur URL, dan *model serving* menggunakan **Scikit-Learn** serta **Joblib**.
3. **Protokol Komunikasi**: HTTP REST API dengan payload bertipe **JSON** standar.

```
+-------------------------------------------------------------------+
|                           FRONTEND                                |
|             React SPA (Vite + Tailwind + Recharts)                |
+---------------------------------+---------------------------------+
                                  |
                           REST API (JSON)
                                  |
+---------------------------------v---------------------------------+
|                           BACKEND                                 |
|                   FastAPI (Python REST Server)                    |
+-------------------+-------------------------------+---------------+
                    |                               |
          +---------v-----------+         +---------v-----------+
          |   URL Extractor     |         |   ML Inference Engine |
          |   (Regex & Parsing) |         | (Decision Tree, k-NN|
          +---------------------+         |  Random Forest,     |
                                          |  K-Means Clustering)|
                                          +---------------------+
```

### 5.2 Spesifikasi Endpoint API (FastAPI)

1. **`POST /api/v1/extract-url`**
   - **Tujuan**: Menerima input URL tunggal, melakukan parsing & ekstraksi 30 fitur secara otomatis.
   - **Request**: `{"url": "https://example-phish.com"}`
   - **Response**: `{"url": "...", "features": { "having_IP_Address": -1, ... }}`

2. **`POST /api/v1/predict`**
   - **Tujuan**: Memprediksi status URL berdasarkan 30 parameter fitur.
   - **Request**: `{"model_name": "random_forest", "features": { ...30 fitur... }}`
   - **Response**: `{"prediction": "Phishing", "label": 1, "confidence": 0.94, "risk_factors": ["SSLfinal_State", "URL_Length"]}`

3. **`GET /api/v1/models/benchmark`**
   - **Tujuan**: Mengambil metrik kinerja hasil pelatihan dari semua algoritma (Decision Tree, k-NN, Random Forest, K-Means).
   - **Response**: Metrik evaluasi lengkap (*accuracy, precision, recall, f1_score, confusion_matrix, silhouette_score*).

4. **`GET /api/v1/dataset/eda-summary`**
   - **Tujuan**: Mengambil ringkasan statistik dataset untuk visualisasi dashboard EDA di React.
   - **Response**: Distribusi kelas target, statistik frekuensi fitur, dan matriks korelasi.

---

## 6. Kebutuhan Non-Fungsional (Non-Functional Requirements)

- **Performa (Latency & Throughput)**:
  - Waktu respon inferensi prediksi API `< 300 ms`.
  - Waktu muat awal halaman React SPA `< 1,5 detik`.
- **Keamanan (Security)**:
  - Validasi ketat tipe data masukan menggunakan *Pydantic Schemas* di FastAPI.
  - Pembatasan domain dengan kebijakan *Cross-Origin Resource Sharing* (CORS).
  - Sanitasi karakter input URL guna mencegah kerentanan injection.
- **Keandalan & Penanganan Error (Reliability)**:
  - Penanganan error komprehensif pada proses ekstraksi URL (misal: penanganan timeout jika situs tidak merespons atau domain tidak valid).
- **Kompatibilitas & Portabilitas**:
  - Tampilan web sepenuhnya responsif (desktop, tablet, dan smartphone).
  - Backend dan frontend dapat dijalankan secara terisolasi via Docker atau virtual environment Python & Node.js lokal.

---

## 7. Rencana Rilis & Milestone Proyek (Roadmap 5 Minggu)

```
Minggu 1: Preprocessing Dataset & Eksplorasi Data (Dataset Phising Website.csv)
Minggu 2: Pelatihan, Validasi, & Serialisasi Model ML (Decision Tree, k-NN, Random Forest, K-Means)
Minggu 3: Pengembangan Backend REST API (FastAPI) & Pembuatan Modul URL Extractor
Minggu 4: Pembangunan Antarmuka Frontend (React + Vite + Tailwind + Chart.js/Recharts)
Minggu 5: Integrasi Client-Server, System Testing, Pembuatan Laporan Akhir & Presentasi
```

---

## 8. Kriteria Penerimaan Produk (Acceptance Criteria Ringkas)

1. Dashboard EDA berhasil menampilkan visualisasi grafik interaktif distribusi kelas target dan korelasi fitur.
2. Tab Benchmark menampilkan tabel perbandingan dan grafik metrik 4 algoritma ML secara akurat.
3. Form deteksi URL mampu menerima alamat web, mengisi 30 fitur ke panel, serta menghasilkan prediksi aman/phishing dalam hitungan detik.
4. Nilai akurasi model klasifikasi terbaik (Random Forest) di atas data uji mencapai target minimal **≥ 88%**.
