# NewsGuard AI — Frontend

Next.js frontend for the NewsGuard AI news verification system.

## Tech Stack

- **Next.js 16** — React framework with App Router
- **React 19** — UI library
- **TypeScript** — type safety
- **Tailwind CSS 4** — utility-first styling
- **Framer Motion** — animations
- **Axios** — HTTP client
- **Lucide React** — icons

## Prerequisites

- Node.js 18+
- NewsGuard backend running at `http://localhost:8000`

## Setup

```bash
cd newsguard-frontend

npm install

cp .env.local.example .env.local
# Edit .env.local if your backend runs on a different port

npm run dev
```

App available at **http://localhost:3000**

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── library/      # Saved articles
│   │   ├── scans/        # Scan history
│   │   ├── settings/     # User settings
│   │   └── verify/       # News verification page
│   ├── signin/           # Login page
│   ├── signup/           # Registration page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── Navbar.tsx        # Navigation bar
│   └── NewsAnalyzer.tsx  # Main verification component
└── utils/
    └── auth.ts           # JWT token helpers
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Pages

| Route                    | Description                        |
|--------------------------|------------------------------------|
| `/`                      | Landing page                       |
| `/signin`                | Login                              |
| `/signup`                | Register                           |
| `/dashboard`             | Overview and stats                 |
| `/dashboard/verify`      | Analyze and verify news            |
| `/dashboard/library`     | Saved articles                     |
| `/dashboard/scans`       | Past scan history                  |
| `/dashboard/settings`    | Account settings                   |
