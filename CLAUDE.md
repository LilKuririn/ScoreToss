# ScoreToss

## `index.html` est généré — ne jamais le modifier à la main

L'application est livrée en un seul fichier, mais écrite en morceaux dans `src/` :

- `src/page.html` — le squelette, avec les repères `@@css@@`, `@@html@@` et `@@js@@`
- `src/css/`, `src/html/`, `src/js/` — assemblés dans l'ordre de leur préfixe `NNN-`

Après toute modification de `src/` :

```bash
node tools/build.js
```

puis committer `src/` **et** `index.html` ensemble. `node tools/build.js --check` vérifie qu'ils
correspondent ; la CI fait le même contrôle à chaque push (`.github/workflows/assemblage.yml`).

Les fichiers de `src/js/` s'exécutent dans une seule fonction englobante : ils partagent leur
portée, et rien ne devient global. **L'ordre des fichiers compte** — en CSS la règle la plus
tardive l'emporte, en JS les écouteurs sont posés dans l'ordre de lecture.

## Ce qui ne doit jamais bouger

- **L'URL de la page et la portée du service worker.** De nombreux utilisateurs iPhone ont
  installé la version web depuis Safari : `index.html`, `sw.js` et `manifest.webmanifest` restent
  à la racine.
- **Les clés `localStorage`** — `cornhole.v1`, `cornhole.lang`, `cornhole.theme`. Les renommer
  effacerait les parties et palmarès existants.
- **L'identifiant Android** `com.scoretosslabs.cornscore`, gravé par Google Play.

## Pièges connus

- Une classe qui pose un `display` écrase l'attribut `hidden` : lui ajouter sa garde
  `.classe[hidden]{display:none}`.
- Vérifier le **rendu**, pas l'intention : `display` calculé et hauteur mesurée plutôt que la
  propriété `hidden`, position des cellules plutôt que leur texte.
