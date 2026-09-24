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

## Ajouter un jeu

Chaque jeu vit dans `src/jeux/NNN-identifiant/` — le préfixe fixe l'ordre des tuiles de l'accueil.
Le code commun ne nomme aucun jeu : il interroge le registre, `src/js/015-registre.js`, dont
l'en-tête décrit le contrat complet.

- `jeu.js`, obligatoire : `declarerJeu({...})` — identifiant, famille, catégorie (`exterieur`,
  `interieur` ou `societe`) et `nom()` au minimum —, puis le code propre au jeu. Il s'exécute tôt,
  avant la plupart des fichiers partagés : n'y lire aucune variable partagée au chargement,
  seulement à l'intérieur des fonctions.
- `tuile.html` : sa tuile d'accueil, un bouton portant `data-jeu="identifiant"`.
- `textes.js` : ses textes dans les trois langues, `ajouterTextes({fr:{…}, en:{…}, es:{…}})`. Le
  dictionnaire commun de `src/js/020-langues.js` ne garde que ce que partagent plusieurs jeux.
- `jeu.css`, et des fragments HTML que des repères `@@jeux:fichier@@` insèrent à leur place :
  `ecrans.html`, `fiches.html`, `console.html`, `reglages.html`… Un élément qui ne doit
  s'afficher que pour ce jeu porte `data-propre="identifiant"`.

Un jeu à deux camps (famille `duel`) réutilise préparation, console, feuille de match, écran de
fin et tournois en fournissant ses calculs, comme le cornhole et le palet. Un jeu à tour de rôle
apporte ses propres écrans et son état, comme le mölkky — et déclare, dans `retour`, ce que
ferme le bouton retour d'Android sur ses fiches et ses écrans. Il peut proposer le tirage au sort
de l'ordre de jeu : `tirerOrdre(participants, fin)`, dans `src/js/065-tirage-ordre.js`.

Un jeu à tour de rôle s'appuie sur les briques communes plutôt que de les recopier :
`devenirJeuCourant(id)` dans son `ouvrir` ; `peindreRangees({...})` pour les rangées de joueurs de
sa préparation (numéro, couleur, nom relié au carnet, coéquipiers) ; `apresUnCoup(finie, {...})`
après chaque coup ; `blocBareme` et `blocDeroule` pour sa fiche de règles ; `phraseAvecNom` pour
une phrase traduite dont un nom se détache en gras. **Une partie terminée est archivée avant d'être
sauvegardée** — dans l'autre ordre, fermer l'application sur l'écran de fin la faisait perdre au
palmarès : `apresUnCoup` et `afterHistoryChange` le garantissent.

Restent partagés pour l'instant, et donc à toucher pour certains jeux : le format enregistré des
parties à deux camps (`S.palets`, `G.max`) et les seuls formats simple et double.

Un champ de nom se relie au carnet de joueurs — `src/js/067-joueurs.js` — par
`champDeJoueur(input, porteur, cle)`, appelé une fois le champ dans le DOM : le bouton ouvre le
carnet, et l'identifiant choisi est rangé dans `porteur[cle]`, à côté du nom que le jeu enregistre
déjà. Taper un nom à la main détache le joueur. Au démarrage d'une partie, le jeu range les
identifiants de chaque camp — `idsDe(porteur, nbCoequipiers)` — et les archive dans `p`, parallèle
aux noms de `n` : c'est de là que sortent le classement croisé et les fiches des joueurs.

Le banc joue vingt-huit parcours, le carnet compris.

Un nouveau jeu ajoute enfin son parcours au banc, dans `tools/banc/scenarios.js`.

## Vérifier une refonte : le banc de comparaison

`tools/banc/` joue vingt-huit parcours réels — les huit jeux, tournois, palmarès, réglages, reprise,
import, petit écran, catégories — sur deux versions de l'application, et compare ce qui s'affiche vraiment :
chaque élément visible, sa place, ses couleurs, son texte, plus l'état enregistré. Le hasard,
l'heure et les animations sont figés : une version comparée à elle-même donne zéro différence.

1. Extraire la référence : `git show <commit>:index.html > .banc/reference.html` (dossier ignoré).
2. Servir la racine du dépôt en HTTP (par exemple `python -m http.server 8765`) et ouvrir
   `/tools/banc/index.html`.
3. Dans la console : `demarrer({})`, puis lire `BANC.resultat`.

Tout changement censé ne rien changer à l'écran doit passer le banc avec zéro différence. Un
nouveau jeu ajoute son parcours à `tools/banc/scenarios.js` ; recharger ensuite la page du banc
sans cache, le navigateur gardant volontiers l'ancien fichier.

## Ce qui ne doit jamais bouger

- **L'URL de la page et la portée du service worker.** De nombreux utilisateurs iPhone ont
  installé la version web depuis Safari : `index.html`, `sw.js` et `manifest.webmanifest` restent
  à la racine.
- **Les clés `localStorage`** — `cornhole.v1`, `cornhole.lang`, `cornhole.theme`. Les renommer
  effacerait les parties et palmarès existants.
- **L'identifiant Android** `com.scoretosslabs.cornscore`, gravé par Google Play.

Un état enregistré abîmé ne doit jamais empêcher l'application de démarrer : `load()` relit chaque
jeu à part et remet à zéro celui qui échoue, écarte les parties illisibles du palmarès (`normH`), et
recopie ce qu'il n'a pas su relire sous `cornhole.v1.secours` avant que la prochaine sauvegarde
ne l'écrase.

## Pièges connus

- Une classe qui pose un `display` écrase l'attribut `hidden` : lui ajouter sa garde
  `.classe[hidden]{display:none}`.
- Vérifier le **rendu**, pas l'intention : `display` calculé et hauteur mesurée plutôt que la
  propriété `hidden`, position des cellules plutôt que leur texte.
