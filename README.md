# Next.js Dashboard MyCareer - Dokumentasi API (v1.0)

## Ringkasan

Dokumentasi ini memberikan gambaran lengkap dan terorganisir mengenai endpoint API untuk proyek Dashboard MyCareer berbasis Next.js. Dokumentasi ini mencakup autentikasi, otorisasi, dan batasan fungsional per peran.

---

## Detail Fitur Berdasarkan Peran

### 1. **Employee (Karyawan)**

- **Melihat dan memperbarui profil pribadi**
- **Mengisi kuesioner dan penilaian diri**
- **Melihat riwayat karier, pengalaman proyek, panitia, organisasi, GKM**
- **Menentukan preferensi karier jangka pendek & panjang**
- **Menyatakan minat terhadap lowongan yang tersedia**
- **Melihat pelatihan dan mentor yang diminati**
- **Mengakses form pengembangan diri atau penilaian tahunan**

### 2. **HR (Sumber Daya Manusia)**

- **Mengelola data karyawan secara masif atau individual (CRUD)**
- **Mengunggah dan memperbarui data supervisor**
- **Membuat dan mengelola akun HR/HD**
- **Mengakses analisis dasbor (usia, masa kerja, form, penilaian)**
- **Mengelola form, pertanyaan, dan jawaban karyawan**
- **Melihat dan menyaring minat karyawan terhadap lowongan**
- **Menentukan jalur karier yang tersedia**
- **Melihat semua data referensi seperti cabang, departemen, posisi, level**
- **Mengedit profil karyawan dan memperbarui histori karier mereka**

### 3. **HD (Human Development)**

- **Mengakses fitur analitik dan dasbor pengembangan SDM**
- **Melihat hasil penilaian dan kuesioner**
- **Mengakses preferensi dan rencana karier seluruh karyawan**
- **Menentukan kebijakan rotasi, pelatihan, dan promosi berdasarkan data**
- **Melihat hasil agregat pengembangan kompetensi**

---

## Daftar Isi

1. [API Autentikasi](/api/auth)
2. [API Admin](/api/admin)
3. [API Karyawan](/api/employees)
4. [API Kuesioner](/api/forms)
5. [API Penilaian](/api/questionnaires)
6. [API Data Master](/api/master-data)
7. [API Jalur Karier](/api/career-paths)
8. [API Lowongan Pekerjaan](/api/job-vacancies)
9. [Dokumentasi Fitur Berdasarkan Peran](#detail-fitur-berdasarkan-peran)

---

## 1. API Autentikasi

| Endpoint                  | Metode   | Fungsi                                                | Peran |
| ------------------------- | -------- | ----------------------------------------------------- | ----- |
| `/api/auth/[...nextauth]` | GET/POST | Menangani login, logout, dan sesi melalui NextAuth.js | Semua |

---

## 2. API Admin

### 2.1 Manajemen Karyawan

| Endpoint                           | Metode | Fungsi                                      | Peran | Catatan                           |
| ---------------------------------- | ------ | ------------------------------------------- | ----- | --------------------------------- |
| `/api/admin/employees`             | GET    | Menampilkan semua karyawan                  | hr    | Akses difilter berdasarkan cabang |
| `/api/admin/employees`             | POST   | Unggah/buat data karyawan massal dari Excel | hr    | Dibatasi berdasarkan cabang/N001  |
| `/api/admin/employees/:employeeId` | GET    | Detail karyawan                             | hr    | Dibatasi ke cabang kecuali N001   |
| `/api/admin/employees/:employeeId` | POST   | Buat satu karyawan                          | hr    | Dibatasi ke cabang kecuali N001   |
| `/api/admin/employees/:employeeId` | PUT    | Perbarui detail karyawan & histori karier   | hr    | Dibatasi ke cabang kecuali N001   |
| `/api/admin/employees/:employeeId` | DELETE | Hapus karyawan & seluruh datanya            | hr    | Dibatasi ke cabang kecuali N001   |

### 2.2 Manajemen Akun HR/HD

| Endpoint                    | Metode | Fungsi                   | Peran |
| --------------------------- | ------ | ------------------------ | ----- |
| `/api/admin/hr-hd-accounts` | POST   | Buat akun pengguna HR/HD | hr    |

### 2.3 Dashboard Admin

_(Beberapa endpoint untuk analisis: usia, skor karyawan terbaik, LoS, status form, dll.)_

Semua route dalam `/api/admin/dashboard/*` dibatasi untuk `hr` dan `hd`, dengan filter cabang/departemen/level.

### 2.4 Manajemen Minat Lowongan

| Endpoint                                 | Metode | Fungsi                                 | Peran |
| ---------------------------------------- | ------ | -------------------------------------- | ----- |
| `/api/admin/job-interests`               | POST   | (Placeholder, masih ditinjau)          | hr    |
| `/api/admin/job-interests/:jobVacancyId` | GET    | Lihat minat karyawan terhadap lowongan | hr    |

### 2.5 Manajemen Supervisor

| Endpoint                               | Metode | Fungsi                              | Peran            |
| -------------------------------------- | ------ | ----------------------------------- | ---------------- |
| `/api/admin/supervisors`               | GET    | Lihat semua supervisor              | hr               |
| `/api/admin/supervisors`               | POST   | Unggah massal supervisor dari Excel | hr (khusus N001) |
| `/api/admin/supervisors/:supervisorId` | POST   | Tambah satu supervisor              | hr               |

### 2.6 Edit Profil Karyawan (oleh Admin)

| Endpoint                                        | Metode | Fungsi                                | Peran |
| ----------------------------------------------- | ------ | ------------------------------------- | ----- |
| `/api/admin/employee-profile-edits/:employeeId` | PUT    | Edit profil + perbarui riwayat karier | hr    |

---

## 3. API Karyawan

_(Diakses oleh employee, hr, atau hd tergantung endpoint)_

Endpoint utama:

- Ringkasan profil: `/dashboard`
- Riwayat karier: `/career-history`
- Riwayat organisasi/panitia/proyek/GKM
- Rencana dan preferensi karier
- Mentor dan pelatihan yang diminati

Semua parameter dinamis (`:employeeId`, `:historyId`, dll.) harus konsisten dengan struktur folder route.

---

## 4. API Kuesioner & Penilaian

Digunakan untuk:

- Pembuatan dan pengelolaan form (HR)
- Pengisian dan pengumpulan jawaban (Karyawan)
- Hasil agregasi (HR)

Endpoint utama:

- `/api/forms`
- `/api/questionnaires`
- `/api/questionnaire-results`
- `/api/answers`
- `/api/assessments`
- `/api/questions`
- `/api/involved-positions`, `/departments`, `/levels`

---

## 5. API Data Master

Endpoint referensi:

| Endpoint                       | Metode          | Fungsi                | Peran    |
| ------------------------------ | --------------- | --------------------- | -------- |
| `/api/master-data/branches`    | GET             | Ambil data cabang     | semua    |
| `/api/master-data/departments` | GET             | Ambil data departemen | semua    |
| `/api/master-data/levels`      | GET             | Ambil data level      | semua    |
| `/api/master-data/positions`   | GET/POST/DELETE | CRUD posisi jabatan   | semua/hr |

---

## 6. API Jalur Karier

| Endpoint            | Metode          | Fungsi                        | Peran    |
| ------------------- | --------------- | ----------------------------- | -------- |
| `/api/career-paths` | GET/POST/DELETE | Kelola referensi jalur karier | semua/hr |

---

## 7. API Lowongan Pekerjaan

| Endpoint                        | Metode | Fungsi                   | Peran |
| ------------------------------- | ------ | ------------------------ | ----- |
| `/api/job-vacancies`            | GET    | Daftar publik lowongan   | semua |
| `/api/job-vacancies/:vacancyId` | PUT    | Perbarui detail lowongan | hr    |

---
