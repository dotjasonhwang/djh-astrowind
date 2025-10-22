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

- `src/config.yaml` - Site configuration + business data (single source of truth)
- `public/decapcms/config.yml` - Decap CMS configuration (blog editing only)
- `src/types.d.ts` - TypeScript definitions
- `astro.config.ts` - Astro configuration with custom integrations
- `vitest.config.ts` - Test configuration (requires Vite override)

### Content Management

- **Decap CMS**: Available at `/decapcms` for blog post editing
- **Business Data**: Managed in `src/config.yaml` under the `business:` section
- **Site Config**: All site settings in `src/config.yaml` (no separate client.json)

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

## Migration

### Spacing Pattern Migration

For each file in MIGRATION.md

- If it is a list/map of items:
  - `mb-*` → `mt-*` + `first:mt-0` for consistent top-margin flow
- If it is a separate item:
  - `mb-*` -> `mt-*`, trust that the other components will adjust accordingly
  - `my-*` -> `mt-* times 2`

For each file in MIGRATION.md audit the following:

1. vertical margin
2. horizontal margin
3. vertical padding
4. horizontal padding

## Spacing Audit Results (2025-10-02)

### 1. Vertical Margins (mt-, mb-, my-)

**Successfully Migrated Patterns:**

- ✅ mb-_ → mt-_ conversion completed across all files
- ✅ my-_ → mt-_ (doubled) conversion completed
- ✅ Proper first:mt-0 usage on lists only (not singular elements)

**Current Usage Analysis:**

- **Hero Components** (Hero.astro, Hero2.astro, HeroText.astro): mt-6 between subtitle and actions
- **Blog Components**: mt-8 md:mt-16 for headers, mt-2 for tags with first:mt-0
- **Content Components**: mt-8 md:mt-12 for sections, mt-6 for content elements
- **404 Page**: mt-16 for main container, mt-8 for heading
- **List Items**: Proper first:mt-0 pattern in Tags.astro, Footer.astro

**Spacing Scale Distribution:**

- mt-1, mt-2: Small spacing (tags, form elements)
- mt-4, mt-6: Medium spacing (content flow)
- mt-8, mt-12: Section spacing (responsive)
- mt-16, mt-20: Large section breaks

**Issues Found:**

- Inconsistent spacing scales across components
- Some components use fixed values, others responsive
- Hero components have complex mt-6 pattern between elements

### 2. Horizontal Margins (ml-, mr-, mx-)

**Container Patterns:**

- mx-auto: Consistent centering across all major containers
- max-w-7xl mx-auto: Standard layout container
- max-w-3xl mx-auto: Content containers (blog, forms)
- max-w-4xl mx-auto: Section containers

**Element Spacing:**

- ml-2/mr-2: Standard element spacing (buttons, icons, social links)
- ml-4/mr-4: Larger element spacing (navigation, footer links)
- ml-8: Definition list indentation (DListItem.astro)

**Issues Found:**

- Mixed margin values for similar use cases
- Some negative margins (-ml-1.5, -mr-1.5) for icon positioning

### 3. Vertical Padding (pt-, pb-, py-)

**Section Patterns:**

- py-12 md:py-16 lg:py-20: Standard section padding (WidgetWrapper)
- py-8 sm:py-16 lg:py-20: Blog sections
- py-12 md:py-20: Hero sections

**Hero-Specific Patterns:**

- pt-0 md:pt-[76px]: Header offset compensation
- pb-10 md:pb-16: Hero content bottom padding
- Complex responsive scaling

**Form Elements:**

- py-3 px-4: Standard input field padding (consistent)
- py-2 px-5: Button padding variations
- py-0.5 px-2: Small elements (tags)

**Issues Found:**

- Multiple py- patterns for similar section types
- Hero components have complex responsive padding
- Inconsistent button padding variations

### 4. Horizontal Padding (pl-, pr-, px-)

**Container Standards:**

- px-4 sm:px-6: Small to medium containers
- px-4 md:px-6: Most widget containers
- px-6 sm:px-6: Blog content containers
- px-3: Compact elements (buttons, small containers)

**Form Elements:**

- px-4: Standard input fields (consistent across Form.astro)
- px-3 py-2: Small buttons and controls
- px-5.5 md:px-6: CTA buttons

**Complex Patterns:**

- Header.astro: px-3 md:px-6 responsive navigation
- Dropdown menus: pl-4 md:pl-0 conditional padding

**Issues Found:**

- Inconsistent px- values for similar components
- Some components missing responsive padding

## Color Migration Strategy

### ✅ NEXT: Color Migration (Eliminate dark: classes)

**Goal:** Use Tailwind v4 @theme directive to eliminate all 135 `dark:` class occurrences across 47 files.

**Approach:** CSS-first configuration with automatic theme switching via semantic color tokens.

**Phase 1: Theme Infrastructure Setup**

- Configure @theme directive with semantic CSS variables in tailwind.css
- Set up automatic dark mode using @custom-variant
- Replace existing --aw-color-\* variables with semantic system
- Create utility classes that automatically switch themes

**Phase 2: Semantic Color System**

- Define semantic tokens: --color-background, --color-foreground, --color-muted, --color-primary
- Map to light/dark values using :root and .dark selectors
- Register with @theme for automatic utility generation
- Create semantic utilities: bg-background, text-foreground, text-muted

**Phase 3: Systematic Component Migration (ALL 75 files in MIGRATION.md)**

- **Pages (15 files):** index.astro → about.astro → admin.astro → contact.astro → pricing.astro → services.astro → services1.astro → services2.astro → services3.astro → 404.astro → [...blog]/index.astro → [...blog]/[...page].astro → [...blog]/[category]/[...page].astro → [...blog]/[tag]/[...page].astro
- **Layouts (3 files):** Layout.astro → MarkdownLayout.astro → PageLayout.astro
- **Components - Widgets (24 files):** All widget components systematically
- **Components - UI (8 files):** Button.astro → Form.astro → Headline.astro → ItemGrid.astro → Timeline.astro → WidgetWrapper.astro → Background.astro
- **Components - Blog (10 files):** All blog components
- **Components - Common (3 files):** SocialShare.astro → ToggleMenu.astro → ToggleTheme.astro
- **Components - Root (2 files):** CustomStyles.astro → Logo.astro

**Common Replacement Patterns:**

- `text-gray-900 dark:text-white` → `text-foreground`
- `bg-white dark:bg-slate-800` → `bg-background`
- `text-gray-600 dark:text-gray-400` → `text-muted`
- `bg-gray-100 dark:bg-gray-700` → `bg-surface`
- `border-gray-200 dark:border-gray-600` → `border-subtle`
