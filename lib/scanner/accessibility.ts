import { Page } from 'puppeteer-core';
import path from 'path';
import { readFileSync } from 'fs';
import { CheckResult } from '@/lib/types';

// Read the browser-safe axe-core bundle once at module load time
const axeSource = readFileSync(
  path.join(process.cwd(), 'node_modules', 'axe-core', 'axe.min.js'),
  'utf-8'
);

interface AxeViolation {
  id: string;
  impact: string | null;
  nodes: Array<{ html: string }>;
}

export async function runAccessibilityScan(page: Page): Promise<CheckResult[]> {
  await page.evaluate(axeSource);

  const violations: AxeViolation[] = await page.evaluate(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = await (window as any).axe.run();
    return results.violations;
  });

  const violationIds = new Set(violations.map((v) => v.id));
  const countMatching = (ids: string[]) => ids.filter((id) => violationIds.has(id)).length;

  return [
    (() => {
      const count = countMatching(['image-alt']);
      return {
        id: 'image-alt',
        label: 'Images alt text',
        status: count === 0 ? 'pass' : 'fail',
        message:
          count === 0
            ? 'All images have meaningful alt text'
            : `${count} image(s) found without alt attributes`,
        fixHint: 'Add descriptive alt="…" attributes to all <img> elements',
      } satisfies CheckResult;
    })(),

    (() => {
      const count = countMatching(['label', 'label-content-name-mismatch']);
      return {
        id: 'form-labels',
        label: 'Form input labels',
        status: count === 0 ? 'pass' : 'fail',
        message:
          count === 0
            ? 'All form inputs have associated labels'
            : `${count} form input(s) found without labels`,
        fixHint: 'Add <label for="…"> or aria-label to all input elements',
      } satisfies CheckResult;
    })(),

    (() => {
      const count = countMatching(['color-contrast', 'color-contrast-enhanced']);
      return {
        id: 'color-contrast',
        label: 'Colour contrast',
        status: count === 0 ? 'pass' : count <= 2 ? 'amber' : 'fail',
        message:
          count === 0
            ? 'No colour contrast failures detected'
            : `${count} colour contrast issue(s) detected`,
        fixHint: 'Ensure text has a contrast ratio of at least 4.5:1 (WCAG AA)',
      } satisfies CheckResult;
    })(),

    (() => {
      const missingTitle = violationIds.has('document-title');
      const missingLang =
        violationIds.has('html-has-lang') || violationIds.has('html-lang-valid');
      const passed = !missingTitle && !missingLang;
      return {
        id: 'title-lang',
        label: 'Page title & language',
        status: passed ? 'pass' : 'fail',
        message: passed
          ? 'Page has both a <title> and lang attribute'
          : missingTitle && missingLang
            ? 'Page is missing <title> and html[lang] attribute'
            : missingTitle
              ? 'Page is missing a <title> element'
              : 'Page is missing lang attribute on <html>',
        fixHint: 'Add <title> to <head> and lang="en" to <html> element',
      } satisfies CheckResult;
    })(),

    (() => {
      const ariaRules = [
        'aria-allowed-attr', 'aria-required-attr', 'aria-valid-attr',
        'aria-valid-attr-value', 'aria-roles', 'aria-hidden-body',
        'aria-hidden-focus', 'aria-input-field-name', 'aria-required-children',
        'aria-required-parent', 'aria-toggle-field-name', 'aria-tooltip-name',
      ];
      const count = countMatching(ariaRules);
      return {
        id: 'aria-errors',
        label: 'ARIA errors',
        status: count === 0 ? 'pass' : count <= 2 ? 'amber' : 'fail',
        message:
          count === 0 ? 'No ARIA errors detected' : `${count} ARIA error(s) detected`,
        fixHint: 'Fix invalid ARIA roles and attributes per the WAI-ARIA spec',
      } satisfies CheckResult;
    })(),

    (() => {
      const count = countMatching(['heading-order', 'page-has-heading-one', 'empty-heading']);
      return {
        id: 'heading-structure',
        label: 'Heading structure',
        status: count === 0 ? 'pass' : count === 1 ? 'amber' : 'fail',
        message:
          count === 0
            ? 'Heading structure is logical and well-ordered'
            : `${count} heading structure issue(s) detected`,
        fixHint: 'Use headings in order (h1, h2, h3) without skipping levels',
      } satisfies CheckResult;
    })(),

    (() => {
      const count = countMatching([
        'tabindex', 'bypass', 'scrollable-region-focusable', 'focus-order-semantics',
      ]);
      return {
        id: 'keyboard-focus',
        label: 'Keyboard focus',
        status: count === 0 ? 'pass' : 'fail',
        message:
          count === 0
            ? 'No keyboard focus issues detected'
            : `${count} keyboard focus issue(s) detected`,
        fixHint: 'Ensure all interactive elements are reachable via the Tab key',
      } satisfies CheckResult;
    })(),
  ];
}
