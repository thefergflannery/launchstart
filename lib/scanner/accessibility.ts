import { CheerioAPI } from 'cheerio';
import { CheckResult } from '@/lib/types';

export function runAccessibilityScan($: CheerioAPI): CheckResult[] {
  // Image alt text
  const imgsWithoutAlt = $('img').filter((_, el) => {
    const alt = $(el).attr('alt');
    return alt === undefined || alt === null;
  }).length;
  const imgsWithEmptyOrGeneric = $('img[alt]').filter((_, el) => {
    const alt = $(el).attr('alt') ?? '';
    const generic = ['image', 'photo', 'picture', 'img', 'graphic', 'icon', 'banner'];
    return generic.includes(alt.trim().toLowerCase());
  }).length;
  const imageIssues = imgsWithoutAlt + imgsWithEmptyOrGeneric;

  // Form labels: inputs without associated label, aria-label, or aria-labelledby
  const inputsWithoutLabel = $('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"])').filter((_, el) => {
    const id = $(el).attr('id');
    const ariaLabel = $(el).attr('aria-label');
    const ariaLabelledBy = $(el).attr('aria-labelledby');
    const title = $(el).attr('title');
    const hasLabel = id ? $(`label[for="${id}"]`).length > 0 : false;
    return !hasLabel && !ariaLabel && !ariaLabelledBy && !title;
  }).length;

  // Page title and language
  const hasTitle = $('title').length > 0 && ($('title').text().trim().length > 0);
  const htmlLang = $('html').attr('lang');
  const hasLang = !!htmlLang && htmlLang.trim().length > 0;

  // ARIA errors: invalid roles and missing required attributes
  const invalidAriaRoles = $('[role]').filter((_, el) => {
    const role = $(el).attr('role')?.trim().toLowerCase() ?? '';
    const validRoles = [
      'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
      'cell', 'checkbox', 'columnheader', 'combobox', 'complementary', 'contentinfo',
      'definition', 'dialog', 'directory', 'document', 'feed', 'figure', 'form',
      'grid', 'gridcell', 'group', 'heading', 'img', 'link', 'list', 'listbox',
      'listitem', 'log', 'main', 'marquee', 'math', 'menu', 'menubar', 'menuitem',
      'menuitemcheckbox', 'menuitemradio', 'navigation', 'none', 'note', 'option',
      'presentation', 'progressbar', 'radio', 'radiogroup', 'region', 'row',
      'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox', 'separator',
      'slider', 'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist',
      'tabpanel', 'term', 'textbox', 'timer', 'toolbar', 'tooltip', 'tree',
      'treegrid', 'treeitem',
    ];
    return role.length > 0 && !validRoles.includes(role);
  }).length;

  // Heading structure
  const headings: number[] = [];
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    headings.push(parseInt(el.tagName.slice(1), 10));
  });
  const h1Count = headings.filter((h) => h === 1).length;
  let headingOrderIssues = 0;
  if (h1Count === 0) headingOrderIssues++;
  if (h1Count > 1) headingOrderIssues++;
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] - headings[i - 1] > 1) headingOrderIssues++;
  }
  // Empty headings
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    if ($(el).text().trim().length === 0) headingOrderIssues++;
  });

  // Keyboard focus: tabindex > 0 (anti-pattern), missing skip link
  const positiveTabindex = $('[tabindex]').filter((_, el) => {
    const t = parseInt($(el).attr('tabindex') ?? '0', 10);
    return t > 0;
  }).length;
  const hasSkipLink = $('a[href="#main"], a[href="#main-content"], a[href="#content"]').length > 0
    || $('a').first().attr('class')?.includes('skip') === true;
  const keyboardIssues = positiveTabindex + (hasSkipLink ? 0 : 1);

  return [
    {
      id: 'image-alt',
      label: 'Images alt text',
      status: imageIssues === 0 ? 'pass' : 'fail',
      message: imageIssues === 0
        ? 'All images have alt attributes'
        : `${imageIssues} image(s) missing or with generic alt text`,
      fixHint: 'Add descriptive alt="…" to all <img> elements; use alt="" for decorative images',
    },
    {
      id: 'form-labels',
      label: 'Form input labels',
      status: inputsWithoutLabel === 0 ? 'pass' : 'fail',
      message: inputsWithoutLabel === 0
        ? 'All form inputs have associated labels'
        : `${inputsWithoutLabel} input(s) without a visible label or aria-label`,
      fixHint: 'Add <label for="…"> or aria-label to all input elements',
    },
    {
      id: 'color-contrast',
      label: 'Colour contrast',
      status: 'amber',
      message: 'Colour contrast requires browser rendering — check with the A11YO Chrome extension or browser devtools',
      fixHint: 'Ensure text has a contrast ratio of at least 4.5:1 against its background (WCAG AA)',
    },
    {
      id: 'title-lang',
      label: 'Page title & language',
      status: hasTitle && hasLang ? 'pass' : 'fail',
      message: hasTitle && hasLang
        ? 'Page has a <title> and html[lang] attribute'
        : !hasTitle && !hasLang
          ? 'Page is missing <title> and html[lang]'
          : !hasTitle ? 'Page is missing a <title> element'
            : 'Page is missing lang attribute on <html>',
      fixHint: 'Add <title> to <head> and lang="en" to <html>',
    },
    {
      id: 'aria-errors',
      label: 'ARIA errors',
      status: invalidAriaRoles === 0 ? 'pass' : invalidAriaRoles <= 2 ? 'amber' : 'fail',
      message: invalidAriaRoles === 0
        ? 'No invalid ARIA roles detected'
        : `${invalidAriaRoles} invalid ARIA role(s) found`,
      fixHint: 'Fix invalid ARIA roles and attributes per the WAI-ARIA specification',
    },
    {
      id: 'heading-structure',
      label: 'Heading structure',
      status: headingOrderIssues === 0 ? 'pass' : headingOrderIssues <= 2 ? 'amber' : 'fail',
      message: headingOrderIssues === 0
        ? 'Heading hierarchy is logical and well-ordered'
        : `${headingOrderIssues} heading structure issue(s) — missing h1, skipped levels, or empty headings`,
      fixHint: 'Use one <h1> per page, nest headings in order (h1→h2→h3) without skipping',
    },
    {
      id: 'keyboard-focus',
      label: 'Keyboard focus',
      status: keyboardIssues === 0 ? 'pass' : keyboardIssues <= 1 ? 'amber' : 'fail',
      message: keyboardIssues === 0
        ? 'No keyboard focus issues detected'
        : `${keyboardIssues} keyboard focus issue(s) — positive tabindex or missing skip link`,
      fixHint: 'Remove positive tabindex values and add a skip-to-main-content link',
    },
  ] satisfies CheckResult[];
}
