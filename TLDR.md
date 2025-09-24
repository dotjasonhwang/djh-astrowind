# AstroWind Template - Quick Start Guide

## Setup

```shell
git clone git@github.com-djh:dotjasonhwang/djh-astrowind.git my-website
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

| Command            | Action                               |
| :----------------- | :----------------------------------- |
| `npm run dev`      | Start dev server at `localhost:4321` |
| `npm run test`     | Run unit tests                       |
| `npm run test:e2e` | Run e2e tests                        |
| `npm run fix`      | Format code with Prettier + ESLint   |

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
