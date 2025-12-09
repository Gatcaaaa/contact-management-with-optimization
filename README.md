# Contact Management with Optimization

Aplikasi manajemen kontak Full Stack yang dirancang untuk performa tinggi menggunakan strategi **Cache-First** dan **Background Synchronization**.

Aplikasi ini mendemonstrasikan bagaimana menangani data dalam jumlah besar dengan UI yang tetap responsif, menggunakan **Browser Cache API** secara manual (tanpa Service Worker PWA standar) dan **Server-Side Pagination**.

## Fitur Utama

- **Cache-First Strategy**: Data dimuat instan dari Cache Storage browser saat aplikasi dibuka.
- **Background Synchronization**: Sinkronisasi data dengan API pihak ketiga (simulasi) berjalan di _background_ tanpa memblokir UI.
- **Sequential Data Processing**: Backend memproses sinkronisasi data (Create/Update) secara berurutan (_sequential loop_) untuk menjaga kestabilan Connection Pool database.
- **Server-Side Pagination**: Menangani load data yang efisien menggunakan pagination di level query database.
- **Real-time Status**: Indikator UI untuk status sinkronisasi ("Syncing data...").
- **Manual Cache API**: Implementasi `window.caches` manual di dalam Pinia Store.

## Tech Stack

### Frontend

- **Framework**: Vue 3 + Vite
- **Language**: TypeScript
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

### Backend

- **Runtime**: Node.js (Express)
- **Language**: TypeScript (`tsx` for dev)
- **ORM**: Prisma
- **Database**: MySQL / MariaDB

---

## Prerequisites

Sebelum memulai, pastikan kamu sudah menginstall:

1.  [Node.js](https://nodejs.org/) (v18 atau lebih baru)
2.  MySQL atau MariaDB (via XAMPP atau Docker)

---

## Installation & Setup

Proyek ini terdiri dari dua folder utama: `frontend` (root) dan `backend`. Kamu perlu menjalankan keduanya secara bersamaan.

### 1. Setup Backend & Database

Masuk ke folder backend dan install dependencies:

```bash
cd backend
npm install
```

Untuk setup Prisma ikuti dokumentasi dibawah ini

```
https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/mysql
```
