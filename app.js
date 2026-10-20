// Handleliste – familiens felles handleliste
import { firebaseConfig } from './firebase-config.js';
import { kassalOn, searchProducts, pricesFor, sameChain } from './kassal.js';
import { CATEGORIES, COMMON, UNITS, STEPS, categorize, norm, mergeQty, splitInput, parseQty, parseNum, fmtNum, fmtQty, dictUnit, cap } from './varer.js';

/* =========================================================
   Ikoner
   ========================================================= */
const I = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  dots: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>',
  paper: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h13v15a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2z"/><path d="M17 8h3v11a2 2 0 0 1-2 2"/><path d="M8 8h5M8 12h5M8 16h3"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>',
  move: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="18" height="18"><path d="M4 12h14M13 6l6 6-6 6"/></svg>',
  party: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.8 11.3 2 22l10.7-3.8"/><path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01"/><path d="m22 2-2.2.8a2.9 2.9 0 0 0-1.9 3.2c.1.9-.6 1.7-1.5 1.7h-.4c-.9 0-1.6.7-1.8 1.5L14 10"/><path d="m22 13-.8-.3c-.9-.3-1.8.2-2.1 1.1-.2.8-1 1.3-1.8 1.2h-.4"/><path d="m11 2 .3.8c.3.9-.2 1.8-1.1 2.1-.8.2-1.3 1-1.2 1.8v.4"/><path d="M11 13c1.9 1.9 2.8 4.1 2 4.9-.8.8-3-.1-4.9-2-1.9-1.9-2.8-4.1-2-4.9.8-.8 3 .1 4.9 2z"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  cloudOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="16" height="16"><path d="m2 2 20 20"/><path d="M5.8 5.8A7 7 0 0 0 7 19h10a5 5 0 0 0 2.2-.5"/><path d="M21.6 15.3A5 5 0 0 0 17.5 10h-1.3A7 7 0 0 0 9.4 5.1"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.5-4.5L5 21"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 6h10M10 12h10M10 18h10"/><path d="m3.5 6 1.5 1.5L7.5 5"/><path d="m3.5 12 1.5 1.5 2.5-2.5"/><path d="m3.5 18 1.5 1.5 2.5-2.5"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  redo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>'
};

/* =========================================================
   Hjelpere
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const now = () => Date.now();
const LS = {
  get(k, d = null) { try { const v = localStorage.getItem('hl.' + k); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { if (v === null || v === undefined) localStorage.removeItem('hl.' + k); else localStorage.setItem('hl.' + k, v); } catch (e) {} }
};
const COLORS = ['#9AD93A', '#FF9F7A', '#8FCBFF', '#C9A7FF', '#FFD166', '#5ED3B8', '#FF8FB1', '#B0B6C0'];
const PERSON_COLORS = ['#9AD93A', '#FF9F7A', '#8FCBFF', '#C9A7FF', '#FFD166', '#5ED3B8', '#FF8FB1'];
const LIVE_MS = 5 * 60 * 1000;

function ago(ms) {
  if (!ms) return '';
  const s = (now() - ms) / 1000;
  if (s < 60) return 'nå nettopp';
  if (s < 3600) return Math.floor(s / 60) + ' min siden';
  if (s < 86400) return Math.floor(s / 3600) + ' t siden';
  const d = Math.floor(s / 86400);
  return d === 1 ? 'i går' : d + ' dager siden';
}
const dateLong = (ms) => cap(new Intl.DateTimeFormat('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' }).format(ms));
const dateTrip = (ms) => new Intl.DateTimeFormat('nb-NO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(ms);

function makeCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const a = new Uint32Array(10); crypto.getRandomValues(a);
  return Array.from(a, (x) => chars[x % chars.length]).join('');
}
const cleanCode = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const showCode = (c) => c ? c.slice(0, 5) + '-' + c.slice(5) : '';
const cleanDomain = (s) => String(s || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split(/[/?#\s]/)[0];

/* =========================================================
   Tilstand
   ========================================================= */
const S = {
  db: null, uid: null, fid: LS.get('fid'),
  members: [], stores: [], items: [], trips: [], names: [], meta: [], dragging: false, todoChecked: false, newAssignee: null, newDue: null,
  view: { name: 'boot' },
  sort: LS.get('sort', 'cat'),
  theme: LS.get('theme', 'light'),
  unsubs: [], seen: new Set(), popId: null, ready: { members: false, stores: false, items: false, meta: false }
};
const me = () => S.members.find((m) => m.id === S.uid) || { name: LS.get('name', ''), color: LS.get('color', COLORS[0]) };
const memberOf = (uid) => S.members.find((m) => m.id === uid);
const storeOf = (sid) => S.stores.find((s) => s.id === sid);
const itemsIn = (sid) => S.items.filter((i) => i.storeId === sid);
const sortedStores = () => [...S.stores].sort((a, b) => (a.order || 0) - (b.order || 0));
const initialOf = (name) => (String(name || '?').trim().charAt(0) || '?').toUpperCase();
const firstName = (name) => String(name || '').trim().split(' ')[0] || 'Noen';
const isLive = (m) => m && m.shoppingIn && m.lastSeen && now() - m.lastSeen < LIVE_MS;
const isTodo = (s) => !!(s && s.type === 'todo');
const DONE_TTL = 24 * 3600 * 1000;
const expired = (i) => i.done && i.doneAt && now() - i.doneAt > DONE_TTL;
const visibleIn = (sid) => { const s = storeOf(sid); const l = itemsIn(sid); return isTodo(s) ? l.filter((i) => !expired(i)) : l; };
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
function dueInfo(due) {
  if (!due) return null;
  const [y, m, d] = String(due).split('-').map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d), t = new Date(); t.setHours(0, 0, 0, 0);
  const diff = Math.round((dt - t) / 86400000);
  const label = diff === 0 ? 'I dag' : diff === 1 ? 'I morgen' : diff === -1 ? 'I går'
    : `${cap(new Intl.DateTimeFormat('nb-NO', { weekday: 'short' }).format(dt).replace('.', ''))} ${d}. ${new Intl.DateTimeFormat('nb-NO', { month: 'short' }).format(dt).replace('.', '')}`;
  return { label, diff, cls: diff < 0 ? 'late' : diff === 0 ? 'today' : '' };
}

function avatar(m, cls = '') {
  if (!m) return '';
  const c = m.color || '#B0B6C0';
  return `<span class="avatar ${cls}" style="background:${esc(c)};color:#1E2026" title="${esc(m.name)}">${esc(initialOf(m.name))}</span>`;
}
function logo(store, cls = '') {
  if (!store) return '';
  if (isTodo(store)) return `<div class="logo todo-ic ${cls}" style="background:${esc(store.color || COLORS[5])}" aria-hidden="true">${I.list}</div>`;
  const mono = `<span>${esc(initialOf(store.name))}</span>`;
  let img = '';
  if (store.image) img = `<img src="${esc(store.image)}" alt="">`;
  else if (store.domain) img = `<img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(store.domain)}&sz=128" alt="" onerror="this.parentNode.classList.remove('has-img');this.remove()">`;
  return `<div class="logo ${cls} ${img ? 'has-img' : ''}" style="background:${esc(store.color || COLORS[0])}" aria-hidden="true">${img}${mono}</div>`;
}

/* =========================================================
   Tema, nett, toast, konfetti
   ========================================================= */
function applyTheme() {
  document.documentElement.dataset.theme = S.theme === 'dark' ? 'dark' : 'light';
  const tc = document.querySelector('meta[name="theme-color"]');
  if (tc) tc.content = S.theme === 'dark' ? '#2B2E35' : '#F4F3EF';
}
function updateOnline() { document.body.classList.toggle('is-offline', !navigator.onLine); }
window.addEventListener('online', updateOnline);
window.addEventListener('offline', updateOnline);

function toast(text, action) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span>${esc(text)}</span>${action ? `<button type="button">${esc(action.label)}</button>` : ''}`;
  $('#toasts').appendChild(el);
  let done = false;
  const close = () => { if (done) return; done = true; el.classList.add('out'); setTimeout(() => el.remove(), 260); };
  if (action) el.querySelector('button').onclick = () => { action.run(); close(); };
  setTimeout(close, action ? 5000 : 2600);
}
window.addEventListener('hl-error', (e) => {
  const code = e.detail && e.detail.code;
  if (code === 'permission-denied') toast('Fikk ikke lagret – mangler tilgang');
});

function confetti(power = 1) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = $('#confetti'), ctx = c.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.scale(dpr, dpr);
  const cols = ['#9AD93A', '#FF9F7A', '#8FCBFF', '#C9A7FF', '#FFD166', '#5ED3B8'];
  const n = Math.round(110 * power);
  const P = Array.from({ length: n }, () => ({
    x: innerWidth / 2 + (Math.random() - .5) * 80, y: innerHeight * .62,
    vx: (Math.random() - .5) * 13, vy: -Math.random() * 15 - 6,
    r: Math.random() * 6 + 4, a: Math.random() * 6, va: (Math.random() - .5) * .4,
    c: cols[Math.floor(Math.random() * cols.length)], s: Math.random() > .5
  }));
  const t0 = performance.now();
  (function frame(t) {
    const el = t - t0;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of P) {
      p.vy += .42; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
      ctx.globalAlpha = Math.max(0, 1 - el / 2400); ctx.fillStyle = p.c;
      if (p.s) ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); else { ctx.beginPath(); ctx.arc(0, 0, p.r / 2.4, 0, 6.3); ctx.fill(); }
      ctx.restore();
    }
    if (el < 2400) requestAnimationFrame(frame); else ctx.clearRect(0, 0, innerWidth, innerHeight);
  })(t0);
}

/* =========================================================
   Ark og dialoger
   ========================================================= */
let sheetClose = null;
function openSheet(html, onMount, { onClose } = {}) {
  if (sheetClose) sheetClose(true);
  const root = $('#overlay');
  root.innerHTML = `<div class="backdrop"><div class="sheet" role="dialog" aria-modal="true"><div class="grabber"></div>${html}</div></div>`;
  const bd = root.firstElementChild, sheet = bd.firstElementChild;
  const lastFocus = document.activeElement;
  let closed = false;
  const close = (instant) => {
    if (closed) return; closed = true; sheetClose = null;
    document.removeEventListener('keydown', onKey);
    const finish = () => { if (root.firstElementChild === bd) root.innerHTML = ''; if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); if (onClose) onClose(); };
    if (instant) finish(); else { bd.classList.add('closing'); setTimeout(finish, 200); }
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  bd.addEventListener('click', (e) => { if (e.target === bd) close(); });
  sheet.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => close()));
  // dra ned for å lukke
  let sy = null;
  sheet.querySelector('.grabber').addEventListener('pointerdown', (e) => { sy = e.clientY; });
  sheet.addEventListener('pointerup', (e) => { if (sy !== null && e.clientY - sy > 60) close(); sy = null; });
  sheetClose = close;
  if (onMount) onMount(sheet, close);
  const f = sheet.querySelector('[autofocus]') || sheet.querySelector('button, input');
  if (f) setTimeout(() => f.focus({ preventScroll: true }), 60);
  return close;
}
const head = (title) => `<div class="sheet-head"><h2>${esc(title)}</h2><button class="icon-btn" data-close aria-label="Lukk">${I.close}</button></div>`;

function ask({ title, text = '', html = '', buttons }) {
  return new Promise((resolve) => {
    let value = null;
    openSheet(`${head(title)}${text ? `<p class="muted">${esc(text)}</p>` : ''}${html}
      <div class="actions-col">${buttons.map((b, i) => `<button class="btn block ${b.kind || ''}" data-i="${i}">${esc(b.label)}</button>`).join('')}</div>`,
    (sheet, close) => {
      sheet.querySelectorAll('[data-i]').forEach((el) => el.addEventListener('click', () => { value = buttons[+el.dataset.i].value; close(); }));
    }, { onClose: () => resolve(value) });
  });
}

function pickStore({ title, exclude, todo = false }) {
  const list = sortedStores().filter((s) => s.id !== exclude && isTodo(s) === todo);
  if (!list.length) { toast(todo ? 'Du har ingen andre gjøremålslister' : 'Du har ingen andre butikker ennå'); return Promise.resolve(null); }
  return new Promise((resolve) => {
    let value = null;
    openSheet(`${head(title)}<div class="actions-col">${list.map((s) =>
      `<button class="list-row" data-sid="${s.id}">${logo(s)}<span class="grow"><b>${esc(s.name)}</b><br><span class="small muted">${visibleIn(s.id).filter((i) => !i.done).length} på listen</span></span>${I.chev}</button>`).join('')}</div>`,
    (sheet, close) => {
      sheet.querySelectorAll('[data-sid]').forEach((el) => el.addEventListener('click', () => { value = el.dataset.sid; close(); }));
    }, { onClose: () => resolve(value) });
  });
}

/* =========================================================
   Datahandlinger
   ========================================================= */
function touchStore(sid, text) {
  if (!storeOf(sid)) return;
  S.db.set(S.fid, 'stores', sid, { last: { text, at: now(), by: S.uid } }, true);
}
/* ---------- egne varer (forslag) og enheter ---------- */
const nameKey = (name) => norm(name).replace(/[\/.#\[\]$]/g, '_').slice(0, 200) || '_';
const nameRec = (name) => S.names.find((r) => r.id === nameKey(name));
const defaultUnit = (name) => { const r = nameRec(name); return (r && r.unit) || dictUnit(name); };
function bumpName(name, extra = {}) {
  const r = nameRec(name);
  const data = { name, count: ((r && r.count) || 0) + 1, lastAt: now() };
  if (extra.ean) { data.ean = extra.ean; data.img = extra.img || ''; }
  S.db.set(S.fid, 'names', nameKey(name), data, true);
}
const kr = (v) => new Intl.NumberFormat('nb-NO', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(v) + '\u00a0kr';
// Pris for linjen: antall × stykkpris når enheten er stk/pk, ellers stykkprisen
function lineTotal(it) {
  if (typeof it.price !== 'number') return null;
  const p = it.qty ? parseQty(it.qty) : null;
  return p && (p.unit === 'stk' || p.unit === 'pk') ? p.n * it.price : it.price;
}
// Enheten blir ny standard etter tre handleturer på rad med samme (avvikende) enhet.
function unitOps(doneItems) {
  const ops = [], seen = new Set();
  for (const it of doneItems) {
    const k = nameKey(it.name); if (seen.has(k)) continue; seen.add(k);
    const p = it.qty ? parseQty(it.qty) : null;
    if (!p) continue;
    const r = nameRec(it.name) || {};
    const def = r.unit || dictUnit(it.name);
    let data;
    if (p.unit === def) data = { cand: null, streak: 0 };
    else if (p.unit === r.cand) {
      const streak = (r.streak || 0) + 1;
      data = streak >= 3 ? { unit: p.unit, cand: null, streak: 0 } : { cand: p.unit, streak };
    } else data = { cand: p.unit, streak: 1 };
    ops.push({ type: 'set', c: 'names', id: k, data: { name: r.name || it.name, ...data }, merge: true });
  }
  return ops;
}
// Varer familien selv har skrevet inn, mest brukte først
function vocab() {
  const map = new Map();
  const add = (name, c, at) => {
    const k = nameKey(name); if (!name || k === '_') return;
    const e = map.get(k) || { name, c: 0, at: 0 };
    e.c += c; e.at = Math.max(e.at, at || 0); map.set(k, e);
  };
  S.names.forEach((r) => add(r.name, r.count || 0, r.lastAt));
  if (map.size < 3) { // eldre data fra før forslagslisten fantes
    S.trips.forEach((t) => (t.items || []).forEach((i) => { if (!map.has(nameKey(i.name))) add(i.name, 1, t.at); }));
    S.items.forEach((i) => { if (!isTodo(storeOf(i.storeId)) && !map.has(nameKey(i.name))) add(i.name, 1, i.createdAt); });
  }
  return [...map.values()].sort((a, b) => b.c - a.c || b.at - a.at).map((e) => e.name);
}
function frequentNames(sid, limit = 12) {
  const open = new Set(S.items.filter((i) => !i.done && (!sid || i.storeId === sid)).map((i) => norm(i.name)));
  return vocab().filter((n) => !open.has(norm(n))).slice(0, limit);
}
function autocomplete(q, limit = 6) {
  const n = norm(q); if (!n) return [];
  const seen = new Set(), all = [];
  [...vocab(), ...COMMON].forEach((x) => { const k = norm(x); if (!seen.has(k)) { seen.add(k); all.push(x); } });
  const starts = all.filter((x) => norm(x).startsWith(n) && norm(x) !== n);
  const incl = all.filter((x) => !norm(x).startsWith(n) && norm(x).includes(n));
  return [...starts, ...incl].slice(0, limit);
}
const parseInput = (text) => splitInput(text, defaultUnit);

function addItem(sid, name, qty = '', extra = {}) {
  name = cap(String(name || '').trim());
  if (!name || !sid) return false;
  const todo = isTodo(storeOf(sid));
  if (!todo) {
    const dup = itemsIn(sid).find((i) => !i.done && norm(i.name) === norm(name));
    if (dup) { flash(dup.id); toast(`${dup.name} står allerede på listen`); return false; }
  }
  const id = S.db.newId();
  const m = me();
  const data = { storeId: sid, name, qty: todo ? '' : (qty || ''), cat: todo ? '' : categorize(name), done: false, createdAt: now(), by: S.uid, byName: m.name || '' };
  if (todo) { data.assignee = extra.assignee || null; data.due = extra.due || null; }
  else if (extra.ean) { data.ean = extra.ean; data.img = extra.img || ''; data.size = extra.size || ''; data.price = typeof extra.price === 'number' ? extra.price : null; data.priceAt = now(); }
  S.db.set(S.fid, 'items', id, data);
  touchStore(sid, todo ? `${firstName(m.name)} la til «${name}»` : `${firstName(m.name)} la til ${name.toLowerCase()}`);
  if (!todo) bumpName(name, extra);
  return true;
}

// Tallvelger: velg antall for en vare fra forslagsraden
function openQtyPicker(name, sid, after, extra = {}) {
  const unit = extra.ean ? 'stk' : defaultUnit(name);
  openSheet(`${head(name)}
    ${extra.img ? `<div class="pick-prod"><img src="${esc(extra.img)}" alt="" referrerpolicy="no-referrer"><span>${extra.size ? esc(extra.size) + '<br>' : ''}${typeof extra.price === 'number' ? `<b>${esc(kr(extra.price))}</b>` : '<span class="muted">Ingen pris for denne butikken</span>'}</span></div>` : ''}
    <p class="muted" style="margin-top:-8px">Velg antall (${esc(unit)})</p>
    <div class="qty-grid">${STEPS.map((n) => `<button type="button" class="qty-btn" data-n="${n}">${fmtNum(n)}</button>`).join('')}</div>
    <button type="button" class="btn block" data-none>Legg til uten antall</button>`,
  (sh, close) => {
    const done = (qty) => { if (addItem(sid, name, qty, extra)) { toast(`${name}${qty ? ' (' + qty + ')' : ''} lagt til`); if (after) after(); } close(); };
    sh.querySelectorAll('[data-n]').forEach((b) => b.onclick = () => done(fmtQty({ n: +b.dataset.n, unit })));
    sh.querySelector('[data-none]').onclick = () => done('');
  });
}
function toggleItem(id) {
  const it = S.items.find((i) => i.id === id); if (!it) return;
  const done = !it.done;
  S.popId = done ? id : null;
  S.db.update(S.fid, 'items', id, { done, doneAt: done ? now() : null, doneBy: done ? S.uid : null });
  if (done) {
    touchStore(it.storeId, isTodo(storeOf(it.storeId)) ? `${firstName(me().name)} fullførte «${it.name}»` : `${firstName(me().name)} krysset av ${it.name.toLowerCase()}`);
    const left = itemsIn(it.storeId).filter((i) => !i.done && i.id !== id).length;
    if (left === 0) setTimeout(() => confetti(.5), 150);
    if (navigator.vibrate) navigator.vibrate(12);
  }
}
function deleteItem(id) {
  const it = S.items.find((i) => i.id === id); if (!it) return;
  const copy = { ...it }; delete copy.id;
  S.db.remove(S.fid, 'items', id);
  toast(`${it.name} er slettet`, { label: 'Angre', run: () => S.db.set(S.fid, 'items', id, copy) });
}

// Flytter varer til en annen butikk. Ved duplikat: spør om å slå sammen eller slette.
async function moveItems(ids, target) {
  const tStore = storeOf(target); if (!tStore) return;
  let moved = 0;
  for (const id of ids) {
    const it = S.items.find((i) => i.id === id); if (!it) continue;
    const dup = isTodo(tStore) ? null : itemsIn(target).find((i) => !i.done && i.id !== id && norm(i.name) === norm(it.name));
    if (dup) {
      const merged = mergeQty(dup.qty, it.qty);
      const choice = await ask({
        title: `${it.name} finnes allerede`,
        text: `${tStore.name}-listen har allerede ${dup.name}${dup.qty ? ' (' + dup.qty + ')' : ''}. Hva vil du gjøre?`,
        buttons: [
          { label: `Slå sammen → ${merged}`, value: 'merge', kind: 'primary' },
          { label: `Slett denne ${it.name.toLowerCase()}`, value: 'delete' },
          { label: 'Avbryt', value: null, kind: 'danger' }
        ]
      });
      if (choice === 'merge') {
        S.db.batch(S.fid, [{ type: 'update', c: 'items', id: dup.id, data: { qty: merged } }, { type: 'delete', c: 'items', id }]);
        moved++;
      } else if (choice === 'delete') {
        S.db.remove(S.fid, 'items', id); moved++;
      }
    } else {
      S.db.update(S.fid, 'items', id, { storeId: target, done: false, doneAt: null, doneBy: null, price: null, priceAt: 0 });
      moved++;
    }
  }
  const word = isTodo(tStore) ? ['oppgave', 'oppgaver', 'en oppgave'] : ['vare', 'varer', 'en vare'];
  if (moved) { toast(`${moved === 1 ? '1 ' + word[0] : moved + ' ' + word[1]} flyttet til ${tStore.name}`); touchStore(target, `${firstName(me().name)} flyttet ${moved === 1 ? word[2] : moved + ' ' + word[1]} hit`); }
}
async function moveFlow(ids, fromSid) {
  const t = await pickStore({ title: ids.length > 1 ? `Flytt ${ids.length} varer til` : 'Flytt til', exclude: fromSid, todo: isTodo(storeOf(fromSid)) });
  if (t) await moveItems(ids, t);
}

async function finishTrip(sid) {
  const store = storeOf(sid); if (!store) return;
  let list = itemsIn(sid);
  const open = list.filter((i) => !i.done);
  if (open.length) {
    const names = open.slice(0, 6).map((i) => esc(i.name)).join(', ') + (open.length > 6 ? ' …' : '');
    const choice = await ask({
      title: `${open.length === 1 ? '1 vare' : open.length + ' varer'} ble ikke kjøpt`,
      html: `<p class="muted">${names}</p>`,
      buttons: [
        { label: 'La dem stå på listen', value: 'keep', kind: 'primary' },
        { label: 'Flytt til en annen butikk', value: 'move' },
        { label: 'Fjern dem', value: 'remove' },
        { label: 'Avbryt', value: null, kind: 'danger' }
      ]
    });
    if (!choice) return;
    if (choice === 'move') {
      const t = await pickStore({ title: 'Flytt til', exclude: sid });
      if (!t) return;
      await moveItems(open.map((i) => i.id), t);
    } else if (choice === 'remove') {
      S.db.batch(S.fid, open.map((i) => ({ type: 'delete', c: 'items', id: i.id })));
    }
  }
  list = itemsIn(sid);
  const done = list.filter((i) => i.done);
  if (done.length) {
    const tripId = S.db.newId();
    const ops = [{ type: 'set', c: 'trips', id: tripId, data: {
      storeId: sid, storeName: store.name, at: now(), by: S.uid, byName: me().name || '',
      items: done.map((i) => ({ name: i.name, qty: i.qty || '' }))
    } }];
    done.forEach((i) => ops.push({ type: 'delete', c: 'items', id: i.id }));
    ops.push({ type: 'set', c: 'stores', id: sid, data: { last: { text: `${firstName(me().name)} handlet ${done.length} varer`, at: now(), by: S.uid } }, merge: true });
    ops.push(...unitOps(done));
    S.db.batch(S.fid, ops);
  }
  setPresence(null);
  confetti(1);
  toast(done.length ? 'Handletur lagret i historikken' : 'Ferdig!');
}

/* =========================================================
   Tilstedeværelse («handler nå»)
   ========================================================= */
let beat = null;
function setPresence(sid) {
  if (!S.fid || !S.uid) return;
  if (sid && isTodo(storeOf(sid))) sid = null;
  S.db.set(S.fid, 'members', S.uid, { shoppingIn: sid || null, lastSeen: now() }, true);
  clearInterval(beat); beat = null;
  if (sid) beat = setInterval(() => { if (document.visibilityState === 'visible') S.db.set(S.fid, 'members', S.uid, { lastSeen: now() }, true); }, 60000);
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && S.view.name === 'store') setPresence(S.view.sid);
});

/* =========================================================
   Visninger
   ========================================================= */
const app = $('#app');
let suppressClick = false;

function go(name, extra = {}, back = false) {
  const prev = S.view;
  if (prev.name === 'store' && !(name === 'store' && extra.sid === prev.sid)) setPresence(null);
  S.view = { name, ...extra };
  S.seen = new Set();
  window.scrollTo(0, 0);
  if (name === 'store') setPresence(extra.sid);
  render(back);
  if (!back && name !== 'welcome' && name !== 'boot') history.pushState({ v: S.view }, '');
}
window.addEventListener('popstate', (e) => {
  if (sheetClose) { sheetClose(); history.pushState({ v: S.view }, ''); return; }
  const v = (e.state && e.state.v) || { name: 'home' };
  if (!S.fid) return;
  const prev = S.view;
  if (prev.name === 'store' && v.sid !== prev.sid) setPresence(null);
  S.view = v; S.seen = new Set();
  if (v.name === 'store') { if (!storeOf(v.sid)) S.view = { name: 'home' }; else setPresence(v.sid); }
  render(true);
});

function render(back = false) {
  const v = S.view.name;
  if (v === 'welcome') return renderWelcome();
  if (v === 'home') app.innerHTML = `<div class="screen ${back ? 'back' : ''}" id="screen"></div>`, refreshHome(true);
  else if (v === 'store') renderStore(back);
  else if (v === 'settings') app.innerHTML = `<div class="screen ${back ? 'back' : ''}" id="screen"></div>`, refreshSettings();
  else if (v === 'history') app.innerHTML = `<div class="screen ${back ? 'back' : ''}" id="screen"></div>`, refreshHistory();
}
let lastClean = 0;
function housekeeping() {
  if (!S.fid) return;
  if (!S.todoChecked && S.ready.stores && S.ready.meta) {
    S.todoChecked = true;
    const setup = S.meta.find((x) => x.id === 'setup');
    if (!(setup && setup.todos)) {
      S.db.batch(S.fid, [
        { type: 'set', c: 'stores', id: 'todo-hjemme', data: { name: 'Hjemme', type: 'todo', color: '#5ED3B8', order: 1e9 }, merge: true },
        { type: 'set', c: 'stores', id: 'todo-hytta', data: { name: 'Hytta', type: 'todo', color: '#FFD166', order: 1e9 + 1 }, merge: true },
        { type: 'set', c: 'meta', id: 'setup', data: { todos: true }, merge: true }
      ]);
    }
  }
  if (S.ready.items && now() - lastClean > 60000) {
    lastClean = now();
    const old = S.items.filter((i) => expired(i) && isTodo(storeOf(i.storeId)));
    if (old.length) S.db.batch(S.fid, old.map((i) => ({ type: 'delete', c: 'items', id: i.id })));
  }
}
function refresh() {
  housekeeping();
  const v = S.view.name;
  if (v === 'home') refreshHome(false);
  else if (v === 'store') { if (!storeOf(S.view.sid)) { if (S.ready.stores) go('home', {}, true); return; } refreshStore(); }
  else if (v === 'settings') refreshSettings();
  else if (v === 'history') refreshHistory();
}

/* ---------- velkomst ---------- */
function renderWelcome() {
  const inviteCode = cleanCode(new URLSearchParams(location.search).get('familie') || LS.get('invite', ''));
  app.innerHTML = `<div class="screen welcome">
    <div class="hero">
      <div class="hero-icon">${I.cart}</div>
      <h1 class="title">Handleliste</h1>
      <p class="muted" style="margin:0;font-size:16px;line-height:1.5">Familiens felles handleliste. Alt oppdateres live på alles telefoner.</p>
    </div>
    <div class="field"><label for="w-name">Hva heter du?</label>
      <input id="w-name" class="input" autocomplete="given-name" placeholder="Fornavn" value="${esc(LS.get('name', ''))}"></div>
    ${inviteCode ? `
      <div class="card"><div class="label">Du er invitert til en familieliste</div>
        <div class="input code" style="display:flex;align-items:center;justify-content:center">${esc(showCode(inviteCode))}</div>
        <button class="btn primary block" id="w-join-invite">Bli med</button></div>
      <button class="btn block" id="w-other">Bruk en annen kode</button>` : `
      <button class="btn primary block" id="w-new">Start en ny familieliste</button>
      <div class="divider">eller bli med i en eksisterende</div>
      <div class="field"><label for="w-code">Familiekode</label>
        <input id="w-code" class="input code" placeholder="XXXXX-XXXXX" autocomplete="off" autocapitalize="characters"></div>
      <button class="btn block" id="w-join">Bli med</button>`}
    ${S.db.mode === 'local' ? '<p class="small muted" style="margin:0">Demomodus: lagres bare på denne enheten til Firebase er koblet til.</p>' : ''}
  </div>`;
  const nameEl = $('#w-name');
  const needName = () => { const n = nameEl.value.trim(); if (!n) { nameEl.focus(); toast('Skriv navnet ditt først'); return null; } return n; };
  const busy = (b) => app.querySelectorAll('button').forEach((x) => x.disabled = b);
  const join = async (code, isNew) => {
    const name = needName(); if (!name) return;
    busy(true);
    try {
      if (isNew) await S.db.createFamily(code);
      await startFamily(code, name, isNew);
    } catch (e) {
      console.error(e); busy(false);
      toast(e && e.code === 'permission-denied' ? 'Fant ingen familie med den koden' : 'Noe gikk galt – sjekk nettet og prøv igjen');
    }
  };
  if (inviteCode) {
    $('#w-join-invite').onclick = () => join(inviteCode, false);
    $('#w-other').onclick = () => { LS.set('invite', null); history.replaceState(null, '', location.pathname); renderWelcome(); };
    if (!nameEl.value) nameEl.focus();
  } else {
    $('#w-new').onclick = () => join(makeCode(), true);
    $('#w-join').onclick = () => { const c = cleanCode($('#w-code').value); if (c.length < 6) { toast('Skriv inn familiekoden'); return; } join(c, false); };
    $('#w-code').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#w-join').click(); });
  }
}

async function startFamily(fid, name, isNew) {
  const color = LS.get('color') || PERSON_COLORS[Math.floor(Math.random() * PERSON_COLORS.length)];
  await S.db.join(fid, S.uid, { name, color, joinedAt: now(), lastSeen: now(), shoppingIn: null });
  LS.set('fid', fid); LS.set('name', name); LS.set('color', color); LS.set('invite', null);
  S.fid = fid;
  if (isNew) {
    const defaults = [['Rema 1000', 'rema.no', COLORS[0]], ['Kiwi', 'kiwi.no', COLORS[1]], ['Coop Extra', 'coop.no', COLORS[2]], ['Europris', 'europris.no', COLORS[3]]];
    S.db.batch(fid, defaults.map(([n, d, c], i) => ({ type: 'set', c: 'stores', id: S.db.newId(), data: { name: n, domain: d, color: c, flyer: '', image: '', order: i } })));
  }
  history.replaceState(null, '', location.pathname);
  subscribe();
  S.view = { name: 'home' };
  history.replaceState({ v: S.view }, '');
  render();
  if (isNew) setTimeout(() => toast('Familielisten er klar! Del koden fra innstillinger.'), 500);
}

/* ---------- hjem ---------- */
function refreshHome(first) {
  const scr = $('#screen'); if (!scr || S.dragging) return;
  const shopping = S.members.filter(isLive);
  const liveText = shopping.length === 0 ? 'Ingen handler nå'
    : shopping.length === 1 ? `${firstName(shopping[0].name)} handler nå` : `${shopping.length} handler nå`;
  const stores = sortedStores();
  scr.innerHTML = `
    <div class="topbar">
      <div><div class="eyebrow">${esc(dateLong(now()))}</div><h1 class="title">Handlelister</h1></div>
      <div class="actions">
        <button class="icon-btn" data-act="history" aria-label="Historikk">${I.clock}</button>
        <button class="icon-btn" data-act="settings" aria-label="Innstillinger">${I.gear}</button>
      </div>
    </div>
    <button class="family" data-act="settings" style="border:0;width:100%;text-align:left" aria-label="Familien – åpne innstillinger">
      <span style="display:flex;align-items:center"><span class="avatars">${S.members.slice(0, 5).map((m) => avatar(m)).join('')}</span><span class="family-name">Familien</span></span>
      <span class="live"><span class="live-dot ${shopping.length ? 'on' : ''}"></span>${esc(liveText)}</span>
    </button>
    <span class="offline pill">${I.cloudOff} Uten nett – endringer lagres og sendes senere</span>
    ${S.db.mode === 'local' ? '<span class="pill">Demomodus – lagres bare på denne enheten</span>' : ''}
    <div class="section-row"><h2 class="section">Lister</h2><span class="small muted">${stores.length > 1 ? 'Hold inne og dra for å sortere' : ''}</span></div>
    <div class="stores">
      ${stores.map((s, i) => storeCard(s, first ? i : -1)).join('')}
      <button class="dashed-btn" data-act="new-store">${I.plus} Ny liste</button>
    </div>
    ${stores.length ? `<button class="fab" data-act="add" aria-label="Legg til vare">${I.plus}</button>` : ''}`;
}
function storeCard(s, i) {
  if (isTodo(s)) return todoCard(s, i);
  const list = itemsIn(s.id);
  const open = list.filter((x) => !x.done).length;
  const done = list.length - open;
  const pct = list.length ? Math.round((done / list.length) * 100) : 0;
  const here = S.members.filter((m) => isLive(m) && m.shoppingIn === s.id);
  const meta = here.length ? `${here.map((m) => firstName(m.name)).join(' og ')} handler her nå`
    : s.last && s.last.text ? `${s.last.text} · ${ago(s.last.at)}` : 'Ingen endringer ennå';
  return `<button class="store-card" data-act="open-store" data-sid="${s.id}" style="${i < 0 ? 'animation:none' : `animation-delay:${i * 0.06}s`}">
    ${logo(s)}
    <span class="store-body">
      <span class="store-top"><span class="store-name">${esc(s.name)}</span><span class="small muted">${open ? open + ' igjen' : list.length ? 'Alt i kurven' : 'Tom'}</span></span>
      <span class="progress"><div style="width:${pct}%;background:${esc(s.color || COLORS[0])}"></div></span>
      <span class="store-meta">${here.length ? '<span class="live-dot on" style="display:inline-block;margin-right:6px;vertical-align:middle"></span>' : ''}${esc(meta)}</span>
    </span></button>`;
}

function todoCard(s, i) {
  const list = visibleIn(s.id);
  const open = list.filter((x) => !x.done);
  const pct = list.length ? Math.round(((list.length - open.length) / list.length) * 100) : 0;
  const late = open.filter((x) => { const d = dueInfo(x.due); return d && d.diff < 0; }).length;
  const today = open.filter((x) => { const d = dueInfo(x.due); return d && d.diff === 0; }).length;
  const flags = [late ? `${late} forfalt` : '', today ? `${today} i dag` : ''].filter(Boolean).join(' · ');
  const meta = flags || (s.last && s.last.text ? `${s.last.text} · ${ago(s.last.at)}` : 'Ingen oppgaver ennå');
  return `<button class="store-card" data-act="open-store" data-sid="${s.id}" style="${i < 0 ? 'animation:none' : `animation-delay:${i * 0.06}s`}">
    ${logo(s)}
    <span class="store-body">
      <span class="store-top"><span class="store-name">${esc(s.name)}</span><span class="small muted">${open.length ? open.length + ' igjen' : list.length ? 'Alt gjort' : 'Tom'}</span></span>
      <span class="progress"><div style="width:${pct}%;background:${esc(s.color || COLORS[5])}"></div></span>
      <span class="store-meta ${late ? 'late' : ''}">${esc(meta)}</span>
    </span></button>`;
}

/* ---------- dra for å endre rekkefølge på butikker ---------- */
(function bindReorder() {
  let st = null;
  const cancel = () => { if (!st) return; clearTimeout(st.timer); st.card.classList.remove('pressing'); st = null; };
  const lift = () => {
    if (!st) return;
    const card = st.card, list = card.parentNode;
    st.active = true; S.dragging = true;
    card.classList.remove('pressing'); card.classList.add('lifted');
    list.classList.add('reordering');
    st.cards = [...list.querySelectorAll('.store-card')];
    st.idx = st.target = st.cards.indexOf(card);
    st.rects = st.cards.map((c) => c.getBoundingClientRect());
    const r = st.rects[st.idx], nb = st.rects[st.idx + 1] || st.rects[st.idx - 1];
    st.step = nb ? Math.abs(nb.top - r.top) : r.height + 12;
    try { card.setPointerCapture(st.pid); } catch (e) {}
    if (navigator.vibrate) navigator.vibrate(20);
  };
  app.addEventListener('pointerdown', (e) => {
    const card = e.target.closest('.store-card');
    if (!card || S.view.name !== 'home' || (e.pointerType === 'mouse' && e.button !== 0)) return;
    cancel();
    st = { card, pid: e.pointerId, x: e.clientX, y: e.clientY, active: false };
    card.classList.add('pressing');
    st.timer = setTimeout(lift, 450);
  });
  app.addEventListener('pointermove', (e) => {
    if (!st || e.pointerId !== st.pid) return;
    const dy = e.clientY - st.y;
    if (!st.active) { if (Math.hypot(e.clientX - st.x, dy) > 8) cancel(); return; }
    st.card.style.transform = `translateY(${dy}px)`;
    const c = st.rects[st.idx].top + st.rects[st.idx].height / 2 + dy;
    let t = st.idx;
    for (let i = 0; i < st.idx; i++) if (c < st.rects[i].top + st.rects[i].height / 2) { t = i; break; }
    if (t === st.idx) for (let i = st.rects.length - 1; i > st.idx; i--) if (c > st.rects[i].top + st.rects[i].height / 2) { t = i; break; }
    if (t !== st.target && navigator.vibrate) navigator.vibrate(6);
    st.target = t;
    st.cards.forEach((el, i) => {
      if (i === st.idx) return;
      let sh = 0;
      if (st.idx < t && i > st.idx && i <= t) sh = -st.step;
      else if (st.idx > t && i >= t && i < st.idx) sh = st.step;
      el.style.transform = sh ? `translateY(${sh}px)` : '';
    });
  });
  document.addEventListener('touchmove', (e) => { if (st && st.active) e.preventDefault(); }, { passive: false });
  app.addEventListener('contextmenu', (e) => { if (e.target.closest('.store-card')) e.preventDefault(); });
  const end = () => {
    if (!st) return;
    const s = st; st = null;
    clearTimeout(s.timer); s.card.classList.remove('pressing');
    if (!s.active) return;
    suppressClick = true; setTimeout(() => { suppressClick = false; }, 120);
    S.dragging = false;
    if (s.target !== s.idx) {
      const order = sortedStores().map((x) => x.id);
      const [m] = order.splice(s.idx, 1); order.splice(s.target, 0, m);
      order.forEach((id, i) => { const so = storeOf(id); if (so) so.order = i; });
      S.db.batch(S.fid, order.map((id, i) => ({ type: 'set', c: 'stores', id, data: { order: i }, merge: true })));
    }
    refreshHome(false);
  };
  app.addEventListener('pointerup', end);
  app.addEventListener('pointercancel', end);
})();

/* ---------- liste ---------- */
function renderStore(back) {
  const s = storeOf(S.view.sid);
  if (!s) { go('home', {}, true); return; }
  if (isTodo(s)) return renderTodo(back);
  app.innerHTML = `<div class="screen ${back ? 'back' : ''}" id="screen" style="padding-bottom:calc(var(--safe-bottom) + 240px)">
    <div class="topbar">
      <button class="icon-btn" data-act="home" aria-label="Tilbake til alle lister">${I.back}</button>
      <div id="presence"></div>
      <div class="actions">
        <button class="icon-btn" data-act="flyer" aria-label="Tilbudsavis">${I.paper}</button>
        <button class="icon-btn" data-act="edit-store" aria-label="Rediger butikk">${I.dots}</button>
      </div>
    </div>
    <div class="list-head" id="list-head"></div>
    <span class="offline pill">${I.cloudOff} Uten nett – endringer sendes når du får dekning</span>
    <div class="items" id="items"></div>
  </div>
  <div class="bottom-bar"><div class="bottom-inner">
    <div id="finish"></div>
    <div class="products" id="products" aria-label="Treff i nettbutikken" hidden></div>
    <div class="suggest" id="suggest" aria-label="Forslag"></div>
    <form class="addbar" id="addform" autocomplete="off">
      <label class="sr-only" for="newitem">Ny vare</label>
      <input id="newitem" placeholder="Legg til vare …  (f.eks. melk 2 liter)" enterkeyhint="done">
      <button class="add-btn" aria-label="Legg til">${I.plus}</button>
    </form>
  </div></div>`;
  const input = $('#newitem');
  $('#addform').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim(); if (!v) { openAddSheet(S.view.sid); return; }
    const { name, qty } = parseInput(v);
    if (addItem(S.view.sid, name, qty)) { input.value = ''; renderSuggest(); renderProducts([]); }
  });
  input.addEventListener('input', () => { renderSuggest(); queueSearch(); });
  refreshPrices(S.view.sid);
  bindSwipe($('#items'));
  refreshStore(true);
}
function refreshStore(first = false) {
  const sid = S.view.sid, s = storeOf(sid); if (!s || !$('#items')) return;
  if (isTodo(s)) return refreshTodo(first);
  const list = itemsIn(sid);
  const open = list.filter((i) => !i.done);
  const done = list.filter((i) => i.done).sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0));
  const pct = list.length ? done.length / list.length : 0;
  const others = S.members.filter((m) => m.id !== S.uid && isLive(m) && m.shoppingIn === sid);
  $('#presence').innerHTML = others.length
    ? `<span class="pill"><span class="live-dot on"></span>${esc(others.map((m) => firstName(m.name)).join(' og '))} handler nå</span>` : '';
  $('#list-head').innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;min-width:0">${logo(s, 'lg')}
      <div style="min-width:0"><h1 class="title">${esc(s.name)}</h1>
      <div class="muted" style="font-size:14px;margin-top:4px">${open.length} igjen · ${done.length} i kurven${sumText(list)}</div></div></div>
    <div class="ring" role="img" aria-label="${Math.round(pct * 100)} prosent handlet">
      <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="var(--track)" stroke-width="7"/>
      <circle cx="32" cy="32" r="26" fill="none" stroke="var(--accent)" stroke-width="7" stroke-linecap="round" stroke-dasharray="163.4" stroke-dashoffset="${(163.4 * (1 - pct)).toFixed(1)}"/></svg>
      <span aria-hidden="true">${Math.round(pct * 100)}%</span></div>`;

  let html = '';
  let k = 0;
  const row = (it) => itemRow(it, first ? k++ : -1);
  if (!list.length) {
    html = `<div class="empty">${I.cart}<div class="big">Listen er tom</div><div>Skriv inn en vare nederst, eller trykk på et forslag.</div></div>`;
  } else if (!open.length) {
    html = `<div class="empty">${I.party}<div class="big">Alt er i kurven!</div><div>Trykk «Ferdig handlet» når du er ferdig.</div></div>`;
  } else if (S.sort === 'cat') {
    const groups = new Map();
    open.forEach((i) => { const c = i.cat || categorize(i.name); if (!groups.has(c)) groups.set(c, []); groups.get(c).push(i); });
    const cats = [...groups.keys()].sort((a, b) => CATEGORIES.indexOf(a) - CATEGORIES.indexOf(b));
    for (const c of cats) {
      html += `<div class="group-label">${esc(c)}</div>`;
      html += groups.get(c).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)).map(row).join('');
    }
  } else {
    html += `<div class="group-label">Igjen</div>` + open.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)).map(row).join('');
  }
  if (done.length) html += `<div class="group-label">I kurven</div>` + done.map(row).join('');
  $('#items').innerHTML = html;
  list.forEach((i) => S.seen.add(i.id));
  S.popId = null;

  $('#finish').innerHTML = done.length
    ? `<button class="finish-btn ${open.length ? '' : 'ready'}" data-act="finish">${I.check} ${open.length ? `Ferdig handlet (${done.length} i kurven)` : 'Ferdig handlet'}</button>` : '';
  renderSuggest();
}
function itemRow(it, i) {
  const enter = i >= 0 || !S.seen.has(it.id);
  const todo = isTodo(storeOf(it.storeId));
  const by = todo ? (it.assignee ? memberOf(it.assignee) : null) : (memberOf(it.by) || (it.byName ? { name: it.byName, color: '#B0B6C0' } : null));
  const due = todo && !it.done ? dueInfo(it.due) : null;
  const lt = todo ? null : lineTotal(it);
  const sub = [it.qty || '', lt != null ? kr(lt) : ''].filter(Boolean).join(' · ');
  return `<div class="item-wrap" data-id="${it.id}" style="${enter ? `animation-delay:${Math.min(Math.max(i, 0), 10) * 0.03}s` : 'animation:none'}">
    <div class="item-bg">${I.move} Flytt</div>
    <div class="item ${it.done ? 'done' : ''}" data-id="${it.id}">
      <button class="check ${it.done ? 'on' : ''} ${S.popId === it.id ? 'pop' : ''}" data-act="toggle" data-id="${it.id}" aria-pressed="${it.done}" aria-label="${it.done ? 'Fjern kryss for' : 'Kryss av'} ${esc(it.name)}">${it.done ? I.check : ''}</button>
      ${it.img && !todo ? `<button class="item-img-btn" data-act="edit-item" data-id="${it.id}" aria-label="Vis ${esc(it.name)}"><img class="item-img" src="${esc(it.img)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.remove()"></button>` : ''}
      <button class="item-text" data-act="edit-item" data-id="${it.id}" aria-label="Endre ${esc(it.name)}">
        <span class="item-name">${esc(it.name)}</span>${sub ? `<span class="item-qty">${esc(sub)}</span>` : ''}${due ? `<span class="item-qty due ${due.cls}">${I.cal} ${esc(due.label)}</span>` : ''}</button>
      ${by ? avatar(by, 'sm') : ''}
    </div></div>`;
}
/* ---------- gjøremål ---------- */
function renderTodo(back) {
  S.newDue = null;
  if (S.newAssignee && !memberOf(S.newAssignee)) S.newAssignee = null;
  app.innerHTML = `<div class="screen ${back ? 'back' : ''}" id="screen" style="padding-bottom:calc(var(--safe-bottom) + 190px)">
    <div class="topbar">
      <button class="icon-btn" data-act="home" aria-label="Tilbake til alle lister">${I.back}</button>
      <span></span>
      <div class="actions"><button class="icon-btn" data-act="edit-store" aria-label="Rediger listen">${I.dots}</button></div>
    </div>
    <div class="list-head" id="list-head"></div>
    <span class="offline pill">${I.cloudOff} Uten nett – endringer sendes når du får dekning</span>
    <div class="items" id="items"></div>
  </div>
  <div class="bottom-bar"><div class="bottom-inner">
    <div class="suggest" id="assign" aria-label="Hvem skal gjøre det?"></div>
    <form class="addbar" id="addform" autocomplete="off">
      <label class="sr-only" for="newitem">Ny oppgave</label>
      <input id="newitem" placeholder="Ny oppgave …" enterkeyhint="done">
      <input type="date" id="newdue" class="sr-only" tabindex="-1" aria-hidden="true">
      <button class="add-btn" aria-label="Legg til">${I.plus}</button>
    </form>
  </div></div>`;
  const input = $('#newitem');
  $('#addform').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim(); if (!v) { input.focus(); return; }
    if (addItem(S.view.sid, v, '', { assignee: S.newAssignee, due: S.newDue })) { input.value = ''; S.newDue = null; renderAssign(); }
  });
  $('#newdue').addEventListener('change', (e) => { S.newDue = e.target.value || null; renderAssign(); });
  bindSwipe($('#items'));
  refreshTodo(true);
}
function renderAssign() {
  const el = $('#assign'); if (!el) return;
  const due = dueInfo(S.newDue);
  el.innerHTML = S.members.map((m) => {
    const on = S.newAssignee === m.id;
    return `<button type="button" class="chip ${on ? 'on' : ''}" data-act="assign" data-uid="${m.id}" aria-pressed="${on}">${avatar(m, 'xs')}${esc(firstName(m.name))}</button>`;
  }).join('') + `<button type="button" class="chip ${due ? 'on' : 'outline'}" data-act="pick-due" aria-label="${due ? 'Fjern dato ' + esc(due.label) : 'Velg dato'}">${I.cal} ${due ? esc(due.label) + ' ✕' : 'Dato'}</button>`;
}
function sortTodos(list) {
  return [...list].sort((a, b) => {
    if (a.due && b.due) return a.due < b.due ? -1 : a.due > b.due ? 1 : (a.createdAt || 0) - (b.createdAt || 0);
    if (a.due) return -1; if (b.due) return 1;
    return (a.createdAt || 0) - (b.createdAt || 0);
  });
}
function refreshTodo(first = false) {
  const sid = S.view.sid, s = storeOf(sid); if (!s || !$('#items')) return;
  const list = visibleIn(sid);
  const open = sortTodos(list.filter((i) => !i.done));
  const done = list.filter((i) => i.done).sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0));
  const pct = list.length ? done.length / list.length : 0;
  $('#list-head').innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;min-width:0">${logo(s, 'lg')}
      <div style="min-width:0"><h1 class="title">${esc(s.name)}</h1>
      <div class="muted" style="font-size:14px;margin-top:4px">${open.length} igjen · ${done.length} ferdig</div></div></div>
    <div class="ring" role="img" aria-label="${Math.round(pct * 100)} prosent gjort">
      <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="var(--track)" stroke-width="7"/>
      <circle cx="32" cy="32" r="26" fill="none" stroke="var(--accent)" stroke-width="7" stroke-linecap="round" stroke-dasharray="163.4" stroke-dashoffset="${(163.4 * (1 - pct)).toFixed(1)}"/></svg>
      <span aria-hidden="true">${Math.round(pct * 100)}%</span></div>`;
  let k = 0;
  const row = (it) => itemRow(it, first ? k++ : -1);
  let html = '';
  if (!list.length) html = `<div class="empty">${I.list}<div class="big">Ingen oppgaver</div><div>Velg hvem som skal gjøre det, skriv oppgaven nederst og trykk +.</div></div>`;
  else if (!open.length) html = `<div class="empty">${I.party}<div class="big">Alt er gjort!</div><div>Ferdige oppgaver forsvinner etter et døgn.</div></div>`;
  else html = open.map(row).join('');
  if (done.length) html += `<div class="group-label">Ferdig</div>` + done.map(row).join('');
  $('#items').innerHTML = html;
  list.forEach((i) => S.seen.add(i.id));
  S.popId = null;
  renderAssign();
}

function openTodoSheet(id) {
  const it = S.items.find((i) => i.id === id); if (!it) return;
  const others = sortedStores().filter((s) => isTodo(s) && s.id !== it.storeId);
  let who = it.assignee || null;
  openSheet(`${head('Endre oppgave')}
    <div class="field"><label for="t-name">Oppgave</label><input id="t-name" class="input" value="${esc(it.name)}"></div>
    <div class="field"><span class="label">Hvem skal gjøre det?</span><div class="chips" id="t-who"></div></div>
    <div class="field"><label for="t-due">Dato</label>
      <div class="qty-row" style="grid-template-columns:minmax(0,1fr) auto"><input type="date" id="t-due" class="input" value="${esc(it.due || '')}">
      <button type="button" class="btn" id="t-nodue">Ingen dato</button></div></div>
    ${others.length ? `<div class="field"><span class="label">Flytt til</span><div class="chips">${others.map((s) => `<button type="button" class="chip square" data-move="${s.id}"><span class="dot" style="background:${esc(s.color)}"></span>${esc(s.name)}</button>`).join('')}</div></div>` : ''}
    <div class="actions-col"><button class="btn primary block" id="t-save">Lagre</button><button class="btn danger block" id="t-del">Slett oppgave</button></div>`,
  (sh, close) => {
    const draw = () => {
      $('#t-who', sh).innerHTML = `<button type="button" class="chip ${who ? '' : 'on'}" data-who="" aria-pressed="${!who}">Ingen</button>` +
        S.members.map((m) => `<button type="button" class="chip ${who === m.id ? 'on' : ''}" data-who="${m.id}" aria-pressed="${who === m.id}">${avatar(m, 'xs')}${esc(firstName(m.name))}</button>`).join('');
    };
    draw();
    $('#t-who', sh).addEventListener('click', (e) => { const b = e.target.closest('[data-who]'); if (b) { who = b.dataset.who || null; draw(); } });
    $('#t-nodue', sh).onclick = () => { $('#t-due', sh).value = ''; };
    $('#t-save', sh).onclick = () => {
      const name = cap($('#t-name', sh).value.trim()); if (!name) return;
      S.db.update(S.fid, 'items', id, { name, assignee: who, due: $('#t-due', sh).value || null });
      close();
    };
    $('#t-del', sh).onclick = () => { close(); deleteItem(id); };
    sh.querySelectorAll('[data-move]').forEach((b) => b.onclick = () => { close(); setTimeout(() => moveItems([id], b.dataset.move), 220); });
  });
}

/* ---------- nettbutikk-søk (Kassalapp) ---------- */
let searchTimer = 0, searchSeq = 0, lastProducts = [];
function sumText(list) {
  const priced = list.map(lineTotal).filter((v) => v != null);
  if (!priced.length) return '';
  return ` · ca.\u00a0${kr(Math.round(priced.reduce((a, b) => a + b, 0)))}`;
}
function queueSearch() {
  clearTimeout(searchTimer);
  if (!kassalOn()) return;
  const input = $('#newitem'); if (!input) return;
  const q = parseInput(input.value).name || '';
  if (q.trim().length < 2) { searchSeq++; renderProducts([]); return; }
  const seq = ++searchSeq;
  searchTimer = setTimeout(async () => {
    const s = storeOf(S.view.sid); if (!s) return;
    try {
      const res = await searchProducts(q, s.name);
      if (seq === searchSeq && $('#newitem') && $('#newitem').value.trim()) renderProducts(res);
    } catch (e) { console.warn('Produktsøk feilet', e); if (seq === searchSeq) renderProducts([]); }
  }, 300);
}
function renderProducts(list) {
  const el = $('#products'); if (!el) return;
  lastProducts = list;
  el.hidden = !list.length;
  el.innerHTML = list.map((p, i) => `<button type="button" class="prod" data-act="product" data-i="${i}">
    ${p.img ? `<img src="${esc(p.img)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'">` : '<span class="noimg"></span>'}
    <span class="prod-text"><span class="prod-name">${esc(p.name)}</span><span class="small muted">${esc([p.brand, p.size].filter(Boolean).join(' · '))}</span></span>
    <span class="prod-price">${p.price != null ? esc(kr(p.price)) : ''}</span></button>`).join('');
  el.scrollTop = 0;
}
// Oppdater priser for varer med strekkode (maks hver 6. time per vare)
const priceBusy = new Set();
async function refreshPrices(sid, force = false) {
  const s = storeOf(sid);
  if (!kassalOn() || !s || isTodo(s) || priceBusy.has(sid) || !navigator.onLine) return;
  const due = itemsIn(sid).filter((i) => i.ean && (force || !i.priceAt || now() - i.priceAt > 6 * 3600 * 1000));
  if (!due.length) return;
  priceBusy.add(sid);
  try {
    const prices = await pricesFor([...new Set(due.map((i) => i.ean))], s.name);
    const ops = due.filter((i) => i.ean in prices).map((i) => ({ type: 'update', c: 'items', id: i.id, data: { price: prices[i.ean], priceAt: now() } }));
    if (ops.length) S.db.batch(S.fid, ops);
  } catch (e) { console.warn('Prisoppdatering feilet', e); }
  finally { priceBusy.delete(sid); }
}

function renderSuggest() {
  const el = $('#suggest'); const input = $('#newitem'); if (!el || !input) return;
  const q = input.value.trim();
  const names = q ? autocomplete(parseInput(q).name) : frequentNames(S.view.sid, 12);
  el.innerHTML = names.map((n) => `<button type="button" class="chip ${q ? '' : 'outline'}" data-act="suggest" data-name="${esc(n)}">${q ? '' : '+ '}${esc(n)}</button>`).join('');
}
function flash(id) {
  const el = document.querySelector(`.item[data-id="${id}"]`);
  if (el) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
}

// Sveip til venstre for å flytte en vare
function bindSwipe(root) {
  let d = null;
  root.addEventListener('pointerdown', (e) => {
    const row = e.target.closest('.item');
    if (!row || e.target.closest('.check') || (e.pointerType === 'mouse' && e.button !== 0)) return;
    d = { row, wrap: row.parentNode, id: row.dataset.id, x: e.clientX, y: e.clientY, dx: 0, on: false, pid: e.pointerId };
  });
  root.addEventListener('pointermove', (e) => {
    if (!d || e.pointerId !== d.pid) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!d.on) {
      if (dx < -12 && Math.abs(dx) > Math.abs(dy) * 1.3) { d.on = true; try { d.row.setPointerCapture(d.pid); } catch (er) {} d.wrap.classList.add('dragging', 'swiping'); }
      else if (Math.abs(dy) > 12 || dx > 12) { d = null; }
      return;
    }
    d.dx = Math.min(0, dx);
    d.row.style.transform = `translateX(${d.dx}px)`;
  });
  const end = () => {
    if (!d) return;
    if (d.on) {
      const { wrap, row, id, dx } = d;
      wrap.classList.remove('dragging');
      row.style.transform = '';
      setTimeout(() => wrap.classList.remove('swiping'), 260);
      suppressClick = true; setTimeout(() => { suppressClick = false; }, 80);
      if (dx < -90) { if (navigator.vibrate) navigator.vibrate(10); moveFlow([id], S.view.sid); }
    }
    d = null;
  };
  root.addEventListener('pointerup', end);
  root.addEventListener('pointercancel', end);
}

/* ---------- ark: legg til vare ---------- */
// Felles felt for antall (½, 1, 1½, 2 … 10 eller fritt) og enhet
function qtyFields(n, unit) {
  const units = UNITS.includes(unit) ? UNITS : [...UNITS, unit];
  return `<div class="qty-row">
    <div class="field"><label for="q-n">Antall</label>
      <div class="stepper"><button type="button" data-step="-1" aria-label="Færre">${I.minus}</button>
      <input id="q-n" class="val qty-in" inputmode="decimal" autocomplete="off" placeholder="–" value="${isFinite(n) && n > 0 ? esc(fmtNum(n)) : ''}">
      <button type="button" data-step="1" aria-label="Flere">${I.plus}</button></div></div>
    <div class="field"><label for="q-unit">Enhet</label>
      <select id="q-unit" class="input">${units.map((u) => `<option ${u === unit ? 'selected' : ''}>${esc(u)}</option>`).join('')}</select></div>
  </div>`;
}
function bindQty(sh) {
  const inp = $('#q-n', sh);
  sh.querySelectorAll('[data-step]').forEach((b) => b.onclick = () => {
    const cur = parseNum(inp.value);
    let v;
    if (+b.dataset.step > 0) v = !isFinite(cur) ? 1 : (STEPS.find((x) => x > cur + 1e-9) ?? Math.floor(cur) + 1);
    else v = !isFinite(cur) ? NaN : ([...STEPS].reverse().find((x) => x < cur - 1e-9) ?? NaN);
    inp.value = isFinite(v) ? fmtNum(v) : '';
    inp.dispatchEvent(new Event('input'));
  });
  return () => {
    const n = parseNum(inp.value);
    const unit = $('#q-unit', sh).value;
    return isFinite(n) && n > 0 ? fmtQty({ n, unit }) : '';
  };
}

function openAddSheet(presetSid) {
  const stores = sortedStores().filter((x) => !isTodo(x));
  let sid = [presetSid, S.view.name === 'store' ? S.view.sid : null].find((x) => x && stores.some((st) => st.id === x)) || (stores[0] && stores[0].id);
  let unitTouched = false, nTouched = false;
  openSheet(`${head('Legg til vare')}
    <div class="field"><label for="a-name">Hva trenger dere?</label>
      <input id="a-name" class="input" placeholder="F.eks. melk eller 2 melk" autocomplete="off" autofocus>
      <div class="chips" id="a-auto"></div></div>
    ${qtyFields(NaN, 'stk')}
    <div class="field"><span class="label">Butikk</span><div class="chips" id="a-stores"></div></div>
    <div class="field" id="a-freq-wrap"><span class="label">Ofte kjøpt</span><div class="chips" id="a-freq"></div></div>
    <button class="btn primary block" id="a-add">${I.plus} Legg til i listen</button>`,
  (sh, close) => {
    const nameEl = $('#a-name', sh), unitEl = $('#q-unit', sh), nEl = $('#q-n', sh);
    const getQty = bindQty(sh);
    const syncUnit = () => {
      if (unitTouched) return;
      const p = parseInput(nameEl.value);
      const u = defaultUnit(p.name || nameEl.value);
      if (![...unitEl.options].some((o) => o.value === u)) unitEl.add(new Option(u, u));
      unitEl.value = u;
    };
    const drawStores = () => { $('#a-stores', sh).innerHTML = stores.map((s) => `<button type="button" class="chip square ${s.id === sid ? 'on' : ''}" data-sid="${s.id}" aria-pressed="${s.id === sid}"><span class="dot" style="background:${esc(s.color)}"></span>${esc(s.name)}</button>`).join(''); };
    const drawFreq = () => {
      const list = frequentNames(sid, 10);
      $('#a-freq-wrap', sh).hidden = !list.length;
      $('#a-freq', sh).innerHTML = list.map((x) => `<button type="button" class="chip outline" data-fill="${esc(x)}">${esc(x)}</button>`).join('');
    };
    const drawAuto = () => { $('#a-auto', sh).innerHTML = autocomplete(parseInput(nameEl.value).name).map((x) => `<button type="button" class="chip" data-fill="${esc(x)}">${esc(x)}</button>`).join(''); };
    drawStores(); drawFreq();
    nameEl.addEventListener('input', () => { drawAuto(); syncUnit(); });
    nameEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); $('#a-add', sh).click(); } });
    unitEl.addEventListener('change', () => { unitTouched = true; });
    nEl.addEventListener('input', () => { nTouched = true; });
    $('#a-stores', sh).addEventListener('click', (e) => { const b = e.target.closest('[data-sid]'); if (b) { sid = b.dataset.sid; drawStores(); drawFreq(); } });
    const fill = (e) => { const b = e.target.closest('[data-fill]'); if (b) { nameEl.value = b.dataset.fill; drawAuto(); syncUnit(); nEl.focus(); } };
    $('#a-auto', sh).addEventListener('click', fill);
    $('#a-freq', sh).addEventListener('click', fill);
    $('#a-add', sh).onclick = () => {
      if (!nameEl.value.trim()) { nameEl.focus(); return; }
      if (!sid) { toast('Lag en butikk først'); return; }
      const p = parseInput(nameEl.value);
      const qty = (nTouched || !p.qty) ? getQty() : p.qty;
      if (addItem(sid, p.name, qty)) { toast(`${p.name} lagt til i ${storeOf(sid).name}`); close(); }
    };
  });
}

/* ---------- ark: endre vare ---------- */
function zoomImage(src, name) {
  const el = document.createElement('div');
  el.className = 'zoom';
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', name || 'Bilde');
  el.innerHTML = `<img src="${esc(src)}" alt="${esc(name || '')}" referrerpolicy="no-referrer"><button class="icon-btn zoom-close" aria-label="Lukk">${I.close}</button>`;
  const close = () => { document.removeEventListener('keydown', onKey, true); el.classList.add('out'); setTimeout(() => el.remove(), 200); };
  const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
  el.addEventListener('click', close);
  document.addEventListener('keydown', onKey, true);
  document.body.appendChild(el);
  el.querySelector('.zoom-close').focus();
}
function openItemSheet(id) {
  const it = S.items.find((i) => i.id === id); if (!it) return;
  if (isTodo(storeOf(it.storeId))) return openTodoSheet(id);
  const others = sortedStores().filter((s) => s.id !== it.storeId);
  const p = it.qty ? parseQty(it.qty) : null;
  const odd = it.qty && !p; // f.eks. «1 stk + 2 liter»
  const hero = it.img ? `<div class="hero">
      <button type="button" class="hero-img" id="e-zoom" aria-label="Vis bildet i full størrelse"><img src="${esc(it.img)}" alt="${esc(it.name)}" referrerpolicy="no-referrer"></button>
      <div class="hero-info"><div class="hero-name">${esc(it.name)}</div>${it.size ? `<div class="small muted">${esc(it.size)}</div>` : ''}
      <div class="hero-price" id="e-price"></div></div></div>` : '';
  openSheet(`${head('Endre vare')}
    ${hero}
    <div class="field"><label for="e-name">Navn</label><input id="e-name" class="input" value="${esc(it.name)}"></div>
    ${qtyFields(p ? p.n : NaN, p ? p.unit : defaultUnit(it.name))}
    ${odd ? `<p class="small muted" style="margin-top:-8px">Nå: ${esc(it.qty)}. Velg antall og enhet for å erstatte.</p>` : ''}
    <div class="field"><label for="e-cat">Kategori</label><select id="e-cat" class="input">${CATEGORIES.map((c) => `<option ${c === (it.cat || categorize(it.name)) ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
    ${others.length ? `<div class="field"><span class="label">Flytt til</span><div class="chips">${others.map((s) => `<button type="button" class="chip square" data-move="${s.id}"><span class="dot" style="background:${esc(s.color)}"></span>${esc(s.name)}</button>`).join('')}</div></div>` : ''}
    <div class="actions-col"><button class="btn primary block" id="e-save">Lagre</button><button class="btn danger block" id="e-del">Slett vare</button></div>`,
  (sh, close) => {
    const getQty = bindQty(sh);
    let qtyTouched = false;
    const drawPrice = () => {
      const el = $('#e-price', sh); if (!el) return;
      if (typeof it.price !== 'number') { el.innerHTML = '<span class="muted small">Ingen pris for denne butikken</span>'; return; }
      const lt = lineTotal({ price: it.price, qty: getQty() });
      el.innerHTML = `<b>${esc(kr(it.price))}</b><span class="muted small"> / stk</span>${lt != null && Math.abs(lt - it.price) > 0.001 ? `<br><span class="small">Totalt ${esc(kr(lt))}</span>` : ''}`;
    };
    drawPrice();
    $('#q-n', sh).addEventListener('input', () => { qtyTouched = true; drawPrice(); });
    $('#q-unit', sh).addEventListener('change', () => { qtyTouched = true; drawPrice(); });
    const z = $('#e-zoom', sh); if (z) z.onclick = () => zoomImage(it.img, it.name);
    $('#e-save', sh).onclick = () => {
      const name = cap($('#e-name', sh).value.trim()); if (!name) return;
      const qty = odd && !qtyTouched ? it.qty : getQty();
      const patch = { name, qty, cat: $('#e-cat', sh).value };
      if (norm(name) !== norm(it.name) && $('#e-cat', sh).value === (it.cat || categorize(it.name))) patch.cat = categorize(name);
      S.db.update(S.fid, 'items', id, patch);
      if (norm(name) !== norm(it.name)) bumpName(name);
      close();
    };
    $('#e-del', sh).onclick = () => { close(); deleteItem(id); };
    sh.querySelectorAll('[data-move]').forEach((b) => b.onclick = () => { close(); setTimeout(() => moveItems([id], b.dataset.move), 220); });
  });
}

/* ---------- ark: butikk ---------- */
function openStoreSheet(sid, newType) {
  const s = sid ? storeOf(sid) : null;
  const todo = s ? isTodo(s) : newType === 'todo';
  const d = s ? { ...s } : { name: '', domain: '', color: COLORS[S.stores.length % COLORS.length], flyer: '', image: '', type: todo ? 'todo' : undefined };
  const noun = todo ? 'liste' : 'butikk';
  openSheet(`${head(s ? `Rediger ${noun}` : todo ? 'Ny gjøremålsliste' : 'Ny butikk')}
    <div class="row" style="justify-content:flex-start;gap:16px"><div id="s-logo"></div>
      <div class="small muted" style="flex:1">${todo ? 'Velg navn og farge på listen.' : 'Logoen hentes automatisk fra nettsiden. Du kan også velge et eget bilde.'}</div></div>
    <div class="field"><label for="s-name">Navn</label><input id="s-name" class="input" value="${esc(d.name)}" placeholder="${todo ? 'F.eks. Hagen' : 'F.eks. Rema 1000'}" ${s ? '' : 'autofocus'}></div>
    <div class="field" ${todo ? 'hidden' : ''}><label for="s-domain">Nettside (for logo)</label><input id="s-domain" class="input" value="${esc(d.domain || '')}" placeholder="f.eks. rema.no" inputmode="url" autocapitalize="off"></div>
    <div class="field"><span class="label">Farge</span><div class="chips" id="s-colors"></div></div>
    <div class="field" ${todo ? 'hidden' : ''}><label for="s-flyer">Lenke til tilbudsavis (valgfritt)</label><input id="s-flyer" class="input" value="${esc(d.flyer || '')}" placeholder="https://…" inputmode="url" autocapitalize="off"></div>
    <div class="chips" ${todo ? 'hidden' : ''}><label class="btn" style="cursor:pointer">${I.image} Velg eget bilde<input type="file" accept="image/*" id="s-file" class="sr-only"></label>
      <button type="button" class="btn" id="s-noimg" ${d.image ? '' : 'hidden'}>Fjern bilde</button></div>
    <div class="actions-col"><button class="btn primary block" id="s-save">${s ? 'Lagre' : todo ? 'Lag listen' : 'Lag butikk'}</button>
      ${s ? `<button class="btn danger block" id="s-del">Slett ${todo ? 'listen' : 'butikken'}</button>` : ''}</div>`,
  (sh, close) => {
    const draw = () => {
      $('#s-logo', sh).innerHTML = logo({ ...d, name: d.name || '?' }, 'lg');
      $('#s-colors', sh).innerHTML = COLORS.map((c) => `<button type="button" class="color-swatch ${c === d.color ? 'on' : ''}" style="background:${c}" data-c="${c}" aria-label="Farge ${c}" aria-pressed="${c === d.color}"></button>`).join('');
      $('#s-noimg', sh).hidden = !d.image;
    };
    draw();
    $('#s-name', sh).addEventListener('input', (e) => { d.name = e.target.value; draw(); });
    $('#s-domain', sh).addEventListener('change', (e) => { d.domain = cleanDomain(e.target.value); e.target.value = d.domain; draw(); });
    $('#s-colors', sh).addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if (b) { d.color = b.dataset.c; draw(); } });
    $('#s-file', sh).addEventListener('change', async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { d.image = await resizeImage(f, 128); draw(); } catch (er) { toast('Klarte ikke å lese bildet'); }
    });
    $('#s-noimg', sh).onclick = () => { d.image = ''; draw(); };
    $('#s-save', sh).onclick = () => {
      d.name = $('#s-name', sh).value.trim(); d.domain = cleanDomain($('#s-domain', sh).value); d.flyer = $('#s-flyer', sh).value.trim();
      if (!d.name) { $('#s-name', sh).focus(); return; }
      const data = todo ? { name: d.name, color: d.color, type: 'todo' } : { name: d.name, domain: d.domain, color: d.color, flyer: d.flyer, image: d.image || '' };
      if (s) S.db.set(S.fid, 'stores', sid, data, true);
      else S.db.set(S.fid, 'stores', S.db.newId(), { ...data, order: now() });
      close();
    };
    if (s) $('#s-del', sh).onclick = async () => {
      close();
      const n = itemsIn(sid).length;
      const ok = await ask({ title: `Slette ${s.name}?`, text: n ? `${n} ${todo ? 'oppgaver' : 'varer'} på listen slettes også.` : 'Listen er tom.', buttons: [{ label: todo ? 'Slett listen' : 'Slett butikken', value: true, kind: 'primary' }, { label: 'Avbryt', value: false }] });
      if (!ok) return;
      S.db.batch(S.fid, [{ type: 'delete', c: 'stores', id: sid }, ...itemsIn(sid).map((i) => ({ type: 'delete', c: 'items', id: i.id }))]);
      if (S.view.name === 'store') go('home', {}, true);
      toast(`${s.name} er slettet`);
    };
  });
}
function resizeImage(file, size) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = c.height = size;
      const x = c.getContext('2d'); x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, size, size);
      const r = Math.min(size / img.width, size / img.height);
      const w = img.width * r, h = img.height * r;
      x.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/* ---------- innstillinger ---------- */
function refreshSettings() {
  const scr = $('#screen'); if (!scr) return;
  if (scr.contains(document.activeElement) && document.activeElement.tagName === 'INPUT') return; // ikke forstyrr mens man skriver
  const m = me();
  const link = `${location.origin}${location.pathname}?familie=${S.fid}`;
  scr.innerHTML = `
    <div class="topbar"><button class="icon-btn" data-act="home" aria-label="Tilbake">${I.back}</button><span></span><span style="width:44px"></span></div>
    <h1 class="title">Innstillinger</h1>
    <div class="card">
      <div class="field"><label for="set-name">Ditt navn</label><input id="set-name" class="input" value="${esc(m.name || '')}"></div>
      <div class="field"><span class="label">Din farge</span><div class="chips">${PERSON_COLORS.map((c) => `<button class="color-swatch ${c === m.color ? 'on' : ''}" style="background:${c}" data-act="my-color" data-c="${c}" aria-label="Farge ${c}" aria-pressed="${c === m.color}"></button>`).join('')}</div></div>
    </div>
    <div class="card">
      <div class="field"><span class="label">Utseende</span><div class="seg">
        <button data-act="theme" data-v="light" class="${S.theme !== 'dark' ? 'on' : ''}" aria-pressed="${S.theme !== 'dark'}">Lyst</button>
        <button data-act="theme" data-v="dark" class="${S.theme === 'dark' ? 'on' : ''}" aria-pressed="${S.theme === 'dark'}">Mørkt</button></div></div>
      <div class="field"><span class="label">Sortering av varer</span><div class="seg">
        <button data-act="sort" data-v="cat" class="${S.sort === 'cat' ? 'on' : ''}" aria-pressed="${S.sort === 'cat'}">Etter kategori</button>
        <button data-act="sort" data-v="added" class="${S.sort !== 'cat' ? 'on' : ''}" aria-pressed="${S.sort !== 'cat'}">Slik de ble lagt inn</button></div></div>
    </div>
    <div class="card">
      <div class="row"><h2 class="section">Lister</h2></div>
      <div>${sortedStores().map((s) => `<button class="list-row" data-act="edit-store" data-sid="${s.id}">${logo(s)}<span class="grow"><b>${esc(s.name)}</b><br><span class="small muted">${isTodo(s) ? 'Gjøremålsliste' : esc(s.domain || 'Ingen nettside')}</span></span>${I.chev}</button>`).join('')}</div>
      <button class="dashed-btn" data-act="new-store" style="min-height:52px">${I.plus} Ny liste</button>
    </div>
    <div class="card">
      <h2 class="section">Familien</h2>
      <div style="display:flex;flex-direction:column;gap:10px">${S.members.map((x) => `<div style="display:flex;align-items:center;gap:12px">${avatar(x)}<span>${esc(x.name)}${x.id === S.uid ? ' <span class="muted">(deg)</span>' : ''}</span></div>`).join('')}</div>
      <div class="field"><span class="label">Familiekode – del med de andre i familien</span>
        <div class="input code" style="display:flex;align-items:center;justify-content:center">${esc(showCode(S.fid))}</div></div>
      <div class="chips">
        ${navigator.share ? `<button class="btn" data-act="share" data-link="${esc(link)}">${I.share} Del invitasjon</button>` : ''}
        <button class="btn" data-act="copy" data-link="${esc(link)}">${I.copy} Kopier lenke</button>
      </div>
    </div>
    <button class="btn block" data-act="history">${I.clock} Historikk</button>
    <button class="btn danger block" data-act="leave">Forlat familielisten på denne telefonen</button>
    <p class="small muted" style="margin:0;text-align:center">${S.db.mode === 'local' ? 'Demomodus – data lagres bare på denne enheten.' : 'Synkroniseres med Firebase.'}</p>`;
  const nameEl = $('#set-name');
  nameEl.addEventListener('change', () => {
    const n = nameEl.value.trim(); if (!n) { nameEl.value = me().name || ''; return; }
    LS.set('name', n); S.db.set(S.fid, 'members', S.uid, { name: n }, true); toast('Navnet er lagret');
  });
}

/* ---------- historikk ---------- */
function refreshHistory() {
  const scr = $('#screen'); if (!scr) return;
  const open = new Set([...scr.querySelectorAll('details[open]')].map((d) => d.dataset.id));
  const trips = [...S.trips].sort((a, b) => (b.at || 0) - (a.at || 0)).slice(0, 100);
  scr.innerHTML = `
    <div class="topbar"><button class="icon-btn" data-act="home" aria-label="Tilbake">${I.back}</button><span></span><span style="width:44px"></span></div>
    <h1 class="title">Historikk</h1>
    ${trips.length ? trips.map((t) => {
      const st = storeOf(t.storeId) || { name: t.storeName, color: '#B0B6C0' };
      const by = memberOf(t.by);
      return `<details class="card trip" data-id="${t.id}" ${open.has(t.id) ? 'open' : ''}>
        <summary>${logo(st)}<span style="flex:1;min-width:0"><b>${esc(t.storeName || st.name)}</b><br>
        <span class="small muted">${esc(dateTrip(t.at))} · ${(t.items || []).length} varer${by ? ' · ' + esc(firstName(by.name)) : t.byName ? ' · ' + esc(firstName(t.byName)) : ''}</span></span>${I.chev}</summary>
        <ul>${(t.items || []).map((i) => `<li>${esc(i.name)}${i.qty ? ` <span>${esc(i.qty)}</span>` : ''}</li>`).join('')}</ul>
        ${storeOf(t.storeId) ? `<button class="btn" data-act="again" data-trip="${t.id}">${I.redo} Legg alt på listen igjen</button>` : ''}
      </details>`;
    }).join('') : `<div class="empty">${I.clock}<div class="big">Ingen handleturer ennå</div><div>Når du trykker «Ferdig handlet», lagres turen her.</div></div>`}`;
}

/* =========================================================
   Klikk
   ========================================================= */
document.addEventListener('click', async (e) => {
  if (suppressClick) { e.preventDefault(); e.stopPropagation(); return; }
  const t = e.target.closest('[data-act]'); if (!t || !app.contains(t)) return;
  const act = t.dataset.act;
  switch (act) {
    case 'home': if (history.state && history.length > 1) history.back(); else go('home', {}, true); break;
    case 'settings': go('settings'); break;
    case 'history': go('history'); break;
    case 'open-store': go('store', { sid: t.dataset.sid }); break;
    case 'add': openAddSheet(); break;
    case 'new-store': {
      const type = await ask({ title: 'Ny liste', text: 'Hva slags liste vil du lage?', buttons: [
        { label: 'Butikk (handleliste)', value: 'shop', kind: 'primary' }, { label: 'Gjøremålsliste', value: 'todo', kind: 'primary' }, { label: 'Avbryt', value: null, kind: 'danger' }] });
      if (type) setTimeout(() => openStoreSheet(null, type), 10);
      break;
    }
    case 'product': {
      const p = lastProducts[+t.dataset.i]; if (!p) break;
      const input = $('#newitem');
      const typed = input.value.trim() ? parseQty(parseInput(input.value).qty) : null;
      const extra = { ean: p.ean, img: p.img, price: p.price, size: p.size };
      const name = p.name;
      const clear = () => { input.value = ''; renderSuggest(); renderProducts([]); };
      if (typed) { if (addItem(S.view.sid, name, fmtQty({ n: typed.n, unit: 'stk' }), extra)) clear(); }
      else openQtyPicker(name, S.view.sid, clear, extra);
      break;
    }
    case 'assign': S.newAssignee = S.newAssignee === t.dataset.uid ? null : t.dataset.uid; renderAssign(); break;
    case 'pick-due': {
      if (S.newDue) { S.newDue = null; renderAssign(); break; }
      const d = $('#newdue'); if (!d) break;
      d.value = '';
      try { if (d.showPicker) d.showPicker(); else d.click(); } catch (er) { d.click(); }
      break;
    }
    case 'edit-store': openStoreSheet(t.dataset.sid || S.view.sid); break;
    case 'toggle': toggleItem(t.dataset.id); break;
    case 'edit-item': openItemSheet(t.dataset.id); break;
    case 'finish': finishTrip(S.view.sid); break;
    case 'suggest': {
      const input = $('#newitem');
      const name = t.dataset.name;
      const typed = input.value.trim() ? parseQty(parseInput(input.value).qty) : null;
      const clear = () => { input.value = ''; renderSuggest(); };
      const rec = nameRec(name);
      const extra = rec && rec.ean ? { ean: rec.ean, img: rec.img || '', price: null } : {};
      if (typed) { if (addItem(S.view.sid, name, fmtQty({ n: typed.n, unit: extra.ean ? 'stk' : defaultUnit(name) }), extra)) { clear(); if (extra.ean) setTimeout(() => refreshPrices(S.view.sid, true), 800); } }
      else openQtyPicker(name, S.view.sid, () => { clear(); if (extra.ean) setTimeout(() => refreshPrices(S.view.sid, true), 800); }, extra);
      break;
    }
    case 'flyer': {
      const s = storeOf(S.view.sid); if (!s) break;
      const url = s.flyer && /^https?:\/\//i.test(s.flyer) ? s.flyer : `https://www.google.com/search?q=${encodeURIComponent(s.name + ' kundeavis')}`;
      window.open(url, '_blank', 'noopener');
      break;
    }
    case 'theme': S.theme = t.dataset.v; LS.set('theme', S.theme); applyTheme(); refreshSettings(); break;
    case 'sort': S.sort = t.dataset.v; LS.set('sort', S.sort); refreshSettings(); break;
    case 'my-color': LS.set('color', t.dataset.c); S.db.set(S.fid, 'members', S.uid, { color: t.dataset.c }, true); break;
    case 'copy':
      try { await navigator.clipboard.writeText(t.dataset.link); toast('Lenken er kopiert'); }
      catch (er) { prompt('Kopier lenken:', t.dataset.link); }
      break;
    case 'share':
      try { await navigator.share({ title: 'Handleliste', text: `Bli med i familiens handleliste. Kode: ${showCode(S.fid)}`, url: t.dataset.link }); } catch (er) {}
      break;
    case 'again': {
      const trip = S.trips.find((x) => x.id === t.dataset.trip); if (!trip) break;
      let n = 0;
      for (const i of trip.items || []) {
        if (!itemsIn(trip.storeId).some((x) => !x.done && norm(x.name) === norm(i.name))) {
          const id = S.db.newId();
          S.db.set(S.fid, 'items', id, { storeId: trip.storeId, name: i.name, qty: i.qty || '', cat: categorize(i.name), done: false, createdAt: now() + n, by: S.uid, byName: me().name || '' });
          n++;
        }
      }
      toast(n ? `${n} varer lagt på ${storeOf(trip.storeId).name}-listen` : 'Alt står allerede på listen');
      break;
    }
    case 'leave': {
      const ok = await ask({ title: 'Forlate familielisten?', text: 'Listen blir ikke slettet for de andre. Du kan bli med igjen senere med familiekoden.', buttons: [{ label: 'Forlat', value: true, kind: 'primary' }, { label: 'Avbryt', value: false }] });
      if (!ok) break;
      setPresence(null);
      S.db.remove(S.fid, 'members', S.uid);
      unsubscribe(); LS.set('fid', null); S.fid = null; S.todoChecked = false; S.ready.meta = false;
      S.members = []; S.stores = []; S.items = []; S.trips = [];
      S.view = { name: 'welcome' }; render();
      break;
    }
  }
});

/* =========================================================
   Abonnement på data
   ========================================================= */
let raf = 0;
const schedule = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; refresh(); }); };
function subscribe() {
  unsubscribe();
  const w = (c, key) => S.db.watch(S.fid, c, (rows) => {
    S[c] = rows;
    if (key) S.ready[key] = true;
    schedule();
  }, (err) => {
    if (err && err.code === 'permission-denied' && c === 'members') {
      toast('Du har ikke lenger tilgang til denne familielisten');
    }
  });
  S.unsubs = [w('members', 'members'), w('stores', 'stores'), w('items', 'items'), w('trips'), w('names'), w('meta', 'meta')];
}
function unsubscribe() { S.unsubs.forEach((u) => { try { u(); } catch (e) {} }); S.unsubs = []; }
setInterval(() => { if (S.view.name === 'home') refreshHome(false); }, 60000); // oppdater «x min siden»

/* =========================================================
   Oppstart
   ========================================================= */
async function boot() {
  applyTheme(); updateOnline();
  const invite = cleanCode(new URLSearchParams(location.search).get('familie'));
  if (invite) LS.set('invite', invite);
  try {
    if (firebaseConfig && firebaseConfig.apiKey) {
      const { createFirebaseDb } = await import('./db-firebase.js');
      S.db = await createFirebaseDb(firebaseConfig);
    } else {
      const { createLocalDb } = await import('./db-local.js');
      S.db = createLocalDb();
    }
    S.uid = await S.db.init();
  } catch (e) {
    console.error(e);
    app.innerHTML = `<div class="screen"><div class="empty">${I.cloudOff}<div class="big">Får ikke startet</div><div>Sjekk nettet og prøv igjen. Første gang må telefonen være på nett.</div><button class="btn primary" onclick="location.reload()">Prøv igjen</button></div></div>`;
    return;
  }
  if (S.fid) {
    if (invite && invite !== S.fid) toast('Du er allerede med i en familieliste. Forlat den i innstillinger for å bytte.');
    LS.set('invite', null);
    history.replaceState({ v: { name: 'home' } }, '', location.pathname);
    subscribe();
    S.db.set(S.fid, 'members', S.uid, { lastSeen: now(), shoppingIn: null }, true);
    S.view = { name: 'home' };
    render();
  } else {
    S.view = { name: 'welcome' };
    render();
  }
}
boot();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch((e) => console.warn('SW', e));
}
