# RideSharing DApp

## Deskripsi Proyek
Proyek ini merupakan **Decentralized Application (DApp)** Ride Sharing yang dibangun untuk memenuhi tugas **UAS Advanced Blockchain Programming**.  
Aplikasi memungkinkan pembuatan dan pemesanan perjalanan secara terdesentralisasi menggunakan **Smart Contract Ethereum** dan **Web3.js** sebagai penghubung ke antarmuka frontend.

---

## Fitur Utama
1. **Pembuatan Ride**
   - User memasukkan lokasi pickup, destinasi, dan jarak.
   - Data ride disimpan di blockchain.

2. **Pemilihan Ride**
   - User dapat melihat daftar ride yang tersedia.
   - Ride dipilih berdasarkan index.

3. **Pembayaran Terdesentralisasi**
   - Pembayaran dilakukan langsung ke smart contract.
   - Dana disimpan dan dikelola secara on-chain.

4. **Integrasi Web3**
   - Wallet connection menggunakan provider Ethereum (MetaMask).
   - Interaksi smart contract via Web3.js.

---

## Teknologi yang Digunakan
- **Solidity** – Smart Contract
- **Remix IDE** – Development & Deployment Smart Contract
- **Next.js (App Router)** – Frontend
- **Web3.js** – Blockchain interaction
- **Vercel** – Deployment Frontend
- **GitHub** – Version Control

---

## Struktur Repository
ride-sharing-da-pp-ui/
├── app/ # Next.js App Router (pages, layout, routing)
│ ├── layout.tsx # Root layout
│ └── page.tsx # Main UI page
│
├── components/ # Reusable UI components
│
├── contracts/ # Smart Contracts (Solidity)
│ ├── RideSharing.sol # Main ride sharing contract
│ ├── 1_Storage.sol # Shared storage logic
│ ├── 2_Owner.sol # Ownership & access control
│ └── 3_Ballot.sol # Voting / ballot example
│
├── lib/ # Web3 & smart contract helpers
│ ├── web3.ts # Web3 provider initialization
│ ├── contract.ts # Contract interaction logic
│ └── contractAddress.ts # Deployed contract addresses
│
├── public/ # Static assets
├── styles/ # Styling
├── types/ # TypeScript definitions
│
├── README.md
├── package.json
├── tsconfig.json
└── next.config.mjs

---

## Smart Contract
- Smart contract utama: **RideSharing.sol**
- Dikembangkan dan diuji menggunakan **Remix IDE**
- ABI digunakan pada frontend untuk integrasi Web3.js

---

## Deployment
- **Smart Contract**: Deploy via Remix ke Ethereum testnet
- **Frontend**: Deploy menggunakan Vercel
- Frontend terhubung langsung ke smart contract menggunakan alamat kontrak dan ABI

---

## Cara Menjalankan Lokal
```bash
npm install
npm run dev
Akses di: http://localhost:3000
