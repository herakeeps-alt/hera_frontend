<div align="center">

<img src="https://herakeeps.circularityspace.com/favicon.ico" width="64" height="64" alt="Hera Keeps" />

# Hera Keeps

### Transparent. Immutable. Accountable.

**Blockchain-based education funding transparency for Kenya — and every country where public funds go missing.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-herakeeps.circularityspace.com-gold?style=for-the-badge)](https://herakeeps.circularityspace.com/)
[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-L2%20Ready-627EEA?style=for-the-badge&logo=ethereum)](https://ethereum.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## The Problem

Every year, **billions of shillings** allocated to Kenyan public schools disappear between government disbursement and classroom delivery. Teachers go unpaid. Textbooks never arrive. School meals programs run dry mid-term — while receipts show full disbursement.

The root cause is structural: **no single source of truth**. Funds flow through too many hands, across too many paper ledgers, with no mechanism for a parent, auditor, or journalist to verify what was sent, what arrived, and what was spent.

> *"Kenya loses an estimated KES 608 billion annually to corruption — a significant portion tied to public sector procurement and fund mismanagement."*
> — Controller of Budget, Annual Report 2023

---

## The Solution

**Hera Keeps** creates an immutable, auditable ledger of education fund flows — from government allocation through to school-level expenditure — anchored on the Ethereum blockchain with Layer-2 support for low transaction costs.

Every fund disbursement, every receipt, every document hash is recorded on-chain. Anyone with a link can verify. Nothing can be quietly edited.

```
Ministry allocates → Tx recorded on-chain → School receives → Receipt uploaded
      ↓                      ↓                     ↓                ↓
   Immutable hash       Block number           IPFS document     Hash verified
```

---

## ✨ Live Demo

**→ [herakeeps.circularityspace.com](https://herakeeps.circularityspace.com/)**

Log in with any of these demo accounts to explore the platform from each stakeholder's perspective:

| Role | Email | Password | What they see |
|------|-------|----------|---------------|
| 🏛️ **Ministry** | `grace.muthoni@education.go.ke` | `ministry2026` | National allocation dashboard, all schools, flagged anomalies |
| 🌍 **Donor / NGO** | `admin@greenfuture.org` | `donor2026` | Their fund disbursements, impact tracking, document verification |
| 🏫 **School Admin** | `mary.wanjiku@kibera.sc.ke` | `school2026` | Their school's funds, uploaded receipts, spending records |
| 👨‍👩‍👧 **Parent** | `john.kamau@gmail.com` | `parent2026` | Their child's school funding and expenditure — read only |
| 🔍 **Auditor** | `auditor@oagkenya.go.ke` | `audit2026` | Flagged transactions, hash mismatches, full audit trail |

---

## Key Features

- **Multi-role dashboard** — five distinct interfaces for Ministry, Donors, School Admins, Parents, and Auditors, each with role-appropriate data and actions
- **Immutable transaction ledger** — every fund movement recorded with Ethereum tx hash and block number
- **Document integrity verification** — receipts and invoices stored on IPFS with on-chain hash anchoring; mismatches are automatically flagged
- **Anomaly detection** — transactions and funds with integrity mismatches surface automatically to auditors and ministry officials
- **Real-time fund tracking** — allocation → disbursement → expenditure at school level, with utilization rates
- **6-county coverage** in the current dataset: Nairobi, Kisumu, Kiambu, Mombasa, Nakuru and more
- **Layer-2 ready** — architecture supports Optimism/Arbitrum/Polygon for minimal gas costs at scale

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (This repo)               │
│         Next.js 15 · TypeScript · Tailwind CSS       │
│   Role-based views · JWT auth · IPFS doc preview     │
└─────────────────────┬───────────────────────────────┘
                      │ REST API
┌─────────────────────▼───────────────────────────────┐
│                  Backend API                         │
│         FastAPI · PostgreSQL · SQLAlchemy            │
│      github.com/your-org/hera-keeps-api              │
└─────────────────────┬───────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
┌───────────────┐         ┌─────────────────┐
│   Ethereum    │         │      IPFS        │
│  Smart        │         │  Document store  │
│  Contracts    │         │  (via Web3.Storage)│
│  (L2 ready)   │         │                 │
└───────────────┘         └─────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | FastAPI, PostgreSQL, SQLAlchemy (async) |
| Auth | JWT (access + refresh tokens), bcrypt |
| Blockchain | Ethereum, Solidity, ethers.js (L2: Optimism/Arbitrum) |
| Documents | IPFS via Web3.Storage, on-chain hash verification |
| Infrastructure | Ubuntu Server, Nginx, systemd, Cloudflare |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see [hera-keeps-api](https://github.com/your-org/hera-keeps-api))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/hera-keeps.git
cd hera-keeps

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Run in Development

```bash
npm run dev
# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## Backend Setup

The API lives in a separate repository. To run the full stack locally:

```bash
# Clone the API
git clone https://github.com/your-org/hera-keeps-api.git
cd hera-keeps-api

# Copy environment config
cp .env.example .env

# Start with Docker
docker compose up --build

# Seed the database
docker compose exec api python scripts/seed.py

# API available at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

---

## Roadmap

### ✅ Current (Prototype)
- Multi-role authentication and dashboards
- Fund tracking and transaction ledger
- IPFS document storage with hash verification
- Anomaly detection and flagging
- REST API with full CRUD

### 🔨 In Development
- Ethereum smart contract deployment (Sepolia testnet)
- On-chain transaction anchoring from the UI
- Real IPFS upload flow (currently simulated hashes)
- SMS notifications for parents (Africa's Talking)

### 🔭 Planned
- Mobile app (Flutter) for school admins and parents
- Kenya Ministry of Education API integration
- M-Pesa payment rail integration for direct disbursements
- Multi-country support (Uganda, Tanzania, Rwanda)
- Public explorer — no login required for read access
- DAO governance for auditor elections

---

## Why Blockchain?

The audit trail problem in public finance isn't a data problem — it's a **trust problem**. A database can be edited. A PDF can be forged. A blockchain record cannot.

By anchoring each fund movement to an Ethereum transaction hash, Hera Keeps creates proof that is:

- **Tamper-proof** — the hash of the original record is permanent
- **Publicly verifiable** — anyone can check Etherscan
- **Jurisdiction-independent** — no single government entity controls the record
- **Cost-effective at scale** — Layer-2 reduces gas to fractions of a cent per transaction

---

## Market Opportunity

| Metric | Figure |
|--------|--------|
| Kenya education budget (2024/25) | KES 628 billion |
| Sub-Saharan Africa education spend | ~$100B/year |
| Estimated leakage to corruption | 10–30% |
| Schools in Kenya | 32,000+ |
| Target initial counties | 6 (pilot) → 47 |

The same infrastructure applies to healthcare, infrastructure, and social transfer programs — a TAM that extends well beyond education.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes, then
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
```

Please follow the existing TypeScript conventions and ensure `npm run build` passes before submitting.

---

## Contact & Investment Enquiries

Hera Keeps is actively seeking seed funding to accelerate smart contract deployment, mobile app development, and the pilot partnership with the Kenya Ministry of Education.

**If you're an investor, government partner, or NGO interested in talking:**

📧 [hello@circularityspace.com](mailto:hello@circularityspace.com)
🌐 [herakeeps.circularityspace.com](https://herakeeps.circularityspace.com/)

---

## License

MIT © 2026 Hera Keeps / Circularity Space

---

<div align="center">
<sub>Built in Kenya 🇰🇪 · For every country where public funds deserve a paper trail</sub>
</div>