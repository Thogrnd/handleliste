// Demomodus: lagrer alt i nettleseren på denne enheten.
// Brukes bare når firebase-config.js ikke er fylt ut. Flere faner på samme maskin oppdateres live.
const P = 'hl.demo.';
const read = (k) => { try { return JSON.parse(localStorage.getItem(P + k) || 'null'); } catch (e) { return null; } };
const write = (k, v) => { try { localStorage.setItem(P + k, JSON.stringify(v)); } catch (e) { console.error(e); } };
const listeners = new Set();
const emit = (key) => listeners.forEach((l) => l(key));
window.addEventListener('storage', (e) => { if (e.key && e.key.startsWith(P)) emit(e.key.slice(P.length)); });

const rid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export function createLocalDb() {
  const key = (fid, c) => `${fid}.${c}`;
  const getMap = (fid, c) => read(key(fid, c)) || {};
  const putMap = (fid, c, m) => { write(key(fid, c), m); emit(key(fid, c)); };
  const apply = (fid, op) => {
    const m = getMap(fid, op.c);
    if (op.type === 'delete') delete m[op.id];
    else if (op.type === 'update') { if (m[op.id]) m[op.id] = { ...m[op.id], ...op.data }; }
    else m[op.id] = op.merge ? { ...(m[op.id] || {}), ...op.data } : { ...op.data };
    putMap(fid, op.c, m);
  };
  return {
    mode: 'local',
    async init() {
      let uid = read('uid');
      if (!uid) { uid = rid(); write('uid', uid); }
      return uid;
    },
    newId: rid,
    async createFamily(fid) {
      const fams = read('families') || [];
      fams.push(fid); write('families', fams);
    },
    async join(fid, uid, member) {
      const fams = read('families') || [];
      if (!fams.includes(fid)) { const e = new Error('Ukjent familie'); e.code = 'permission-denied'; throw e; }
      apply(fid, { type: 'set', c: 'members', id: uid, data: member, merge: true });
    },
    watch(fid, c, cb) {
      const send = () => { const m = getMap(fid, c); cb(Object.keys(m).map((id) => ({ id, ...m[id] }))); };
      const l = (k) => { if (k === key(fid, c)) send(); };
      listeners.add(l);
      setTimeout(send, 0);
      return () => listeners.delete(l);
    },
    set(fid, c, id, data, merge = false) { apply(fid, { type: 'set', c, id, data, merge }); },
    update(fid, c, id, data) { apply(fid, { type: 'update', c, id, data }); },
    remove(fid, c, id) { apply(fid, { type: 'delete', c, id }); },
    batch(fid, ops) { ops.forEach((op) => apply(fid, op)); }
  };
}
