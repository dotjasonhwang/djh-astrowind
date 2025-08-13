# AstroWind Template - Quick Start Guide

Modern website template built with **Astro 5.0** + **Tailwind CSS** + **TypeScript**.

## Setup

```shell
git clone https://github.com/arthelokyo/astrowind.git my-website
cd my-website
npm install
```

**Quick Configuration:**
1. Update `src/config.yaml` with your site info
2. Update `src/data/client.json` with your business data  
3. Remove unused pages from `src/pages/`
4. Update `src/navigation.ts` to match your pages
5. Replace images in `src/assets/` and `public/`
6. Run `npm run dev` to start development

## Commands

| Command         | Action                              |
| :-------------- | :---------------------------------- |
| `npm run dev`   | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/`   |
| `npm run test`  | Run tests                           |
| `npm run fix`   | Format code with Prettier + ESLint  |

## Key Files to Customize

- **`src/config.yaml`** - Site settings, SEO, analytics
- **`src/data/client.json`** - Business info, hours, contact details
- **`src/navigation.ts`** - Menu structure and links
- **`src/pages/`** - Your website pages (remove unused ones)

## Business Components

- **BusinessHours** - Show open/closed status and schedule
- **EmbeddedMap** - Google Maps integration with directions
- **Reviews** - Customer testimonials page
- **AnalyticsInit** - Enhanced business event tracking

## Testing

```bash
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:a11y     # Accessibility tests
```

Tests run automatically on commit/push via git hooks.

## Content Management (Optional)

Access `/admin` for Decap CMS interface to edit content without code.

## Deploy

**Netlify (Recommended):**
1. Push code to GitHub
2. Connect repository to Netlify
3. Auto-deploys on every push to main branch

**Other Options:** Vercel, GitHub Pages, or any static hosting.

## Support

Built-in features: SEO optimization, dark mode, responsive design, accessibility compliance (WCAG 2.1 AA), performance optimization.