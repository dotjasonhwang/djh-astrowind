# Production Optimization Checklist

## 1. Image Optimization

### Image Sizing & Responsive Serving (Astro-Specific)
- [ ] **Use Astro's Image component**: For single responsive images with automatic optimization
```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---
<Image src={heroImage} alt="Hero image" width={800} height={600} loading="lazy" />
```
- [ ] **Use Astro's Picture component**: For art direction (different images for different breakpoints)
```astro
---
import { Picture } from 'astro:assets';
import heroDesktop from '../assets/hero-desktop.jpg';
import heroMobile from '../assets/hero-mobile.jpg';
---
<Picture
  src={heroDesktop}
  alt="Hero image"
  widths={[400, 800, 1200]}
  formats={['webp', 'jpg']}
  fallbackFormat="jpg"
  pictureAttributes={{
    media: "(min-width: 768px)"
  }}
  loading="lazy"
/>
```
- [ ] **Provide source images at highest resolution**: Astro will generate optimized sizes automatically
- [ ] **Specify widths array**: Let Astro generate multiple sizes for different devices
- [ ] **Never manually resize/compress**: Astro handles WebP conversion and compression

### Image Compression & Conversion (Astro Handles Most)
- [ ] **Let Astro handle compression**: Automatic optimization during build
- [ ] **Specify formats in Picture component**: `formats={['webp', 'avif', 'jpg']}` for best support
- [ ] **Optimize SVGs manually**: Use https://jakearchibald.github.io/svgomg/ (Astro doesn't process SVGs)

### Mobile Landing Page Optimization (With Astro)
- [ ] **Use different source images**: Provide separate mobile-optimized images to Picture component
- [ ] **Crop center portion for mobile sources**: Create mobile versions cropped to ~500px wide
- [ ] **Let Astro handle serving**: Picture component automatically serves appropriate image
```astro
<Picture
  src={heroDesktop}
  alt="Hero"
  widths={[400, 800, 1200]}
  formats={['webp', 'jpg']}
  pictureAttributes={{
    class: "hero-image"
  }}
  loading="eager"
/>
```

## 2. Loading Strategies

### Critical Resource Preloading (Astro-Specific)
- [ ] **Preload critical images in Layout.astro head**:
```astro
---
// In your Layout.astro or specific page
import heroMobile from '../assets/hero-mobile.jpg';
---
<head>
  <link rel="preload" as="image" href={heroMobile.src} />
  <!-- Astro generates optimized URLs automatically -->
</head>
```
- [ ] **Preload fonts in Layout.astro**:
```astro
<head>
  <link rel="preload" href="/fonts/Pacifico-Bold.woff2" as="font" type="font/woff2" crossorigin />
</head>
```

### Image Loading Configuration
- [ ] **Set loading="eager" for above-fold images**: Critical images should load immediately
```astro
<Image src={heroImage} alt="Hero" loading="eager" />  <!-- Above fold -->
```
- [ ] **Verify lazy loading on below-fold images**: Astro defaults to `loading="lazy"` automatically

## 3. Font Optimization

### Local Font Hosting Setup
- [ ] **Use Google Fonts Helper**: https://gwfh.mranftl.com/fonts
- [ ] **Limit font weights**: Use only 400 and 700 for best performance (browser estimates rest)
- [ ] **Select "modern browsers"**: For CSS code generation
- [ ] **Download and place fonts**: In `/fonts` folder
- [ ] **Add to CSS with font-display**:
```css
@font-face {
  font-family: 'FontName';
  src: url('/fonts/font.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

### Fix Flash of Unstyled Content (FOUC)
- [ ] **Use Font Style Matcher**: https://meowni.ca/font-style-matcher/
- [ ] **Match fallback font**: Find system font that closely matches size/shape from https://blog.hubspot.com/website/web-safe-html-css-fonts
- [ ] **Test at same font size**: Set both fonts to actual display size (e.g., 20px)
- [ ] **Align line heights**: Use terminal window or ruler to match exactly
- [ ] **Update CSS**:
```css
font-family: "CustomFont", Arial, serif; /* Arial matches CustomFont best */
```

## 4. Performance Optimizations

### Analytics & Scripts
- [ ] **Load Google Analytics asynchronously**: https://developers.google.com/analytics/devguides/collection/analyticsjs#alternative_async_tag
- [ ] **Place at bottom of head tag**: Reduces impact on load times

### File Optimization
- [ ] **Minify CSS and JS**: Use build tools or hosting platform features (Netlify has auto-minify)
- [ ] **Defer non-essential JavaScript**: Add `defer` attribute and place at bottom of body
- [ ] **Use SVGs everywhere possible**: Icons, graphics, logos
  - Serve in `<img>` tags for cleaner DOM
  - Get premium SVGs: https://www.flaticon.com ($10/month)

### Logo Optimization
- [ ] **Convert PNG logos to SVG**: Use Fiverr designers (~$20)
- [ ] **Huge mobile performance boost**: SVGs look better and load faster
- [ ] **Load via regular img tag**: `<img src="logo.svg" alt="Company">`

## 5. Code Cleanup

### Remove Legacy Dependencies
- [ ] **Audit jQuery usage**: Modern JavaScript can replace most jQuery functions

### Third-Party Script Audit
- [ ] **List all external scripts**: Analytics, widgets, chat tools, etc.
- [ ] **Evaluate necessity**: Remove anything not essential
- [ ] **Defer loading**: For scripts that don't need immediate execution

## 6. SEO & Analytics Setup

### Google Analytics Configuration
- [ ] **Set up Google Analytics**: Create account, get tracking ID (G-XXXXXXXXXX)
- [ ] **Update config.yaml analytics**: Replace `id: null` with real Google Analytics ID
- [ ] **Verify analytics loading**: Check that tracking code appears in page source

### Google Search Console Setup
- [ ] **Set up Google Search Console**: Create account for site monitoring and indexing
- [ ] **Get Search Console verification**: Copy verification meta tag or ID from Search Console
- [ ] **Update config.yaml verification**: Replace `googleSiteVerificationId: xxxx` with real verification ID
- [ ] **Submit sitemap to Search Console**: Add your sitemap.xml URL for proper indexing
- [ ] **Verify site ownership**: Confirm verification is successful in Search Console

### Schema Markup Setup
- [ ] **Generate business schema markup**: Use TechnicalSEO.com generator or Google's Structured Data Markup Helper
- [ ] **Create LocalBusiness schema**: Use business data from client.json (name, address, hours, contact)
- [ ] **Validate schema markup**: Test generated schema with Google's Rich Results Test
- [ ] **Add to Layout.astro**: Insert schema JSON-LD script in head section
- [ ] **Verify implementation**: Check that schema appears correctly in page source

### Deployment
- [ ] **Deploy to Netlify**: Connect GitHub repository to Netlify for automatic deployments
- [ ] **Configure custom domain**: Set up custom domain and SSL certificate in Netlify
- [ ] **Verify build settings**: Ensure build command (`npm run build`) and publish directory (`dist`) are correct
- [ ] **Test live site**: Confirm deployed site loads properly on custom domain

## 7. Content Management (Optional)

### CMS Setup
- [ ] **Configure Decap CMS**: Set up content management system for non-technical content editing (if required)

## 8. Final Verification

### HTML & Link Validation
- [ ] **Validate HTML with W3C**: https://validator.w3.org/ - Goal: Zero flags or warnings
- [ ] **Check GitHub Actions link validation**: Ensure lychee link checker passes with no broken links
- [ ] **Run console error tests**: `npm run test:e2e` should pass with no console errors detected

### Performance Testing
- [ ] **Test on PageSpeed Insights**: https://pagespeed.web.dev/
- [ ] **Aim for 100 scores**: Performance, Accessibility, Best Practices, SEO
- [ ] **Test on mobile and desktop**: Both should score high
- [ ] **Verify Core Web Vitals**: LCP, FID, CLS within good ranges

## Tools Reference

- **HTML Validation**: https://validator.w3.org/
- **Image Compression**: https://compressor.io
- **WebP Conversion**: https://cloudconvert.com/jpg-to-webp
- **Google Fonts Helper**: https://gwfh.mranftl.com/fonts
- **Font Style Matcher**: https://meowni.ca/font-style-matcher/
- **Web Safe Fonts**: https://blog.hubspot.com/website/web-safe-html-css-fonts
- **SVG Optimization**: https://jakearchibald.github.io/svgomg/
- **Premium SVGs**: https://www.flaticon.com
- **Schema Generators**: https://technicalseo.com/tools/schema-markup-generator/ or https://www.google.com/webmasters/markup-helper/
- **Schema Validation**: https://search.google.com/test/rich-results
- **PageSpeed Testing**: https://pagespeed.web.dev/

## Success Metrics

Target scores for production sites:
- **Performance**: 100
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100
- **Load time**: Under 3 seconds on 3G
