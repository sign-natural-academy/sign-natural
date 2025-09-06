# Sign Natural Academy — Frontend

A responsive React frontend for Sign Natural Academy.
Built with Vite, React, Tailwind (via PostCSS), Framer Motion, and React Router.

> This repo contains only the frontend. Backend endpoints are referenced via `VITE_API_URL`.

---

## Key features

- Public pages: Home, Learn, Workshops, Products, Stories, About.
- Authentication pages (signup, login) — OAuth placeholders included.
- Filters for courses and workshops.
- User dashboard (tutorials, bookings, upload story/testimonial).
- Admin dashboard placeholders (approve testimonials, add course/workshop).
- Framer Motion animations and icon libraries preserved.
- Privacy / Terms / Refund pages included exactly as provided.

---

## Tech stack

- React 18 (Functional components + hooks)
- Vite
- Tailwind utility classes (via PostCSS)
- Framer Motion
- React Router v6
- Heroicons + lucide-react
- Axios (for future API calls)

---

## Prerequisites

- Node.js 18+ (recommended)
- npm 8+ (or yarn/pnpm)
- Git

---

## Quick start (dev)

```bash
# clone
git clone <your-repo-url>
cd <repo-name>

# install
npm install

# copy example env (create .env with your API url)
cp .env.example .env
# edit .env as needed

# start dev server
npm run dev
