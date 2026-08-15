# CodeArena — Full Stack Coding Contest Platform

A modern, fully-featured coding contest and assessment platform built for colleges and coding clubs. Replaces Google Forms, WhatsApp, and spreadsheets with one powerful web application.

---

## Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | React 18, TypeScript, Tailwind CSS v4, React Router v7, Axios, React Hook Form, Zod |
| Backend    | Node.js, Express.js, Prisma ORM, PostgreSQL (Neon)  |
| Auth       | JWT, bcryptjs, role-based access control            |
| Storage    | Cloudinary (images, submission files)               |
| Email      | Nodemailer (SMTP)                                   |
| Deploy     | Vercel (frontend) + Render (backend) + Neon (DB)    |

---

## Project Structure

```
CodeArena/
├── client/                  # Vite + React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Shared UI components
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── hooks/           # useContestTimer, useDebounce
│   │   ├── layouts/         # MainLayout, DashboardLayout, AuthLayout
│   │   ├── pages/
│   │   │   ├── auth/        # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── public/      # Landing, ContestList, ContestDetail
│   │   │   ├── student/     # Dashboard, MyContests, Workspace, Profile…
│   │   │   ├── organizer/   # Dashboard, CreateContest, ProblemBank…
│   │   │   └── admin/       # Dashboard, UserManagement, Analytics…
│   │   ├── services/        # API service layer (axios)
│   │   ├── types/           # TypeScript interfaces
│   │   └── utils/           # helpers, pdfExport
│   └── vercel.json
│
├── server/                  # Express + Prisma backend
│   ├── prisma/
│   │   ├── schema.prisma    # 10 DB models
│   │   └── seed.ts          # Demo data seeder
│   └── src/
│       ├── config/          # env, prisma, cloudinary, mailer
│       ├── controllers/     # Business logic
│       ├── middleware/       # auth (JWT), errorHandler
│       ├── routes/          # 10 route modules
│       └── utils/           # apiResponse, jwt, upload, params
│
├── render.yaml              # Render deployment config
└── README.md
```

---

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech) free tier)
- Optional: Cloudinary account, Gmail SMTP app password

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd CodeArena

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Configure Server Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name   # optional for dev
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_USER=your@gmail.com                 # optional for dev
SMTP_PASS=your_gmail_app_password
```

### 4. Set Up the Database

```bash
cd server

# Push schema to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed with demo data
npm run db:seed
```

### 5. Configure Client Environment

```bash
cd client
cp .env.example .env
# .env already contains: VITE_API_URL=http://localhost:5000/api
```

### 6. Run Development Servers

Open two terminals:

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Demo Accounts (after seeding)

| Role      | Email                         | Password        |
|-----------|-------------------------------|-----------------|
| Admin     | admin@codearena.dev           | Admin@1234      |
| Organizer | organizer@codearena.dev       | Organizer@1234  |
| Student   | student@codearena.dev         | Student@1234    |

---

## API Endpoints

| Module          | Base Path              |
|-----------------|------------------------|
| Auth            | `POST /api/auth/...`   |
| Profile         | `GET/PUT /api/profile/...` |
| Contests        | `/api/contests/...`    |
| Problems        | `/api/problems/...`    |
| Submissions     | `/api/submissions/...` |
| Leaderboard     | `/api/leaderboard/...` |
| Announcements   | `/api/announcements/...` |
| Notifications   | `/api/notifications/...` |
| Certificates    | `/api/certificates/...` |
| Admin           | `/api/admin/...`       |

Health check: `GET /health`

---

## Deployment

### Frontend → Vercel

1. Push code to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Set root directory to `client`
4. Add environment variable: `VITE_API_URL=https://your-render-app.onrender.com/api`
5. Deploy — the `vercel.json` handles SPA routing automatically

### Backend → Render

1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your repo, set root directory to `server`
4. Build command: `npm install && npm run db:generate && npm run build`
5. Start command: `npm run start`
6. Add all environment variables from `server/.env.example`
7. The `render.yaml` in the root pre-configures everything

### Database → Neon

1. Create a free project at [neon.tech](https://neon.tech)
2. Copy the connection string to `DATABASE_URL` in both local `.env` and Render env vars
3. Run `npm run db:push` once to apply the schema
4. Run `npm run db:seed` to add demo data

---

## Features

### Authentication
- JWT-based login / register
- Role-based access: Student, Organizer, Admin
- Forgot/reset password via email
- Remember me, session persistence

### Contests
- Create contests with banner, rules, prizes, schedule
- Public and private (password-protected) contests
- Admin approval workflow
- Real-time countdown timer in workspace
- Register, enter, and participate

### Problems
- Rich problem editor: description, input/output format, constraints, examples
- Visible + hidden test cases with individual point weights
- Difficulty levels (Easy / Medium / Hard) and tags
- Per-organizer problem bank

### Submissions
- Submit via code textarea or file upload
- Language selection (C++, Python, Java, JS, Go, Rust, C)
- Submission history with status (AC / WA / TLE / CE / RE)
- Score and penalty tracking

### Leaderboard
- Live rankings by score + penalty + time
- Auto-refresh every 30s during active contests
- Personal rank highlight
- Podium for top 3

### Certificates
- Auto-generate PDFs after contest ends
- Professional certificate design via jsPDF
- Download from profile or certificates page

### Notifications
- Contest started, ending soon, registered
- Announcement broadcasts
- Submission results
- Certificate ready alerts
- Mark read / mark all read / delete

### Admin Panel
- User management: search, block/unblock, delete, change role
- Contest approval queue
- Reports management (user / problem / contest)
- Analytics dashboard with charts (Recharts)

---

## License

MIT

---

## Phase 2 — Product Polish

### Engineering Quality
- **Error Boundary** — React class component (`getDerivedStateFromError`) wrapping the entire route tree; `withErrorBoundary` HOC for section-level isolation
- **Error pages** — 401 Unauthorized, 403 Forbidden, 404 Not Found (animated floating number), 500 Server Error, Network Error (offline detection via `navigator.onLine` + `online`/`offline` events)
- **6 reusable hooks** — `useAsync` (prevents stale state after unmount), `usePagination` (slice + totalPages), `useLocalStorage` (cross-tab sync via `storage` event), `useMediaQuery` + `useIsMobile/useIsTablet/useIsDesktop`, `useKeyboard` (modifier support), `useClickOutside`

### Skeleton Screens
Pixel-accurate loading placeholders for every major page: ContestList, ContestDetail, Problem, Profile, Leaderboard, Submissions, Certificates, Notifications, Settings, MyContests — all shimmer animated, matching the actual page layout.

### Settings Page (`/settings`)
4-tab interface (Profile, Appearance, Notifications, Security) with:
- Avatar upload (Cloudinary), name/college/bio/socials with Zod validation and inline errors
- Theme picker (Dark/Light) with live toggle and color palette preview
- 6 notification preference toggles with custom animated switch UI
- Password change form with current password verification and Danger Zone

### Polished Empty States
11 entity-specific components in `EmptyStates.tsx` — each has a floating animated illustration with entity-specific color, descriptive text, and a context-aware CTA button.

### Accessibility
Skip link, `:focus-visible` keyboard rings, `prefers-reduced-motion`, `forced-colors` (Windows High Contrast), `aria-invalid`/`aria-describedby`/`aria-label`/`aria-busy` on all inputs, `role="alert"` on errors, `.sr-only` utility, `id="main-content"` landmarks.

### Mobile Responsiveness
Responsive card grid (1→4 cols), table→card transform on mobile with `data-label` headers, touch-friendly 40px tap targets, workspace sidebar stacking, responsive TopBar, form grids collapse to single column.

### Profile Page
Activity heatmap (12 weeks, color intensity = submission density), weekly solve area chart, contest history DataTable, certificates grid, badge system (6 badges unlocked by stats thresholds, earned/locked states), animated stat counters, social links.

### Dashboard Upgrades
- **Student**: Animated counters, streak banner, milestone progress bar, weekly chart, badges panel
- **Organizer**: Pending approval banner, registration bar chart, contest health panel, quick actions
- **Admin**: Inline approve/reject, platform health bars, user growth area chart, system status

### FormField Component
Reusable `<FormField>` with: animated label color on focus, `AlertCircle` error icon with `aria-invalid`, `CheckCircle` success state, helper text, password visibility toggle, `useId()` for accessible label/input binding.

### Performance
- 99 source files, all routes lazy-loaded + Suspense boundaries
- `ErrorBoundary` at app root + `memo()` on heavy chart tooltips
- Largest chunk: 403KB → gzip 131KB (jsPDF for certificate generation)
- Build time: ~650ms production build

### Project Stats
| Metric | Count |
|--------|-------|
| Source files | 99 |
| Components | 34 |
| Pages | 34 |
| Custom hooks | 8 |
| API services | 10 |
| DB models | 10 |
| API routes | 60+ |
