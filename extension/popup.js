// A11YO Chrome Extension — Popup Logic
// State machine: loading → auth | ready → scanning → results | error

const SUPABASE_URL = 'https://zvmyjfwkcrnpbudvclko.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_zJTYramyu5uaKoUc7hV6FA_saOZGaiw';
const API_BASE = 'https://a11yo.io';
const GUEST_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes

const SCAN_MESSAGES = [
  'Loading page…',
  'Running accessibility checks…',
  'Scanning SEO metadata…',
  'Checking launch readiness…',
  'Testing broken links…',
  'Saving your report…',
];

// ── DOM refs ─────────────────────────────────────────────────────────────────

const screens = {
  loading:  document.getElementById('screen-loading'),
  auth:     document.getElementById('screen-auth'),
  ready:    document.getElementById('screen-ready'),
  scanning: document.getElementById('screen-scanning'),
  results:  document.getElementById('screen-results'),
  error:    document.getElementById('screen-error'),
};

// ── State ─────────────────────────────────────────────────────────────────────

let currentSession = null;
let currentTabUrl = '';
let scanId = null;
let scanMsgInterval = null;

// ── Screen switch ─────────────────────────────────────────────────────────────

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ── Guest scan helpers ────────────────────────────────────────────────────────

let isGuestScan = false;

async function getLastGuestScan() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['lastGuestScan'], (r) => resolve(r.lastGuestScan ?? 0));
  });
}

async function recordGuestScan() {
  return new Promise((resolve) => {
    chrome.storage.local.set({ lastGuestScan: Date.now() }, resolve);
  });
}

function formatCooldown(ms) {
  const mins = Math.ceil(ms / 60000);
  return `${mins} minute${mins !== 1 ? 's' : ''}`;
}

async function updateGuestCooldownUI() {
  const last = await getLastGuestScan();
  const elapsed = Date.now() - last;
  const remaining = GUEST_COOLDOWN_MS - elapsed;
  const btn = document.getElementById('guest-scan-btn');
  const msg = document.getElementById('guest-cooldown-msg');

  if (remaining > 0) {
    btn.disabled = true;
    btn.textContent = 'Scan this page (guest) →';
    msg.style.display = 'block';
    msg.textContent = `Guest scan available again in ${formatCooldown(remaining)}. Sign in to scan any time.`;
  } else {
    btn.disabled = false;
    msg.style.display = 'none';
  }
}

// ── Storage helpers ───────────────────────────────────────────────────────────

async function getSession() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['session'], (result) => {
      resolve(result.session ?? null);
    });
  });
}

async function saveSession(session) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ session }, resolve);
  });
}

async function clearSession() {
  return new Promise((resolve) => {
    chrome.storage.local.remove(['session'], resolve);
  });
}

// ── Supabase auth ─────────────────────────────────────────────────────────────

async function signIn(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description ?? data.msg ?? 'Sign in failed.');
  return data; // { access_token, refresh_token, user, ... }
}

async function refreshSession(refreshToken) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) return null;
  return res.json();
}

async function getValidToken() {
  if (!currentSession) return null;
  // Check if token is expired (with 60s buffer)
  const expiresAt = currentSession.expires_at ?? 0;
  if (Date.now() / 1000 < expiresAt - 60) {
    return currentSession.access_token;
  }
  // Try to refresh
  const fresh = await refreshSession(currentSession.refresh_token);
  if (fresh?.access_token) {
    currentSession = fresh;
    await saveSession(fresh);
    return fresh.access_token;
  }
  return null;
}

// ── Scan API ──────────────────────────────────────────────────────────────────

async function runScan(url, token) {
  const res = await fetch(`${API_BASE}/api/ext/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Scan failed. Please try again.');
  return data; // { id, results: { accessibility, seo, launch } }
}

async function runGuestScan(url) {
  const res = await fetch(`${API_BASE}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Scan failed. Please try again.');
  return data;
}

// ── Score calculation ─────────────────────────────────────────────────────────

const WEIGHTS = { critical: 3, 'should-fix': 2, 'nice-to-have': 1 };

function calcScore(allChecks) {
  let total = 0;
  let passed = 0;
  for (const c of allChecks) {
    const entry = ISSUE_LIBRARY[c.id];
    const sev = entry?.severity ?? (c.status === 'fail' ? 'critical' : c.status === 'amber' ? 'should-fix' : 'nice-to-have');
    const w = WEIGHTS[sev] ?? 1;
    total += w;
    if (c.status === 'pass') passed += w;
  }
  return total === 0 ? 100 : Math.round((passed / total) * 100);
}

// ── Results rendering ─────────────────────────────────────────────────────────

function renderResults(scanData) {
  const { id, results } = scanData;
  scanId = id;

  const allChecks = [...results.accessibility, ...results.seo, ...results.launch];
  const issues = [];
  const passed = [];

  for (const c of allChecks) {
    if (c.status === 'pass') {
      passed.push(c);
    } else {
      const entry = ISSUE_LIBRARY[c.id];
      const severity = entry?.severity ?? (c.status === 'fail' ? 'critical' : 'should-fix');
      issues.push({ check: c, severity, entry });
    }
  }

  const score = calcScore(allChecks);
  const scoreEl = document.getElementById('results-score');
  scoreEl.textContent = `${score}%`;
  scoreEl.className = 'score-num ' + (score >= 80 ? 'score-green' : score >= 50 ? 'score-warn' : 'score-fail');

  const critical = issues.filter((i) => i.severity === 'critical');
  const should   = issues.filter((i) => i.severity === 'should-fix');
  const nice     = issues.filter((i) => i.severity === 'nice-to-have');

  document.getElementById('count-critical').textContent = critical.length;
  document.getElementById('count-should').textContent = should.length;
  document.getElementById('count-nice').textContent = nice.length;

  // URL header
  try {
    const host = new URL(currentTabUrl).hostname;
    document.getElementById('results-url-header').textContent = host;
  } catch { /* ignore */ }

  // View full report link
  document.getElementById('view-report-link').href = `${API_BASE}/report/${id}`;

  // Issue cards — sorted by severity
  const issuesList = document.getElementById('issues-list');
  issuesList.innerHTML = '';

  const ordered = [
    ...critical.map((i) => ({ ...i, sev: 'critical' })),
    ...should.map((i) => ({ ...i, sev: 'should-fix' })),
    ...nice.map((i) => ({ ...i, sev: 'nice-to-have' })),
  ];

  if (ordered.length === 0) {
    issuesList.innerHTML = '<p style="font-size:11px;color:var(--secondary);text-align:center;padding:12px 0">No issues found — great work!</p>';
  }

  for (const { check, sev, entry } of ordered) {
    const title = entry?.title ?? check.label ?? check.id;
    const means = entry?.means ?? '';
    const fix   = entry?.fix ?? check.fixHint ?? '';
    const wcag  = entry?.wcag ?? '';

    const card = document.createElement('div');
    card.className = 'issue-card';

    const dotClass = sev === 'critical' ? 'dot-critical' : sev === 'should-fix' ? 'dot-should' : 'dot-nice';

    card.innerHTML = `
      <div class="issue-header" role="button" tabindex="0" aria-expanded="false">
        <div class="severity-dot ${dotClass}"></div>
        <span class="issue-title">${escHtml(title)}</span>
        <span class="issue-toggle">▾</span>
      </div>
      <div class="issue-body">
        ${means ? `<p class="issue-section-lbl">What this means</p><p class="issue-text">${escHtml(means)}</p>` : ''}
        ${fix ? `<p class="issue-section-lbl">What needs to happen</p><p class="issue-text">${escHtml(fix)}</p>` : ''}
        ${wcag ? `
          <div class="issue-wcag">
            <button class="wcag-toggle">Show technical reference ▾</button>
            <p class="wcag-text">${escHtml(wcag)}</p>
          </div>
        ` : ''}
      </div>
    `;

    const header = card.querySelector('.issue-header');
    const body   = card.querySelector('.issue-body');
    const toggle = card.querySelector('.issue-toggle');

    header.addEventListener('click', () => {
      const open = body.classList.toggle('open');
      toggle.classList.toggle('open', open);
      header.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); header.click(); }
    });

    const wcagToggle = card.querySelector('.wcag-toggle');
    if (wcagToggle) {
      const wcagText = card.querySelector('.wcag-text');
      wcagToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = wcagText.classList.toggle('visible');
        wcagToggle.textContent = (open ? 'Hide' : 'Show') + ' technical reference ' + (open ? '▴' : '▾');
      });
    }

    issuesList.appendChild(card);
  }

  // Guest upsell
  const upsell = document.getElementById('guest-upsell');
  if (upsell) upsell.style.display = isGuestScan ? 'block' : 'none';

  // Passed section
  if (passed.length > 0) {
    const passedSection = document.getElementById('passed-section');
    const passedList    = document.getElementById('passed-list');
    passedSection.style.display = 'block';
    passedList.innerHTML = '';
    for (const c of passed.slice(0, 6)) {
      const entry = ISSUE_LIBRARY[c.id];
      const label = entry ? entry.title : (c.label ?? c.id);
      const item = document.createElement('div');
      item.className = 'passed-item';
      item.innerHTML = `<span class="passed-check">✓</span><span>${escHtml(label)}</span>`;
      passedList.appendChild(item);
    }
    if (passed.length > 6) {
      const more = document.createElement('p');
      more.style.cssText = 'font-size:10px;color:var(--secondary);margin-top:4px';
      more.textContent = `+ ${passed.length - 6} more passed checks`;
      passedList.appendChild(more);
    }
  }

  showScreen('results');
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Scan progress messages ────────────────────────────────────────────────────

function startScanProgress() {
  let i = 0;
  const el = document.getElementById('scan-msg');
  el.textContent = SCAN_MESSAGES[0];
  scanMsgInterval = setInterval(() => {
    i = (i + 1) % SCAN_MESSAGES.length;
    el.textContent = SCAN_MESSAGES[i];
  }, 4000);
}

function stopScanProgress() {
  if (scanMsgInterval) { clearInterval(scanMsgInterval); scanMsgInterval = null; }
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  showScreen('loading');

  // Get current tab URL
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTabUrl = tab?.url ?? '';
  } catch { /* fallback */ }

  // Check stored session
  const stored = await getSession();

  if (stored?.access_token) {
    currentSession = stored;
    const token = await getValidToken();

    if (token) {
      document.getElementById('ready-email').textContent = stored.user?.email ?? '';
      document.getElementById('ready-url').textContent = currentTabUrl || '(no URL)';
      showScreen('ready');
    } else {
      await clearSession();
      currentSession = null;
      await updateGuestCooldownUI();
      showScreen('auth');
    }
  } else {
    await updateGuestCooldownUI();
    showScreen('auth');
  }
});

// ── Guest scan button ─────────────────────────────────────────────────────────

document.getElementById('guest-scan-btn').addEventListener('click', async () => {
  if (!currentTabUrl || currentTabUrl.startsWith('chrome://') || currentTabUrl.startsWith('chrome-extension://')) {
    showErrorScreen('Cannot scan browser pages. Please navigate to a website first.');
    return;
  }

  const last = await getLastGuestScan();
  if (Date.now() - last < GUEST_COOLDOWN_MS) {
    await updateGuestCooldownUI();
    return;
  }

  isGuestScan = true;
  showScreen('scanning');
  startScanProgress();

  try {
    await recordGuestScan();
    const data = await runGuestScan(currentTabUrl);
    stopScanProgress();
    renderResults(data);
  } catch (err) {
    stopScanProgress();
    showErrorScreen(err.message);
  }
});

// ── Auth form ─────────────────────────────────────────────────────────────────

document.getElementById('auth-submit').addEventListener('click', async () => {
  const email    = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const errorEl  = document.getElementById('auth-error');
  const btn      = document.getElementById('auth-submit');

  if (!email || !password) {
    errorEl.textContent = 'Please enter your email and password.';
    errorEl.classList.add('visible');
    return;
  }

  errorEl.classList.remove('visible');
  btn.disabled = true;
  btn.textContent = 'Signing in…';

  try {
    const session = await signIn(email, password);
    currentSession = session;
    isGuestScan = false;
    await saveSession(session);
    document.getElementById('ready-email').textContent = session.user?.email ?? email;
    document.getElementById('ready-url').textContent = currentTabUrl || '(no URL)';
    showScreen('ready');
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.classList.add('visible');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign in →';
  }
});

// Allow Enter key in password field
document.getElementById('auth-password').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('auth-submit').click();
});

// ── Sign out ──────────────────────────────────────────────────────────────────

document.getElementById('sign-out-btn').addEventListener('click', async () => {
  await clearSession();
  currentSession = null;
  // Clear results state
  document.getElementById('issues-list').innerHTML = '';
  document.getElementById('passed-section').style.display = 'none';
  showScreen('auth');
});

// ── Scan button ───────────────────────────────────────────────────────────────

document.getElementById('scan-btn').addEventListener('click', async () => {
  if (!currentTabUrl || currentTabUrl.startsWith('chrome://') || currentTabUrl.startsWith('chrome-extension://')) {
    showErrorScreen('Cannot scan browser pages. Please navigate to a website first.');
    return;
  }

  const token = await getValidToken();
  if (!token) {
    await clearSession();
    currentSession = null;
    showScreen('auth');
    return;
  }

  showScreen('scanning');
  startScanProgress();

  try {
    const data = await runScan(currentTabUrl, token);
    stopScanProgress();
    renderResults(data);
  } catch (err) {
    stopScanProgress();
    showErrorScreen(err.message);
  }
});

// ── Scan again ────────────────────────────────────────────────────────────────

document.getElementById('scan-again-btn').addEventListener('click', () => {
  document.getElementById('issues-list').innerHTML = '';
  document.getElementById('passed-section').style.display = 'none';
  showScreen('ready');
});

// ── Error screen ──────────────────────────────────────────────────────────────

function showErrorScreen(msg) {
  document.getElementById('error-msg').textContent = msg;
  showScreen('error');
}

document.getElementById('error-retry').addEventListener('click', () => {
  if (currentSession) {
    showScreen('ready');
  } else {
    showScreen('auth');
  }
});
