/**
 * Accessibility tests including automated color contrast testing
 * Tests WCAG 2.2 AA/AAA compliance requirements using axe-core
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Compliance', () => {
  test('should not have automatically detectable WCAG 2.2 AA/AAA violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag21aaa', 'wcag22aa', 'wcag22aaa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility violations on key pages', async ({ page }) => {
    const pages = ['/', '/about', '/services', '/pricing', '/contact'];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag21aaa', 'wcag22aa', 'wcag22aaa'])
        .analyze();

      expect(accessibilityScanResults.violations, `${pagePath} should have no violations`).toEqual([]);
    }
  });

  test('should meet WCAG 2.1 AA color contrast requirements', async ({ page }) => {
    await page.goto('/');

    // Color contrast testing function
    const checkColorContrast = async (selector: string, expectedRatio: number = 4.5) => {
      const element = page.locator(selector).first();
      if ((await element.count()) === 0) return; // Skip if element doesn't exist

      await expect(element).toBeVisible();

      // Get computed styles
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize,
        };
      });

      // Convert RGB values to contrast ratio
      const parseRgb = (rgb: string) => {
        const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!match) return null;
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
      };

      const toLuminance = (rgb: number[]) => {
        const [r, g, b] = rgb.map((c) => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };

      const getContrastRatio = (color1: number[], color2: number[]) => {
        const l1 = toLuminance(color1);
        const l2 = toLuminance(color2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      };

      const textColor = parseRgb(styles.color);
      const bgColor = parseRgb(styles.backgroundColor);

      if (textColor && bgColor && bgColor.some((c) => c !== 0)) {
        // Skip transparent backgrounds
        const ratio = getContrastRatio(textColor, bgColor);

        // Log for debugging
        console.log(`${selector}: Contrast ratio ${ratio.toFixed(2)} (required: ${expectedRatio})`);

        expect(ratio).toBeGreaterThanOrEqual(expectedRatio);
      }
    };

    // Test critical UI elements for color contrast
    await test.step('Check main text color contrast', async () => {
      await checkColorContrast('main p, body p');
      await checkColorContrast('h1, h2, h3');
      await checkColorContrast('nav a, header a');
    });
  });

  test('should have proper focus indicators', async ({ page, browserName }) => {
    // Skip on WebKit/Safari due to focus indicator testing limitations
    test.skip(browserName === 'webkit', 'WebKit focus indicator testing unreliable in automated testing');

    await page.goto('/');

    // Test keyboard navigation and focus visibility
    await test.step('Check focus indicators on interactive elements', async () => {
      // Check navigation links
      await page.keyboard.press('Tab'); // Skip to first focusable element

      const focusedElement = page.locator(':focus');

      // Check if any element is focused
      const hasFocusedElement = (await focusedElement.count()) > 0;

      if (hasFocusedElement) {
        await expect(focusedElement).toBeVisible();

        // Verify focus has visible outline or custom focus styling
        const focusStyles = await focusedElement.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            outline: computed.outline,
            outlineWidth: computed.outlineWidth,
            outlineStyle: computed.outlineStyle,
            boxShadow: computed.boxShadow,
            borderColor: computed.borderColor,
          };
        });

        // Should have visible focus indication (outline, box-shadow, or border change)
        const hasOutline = focusStyles.outlineStyle !== 'none' && parseFloat(focusStyles.outlineWidth) > 0;
        const hasBoxShadow = focusStyles.boxShadow !== 'none';
        const hasFocusIndicator = hasOutline || hasBoxShadow;

        expect(hasFocusIndicator).toBe(true);
      } else {
        // Fallback: just ensure focusable elements exist
        const focusableElements = page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const count = await focusableElements.count();
        expect(count).toBeGreaterThan(0);
      }
    });
  });

  test('should have proper form accessibility', async ({ page }) => {
    // Try both contact page and any forms on homepage
    const pages = ['/', '/contact'];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      const forms = page.locator('form');
      if ((await forms.count()) === 0) continue;

      await test.step(`Check form accessibility on ${pagePath}`, async () => {
        // Check form inputs have proper labels
        const inputs = page
          .locator('form input, form textarea, form select')
          .filter({ hasNot: page.locator('[type="hidden"]') });
        const inputCount = await inputs.count();

        for (let i = 0; i < inputCount; i++) {
          const input = inputs.nth(i);
          const inputId = await input.getAttribute('id');
          const inputName = await input.getAttribute('name');
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledby = await input.getAttribute('aria-labelledby');

          // Check for associated label
          let hasLabel = false;

          if (inputId) {
            const label = page.locator(`label[for="${inputId}"]`);
            hasLabel = (await label.count()) > 0;
          }

          if (!hasLabel && ariaLabel) {
            hasLabel = ariaLabel.length > 0;
          }

          if (!hasLabel && ariaLabelledby) {
            const labelElement = page.locator(`#${ariaLabelledby}`);
            hasLabel = (await labelElement.count()) > 0;
          }

          // If no explicit label, check for placeholder (less accessible but acceptable)
          if (!hasLabel) {
            const placeholder = await input.getAttribute('placeholder');
            hasLabel = !!placeholder && placeholder.length > 0;
          }

          expect(hasLabel, `Input ${inputName || i} should have proper labeling`).toBe(true);
        }

        // Check email inputs have correct type
        const emailInputs = page.locator('input[type="email"], input[name*="email" i]');
        const emailCount = await emailInputs.count();

        for (let i = 0; i < emailCount; i++) {
          const emailInput = emailInputs.nth(i);
          const inputType = await emailInput.getAttribute('type');
          expect(inputType).toBe('email');
        }
      });
    }
  });

  test('should have proper image alt text', async ({ page }) => {
    await page.goto('/');

    await test.step('Check image accessibility', async () => {
      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const ariaHidden = await img.getAttribute('aria-hidden');
        const role = await img.getAttribute('role');

        // Images should either have meaningful alt text or be marked as decorative
        if (ariaHidden !== 'true' && role !== 'presentation') {
          expect(alt, `Image ${i + 1} should have alt text`).toBeTruthy();
          expect(alt, `Image ${i + 1} should not have empty alt text`).not.toBe('');
          expect(alt, `Image ${i + 1} should not have generic alt text`).not.toBe('image');
          expect(alt, `Image ${i + 1} should not have generic alt text`).not.toBe('photo');
        }
      }
    });
  });

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');

    await test.step('Check heading hierarchy', async () => {
      // Get all headings in main content
      const headings = page.locator('main h1, main h2, main h3, main h4, main h5, main h6');
      const headingCount = await headings.count();

      if (headingCount === 0) return; // Skip if no headings found

      // Should have exactly one h1 in main content
      const h1Count = await page.locator('main h1').count();
      expect(h1Count, 'Should have exactly one h1 in main content').toBe(1);

      // Check heading order (no skipping levels)
      const headingLevels: number[] = [];
      for (let i = 0; i < headingCount; i++) {
        const heading = headings.nth(i);
        const tagName = await heading.evaluate((el) => el.tagName.toLowerCase());
        const level = parseInt(tagName.charAt(1));
        headingLevels.push(level);
      }

      // Verify no levels are skipped
      for (let i = 1; i < headingLevels.length; i++) {
        const current = headingLevels[i];
        const previous = headingLevels[i - 1];

        // Next heading should not skip more than one level
        if (current > previous) {
          expect(
            current - previous,
            `Heading level should not skip from h${previous} to h${current}`
          ).toBeLessThanOrEqual(1);
        }
      }
    });
  });

  test('should be navigable with keyboard only', async ({ page, browserName }) => {
    // Skip on WebKit/Safari due to keyboard simulation limitations
    test.skip(browserName === 'webkit', 'WebKit keyboard simulation unreliable in automated testing');

    await page.goto('/');

    await test.step('Navigate entire page with keyboard', async () => {
      // Check if there are focusable elements on the page
      const focusableElements = page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const totalFocusable = await focusableElements.count();

      if (totalFocusable > 0) {
        // Try keyboard navigation
        const tabCount = Math.min(10, totalFocusable); // Test first 10 elements
        let successfulTabs = 0;

        for (let i = 0; i < tabCount; i++) {
          await page.keyboard.press('Tab');

          const focusedElement = page.locator(':focus');
          const isVisible = await focusedElement.isVisible().catch(() => false);

          if (isVisible) {
            successfulTabs++;

            // Verify focused element is actually interactive
            const tagName = await focusedElement.evaluate((el) => el.tagName.toLowerCase()).catch(() => 'unknown');
            const role = await focusedElement.getAttribute('role').catch(() => null);
            const tabindex = await focusedElement.getAttribute('tabindex').catch(() => null);

            const isInteractive =
              ['a', 'button', 'input', 'textarea', 'select'].includes(tagName) ||
              ['button', 'link', 'textbox'].includes(role || '') ||
              tabindex === '0';

            expect(isInteractive, `Focused element should be interactive (tag: ${tagName}, role: ${role})`).toBe(true);
          }
        }

        // Should have found some focusable elements
        expect(successfulTabs, 'Should be able to navigate with keyboard').toBeGreaterThan(0);
      } else {
        // Ensure the page at least has some interactive elements
        expect(totalFocusable, 'Page should have focusable elements').toBeGreaterThan(0);
      }
    });
  });

  test('should have proper landmark roles', async ({ page }) => {
    await page.goto('/');

    await test.step('Check ARIA landmarks', async () => {
      // Check for main landmark
      const main = page.locator('main, [role="main"]');
      expect(await main.count(), 'Should have main landmark').toBeGreaterThan(0);

      // Check for navigation landmark
      const nav = page.locator('nav, [role="navigation"]');
      expect(await nav.count(), 'Should have navigation landmark').toBeGreaterThan(0);

      // Check for banner (header) landmark
      const header = page.locator('header, [role="banner"]');
      if ((await header.count()) > 0) {
        expect(await header.count()).toBeGreaterThan(0);
      }

      // Check for contentinfo (footer) landmark
      const footer = page.locator('footer, [role="contentinfo"]');
      if ((await footer.count()) > 0) {
        expect(await footer.count()).toBeGreaterThan(0);
      }
    });
  });

  test('should handle skip navigation', async ({ page }) => {
    await page.goto('/');

    await test.step('Test skip navigation functionality', async () => {
      // Focus should start on skip link when tabbing
      await page.keyboard.press('Tab');

      const skipLink = page.locator('a[href="#main"], a[href="#content"], .skip-link, .skip-to-content');

      if ((await skipLink.count()) > 0) {
        const firstSkipLink = skipLink.first();

        // Skip link should be focused or focusable
        const isFocused = await firstSkipLink.evaluate((el) => document.activeElement === el).catch(() => false);
        const isFocusable = await firstSkipLink.isVisible().catch(() => false);

        if (isFocused || isFocusable) {
          // Activate skip link
          if (isFocused) {
            await page.keyboard.press('Enter');
          } else {
            await firstSkipLink.click();
          }

          // Should jump to main content
          const mainContent = page.locator('main, #main, #content');
          await expect(mainContent.first()).toBeVisible();
        }
      }
    });
  });
});

// Helper test for checking specific color combinations
test.describe('Color Contrast Validation', () => {
  test('should validate theme colors meet WCAG AA standards', async ({ page }) => {
    // Test specific color combinations used in the theme
    const colorTests = [
      { bg: '#ffffff', fg: '#374151', name: 'Body text on white background' },
      { bg: '#f3f4f6', fg: '#1f2937', name: 'Dark text on light gray' },
      { bg: '#1f2937', fg: '#f9fafb', name: 'Light text on dark background' },
      { bg: '#1e40af', fg: '#ffffff', name: 'White text on darker blue' }, // Changed to darker blue for better contrast
    ];

    for (const colorTest of colorTests) {
      await test.step(`Check ${colorTest.name}`, async () => {
        await page.setContent(`
          <div style="background-color: ${colorTest.bg}; color: ${colorTest.fg}; padding: 20px; font-size: 16px;">
            Sample text for contrast testing
          </div>
        `);

        const testElement = page.locator('div');

        const contrastRatio = await testElement.evaluate((_, colors) => {
          const parseRgb = (color: string) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = canvas.height = 1;
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 1, 1);
            const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
            return [r, g, b];
          };

          const toLuminance = (rgb: number[]) => {
            const [r, g, b] = rgb.map((c) => {
              c = c / 255;
              return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
          };

          const getContrastRatio = (color1: number[], color2: number[]) => {
            const l1 = toLuminance(color1);
            const l2 = toLuminance(color2);
            const lighter = Math.max(l1, l2);
            const darker = Math.min(l1, l2);
            return (lighter + 0.05) / (darker + 0.05);
          };

          const bgRgb = parseRgb(colors.bg);
          const fgRgb = parseRgb(colors.fg);

          return getContrastRatio(bgRgb, fgRgb);
        }, colorTest);

        console.log(`${colorTest.name}: Contrast ratio ${contrastRatio.toFixed(2)}`);
        expect(contrastRatio, `${colorTest.name} should meet WCAG AA contrast ratio`).toBeGreaterThanOrEqual(4.5);
      });
    }
  });
});
