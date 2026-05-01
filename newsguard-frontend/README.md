<div align="center">

# 🎨 NewsGuard AI — Frontend

**Modern, responsive Next.js application for AI-powered news verification**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?logo=framer&logoColor=white)](https://www.framer.com/motion/)

</div>

---

## 📖 Overview

The NewsGuard AI frontend is a cutting-edge web application built with **Next.js 16** (App Router), **React 19**, and **Tailwind CSS 4**. It delivers a beautiful, performant, and accessible user experience for news verification with smooth animations, dark mode support, and responsive design.

### ✨ Key Features

- **🎨 Modern UI/UX**: Glassmorphism, gradient animations, and smooth transitions
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **🌙 Dark Mode**: Seamless theme switching with system preference detection
- **⚡ Lightning Fast**: Next.js 16 with Turbopack for instant hot reloading
- **🎭 Smooth Animations**: Framer Motion for delightful micro-interactions
- **♿ Accessible**: WCAG-compliant components with keyboard navigation
- **🔐 Secure Auth**: JWT token management with localStorage persistence

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** or **yarn** or **pnpm**
- NewsGuard backend running at `http://localhost:8000`

### Installation

```bash
cd newsguard-frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local if your backend runs on a different port

# Start development server
npm run dev
```

**App:** http://localhost:3000

---

## ⚙️ Configuration

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

> ⚠️ **Important**: All environment variables exposed to the browser must be prefixed with `NEXT_PUBLIC_`

---

## 📂 Project Structure

```
newsguard-frontend/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── dashboard/              # Protected dashboard routes
│   │   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   │   ├── page.tsx            # Dashboard home (stats & charts)
│   │   │   ├── verify/
│   │   │   │   └── page.tsx        # News verification interface
│   │   │   ├── library/
│   │   │   │   └── page.tsx        # Saved articles library
│   │   │   ├── scans/
│   │   │   │   └── page.tsx        # Verification history
│   │   │   └── settings/
│   │   │       └── page.tsx        # User settings
│   │   ├── signin/
│   │   │   └── page.tsx            # Login page
│   │   ├── signup/
│   │   │   └── page.tsx            # Registration page
│   │   ├── layout.tsx              # Root layout (fonts, metadata)
│   │   ├── page.tsx                # Landing page
│   │   └── globals.css             # Global styles & Tailwind imports
│   │
│   ├── components/                 # Reusable React components
│   │   ├── Navbar.tsx              # Navigation bar with auth state
│   │   └── NewsAnalyzer.tsx        # Main verification component
│   │
│   └── utils/                      # Utility functions
│       └── auth.ts                 # JWT token management
│
├── public/                         # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── .env.local                      # Environment variables (gitignored)
├── .env.local.example              # Environment template
├── .gitignore                      # Git ignore rules
├── eslint.config.mjs               # ESLint configuration
├── next.config.ts                  # Next.js configuration
├── package.json                    # Dependencies & scripts
├── postcss.config.mjs              # PostCSS configuration
├── tailwind.config.ts              # Tailwind CSS configuration
└── tsconfig.json                   # TypeScript configuration
```

---

## 🚢 Deployment

For production deployment instructions, including Vercel and Docker, please see the [Main Deployment Guide](../DEPLOYMENT_GUIDE.md).

---

## 🎨 Pages & Routes

### Public Routes

| Route     | Component             | Description                                             |
| --------- | --------------------- | ------------------------------------------------------- |
| `/`       | `app/page.tsx`        | Landing page with hero, features, testimonials, pricing |
| `/signin` | `app/signin/page.tsx` | User login with email/password                          |
| `/signup` | `app/signup/page.tsx` | User registration form                                  |

### Protected Routes (Dashboard)

All routes under `/dashboard` require authentication. Unauthenticated users are redirected to `/signin`.

| Route                 | Component                         | Description                                  |
| --------------------- | --------------------------------- | -------------------------------------------- |
| `/dashboard`          | `app/dashboard/page.tsx`          | Overview with stats, charts, recent activity |
| `/dashboard/verify`   | `app/dashboard/verify/page.tsx`   | News verification interface (NewsAnalyzer)   |
| `/dashboard/library`  | `app/dashboard/library/page.tsx`  | Saved articles with search & delete          |
| `/dashboard/scans`    | `app/dashboard/scans/page.tsx`    | Verification history table                   |
| `/dashboard/settings` | `app/dashboard/settings/page.tsx` | User profile & account settings              |

---

## 🧩 Key Components

### `<Navbar />`

**Location:** `src/components/Navbar.tsx`

Responsive navigation bar with:

- Logo and branding
- Desktop menu (Features, How it Works)
- Mobile hamburger menu
- Auth state detection (Sign In / Dashboard button)
- Smooth animations with Framer Motion

**Usage:**

```tsx
import Navbar from "@/components/Navbar";

<Navbar />;
```

---

### `<NewsAnalyzer />`

**Location:** `src/components/NewsAnalyzer.tsx`

The core verification component featuring:

- Large textarea for news input
- "Run Neural Scan" button with loading state
- Animated results display with:
  - Authenticity score (0-100%)
  - Key findings list
  - Supporting evidence with quotes
  - Score breakdown (4 metrics)
  - Related articles grid
- Save to library functionality
- Share button

**Props:** None (self-contained with internal state)

**API Integration:**

```typescript
POST /api/v1/analysis/
Body: { text: string }
Response: VerificationResult
```

**Features:**

- Error handling with user-friendly messages
- Loading states with spinners
- Animated score reveal
- Color-coded trust levels (green/amber/red)
- Responsive grid layout

---

### Dashboard Layout

**Location:** `src/app/dashboard/layout.tsx`

Shared layout for all dashboard pages:

- Sidebar navigation (desktop)
- Mobile drawer menu
- User profile section
- Logout button
- Route highlighting

**Navigation Items:**

- Overview (LayoutDashboard icon)
- Verify News (Search icon)
- Saved Library (Bookmark icon)
- Recent Scans (Shield icon)
- Settings (Settings icon)

---

## 🎨 Design System

### Color Palette

```css
/* Primary */
--indigo-600: #4f46e5;
--fuchsia-600: #c026d3;

/* Semantic */
--emerald-500: #10b981; /* Success / High trust */
--amber-500: #f59e0b; /* Warning / Medium trust */
--rose-500: #f43f5e; /* Error / Low trust */

/* Neutrals */
--zinc-50: #fafafa;
--zinc-900: #18181b;
--zinc-950: #09090b;
```

### Typography

- **Font Family**: System font stack (optimized for performance)
- **Font Weights**:
  - `font-medium` (500): Body text
  - `font-bold` (700): Subheadings
  - `font-black` (900): Headings, buttons, labels

### Border Radius

- `rounded-xl` (12px): Small cards, buttons
- `rounded-2xl` (16px): Medium cards, inputs
- `rounded-3xl` (24px): Large cards
- `rounded-[2.5rem]` (40px): Extra large containers

### Shadows

```css
/* Subtle elevation */
shadow-sm

/* Medium elevation */
shadow-xl

/* Colored glow (for CTAs) */
shadow-lg shadow-indigo-500/25
```

---

## 🔐 Authentication Flow

### Token Management

**Location:** `src/utils/auth.ts`

```typescript
// Store JWT token
setToken(token: string)

// Retrieve JWT token
getToken(): string | null

// Check if user is authenticated
isAuthenticated(): boolean

// Logout and redirect
logout()
```

### Protected Routes

Dashboard layout checks authentication on mount:

```typescript
useEffect(() => {
  if (!isAuthenticated()) {
    router.push("/signin");
  }
}, [router]);
```

### API Requests with Auth

```typescript
const token = getToken();
const response = await axios.get("/api/v1/dashboard/stats", {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## 🎭 Animations

### Framer Motion Patterns

**Page Transitions:**

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {content}
</motion.div>
```

**Staggered Children:**

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
```

**Hover Effects:**

```tsx
<motion.div whileHover={{ y: -10 }}>Card content</motion.div>
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind)

| Prefix | Min Width | Target        |
| ------ | --------- | ------------- |
| `sm:`  | 640px     | Large phones  |
| `md:`  | 768px     | Tablets       |
| `lg:`  | 1024px    | Laptops       |
| `xl:`  | 1280px    | Desktops      |
| `2xl:` | 1536px    | Large screens |

### Mobile-First Approach

```tsx
// Mobile: Stack vertically
// Desktop: Side-by-side
<div className="flex flex-col lg:flex-row gap-6">
  <div>Left</div>
  <div>Right</div>
</div>
```

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server (Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Type check
npx tsc --noEmit
```

### Code Quality

**ESLint Configuration:**

```javascript
// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

**TypeScript Configuration:**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 🎨 Styling Guide

### Tailwind CSS Utilities

**Spacing:**

```tsx
// Padding
p - 4; // 1rem (16px)
p - 8; // 2rem (32px)
px - 6; // Horizontal padding
py - 3; // Vertical padding

// Margin
(m - 4, mx - auto, my - 6);
```

**Layout:**

```tsx
// Flexbox
flex flex-col items-center justify-between gap-4

// Grid
grid grid-cols-1 md:grid-cols-3 gap-6
```

**Typography:**

```tsx
text-sm font-bold text-zinc-900 dark:text-white
```

**Dark Mode:**

```tsx
bg-white dark:bg-zinc-900
text-zinc-900 dark:text-white
border-zinc-200 dark:border-zinc-800
```

---

## 🧪 Testing

### Component Testing (Future)

```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm run test
```

### E2E Testing (Future)

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npx playwright test
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL`
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

**Build & Run:**

```bash
docker build -t newsguard-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.example.com newsguard-frontend
```

---

## 📦 Dependencies

### Core

| Package      | Version | Purpose            |
| ------------ | ------- | ------------------ |
| `next`       | 16.2.4  | React framework    |
| `react`      | 19.2.4  | UI library         |
| `react-dom`  | 19.2.4  | React DOM renderer |
| `typescript` | ^5      | Type safety        |

### UI & Styling

| Package                | Version  | Purpose                |
| ---------------------- | -------- | ---------------------- |
| `tailwindcss`          | ^4       | Utility-first CSS      |
| `@tailwindcss/postcss` | ^4       | PostCSS plugin         |
| `clsx`                 | ^2.1.1   | Conditional classnames |
| `tailwind-merge`       | ^3.5.0   | Merge Tailwind classes |
| `framer-motion`        | ^12.38.0 | Animations             |
| `lucide-react`         | ^1.11.0  | Icon library           |

### HTTP & Data

| Package | Version | Purpose     |
| ------- | ------- | ----------- |
| `axios` | ^1.15.2 | HTTP client |

---

## 🐛 Common Issues

### Issue: "Module not found" errors

**Solution:**

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Environment variables not working

**Solution:**

- Ensure variables are prefixed with `NEXT_PUBLIC_`
- Restart dev server after changing `.env.local`
- Check that `.env.local` is in the project root

### Issue: Dark mode not working

**Solution:**

- Tailwind CSS 4 uses native CSS variables
- Ensure `dark:` variants are properly configured
- Check browser DevTools for applied classes

---

## 🎯 Performance Optimization

### Image Optimization

Use Next.js `<Image>` component:

```tsx
import Image from "next/image";

<Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />;
```

### Code Splitting

Next.js automatically code-splits by route. For dynamic imports:

```tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Loader />,
  ssr: false,
});
```

### Font Optimization

Next.js 16 automatically optimizes fonts. Use `next/font`:

```tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Follow the code style (run `npm run lint`)
4. Commit your changes (`git commit -m 'Add AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

### Code Style Guidelines

- Use functional components with hooks
- Prefer `const` over `let`
- Use TypeScript interfaces for props
- Keep components under 300 lines
- Extract reusable logic into custom hooks
- Use Tailwind classes (avoid inline styles)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Next.js Team** for the incredible framework
- **Vercel** for hosting and deployment platform
- **Tailwind Labs** for Tailwind CSS
- **Framer** for Framer Motion
- **Lucide** for beautiful icons

---

<div align="center">

**Built with ❤️ using Next.js 16 and React 19**

_Empowering truth in the digital age_

</div>
