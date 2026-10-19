// Datalag mot Firebase (Firestore + anonym innlogging).
// Firestore lagrer alt lokalt på telefonen, så appen virker uten nett og synkroniserer etterpå.
const V = '11.0.2';
const base = `https://www.gstatic.com/firebasejs/${V}`;

export async function createFirebaseDb(config) {
  const [{ initializeApp }, authMod, fsMod] = await Promise.all([
    import(`${base}/firebase-app.js`),
    import(`${base}/firebase-auth.js`),
    import(`${base}/firebase-firestore.js`)
  ]);
  const { getAuth, signInAnonymously, onAuthStateChanged } = authMod;
  const {
    initializeFirestore, persistentLocalCache, persistentMultipleTabManager,
    collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, writeBatch
  } = fsMod;

  const app = initializeApp(config);
  const auth = getAuth(app);
  let fs;
  try {
    fs = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });
  } catch (e) {
    console.warn('Lokal lagring ikke tilgjengelig, bruker minne', e);
    fs = initializeFirestore(app, {});
  }

  const col = (fid, c) => collection(fs, 'families', fid, c);
  const ref = (fid, c, id) => doc(fs, 'families', fid, c, id);
  const report = (e) => { console.error(e); window.dispatchEvent(new CustomEvent('hl-error', { detail: e })); };

  return {
    mode: 'firebase',
    init() {
      return new Promise((resolve, reject) => {
        let tried = false;
        const un = onAuthStateChanged(auth, async (u) => {
          if (u) { un(); resolve(u.uid); return; }
          if (tried) return;
          tried = true;
          try { await signInAnonymously(auth); } catch (e) { un(); reject(e); }
        });
      });
    },
    newId() { return doc(collection(fs, '_')).id; },
    async createFamily(fid) {
      await setDoc(doc(fs, 'families', fid), { createdAt: Date.now() });
    },
    async join(fid, uid, member) {
      await setDoc(ref(fid, 'members', uid), member, { merge: true });
    },
    watch(fid, c, cb, onErr) {
      return onSnapshot(col(fid, c), (snap) => {
        cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }, (e) => { report(e); if (onErr) onErr(e); });
    },
    set(fid, c, id, data, merge = false) { setDoc(ref(fid, c, id), data, { merge }).catch(report); },
    update(fid, c, id, patch) { updateDoc(ref(fid, c, id), patch).catch(report); },
    remove(fid, c, id) { deleteDoc(ref(fid, c, id)).catch(report); },
    batch(fid, ops) {
      const b = writeBatch(fs);
      for (const op of ops) {
        const r = ref(fid, op.c, op.id);
        if (op.type === 'set') b.set(r, op.data, { merge: !!op.merge });
        else if (op.type === 'update') b.update(r, op.data);
        else if (op.type === 'delete') b.delete(r);
      }
      b.commit().catch(report);
    }
  };
}
