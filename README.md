# Lilaas — Concept Website

A pitch-grade website built as a concept for **Lilaas AS** (lilaas.no) — a Norwegian high-tech manufacturer of marine joysticks, control levers, and precision mechanics, founded 1961 in Horten.

Built with cinematic 3D, scroll choreography, and B2B-grade engineering precision to match the quality of the products themselves.

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **React 19**
- **Tailwind CSS** for styling
- **React Three Fiber** + **drei** + **postprocessing** for 3D
- **GSAP + ScrollTrigger** + **Framer Motion** for animation
- **Lenis** for smooth scroll
- **next-intl** for English/Norwegian localisation
- **React Hook Form + Zod** for the contact form

## Scripts

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run start
npm run typecheck
```

## Structure

```
app/
  [locale]/         # Routes under /en and /no
    control-levers/ # Product line + individual model pages
    precision-mechanics/
    industries/[industry]/
    case-studies/cern/
    about/
    contact/
    support/
    news/
    careers/
  api/contact/      # Form handler (stub)
components/
  three/            # R3F scenes (HeroScene, Joystick, OceanScene, CNCBackdrop)
  ui/               # Design system primitives
  sections/         # Home page sections
  providers/        # SmoothScroll, Cursor
lib/                # utilities (products data, gsap helpers, SEO)
messages/           # en.json, no.json
i18n/               # next-intl routing + request config
```

## Deploy (Vercel)

1. `git init && git remote add origin <github-url>`
2. Push to GitHub
3. Import in Vercel. No env vars required for v1.
4. Custom subdomain recommended: `lilaas-concept.vercel.app` (or similar).

## Content sources

Facts used in the site are drawn from lilaas.no, proff.no, purehelp.no, SCAN Magazine, Maskinregisteret, and public Lilaas corporate communications. Verbatim quotes from CEO Espen Bergsted Hoff have been preserved.

All imagery is stylised / synthesised — real product photography and Lilaas brand assets should replace stock before any public launch.

## Notes for Lilaas

This is a concept pitch, not an official Lilaas property. The domain label, content, and visual ambition are designed to demonstrate what the brand could look like with a significantly bigger production budget.

— built with care
