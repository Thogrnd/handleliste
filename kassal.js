// Produktsøk og priser fra Kassalapp (kassal.app).
// Nøkkelen er ikke hemmelig i praksis: verste fall kan noen bruke opp gratiskvoten.
export const KASSAL_KEY = '';

const BASE = 'https://kassal.app/api/v1';
const cache = new Map();
export const kassalOn = () => !!KASSAL_KEY;

const n = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9æøå]+/g, ' ').trim();
// Er produktet fra samme kjede som listen? («Rema 1000» ↔ «REMA 1000», «Spar» ↔ «SPAR»)
export function sameChain(listName, storeName) {
  const a = n(listName), b = n(storeName);
  if (!a || !b) return false;
  return a === b || a.startsWith(b + ' ') || b.startsWith(a + ' ') || a.split(' ')[0] === b.split(' ')[0];
}

async function call(path, opts = {}) {
  const res = await fetch(BASE + path, {
    ...opts,
    headers: { Authorization: 'Bearer ' + KASSAL_KEY, Accept: 'application/json', ...(opts.body ? { 'Content-Type': 'application/json' } : {}) }
  });
  if (!res.ok) throw new Error('Kassalapp ' + res.status);
  return res.json();
}

const fmtSize = (w, u) => {
  if (!w || !u) return '';
  if (u === 'ml' && w >= 1000) return String(w / 1000).replace('.', ',') + ' l';
  if (u === 'g' && w >= 1000) return String(w / 1000).replace('.', ',') + ' kg';
  return `${w} ${u}`;
};

// Søk: én rad per produkt (EAN). Pris bare fra butikken listen gjelder.
export async function searchProducts(q, listName) {
  q = q.trim();
  if (!kassalOn() || q.length < 2) return [];
  const key = q.toLowerCase();
  let raw = cache.get(key);
  if (!raw) {
    const r = await call(`/products?search=${encodeURIComponent(q)}&size=60&exclude_without_ean=1`);
    raw = (r && r.data) || [];
    cache.set(key, raw);
  }
  const by = new Map();
  for (const p of raw) {
    const k = p.ean || 'id' + p.id;
    const match = p.store && sameChain(listName, p.store.name);
    const cur = by.get(k);
    if (!cur) by.set(k, { ean: p.ean || null, name: p.name, brand: p.brand || '', img: p.image || '', size: fmtSize(p.weight, p.weight_unit), price: match && p.current_price ? p.current_price : null, hits: 1 });
    else {
      cur.hits++;
      if (!cur.img && p.image) cur.img = p.image;
      if (match && p.current_price) cur.price = p.current_price;
    }
  }
  const ql = key.split(/\s+/)[0];
  return [...by.values()]
    .sort((a, b) => (b.name.toLowerCase().startsWith(ql) - a.name.toLowerCase().startsWith(ql)) || ((b.price != null) - (a.price != null)) || (b.hits - a.hits))
    .slice(0, 20);
}

// Dagens pris for en liste med EAN-er i en gitt kjede
export async function pricesFor(eans, listName) {
  if (!kassalOn() || !eans.length) return {};
  const r = await call('/products/prices-bulk', { method: 'POST', body: JSON.stringify({ eans: eans.slice(0, 100), days: 1 }) });
  const out = {};
  for (const row of (r && r.data) || []) {
    const s = (row.stores || []).find((x) => sameChain(listName, x.name || x.store));
    out[row.ean] = s && s.current_price ? s.current_price : null;
  }
  return out;
}
