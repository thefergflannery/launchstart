/**
 * contrast.js — injected into the page to scan colour contrast
 * Returns array of { text, fg, bg, ratio, largeText, wcagAA, wcagAAA, selector }
 */
(function () {
  function luminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.0715 * gs + 0.0722 * bs;
  }

  function contrastRatio(c1, c2) {
    const l1 = luminance(...c1);
    const l2 = luminance(...c2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function parseColor(str) {
    if (!str || str === 'transparent' || str === 'rgba(0, 0, 0, 0)') return null;
    const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return null;
    return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  }

  function toHex(rgb) {
    return '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('');
  }

  function getEffectiveBg(el) {
    let node = el;
    while (node && node !== document.body.parentElement) {
      const bg = parseColor(getComputedStyle(node).backgroundColor);
      if (bg) return bg;
      node = node.parentElement;
    }
    return [255, 255, 255]; // assume white
  }

  function selectorFor(el) {
    if (el.id) return '#' + el.id;
    const tag = el.tagName.toLowerCase();
    const cls = el.className && typeof el.className === 'string'
      ? '.' + el.className.trim().split(/\s+/)[0]
      : '';
    return tag + cls;
  }

  function isLargeText(style) {
    const size = parseFloat(style.fontSize);
    const bold = parseInt(style.fontWeight) >= 700;
    return size >= 24 || (size >= 18.67 && bold);
  }

  const seen = new Set();
  const results = [];

  document.querySelectorAll('*').forEach((el) => {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return;

    // Only process elements with direct text content
    const hasText = Array.from(el.childNodes).some(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 2
    );
    if (!hasText) return;

    const fg = parseColor(style.color);
    if (!fg) return;

    const bg = getEffectiveBg(el);
    const key = toHex(fg) + '|' + toHex(bg);
    if (seen.has(key)) return;
    seen.add(key);

    const ratio = contrastRatio(fg, bg);
    const large = isLargeText(style);
    const aaThreshold = large ? 3 : 4.5;
    const aaaThreshold = large ? 4.5 : 7;

    results.push({
      selector: selectorFor(el),
      fg: toHex(fg),
      bg: toHex(bg),
      ratio: Math.round(ratio * 100) / 100,
      largeText: large,
      wcagAA: ratio >= aaThreshold,
      wcagAAA: ratio >= aaaThreshold,
      text: el.textContent.trim().slice(0, 40),
    });
  });

  // Sort failures first, then by ratio ascending
  results.sort((a, b) => {
    if (a.wcagAA !== b.wcagAA) return a.wcagAA ? 1 : -1;
    return a.ratio - b.ratio;
  });

  return results.slice(0, 60); // cap at 60 pairs
})();
