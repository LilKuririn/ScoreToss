# Notes de version — à coller dans la console

Limite : 500 caractères par langue. Les balises de langue sont fournies par la console, on écrit
uniquement entre les deux.

---

## Première release (test interne)

### en-US *(langue par défaut, obligatoire)*

```
First internal build of ScoreToss.

Keep score at cornhole: singles or doubles, four bags per team per frame, with the cancellation
worked out for you. Includes single-elimination tournaments up to 16 teams and a record of who
beats whom.

Worth checking: entering a frame, correcting an older one, running a tournament through to the
final, switching language, and that everything survives closing the app.
```

### fr-FR *(seulement si tu ajoutes la langue à la fiche)*

```
Première version interne de ScoreToss.

Compteur de points pour le cornhole : simple ou double, quatre sacs par équipe et par manche,
annulation calculée pour vous. Comprend les tournois à élimination directe jusqu'à 16 équipes et
un palmarès des confrontations.

À vérifier : saisir une manche, corriger une manche passée, mener un tournoi jusqu'à la finale,
changer de langue, et que tout survive à la fermeture de l'application.
```

---

## Première release en production — 1.0.31

Dernier build d'avant le palet : la version qui sort du test fermé ne compte que le cornhole, et
les notes s'y tiennent. Le palet paraîtra dans la release suivante, avec la fiche mise à jour.

Première version visible du grand public : les notes présentent l'application plutôt qu'un journal
des changements, personne n'ayant de version antérieure à comparer.

### en-US *(467 / 500)*

```
First public release of ScoreToss.

A score keeper for cornhole, readable at a glance from the other end of the boards. Singles or doubles, team names and colours, frame-by-frame scoring with the cancellation worked out for you, and any past frame can be corrected.

Single-elimination tournaments up to 16 teams, head-to-head records, and a coin toss for the first throw.

No ads, no account, nothing to sign up for. Everything stays on your phone and works offline.
```

### fr-FR *(487 / 500)*

```
Première version publique de ScoreToss.

Compteur de points pour le cornhole, lisible d'un coup d'œil depuis l'autre planche. Simple ou double, noms et couleurs d'équipes, saisie manche par manche avec l'annulation calculée pour vous, et toute manche passée se corrige.

Tournois à élimination directe jusqu'à 16 équipes, palmarès des confrontations, tirage au sort du premier lanceur.

Sans publicité, sans compte ni inscription. Tout reste sur votre téléphone et fonctionne hors ligne.
```

---

## Version 2.0 — le palet breton

Les utilisateurs ont une version antérieure : on revient au journal des changements.

Nom de release, jamais montré aux utilisateurs : `2.0 — Palet breton`

### en-US *(420 / 500)*

```
New: Breton palet.

On the board, with brass palets, singles or doubles. One stepper per team, because only one team ever scores. A game runs to 12, the decider to 15. The screen says whose turn it is to place the master, and hands the throw over after three missed attempts.

Each game now keeps its own tournament and its own records.

The target score is easier to spot, and light or dark can be set by hand in About.
```

### fr-FR *(429 / 500)*

```
Nouveau : le palet breton.

Sur planche, au laiton, en simple ou en double. Une seule réglette par équipe, puisqu'une seule marque. Partie en 12 points, belle en 15. L'écran indique à qui revient le lancer du maître, et le passe à l'adversaire après trois essais manqués.

Chaque jeu garde désormais son tournoi et son palmarès.

Le score à atteindre se repère mieux, et le thème clair ou sombre se règle à la main dans À propos.
```

---

## Version 3.0 — le mölkky

Nom de release, jamais montré aux utilisateurs : `3.0 — Mölkky`

### en-US *(363 / 500)*

```
New: Mölkky.

2 to 8 players, or teams of 2 to 4 sharing a score. First to exactly 50 wins, going over drops you back to 25, and three misses in a row puts you out. One tap on a twelve-key pad records a throw, and a button shows the official skittle layout.

Fixed: the match sheet lines its columns up again, and two settings no longer show up in the wrong game.
```

### fr-FR *(398 / 500)*

```
Nouveau : le mölkky.

De 2 à 8 joueurs, ou des équipes de 2 à 4 qui partagent un score. Premier à 50 exactement, dépasser ramène à 25, trois ratés de suite éliminent. Un appui sur un pavé de douze touches suffit à saisir un lancer, et un bouton montre le placement officiel des quilles.

Corrigé : la feuille de match retrouve ses colonnes, et deux réglages n'apparaissent plus dans le mauvais jeu.
```

---

## Modèle pour les suivantes

Court, factuel, du point de vue de l'utilisateur. Pas de numéro de version — la console l'affiche
déjà — ni de vocabulaire technique.

```
· Ce qui est nouveau, en une ligne par élément
· Ce qui a été corrigé
```
