# djh-astrowind

## Overview

AstroWind business website template built with Astro 5 & Tailwind 4. Optimized for performance with hybrid CSS architecture using Tailwind CSS v4.

## TODOs
- Change Header on mobile to have buttons at top/right below links?

## Architecture

- **Framework**: Astro 5.x with static output
- **Styling**: Tailwind CSS v4 with custom CSS integration
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Build**: Vite with custom optimizations
- **Deployment**: SSG for Netlify

### Configuration Files

- `src/config.yaml` - Site configuration
- `src/types.d.ts` - TypeScript definitions
- `astro.config.ts` - Astro configuration with custom integrations
- `vitest.config.ts` - Test configuration (requires Vite override)

## Design Principles

Reference the Principles in [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md)

## Development Preferences

- **Code Style**: 2-space indentation, Prettier formatting
- **TypeScript**: Strict mode enabled, prefer explicit types
- **Testing**: Unit, accessibility, e2e tests, maintain high coverage
- **Commits**: Use conventional commits with pre-commit hooks

### Formatter Configuration

- Astro files: `astro-build.astro-vscode`
- TypeScript files: `esbenp.prettier-vscode`
- All files use 2-space indentation

## Important Notes

- **Vite Override**: Added `"vite": "6.0.2"` override in `package.json` to fix Vitest+Vite 6 compatibility issues with `vitest.config.ts`. See [astro/issues/12662](https://github.com/withastro/astro/issues/12662)
  - Don't remove the Vite override without testing vitest.config.ts

### Commands

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm test` - Run unit tests
- `npm run test:e2e` - Run Playwright tests
- `npm run check` - Run all checks (astro + eslint + prettier)
- `npm run fix` - Auto-fix ESLint and Prettier issues

### Configuration

- ESLint uses flat config format (v9+)
- Pre-commit hooks validate tests and build
- All TypeScript files should use Prettier formatting

## Migration Plan
  ## Design Token Migration Strategy
  1. Convert existing CSS custom properties to `@theme` format in tailwind.css
  2. Remove manual utility definitions that can be auto-generated
  3. Keep semantic utilities (`.btn`, `.card`) that need custom behavior
  4. Update components to use new auto-generated utilities (`bg-brand-primary` instead of manual utilities)
