<p align="center">
  <img src="store/feature-graphic-1024x500.png" alt="ScoreToss" width="640">
</p>

# ScoreToss

Compteur de points pour les jeux d'extérieur : **cornhole**, **palet breton** et **mölkky**.

Conçu pour être lu d'un coup d'œil depuis l'autre planche, et utilisé debout dans un jardin : deux
grands chiffres, chacun dans la couleur de son équipe, et rien d'autre qui réclame l'attention
pendant la partie. Aucune publicité, aucun compte, aucun serveur — l'application fonctionne
intégralement hors ligne.

## Essayer

| | |
| --- | --- |
| **Web** | <https://lilkuririn.github.io/ScoreToss/> — *Ajouter à l'écran d'accueil* l'installe en plein écran, et elle fonctionne ensuite sans réseau |
| **Android** | [`cornscore.apk`](https://github.com/LilKuririn/ScoreToss/releases/download/apk/cornscore.apk) — installation directe, reconstruite à chaque modification |
| **Play Store** | [ScoreToss](https://play.google.com/store/apps/details?id=com.scoretosslabs.cornscore) — voir [le carnet de publication](store/publication.md) |

En local, ouvrir [`index.html`](index.html) dans un navigateur suffit.

---

## Compter une partie

L'accueil liste les jeux. Le cornhole et le palet partagent tout : manches successives, honneur au
vainqueur de la précédente, correction après coup, tournois et palmarès — seules la saisie d'une
manche et les règles changent. Le mölkky, qui ne se joue pas à deux camps, a ses propres écrans.

**Simple (1v1) ou double (2v2).** Nom d'équipe, noms des joueurs, couleur au choix parmi neuf.
Passer d'un mode à l'autre repart de noms vides, un joueur n'étant pas une équipe.

**Saisie par manche.** Un compteur *trou* (3 points) et un compteur *planche* (1 point) par équipe,
plafonnés à quatre sacs. L'annulation est calculée et affichée avant validation : personne n'a de
soustraction à faire entre deux lancers.

**Suivi de l'honneur.** L'équipe qui a marqué lance en premier à la manche suivante. La toute
première est désignée par un tirage au sort, présenté comme un rouleau de machine à sous.

**Feuille de match.** Historique manche par manche avec score courant. Chaque manche peut être
corrigée ou supprimée après coup, aussi loin soit-elle : l'historique est rejoué et le score
recalculé sur toute la partie. Une erreur de décompte se répare en cinq secondes au lieu de finir
en discussion.

**Fin de partie.** Vainqueur, score final, puis la courbe des points cumulés des deux équipes,
manche après manche, graduée en points, le score à atteindre marqué en pointillés. Dessous, le face-à-face colonne
contre colonne — points, manches gagnées, sacs dans le trou, sacs sur la planche, meilleure
manche : la meilleure valeur de chaque ligne prend la couleur de son équipe, l'autre s'efface.
Revanche en un appui, ou partage du résultat en texte.

## Tournois

De **2 à 16 équipes**, en élimination directe. Quand le nombre d'équipes n'est pas une puissance de
deux, les premières du tableau sont exemptées du premier tour — le placement suit l'ordre classique
où la tête de série rencontre la dernière équipe.

L'arbre reste consultable en permanence : les vainqueurs apparaissent dans leur couleur avec le
score final, le prochain match est mis en avant et rappelé dans la barre du bas. À la fin d'un
match, on enchaîne sur le suivant ou on revient au tableau.

Le tournoi et la partie en cours sont sauvegardés séparément : un 1v1 improvisé ne fait pas perdre
le tableau commencé. Et rien n'oblige à aller au bout — on peut repartir d'un nouveau tableau ou
abandonner, en deux appuis pour éviter la fausse manœuvre.

Le mölkky n'a pas de tableau. **Chacun des deux autres a le sien**, et son brouillon. Un tournoi de cornhole en cours n'allume
pas la pastille du bouton quand on passe au palet, et les noms d'équipes saisis d'un côté ne
réapparaissent pas de l'autre. Les deux peuvent tourner en même temps sans se gêner.

## Palmarès

Les parties terminées sont archivées, tournoi compris, pour répondre à la seule question qui fâche
entre deux barbecues : **qui mène**.

- **Confrontations** — le face-à-face de chaque paire, avec une barre partagée dans leurs couleurs
- **Classement** — victoires, défaites, ratio
- **Dernières parties** — date, vainqueur, score

Une petite marque `1v1` ou `2v2` distingue les joueurs des équipes. Un nom apparu dans les deux
formats n'en reçoit aucune : elle mentirait.

Chaque jeu a son palmarès, mölkky compris : les victoires ne voyagent pas de l'un à l'autre.

## Les règles appliquées

Le rappel des règles est une fiche qui s'ouvre par-dessus l'écran, et se referme d'un toucher. Elle
suit le jeu en cours.

### Cornhole

Un sac dans le trou vaut **3 points**, un sac sur la planche **1 point**. Chaque équipe lance
**4 sacs** par manche — en double, 2 sacs par joueur. Seule la **différence** entre les deux équipes
est marquée : 5 points contre 3 rapportent 2 points, l'autre équipe n'en marque aucun. La partie
s'arrête dès qu'une équipe atteint le score visé, **21** par défaut, 11 ou 15 au choix.

### Mölkky

De **2 à 8 participants**, chacun son score. Le premier à **50 points exactement** l'emporte ;
**dépasser 50 ramène à 25**. **Trois lancers manqués** de suite éliminent, et le tour est sauté
ensuite.

**En individuel ou en équipes.** Une équipe compte 2 à 4 joueurs, partage un score, et ses membres
lancent à tour de rôle : l'écran annonce « Les Bleus · Marc » et fait tourner. Le lanceur se déduit
du nombre de lancers déjà faits par l'équipe, donc corriger un lancer ancien reste juste. Les trois
ratés se comptent **pour l'équipe**, quel que soit le membre qui lançait. Passer d'un format à
l'autre repart de noms vides, un joueur n'étant pas une équipe.

Un lancer vaut de 0 à 12 : le numéro de l'unique quille renversée, ou le nombre de quilles s'il y en
a plusieurs. Les deux cas donnant le même chiffre, la saisie tient en **un appui** sur un pavé de
douze touches — le jeu va vite, l'application ne doit pas le ralentir.

Un bouton ouvre le **placement des quilles** : la formation officielle, à 3,50 m de la zone de
lancer, consultable depuis la préparation comme en cours de partie.

Pas de tournoi pour ce jeu : le tableau à élimination directe suppose des matchs à deux.

### Palet breton

Sur planche, au laiton. Le **maître** est posé sur la planche par l'équipe qui a marqué, qui lance
ensuite en premier ; l'autre relance jusqu'à reprendre le point ou épuiser ses palets.

L'équipe qui pose le maître a **trois essais** pour l'y placer ; sans succès, l'adversaire tente à
son tour, avec trois essais également, et ainsi de suite. **Celui qui le pose a la main** — l'honneur
peut donc changer avant qu'un seul palet soit lancé, y compris après le tirage au sort d'ouverture.

Une ligne discrète au-dessus de la saisie dit à qui revient le lancer, avec un bouton *Manqué* pour
le passer à l'adversaire. Elle n'apparaît qu'au palet, et disparaît la partie finie. Les essais ne
sont pas comptés : seul importe à qui revient le lancer, et c'est la seule chose que l'écran a
besoin de dire.

Seule l'équipe dont le palet est le plus proche du maître marque, **1 point par palet mieux placé
que le meilleur adverse**. Un palet tombé de la planche ne compte pas. Si le **maître** quitte la
planche, la manche est **nulle** et se rejoue — l'honneur ne change pas de main.

La partie se joue en **12 points**, la **belle en 15**. Chaque jeu garde son propre score : passer
au palet ne touche pas au 21 du cornhole.

Le nombre de **palets par joueur** se règle à 2, 3 ou 4, l'usage variant d'une fédération à l'autre.
Par défaut 4 en simple et 2 en double, soit quatre palets par équipe dans les deux formats — c'est
le maximum qu'une manche peut rapporter.

La saisie s'en trouve simplifiée : une seule réglette par équipe, puisqu'une seule marque. Deux zéros
valent manche nulle.

## Vos données restent chez vous

Aucune donnée ne quitte le téléphone. Pas de compte, pas de serveur, pas de traceur, pas de
publicité. Les parties, les tournois et le palmarès sont enregistrés localement et disparaissent
avec l'application.

Une **sauvegarde** exportable en JSON permet de tout emporter avant de changer de téléphone, et de
le restaurer ensuite.

## Langues et apparence

Français, anglais et espagnol. La langue suit celle du téléphone au premier lancement et se change
depuis la fiche *À propos*, où une position « Téléphone » permet de revenir au suivi automatique.

Le **thème clair ou sombre** se règle au même endroit, avec la même position « Téléphone » par
défaut. Un choix explicite est posé avant le premier rendu, sans clignotement, et s'impose à la
couleur de la barre système.

Le vocabulaire est **commun aux trois jeux** : on parle de manche partout, quel que soit ce que dit
la fédération. En anglais, *frame* désigne la manche et *round* le tour de tournoi — deux mots que
le français confond.

## Comment c'est fait

HTML, CSS et JavaScript natifs, sans dépendance. L'application est **livrée en un seul fichier**,
`index.html` : c'est ce que servent GitHub Pages, le cache hors ligne et la coquille Android, sans
liste de fichiers à tenir à jour nulle part.

Mais elle **s'écrit en morceaux**, dans `src/` — un fichier par écran, par feuille de style et par
partie du script —, que `tools/build.js` remet bout à bout dans l'ordre de leur préfixe. Le script
ne demande que Node. `index.html` ne se modifie donc jamais à la main :

```bash
node tools/build.js
```

À chaque push, la CI vérifie que `index.html` correspond bien à `src/`. Un fichier source modifié
sans réassembler, ou un `index.html` retouché directement, la fait échouer.

Le thème est défini par des variables CSS et les couleurs d'équipe sont dérivées du fond avec
`color-mix()`, ce qui rend l'interface lisible en clair comme en sombre sans dupliquer une seule
règle. L'état est conservé dans `localStorage`.

L'APK n'est pas une copie de l'application : `android/` est une coquille native minimale — une
WebView qui sert `index.html` depuis ses assets — et la compilation va chercher les fichiers web à
la racine du dépôt. Il n'existe donc qu'une seule version du code.

Deux choix méritent d'être signalés côté Android. Les assets sont servis par une origine `https`
interne plutôt qu'en `file://`, sans quoi `localStorage` n'est pas fiable selon les versions. Et le
bouton retour du téléphone s'appuie sur l'interface existante : il ferme la feuille de match ou
remonte d'un écran avant de proposer de quitter, sans qu'`index.html` ait eu à bouger.

Le build tourne dans GitHub Actions, aucune chaîne d'outils Android n'est nécessaire en local. Le
site est publié par GitHub Pages depuis `main` : un `git push` suffit à déployer les deux.

## Dans le dépôt

| Chemin | Rôle |
| --- | --- |
| `index.html` | Toute l'application, **générée** — ne pas modifier |
| `src/` | Les sources : squelette, styles, écrans et script |
| `tools/build.js` | Assemble `index.html` depuis `src/`, ou vérifie qu'il correspond |
| `sw.js`, `manifest.webmanifest` | Installation sur l'écran d'accueil et fonctionnement hors ligne |
| `icon-*.png`, `apple-touch-icon.png` | Icônes 192 / 512 / masquable |
| `privacy.html` | Politique de confidentialité, trilingue |
| `android/` | Coquille native et projet Gradle |
| `.github/workflows/` | Construction de l'APK et du bundle, contrôle de l'assemblage |
| `store/` | Visuels, textes de fiche et [carnet de publication](store/publication.md) |

## Ce qui viendra

La pétanque et le palet vendéen, sur le même moteur — l'accueil garde une place pour eux.
Les tournois en poules, quand l'élimination directe montrera ses limites.
