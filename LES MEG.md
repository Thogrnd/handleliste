# Handleliste – oppsett

Familiens felles handleliste. Nettapp som legges på hjemskjermen på Android og iPhone,
med liveoppdatering via Firebase og full støtte for å handle uten nett.

## Filer

| Fil | Hva den gjør |
|---|---|
| `index.html` | Selve siden |
| `style.css` | Utseende, lyst og mørkt tema, animasjoner |
| `app.js` | All logikk i appen |
| `varer.js` | Kategorier, vanlige varer og mengder |
| `db-firebase.js` | Kobling til Firebase |
| `db-local.js` | Demomodus (brukes til Firebase er koblet til) |
| `firebase-config.js` | **Her limer du inn Firebase-oppsettet ditt** |
| `sw.js`, `manifest.webmanifest`, `icons/` | Gjør at appen kan installeres og åpnes uten nett |

## 1. Firebase

1. console.firebase.google.com → opprett prosjekt `handleliste` (uten Google Analytics).
2. Build → Authentication → Get started → Sign-in method → slå på **Anonymous**.
3. Build → Firestore Database → Create database → `europe-north1` → production mode.
4. Firestore → Rules → lim inn reglene under → Publish.
5. Project settings → Your apps → web-ikonet `</>` → registrer `Handleliste`.
6. Kopier verdiene i `firebaseConfig` inn i `firebase-config.js`.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null; }
    function isMember(fid) {
      return signedIn() && exists(/databases/$(database)/documents/families/$(fid)/members/$(request.auth.uid));
    }
    match /families/{fid} {
      allow create: if signedIn();
      allow read, update: if isMember(fid);
      match /members/{uid} {
        allow create, update: if signedIn() && request.auth.uid == uid
          && exists(/databases/$(database)/documents/families/$(fid));
        allow read, delete: if isMember(fid);
      }
      match /{coll}/{docId} {
        allow read, write: if coll != 'members' && isMember(fid);
      }
    }
  }
}
```

## 2. Legge ut appen på GitHub Pages

1. github.com → **New repository** → navn `handleliste` → **Public** → Create.
2. Trykk «uploading an existing file», dra inn **alle filene og mappen `icons`** → Commit changes.
3. Settings → Pages → Source: **Deploy from a branch** → `main` og `/ (root)` → Save.
4. Etter ca. ett minutt ligger appen på `https://BRUKERNAVN.github.io/handleliste/`.
5. I Firebase: Authentication → Settings → Authorized domains → legg til `BRUKERNAVN.github.io`.

Koden blir offentlig, men selve handlelistene er beskyttet: bare telefoner som har
blitt med via familiekoden kan lese eller endre dem.

## 3. Installere på telefonene

- **Android (Chrome):** åpne adressen → meny (⋮) → «Installer app» / «Legg til på startskjermen».
- **iPhone (Safari):** åpne adressen → Del-knappen → «Legg til på Hjem-skjerm».

Den første telefonen trykker «Start en ny familieliste». Gå så til Innstillinger → «Del invitasjon»
og send lenken til resten av familien.

## 4. Knapp i Home Assistant

Rediger dashbordet → legg til kort → «Manuelt» (YAML):

```yaml
type: button
name: Handleliste
icon: mdi:cart
tap_action:
  action: url
  url_path: https://BRUKERNAVN.github.io/handleliste/
```

## Oppdatere appen senere

Last opp de endrede filene til GitHub på samme måte. Appen henter alltid nyeste versjon når
telefonen er på nett.
