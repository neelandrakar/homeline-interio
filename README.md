# Homeline Interio — Premium Interior Design Website & AI Consultant

> **Interactive Concept Sales Demo**  
> Developed by **Nats LAB** (Web Development & AI Solutions Studio) for **Homeline Interio**, Kolkata, India.  
> *Project concepts and illustrative materials are presented for demonstration and client onboarding purposes.*

---

## 1. Project Overview & Business Benefit

**Homeline Interio** is a residential interior design studio specializing in home interiors, modular kitchens, and residential space consultations in Kolkata and adjoining areas (Garia, Salt Lake, New Town, South City, Ballygunge, Behala, Jadavpur, etc.).

This sales demonstration illustrates how a digital presence combining high-end editorial aesthetics with an **AI-Enabled Design Consultant** directly converts website visitors into qualified residential leads:

```
Visitor → Explores Interior Concepts → Chats with AI Consultant → Generates Structured Brief → Persists Lead → Studio Follows Up via WhatsApp/Phone
```

### Key Differentiators for Homeline Interio:
1. **Interactive AI Design Consultant**: Walks homeowners through room requirements, Kolkata locality selection, property dimensions (2BHK, 3BHK, etc.), and indicative INR budgets without requiring technical jargon.
2. **Deterministic Fallback Engine**: Works out-of-the-box with **zero external API keys**, ensuring 100% demo uptime and reliability during client presentations.
3. **Provider-Swappable AI Adapter**: Easily connects to modern LLMs (Google Gemini 1.5 Flash / OpenAI) with knowledge grounding that strictly prevents hallucinating fake prices, awards, or false delivery commitments.
4. **Indian Mobile Normalization & Zod Validation**: Strict server-side validation rejecting invalid 10-digit mobile numbers while standardizing formats (`+91 98765 43210`).
5. **Protected Admin CRM Dashboard**: Authorized administrators can log in, track lead pipelines (`New`, `Contacted`, `Qualified`, `Scheduled`, `Won`, `Lost`), add internal notes, and initiate one-click WhatsApp or Phone conversations.

---

## 2. Technology Stack

### Frontend (`client/`):
- **React 19 & TypeScript**: Component-driven architecture with strict type safety.
- **Vite 8 & Tailwind CSS v4**: Ultra-fast build times, custom color palette (`#F7F5F0` ivory, `#242722` charcoal, `#68745A` olive, `#8C6D53` walnut).
- **React Router 7**: Client-side routing for seamless transitions.
- **Lucide Icons**: Accessible, clean vector icons.

### Backend (`server/`):
- **Node.js & Express.js (TypeScript)**: Clean modular architecture with controllers, services, middleware, and validators.
- **Zod**: Runtime schema validation and sanitization.
- **Mongoose & MongoDB**: Persistent document storage with compound indexes on `status`, `phoneDigits`, and `createdAt`.
- **JWT & bcryptjs**: Cryptographic password hashing and token-based administrator authentication.
- **Helmet, CORS & Rate Limiting**: Secure HTTP headers and connection throttling.
- **Vitest & Supertest**: 30 passing automated tests covering validation, AI conversation flow, and route security.

---

## 3. Site Structure & Routes

| Route | Description |
|---|---|
| `/` | **Homepage**: Editorial hero, story, 4 featured concepts, proposed services, 3-step process, AI assistant promo, and final CTA. |
| `/projects` | **Project Gallery**: Filterable across All, Living Room, Kitchen, Bedroom, Full Home, Compact Spaces. |
| `/projects/:slug` | **Project Detail**: High-res imagery, design intention brief, materials specification, color swatches, and "Discuss Similar Project" CTA. |
| `/services` | **Services Page**: 6 proposed service categories, typical customer profiles, key consultation decisions, and direct consultation form. |
| `/about` | **About Page**: Design philosophy, Kolkata climate & material craftsmanship considerations, and transparent demo disclosure. |
| `/contact` | **Contact & Enquiries**: Consultation request form, service area coverage, and provisional business notice. |
| `/privacy` | **Privacy Notice**: Plain-language explanation of data collection, retention, and deletion rights. |
| `/admin/login` | **Admin Login**: Secure login form with one-click demo credentials helper. |
| `/admin` | **Admin Dashboard**: Protected CRM with lead pipeline metrics, search, filtering, status changer, internal notes timeline, and direct outreach actions. |

---

## 4. Getting Started & Installation

### Prerequisites:
- **Node.js** (v18.0.0 or higher recommended, tested on v24)
- **npm** (v9.0.0 or higher)

### Setup in 2 Steps:

1. **Install Dependencies**:
```bash
npm run install:all
```
*(This installs root, server, and client dependencies automatically)*

2. **Configure Environment Variables** (Optional for Demo):
```bash
cp .env.example .env
```
*(The application works immediately in local development mode without needing any third-party credentials!)*

---

## 5. Running the Application

### Development Mode (Runs Server + Client concurrently):
```bash
npm run dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

### Separate Dev Commands:
```bash
# Start backend server only:
npm run dev:server

# Start frontend client only:
npm run dev:client
```

### Production Build:
```bash
npm run build
```
Compiles both TypeScript backend into `server/dist` and optimized static assets into `client/dist`.

---

## 6. Administrator Credentials & Provisioning

The application automatically provisions an initial administrator account upon startup.

- **Login URL**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Default Email**: `admin@homelineinterio.com`
- **Default Password**: `Homeline@2026Admin`

*Credentials can be customized via the `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.*

---

## 7. AI Consultant Configuration & Fallback Engine

The AI Design Assistant operates via `POST /api/ai/chat` using an adapter architecture:

### 1. Deterministic Fallback Mode (`AI_PROVIDER=fallback`):
- Operates with **zero API keys**.
- Employs deterministic regex and keyword extraction for Kolkata localities (Garia, Salt Lake, New Town, etc.), property types (2BHK, 3BHK, etc.), room categories, and INR budgets (₹3L, 5-8 lakhs, etc.).
- Grounded strictly in `BUSINESS_CONFIG` without hallucinating pricing or claims.
- Asks one follow-up question at a time and automatically triggers the lead handover when sufficient information is gathered.

### 2. Live LLM Integration (`AI_PROVIDER=gemini`):
To enable Google Gemini:
1. In `.env`, set:
   ```env
   AI_PROVIDER=gemini
   AI_API_KEY=your_gemini_api_key_here
   AI_MODEL=gemini-1.5-flash
   ```
2. Restart the server.
3. If an API outage occurs, the server automatically catches errors and reverts to the fallback engine seamlessly.

---

## 8. Database Architecture & Fallback

- **MongoDB Connected (`MONGODB_URI` set)**: Uses Mongoose with schema validation, compound indexes (`status`, `phoneDigits`, `createdAt`), and persistent database writes.
- **Local Dev / Demo Fallback (`MONGODB_URI` empty)**: Operates an in-memory repository allowing full querying, searching, status updates, and note logging so the presentation runs smoothly on any local machine. Production deployments require a live `MONGODB_URI`.

### Duplicate Lead Handling Policy:
If an enquiry with the exact same phone number and project type is submitted within 5 minutes, it is recognized as a rapid duplicate; rather than cluttering the CRM, the existing record is updated with the additional text and flagged cleanly.

---

## 9. Automated Testing

Run the test suite with:
```bash
npm test
```

### Test Coverage (30 automated unit & integration tests):
- `tests/phoneNormalizer.test.ts`: Verifies Indian phone normalization (+91, trunk 0, 10-digit validation starting with 6,7,8,9, invalid length rejection).
- `tests/leadValidator.test.ts`: Verifies Zod schema rules, mandatory consent, length constraints, and project types.
- `tests/aiFallbackEngine.test.ts`: Verifies natural language requirement extraction, Kolkata locality matching, and lead handover triggers.
- `tests/apiRoutes.test.ts`: Verifies health check, projects and services listing, lead submission, rapid duplicate handling, admin JWT authentication, unauthorized access rejection, lead status update, and note appending.

---

## 10. Replacing Demo Data with Approved Client Information

To transition from the sales demo to live production:
1. **Business Identity**: Edit `server/src/config/business.ts` and `client/src/data/businessData.ts` to update verified phone numbers, official GSTIN, studio address, and approved service descriptions.
2. **Project Portfolio**: Replace entries in `server/src/data/projectsData.ts` and `client/src/data/projectsData.ts` with verified high-resolution photographs and project briefs from Homeline Interio's real portfolio.
3. **Disclosure Banner**: In `client/src/components/common/DemoBanner.tsx` and `Footer.tsx`, remove the demo indicator once final sign-off is granted by Homeline Interio.

---

## 11. Security Considerations

- **Untrusted User Inputs**: All messages sent to the AI assistant are treated as untrusted text. The assistant does not execute commands or read from arbitrary database tables.
- **Prompt Injection Defense**: Server-side system prompts instruct the model to refuse prompt overrides and adhere strictly to grounded business facts.
- **Password Security**: Administrator passwords are hashed with bcrypt (salt rounds = 10).
- **Rate Limiting**: Applied to `/api/leads` (20 req / 15 min), `/api/ai/chat` (60 msg / 10 min), and `/api/admin/login` (15 attempts / 15 min).
- **CORS & Headers**: Strict CORS origin checking with Helmet security headers.

---

## 12. Handover & Client Presentation Checklist

- [x] High-end, architectural editorial visual design (warm ivory, charcoal, olive, walnut).
- [x] Responsive on mobile, tablet, and desktop viewports.
- [x] Filterable gallery with 8 illustrative project concepts.
- [x] Project detail pages with material specifications and palette swatches.
- [x] Floating AI design assistant with 1-click sample Kolkata conversation simulation.
- [x] Verified Indian mobile number validation (+91).
- [x] Dual-mode storage (MongoDB Atlas ready + instant in-memory fallback).
- [x] Protected admin login and CRM dashboard with lead pipeline management.
- [x] 1-click WhatsApp and Phone outreach links with safety notices.
- [x] 30 passing automated tests and successful production build.