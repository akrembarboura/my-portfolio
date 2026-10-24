<div align="center">
  <img src="public/akrempicture.png" alt="Akrem Barboura" width="110" height="110" style="border-radius: 50%; border: 2px solid rgba(59, 130, 246, 0.5); box-shadow: 0 0 25px rgba(59, 130, 246, 0.25); object-fit: cover;" />
  <h1 style="margin: 0.5rem 0 0.25rem 0;">Akrem Barboura</h1>
  <p><strong>Full-Stack Software Engineer · React, TypeScript & Node.js Architecture</strong></p>
  <p><em>Modern Portfolio & Headless Content Management System</em></p>

  [![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
  [![Vite 8](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![React Router v7](https://img.shields.io/badge/React_Router-v7.1-CA4245?style=flat-square&logo=react-router&logoColor=white)](https://reactrouter.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)
</div>

---

## 📖 Executive Summary

This repository houses the personal developer portfolio and custom **Headless Content Management System (CMS)** of **Akrem Barboura**. 

Engineered natively with **React 19**, **Vite 8**, **Tailwind CSS v4**, and **Supabase**, this project goes beyond a conventional static portfolio. It combines a high-performance, accessible client-facing showcase with a secure, authenticated backoffice that allows live editing of projects, contact leads, media assets, and site settings without requiring code modifications or rebuilds.

---

## 🌟 Key Capabilities

### 1. Client-Facing Portfolio
- **High-Fidelity Project Showcase**: 3-column responsive grid featuring custom-designed feature banners, genuine project metadata, category tags (`FREELANCING`, `PERSONAL`), status pills (`COMPLETED`), and active source/demo links.
- **Brand Technical Stack**: Categorized core technologies with authentic brand palettes, glow states, and progress metrics across Frontend, Backend, Database, and DevOps tooling.
- **Interactive Experience Timeline**: Clear chronological trajectory of engineering engagements, freelance delivery, and academic foundation.
- **Geolocation-Enabled Contact Form**: Inbound inquiry form with optional client geolocation detection (via Browser Geolocation API), input sanitization, and direct Supabase database ingestion.
- **Interactive Intro & Fluid UX**: Bespoke entrance animation, smooth scroll reveals powered by `IntersectionObserver`, and responsive dark/light thematic foundation.

### 2. Headless Admin Backoffice (`/admin`)
- **Secure Authentication & RLS**: Protected by Supabase Auth with Row-Level Security (RLS) policies guarding sensitive administration endpoints.
- **Live Project Manager**: Full CRUD capabilities for adding, updating, and ordering projects, assigning technology badges, and setting repository/demo URLs.
- **Inbound Lead CRM**: Dedicated inquiry management portal to inspect customer messages, track lead statuses, attach operational notes, and export datasets to CSV.
- **Media Asset Library**: Cloud asset management dashboard to organize, preview, and link images across the portfolio.
- **SEO & Copywriting Control**: In-app management of meta tags, OpenGraph descriptions, hero statements, and personal bio copy.

---

## 🏛️ Architecture & Directory Tree

The codebase enforces a clean separation of concerns between public presentation components, shared utility hooks, static fallback datasets, and the admin backoffice suite:

```text
c:\Users\Akrem\Desktop\project\
├── public/
│   ├── projects/                 # Optimized showcase banners & web assets
│   │   ├── locmaison.jpg         # LOC MAISON showcase banner
│   │   ├── edupower.jpg          # EduPower Portal showcase banner
│   │   ├── cafe716.jpg           # Café 716+ showcase banner
│   │   ├── 7ata.jpg              # 7ATA.TN showcase banner
│   │   └── rnv.jpg               # R.N.V Peinture showcase banner
│   └── akrempicture.webp         # Profile portrait
├── src/
│   ├── admin/                    # Standalone Admin CMS Suite (TypeScript)
│   │   ├── components/           # Admin UI primitives, modal dialogs, data tables
│   │   ├── context/              # AuthContext, ThemeContext, ToastContext
│   │   ├── hooks/                # Admin custom hooks (useCollection, usePagination)
│   │   ├── layouts/              # AdminLayout, Topbar, Sidebar, UserMenu
│   │   ├── pages/                # Dashboard, ProjectsPage, ContactsPage, MediaLibrary
│   │   ├── services/             # Supabase repository and entity services
│   │   └── types/                # TypeScript interface definitions
│   ├── components/               # Public Portfolio Components (React 19)
│   │   ├── About.jsx             # Bio, highlights, and quick contact triggers
│   │   ├── Contact.jsx           # Inbound message form with GPS geolocation
│   │   ├── Experience.jsx        # Career timeline and milestones
│   │   ├── Navbar.jsx            # Responsive navigation & theme toggler
│   │   ├── PortfolioIntro.jsx    # Animated intro screen
│   │   ├── ProjectCard.jsx       # 3-column showcase card matching reference design
│   │   ├── Projects.jsx          # Work section with dynamic Supabase fallback
│   │   └── Skills.jsx            # Technical stack with authentic brand colors
│   ├── data/                     # Authoritative fallback datasets
│   │   ├── featuredProjects.js   # Production project metadata and banner mappings
│   │   ├── skills.jsx            # Categorized technologies and brand definitions
│   │   └── timeline.js           # Professional career history
│   ├── hooks/                    # Reusable client hooks (useScrollReveal, etc.)
│   ├── pages/                    # Route entry points (Home.jsx, AdminDashboard.jsx)
│   ├── styles/                   # Core CSS and Tailwind v4 stylesheet (index.css)
│   ├── App.jsx                   # React Router v7 routes & Vercel Analytics setup
│   ├── main.jsx                  # Application entry & DOM mount
│   └── supabaseClient.js         # Supabase client instantiation
├── package.json                  # Dependencies and execution scripts
├── vite.config.js                # Vite 8 bundler configuration
└── README.md                     # Project documentation
```

---

## 💼 Featured Production Projects

| Project | Domain | Architecture Stack | Status & Scope |
|---|---|---|---|
| **[LOC MAISON](https://location-match.vercel.app)** | Tunisian Managed Rental Marketplace | `Next.js 15`, `React 19`, `TypeScript`, `Tailwind CSS`, `MongoDB Atlas` | `COMPLETED` · `FREELANCING` |
| **[EduPower Portal](https://github.com/akrembarboura/edupower)** | EdTech LMS & Contextual AI Study Tutor | `TanStack Start`, `React 19`, `TypeScript`, `Supabase`, `PostgreSQL`, `Drizzle ORM` | `COMPLETED` · `PERSONAL` |
| **[Café 716+](https://github.com/akrembarboura/cafe-website)** | Campus Student Café & Gaming Hub | `React 19`, `TanStack Start`, `Three.js`, `Tailwind CSS 4`, `Prisma` | `COMPLETED` · `FREELANCING` |
| **7ATA.TN** | Editorial Luxury Fashion & Streetwear | `Next.js 15`, `React Server Components`, `TypeScript`, `Prisma`, `Tailwind` | `COMPLETED` · `FREELANCING` |
| **R.N.V Peinture** | Artisan Renovation & Plaster Craftsmanship | `React`, `TypeScript`, `Vite`, `Tailwind CSS`, `Supabase` | `COMPLETED` · `FREELANCING` |

---

## 🛠️ Complete Technology Stack

| Layer | Primary Technologies | Key Libraries & Purpose |
|---|---|---|
| **Core Framework** | React 19.2, Vite 8.0 | High-performance SPA compilation and sub-second HMR |
| **Client Routing** | React Router v7.1 | Declarative routing with v7 relative splat path compatibility |
| **Styling & Design** | Tailwind CSS v4.3, CSS Variables | Modern utility-first architecture with custom design tokens |
| **Typography** | Syne, Space Grotesk, Inter | Editorial headings, monospace tags, and crisp body text |
| **Animation & Motion** | Framer Motion 12, GSAP 3 | Fluid layout transitions, reveal cascades, and interactive states |
| **Icons & Visuals** | Lucide React, React Icons | Consistent iconography and authentic brand SVGs |
| **Backend & Database** | Supabase (PostgreSQL) | Serverless relational data store, real-time listeners, and RLS |
| **Authentication** | Supabase Auth | Encrypted token-based authentication for the `/admin` routes |
| **Telemetry & Quality** | Vercel Analytics, Speed Insights | Real-time Core Web Vitals and user telemetry tracking |
| **Code Integrity** | ESLint 10, TypeScript 5.x, Prettier | Strict linting, type validation, and code consistency |

---

## 🚀 Local Development Quickstart

### Prerequisites
- **Node.js**: `v18.0.0` or later (tested on Node `v24.x`)
- **Package Manager**: `npm` (v9+) or `pnpm`

### 1. Clone the Repository
```bash
git clone https://github.com/akrembarboura/project.git
cd project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file at the root of the project:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Launch Development Server
```bash
npm run dev
```
The portfolio will be available at `http://localhost:5173`.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 🔒 Supabase Database Schema

The optional headless CMS functionality relies on the following PostgreSQL tables in Supabase:

```sql
-- 1. Projects Table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subtitle text,
  description text not null,
  image text,
  status text default 'COMPLETED',
  type text default 'FREELANCING',
  privacy text default 'PUBLIC',
  tags text[] default '{}',
  github text,
  demo text,
  sort_order int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Contact Inquiries Table
create table public.contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  latitude double precision,
  longitude double precision,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Row Level Security Policies
alter table public.projects enable row level security;
alter table public.contacts enable row level security;

-- Public read access for portfolio visitors
create policy "Allow public read-only for projects"
  on public.projects for select using (true);

-- Public insert access for contact form
create policy "Allow public insert for contact inquiries"
  on public.contacts for insert with check (true);

-- Authenticated full access for admin users
create policy "Allow admin full access on projects"
  on public.projects for all using (auth.role() = 'authenticated');

create policy "Allow admin full access on contacts"
  on public.contacts for all using (auth.role() = 'authenticated');
```

---

## 🤝 Contact & Connect

**Akrem Barboura** — Full-Stack Software Engineer  
- **GitHub**: [@akrembarboura](https://github.com/akrembarboura)  
- **LinkedIn**: [Akrem Barboura](https://linkedin.com/in/akrembarboura)  
- **Location**: Tunisia (Open to worldwide remote collaboration)

---

<div align="center">
  <sub>Designed & Developed with precision by Akrem Barboura. © 2026 All rights reserved.</sub>
</div>
