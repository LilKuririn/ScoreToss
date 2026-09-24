/* ==================================================================
   Langues — « manche » se dit frame au cornhole, à ne pas confondre
   avec les tours d'un tournoi (rounds).
================================================================== */
var TXT = {
fr:{
  "app.tagline":"Compteur de points",
  "cat.eyebrow":"Choisir une catégorie", "cat.back":"Catégories", "cat.soon":"Bientôt",
  "cat.exterieur":"Extérieur", "cat.interieur":"Intérieur", "cat.societe":"Société",
  "cat.count":"{n} jeu", "cat.count_p":"{n} jeux",
  "games.soon":"En chantier", "games.soon.sub":"Pétanque…",
  "games.change":"Changer de jeu",
  "app.desc":"Compteur de points pour les jeux d'extérieur, d'intérieur et de société. Cornhole, pétanque, palet breton, mölkky, bibock, fléchettes, tossit et yams, en simple, en double ou en équipes, tournois à élimination directe et palmarès entre joueurs.",
  "nav.home":"Accueil", "nav.close":"Fermer",
  "mode.single":"Simple", "mode.single.sub":"1 v 1",
  "mode.double":"Double", "mode.double.sub":"2 v 2",
  "setup.target":"Score à atteindre",
  "setup.start":"Commencer la partie",
  "setup.rules.eyebrow":"Règles du jeu",
  "setup.rules.label":"Comment marquer des points",
  "setup.about.eyebrow":"À propos", "setup.about.label":"Réglages, sauvegarde et langue",
  "team.a":"Équipe A", "team.b":"Équipe B",
  "player.a":"Joueur A", "player.b":"Joueur B",
  "team.name.aria":"Nom de l'équipe", "player.name.aria":"Nom du joueur",
  "team.player":"Joueur",
  "color.aria":"Couleur",
  "game.frame":"Manche", "game.target":"Objectif",
  "game.first":"Lance en premier",
  "game.validate":"Valider",
  "game.scores":"{name} marque {n} point", "game.scores_p":"{name} marque {n} points",
  "toss.draw":"Tirer au sort",
  "toss.who":"Qui lance en premier",
  "toss.running":"Tirage en cours",
  "toss.result":"{name} lance en premier",
  "order.draw":"Tirer l'ordre", "order.who":"Ordre de jeu", "order.first":"{name} commence", "order.ok":"C'est parti",
  "sheet.title":"Feuille de match",
  "sheet.frame":"Manche",
  "sheet.empty":"Aucune manche jouée pour l'instant.",
  "sheet.hint":"Touchez une manche pour corriger son décompte. Le score est recalculé sur toute la partie.",
  "sheet.undo":"Annuler la dernière manche",
  "sheet.quit":"Terminer la partie",
  "sheet.quit.tour":"Abandonner le match",
  "sheet.fix.aria":"Corriger la manche {n}",
  "edit.title":"Correction · manche {n}",
  "edit.cancel":"Annuler",
  "edit.save":"Enregistrer la correction",
  "edit.delete":"Supprimer cette manche",
  "over.done":"Partie terminée en {n} manche","over.done_p":"Partie terminée en {n} manches",
  "over.wins":"{name} l'emporte",
  "over.nframes":"{n} manche","over.nframes_p":"{n} manches",
  "over.best":"Meilleure manche",
  "over.points":"Points",
  "over.won":"Manches gagnées",
  "over.prog":"Progression",
  "over.stats":"Statistiques",
  "over.goal":"Objectif {n}",
  "over.chart.aria":"Progression des points : {a} {sa}, {b} {sb}, en {n} manche","over.chart.aria_p":"Progression des points : {a} {sa}, {b} {sb}, en {n} manches",
  "over.rematch":"Revanche",
  "over.newsetup":"Nouvelle configuration",
  "over.next":"Match suivant",
  "over.nextline":"Ensuite : {a} contre {b}.",
  "over.champion":"Voir le vainqueur du tournoi",
  "over.bracket":"Retour au tableau",
  "tour.title":"Tournoi",
  "tour.eyebrow":"Élimination directe",
  "tour.teams":"Équipes engagées",
  "tour.target":"Score à atteindre — tous les matchs",
  "tour.create":"Créer le tableau",
  "tour.add":"Ajouter une équipe", "tour.remove":"Retirer une équipe",
  "tour.bracketof":"Tableau à {n}",
  "tour.byes.none":"aucune exemption",
  "tour.byes":"{n} équipe exemptée du 1er tour", "tour.byes_p":"{n} équipes exemptées du 1er tour",
  "tour.teamn":"Équipe {n}",
  "tour.team.aria":"Nom de l'équipe {n}",
  "tour.color.aria":"Couleur de l'équipe {n}",
  "tour.menu":"Options du tournoi",
  "tour.state":"État du tableau",
  "tour.summary":"{t} équipes · {m} match joué · {s}", "tour.summary_p":"{t} équipes · {m} matchs joués · {s}",
  "tour.warn":"Abandonner efface le tableau et ses résultats. Les parties déjà jouées restent au palmarès.",
  "tour.restart":"Repartir d'un nouveau tableau",
  "tour.abandon":"Abandonner le tournoi",
  "tour.abandon.confirm":"Confirmer l'abandon",
  "tour.head":"{t} équipes · {m} match", "tour.head_p":"{t} équipes · {m} matchs",
  "tour.next":"Prochain match · {r}",
  "tour.play":"Jouer",
  "tour.winner":"Vainqueur du tournoi",
  "tour.new":"Nouveau",
  "tour.waiting":"Tableau en attente.",
  "tour.tbd":"À suivre",
  "tour.bye":"Exempté",
  "tour.done":"terminé", "tour.pending":"en attente",
  "tour.live":"Tournoi en cours", "tour.over":"Tournoi terminé",
  "round.final":"Finale", "round.semi":"Demi-finales",
  "round.quarter":"Quarts de finale", "round.16":"Huitièmes", "round.n":"Tour {n}",
  "hall.title":"Palmarès", "hall.aria":"Palmarès",
  "hall.count":"{n} partie enregistrée", "hall.count_p":"{n} parties enregistrées",
  "hall.tie":"Égalité",
  "pl.count":"{n} joueur","pl.count_p":"{n} joueurs",
  "pl.empty":"Personne dans le carnet. Ajoutez ceux avec qui vous jouez souvent : leur nom vous sera proposé dans tous les jeux.",
  "pl.empty.pick":"Le carnet est vide. Tapez un nom, puis ajoutez-le d'ici.",
  "pl.none":"Aucun joueur de ce nom.",
  "pl.hint":"Ces noms vous sont proposés dans tous les jeux. Un invité peut toujours être tapé à la main.",
  "pl.new":"Nouveau joueur", "pl.new.ph":"Prénom ou surnom", "pl.add":"Ajouter",
  "pl.pick":"Choisir un joueur", "pl.search":"Rechercher",
  "pl.addname":"Ajouter « {name} » au carnet", "pl.clear":"Vider le champ",
  "pl.name.aria":"Nom du joueur",
  "pl.nogame":"Aucune partie enregistrée pour ce joueur. Choisissez son nom au départ d'une partie et elle comptera ici.",
  "data.wipe.title":"Repartir de zéro", "data.wipe":"Effacer tous les palmarès",
  "data.wipe.confirm":"Confirmer l'effacement", "data.wipe.done":"Palmarès effacés",
  "data.wipe.hint":"Efface les parties enregistrées des huit jeux, d'un coup. Le carnet de joueurs, la partie en cours et les tournois ne sont pas touchés.",
  "about.what":"Huit jeux à compter, en trois catégories : dehors le cornhole, la pétanque, le palet breton, le mölkky et le bibock ; dedans les fléchettes et le tossit ; à table le yams.",
  "about.what2":"Chaque jeu a ses règles, sa saisie et son palmarès ; les jeux à deux camps ont aussi des tournois. Le carnet de joueurs, lui, les traverse tous. Rien ne sort du téléphone, et tout fonctionne hors ligne.",
  "pl.vs":"contre",
  "pal.tab.rank":"Classement",
  "pal.tab.hist":"Historique",
  "pal.tab.people":"Joueurs",
  "pal.filter":"Filtrer par jeu",
  "pal.all":"Tous les jeux",
  "pal.none":"Aucune partie enregistrée pour l'instant. Elles s'afficheront ici à la fin de chaque partie.",
  "pal.none.game":"Aucune partie de ce jeu pour l'instant.",
  "pal.rank":"Classement",
  "pal.rank.rest":"La suite du classement",
  "pal.rank.note":"Classés au nombre de victoires, tous jeux confondus. En équipe, la victoire compte pour chaque membre ; un nom tapé à la main apparaît comme invité. Une partie en solo ne compte pas.",
  "pal.rank.note.game":"Classés au nombre de victoires dans ce jeu. En équipe, la victoire compte pour chaque membre ; un nom tapé à la main apparaît comme invité. Une partie en solo ne compte pas.",
  "pal.wins":"{n} victoire",
  "pal.wins_p":"{n} victoires",
  "pal.games":"{n} partie",
  "pal.games_p":"{n} parties",
  "pal.wins.of":"{v} sur {n}",
  "pal.won":"gagnées",
  "pal.pct":"{n} %",
  "pal.guest":"invité",
  "pal.today":"Aujourd'hui",
  "pal.yesterday":"Hier",
  "pal.tour":"tournoi",
  "pal.beat":"{w} bat {l}",
  "pal.beat_p":"{w} battent {l}",
  "pal.ahead":"{w} l'emporte devant {n} adversaires",
  "pal.ahead_p":"{w} l'emportent devant {n} adversaires",
  "pal.won1":"Gagnée",
  "pal.lost1":"Perdue",
  "pal.with":"avec",
  "pal.clear":"Effacer les parties de ce jeu",
  "pal.clear.ok":"Confirmer : effacer {n} partie",
  "pal.clear.ok_p":"Confirmer : effacer {n} parties",
  "pal.tourmatch":"Match de tournoi",
  "pal.parts":"{n} participant",
  "pal.parts_p":"{n} participants",
  "pal.each":"victoire pour chacun",
  "pal.card":"Fiche joueur",
  "pal.card.rank":"{r} du classement général, sur {n} joueurs",
  "pal.card.none":"Pas encore au classement : aucune partie jouée.",
  "pal.fig.games":"partie jouée", "pal.fig.games_p":"parties jouées",
  "pal.fig.wins":"victoire", "pal.fig.wins_p":"victoires",
  "pal.fig.rate":"de victoires",
  "pal.form":"Forme du moment",
  "pal.form.v":"V",
  "pal.form.d":"D",
  "pal.form.hint":"Dernières parties, la plus récente à droite",
  "pal.streak":"{n} victoires d'affilée",
  "pal.hisgames":"Ses jeux",
  "pal.h2h":"Face à face",
  "pal.h2h.note":"Ses victoires à gauche, celles de l'adversaire à droite.",
  "pal.recent":"Ses dernières parties",
  "pal.edit":"Modifier",
  "pal.del":"Supprimer du carnet",
  "pal.del.ok":"Confirmer la suppression",
  "pal.del.note":"Ses parties restent dans l'historique, sous le nom qu'elles portaient.",
  "pal.nogames":"aucune partie",
  "pal.ord.1":"1er",
  "pal.ord.2":"2e",
  "pal.ord.3":"3e",
  "pal.ord.n":"{n}e",
  "pal.solo":"En solo",
  "pal.solo.h":"{w} en solo",
  "hf.title":"Hauts faits",
  "hf.count":"{n} sur {t}",
  "hf.got":"Obtenu le {d}",
  "hf.gotshort":"obtenu",
  "hf.notyet":"Pas encore obtenu",
  "hf.times":"{n} fois",
  "hf.times_p":"{n} fois",
  "hf.premiere":"Première victoire",
  "hf.premiere.d":"Gagner une partie à plusieurs.",
  "hf.fanny":"La Fanny",
  "hf.fanny.d":"Gagner 13 à 0 à la pétanque.",
  "hf.blanc":"Blanchissage",
  "hf.blanc.d":"Gagner sans laisser un seul point à l'adversaire, dans un autre jeu que la pétanque.",
  "hf.fil":"Sur le fil",
  "hf.fil.d":"Gagner d'un seul point.",
  "hf.serie3":"Sur sa lancée",
  "hf.serie3.d":"Gagner trois parties d'affilée.",
  "hf.serie5":"Intouchable",
  "hf.serie5.d":"Gagner cinq parties d'affilée.",
  "hf.equipe":"Esprit d'équipe",
  "hf.equipe.d":"Gagner cinq parties en équipe.",
  "hf.touche":"Touche-à-tout",
  "hf.touche.d":"Gagner à trois jeux différents.",
  "hf.terrains":"Tous terrains",
  "hf.terrains.d":"Gagner en extérieur, en intérieur et en société.",
  "hf.yams300":"La barre des 300",
  "hf.yams300.d":"Marquer 300 points ou plus au yams.",
  "hf.fidele":"Habitué",
  "hf.fidele.d":"Jouer vingt-cinq parties.",
  "hf.nemesis":"Bête noire",
  "hf.nemesis.d":"Battre trois fois le même adversaire sans jamais perdre contre lui.",
  "hf.nemesis.de":"Bête noire de {nom}",
  "rules.title":"Règles du jeu",
  "about.title":"À propos",
  "about.version":"Version {v}",
  "about.lang":"Langue", "about.lang.auto":"Téléphone",
  "about.support":"Soutenir", "about.support.label":"Offrir un café au développeur",
  "about.privacy":"Confidentialité", "about.privacy.label":"Ce que l'application fait de vos données",
  "about.source":"Code source", "about.source.label":"Le projet sur GitHub",
  "about.foot":"Aucune donnée ne quitte votre téléphone. Les parties, les tournois et le palmarès sont enregistrés localement, ne sont jamais transmis, et disparaissent si vous désinstallez l'application.",
  "sheet.quit.confirm":"Confirmer l'arrêt",
  "over.void":"Manches nulles",
  "about.theme":"Thème",
  "about.theme.auto":"Téléphone",
  "about.theme.light":"Clair",
  "about.theme.dark":"Sombre",
  "data.title":"Vos données",
  "data.export":"Exporter une sauvegarde",
  "data.import":"Restaurer une sauvegarde",
  "data.hint":"La sauvegarde contient le palmarès, le tournoi en cours et la partie en cours. Gardez-la avant de changer de téléphone.",
  "data.done":"Sauvegarde enregistrée",
  "data.imported":"Sauvegarde restaurée",
  "data.bad":"Fichier illisible",
  "data.confirm":"Remplacer les données actuelles ?",
  "share.result":"Partager le résultat",
  "share.game":"{a} {sa} – {sb} {b} · {n} manche · ScoreToss","share.game_p":"{a} {sa} – {sb} {b} · {n} manches · ScoreToss",
  "share.bracket":"Partager le tableau",
  "share.copied":"Copié dans le presse-papiers",
  "color.rouge":"Rouge","color.ambre":"Ambre","color.or":"Or","color.vert":"Vert",
  "color.sarcelle":"Sarcelle","color.bleu":"Bleu","color.violet":"Violet",
  "color.rose":"Rose","color.ardoise":"Ardoise"
},
en:{
  "app.tagline":"Score keeper",
  "cat.eyebrow":"Pick a category", "cat.back":"Categories", "cat.soon":"Coming soon",
  "cat.exterieur":"Outdoor", "cat.interieur":"Indoor", "cat.societe":"Board games",
  "cat.count":"{n} game", "cat.count_p":"{n} games",
  "games.soon":"In the works", "games.soon.sub":"Pétanque…",
  "games.change":"Change game",
  "app.desc":"A score keeper for outdoor, indoor and board games. Cornhole, pétanque, Breton palet, Mölkky, Bibock, darts, Tossit and Yams, singles, doubles or teams, single-elimination tournaments, and a record of who beats whom.",
  "nav.home":"Home", "nav.close":"Close",
  "mode.single":"Singles", "mode.single.sub":"1 v 1",
  "mode.double":"Doubles", "mode.double.sub":"2 v 2",
  "setup.target":"Play to",
  "setup.start":"Start the game",
  "setup.rules.eyebrow":"How to play",
  "setup.rules.label":"How points are scored",
  "setup.about.eyebrow":"About", "setup.about.label":"Settings, backup and language",
  "team.a":"Team A", "team.b":"Team B",
  "player.a":"Player A", "player.b":"Player B",
  "team.name.aria":"Team name", "player.name.aria":"Player name",
  "team.player":"Player",
  "color.aria":"Colour",
  "game.frame":"Frame", "game.target":"Playing to",
  "game.first":"Throws first",
  "game.validate":"Confirm",
  "game.scores":"{name} scores {n} point", "game.scores_p":"{name} scores {n} points",
  "toss.draw":"Coin toss",
  "toss.who":"Who throws first",
  "toss.running":"Tossing",
  "toss.result":"{name} throws first",
  "order.draw":"Draw order", "order.who":"Playing order", "order.first":"{name} goes first", "order.ok":"Let's play",
  "sheet.title":"Scorecard",
  "sheet.frame":"Frame",
  "sheet.empty":"No frames played yet.",
  "sheet.hint":"Tap a frame to correct its count. The score is recalculated across the whole game.",
  "sheet.undo":"Undo the last frame",
  "sheet.quit":"End the game",
  "sheet.quit.tour":"Forfeit the match",
  "sheet.fix.aria":"Correct frame {n}",
  "edit.title":"Correction · frame {n}",
  "edit.cancel":"Cancel",
  "edit.save":"Save the correction",
  "edit.delete":"Delete this frame",
  "over.done":"Game finished in {n} frame","over.done_p":"Game finished in {n} frames",
  "over.wins":"{name} wins",
  "over.nframes":"{n} frame","over.nframes_p":"{n} frames",
  "over.best":"Best frame",
  "over.points":"Points",
  "over.won":"Frames won",
  "over.prog":"Progression",
  "over.stats":"Statistics",
  "over.goal":"Target {n}",
  "over.chart.aria":"Score progression: {a} {sa}, {b} {sb}, over {n} frame","over.chart.aria_p":"Score progression: {a} {sa}, {b} {sb}, over {n} frames",
  "over.rematch":"Rematch",
  "over.newsetup":"New setup",
  "over.next":"Next match",
  "over.nextline":"Up next: {a} against {b}.",
  "over.champion":"See the tournament winner",
  "over.bracket":"Back to the bracket",
  "tour.title":"Tournament",
  "tour.eyebrow":"Single elimination",
  "tour.teams":"Teams entered",
  "tour.target":"Play to — every match",
  "tour.create":"Create the bracket",
  "tour.add":"Add a team", "tour.remove":"Remove a team",
  "tour.bracketof":"{n}-team bracket",
  "tour.byes.none":"no byes",
  "tour.byes":"{n} team gets a first-round bye", "tour.byes_p":"{n} teams get a first-round bye",
  "tour.teamn":"Team {n}",
  "tour.team.aria":"Name of team {n}",
  "tour.color.aria":"Colour of team {n}",
  "tour.menu":"Tournament options",
  "tour.state":"Bracket status",
  "tour.summary":"{t} teams · {m} match played · {s}", "tour.summary_p":"{t} teams · {m} matches played · {s}",
  "tour.warn":"Abandoning erases the bracket and its results. Games already played stay in the records.",
  "tour.restart":"Start a new bracket",
  "tour.abandon":"Abandon the tournament",
  "tour.abandon.confirm":"Confirm abandoning",
  "tour.head":"{t} teams · {m} match", "tour.head_p":"{t} teams · {m} matches",
  "tour.next":"Next match · {r}",
  "tour.play":"Play",
  "tour.winner":"Tournament winner",
  "tour.new":"New",
  "tour.waiting":"Bracket waiting.",
  "tour.tbd":"TBD",
  "tour.bye":"Bye",
  "tour.done":"finished", "tour.pending":"waiting",
  "tour.live":"Tournament in progress", "tour.over":"Tournament finished",
  "round.final":"Final", "round.semi":"Semi-finals",
  "round.quarter":"Quarter-finals", "round.16":"Round of 16", "round.n":"Round {n}",
  "hall.title":"Records", "hall.aria":"Records",
  "hall.count":"{n} game recorded", "hall.count_p":"{n} games recorded",
  "hall.tie":"Draw",
  "pl.count":"{n} player","pl.count_p":"{n} players",
  "pl.empty":"No one here yet. Add the people you play with often: their name will be offered in every game.",
  "pl.empty.pick":"No players yet. Type a name, then add it from here.",
  "pl.none":"No player with that name.",
  "pl.hint":"These names are offered in every game. A guest can always be typed by hand.",
  "pl.new":"New player", "pl.new.ph":"Name or nickname", "pl.add":"Add",
  "pl.pick":"Pick a player", "pl.search":"Search",
  "pl.addname":"Add “{name}” to your players", "pl.clear":"Clear the field",
  "pl.name.aria":"Player name",
  "pl.nogame":"No games recorded for this player yet. Pick their name when starting a game and it will count here.",
  "data.wipe.title":"Start over", "data.wipe":"Clear every standings table",
  "data.wipe.confirm":"Confirm clearing", "data.wipe.done":"Standings cleared",
  "data.wipe.hint":"Clears the recorded games of all eight games at once. Your players, the game in progress and tournaments are left alone.",
  "about.what":"Eight games to keep score of, in three categories: outdoors cornhole, pétanque, Breton palet, mölkky and bibock; indoors darts and Tossit; at the table Yams.",
  "about.what2":"Each game has its rules, its scoring and its standings; the two-sided ones also have tournaments. Your players carry across all of them. Nothing leaves the phone, and everything works offline.",
  "pl.vs":"vs",
  "pal.tab.rank":"Standings",
  "pal.tab.hist":"History",
  "pal.tab.people":"Players",
  "pal.filter":"Filter by game",
  "pal.all":"All games",
  "pal.none":"No games recorded yet. They'll show up here as soon as a game ends.",
  "pal.none.game":"No games of this one yet.",
  "pal.rank":"Standings",
  "pal.rank.rest":"The rest of the standings",
  "pal.rank.note":"Ranked by wins, all games together. In a team, the win counts for every member; a name typed by hand shows as a guest. Solo games don't count.",
  "pal.rank.note.game":"Ranked by wins in this game. In a team, the win counts for every member; a name typed by hand shows as a guest. Solo games don't count.",
  "pal.wins":"{n} win",
  "pal.wins_p":"{n} wins",
  "pal.games":"{n} game",
  "pal.games_p":"{n} games",
  "pal.wins.of":"{v} in {n}",
  "pal.won":"won",
  "pal.pct":"{n}%",
  "pal.guest":"guest",
  "pal.today":"Today",
  "pal.yesterday":"Yesterday",
  "pal.tour":"tournament",
  "pal.beat":"{w} beats {l}",
  "pal.beat_p":"{w} beat {l}",
  "pal.ahead":"{w} wins ahead of {n} others",
  "pal.ahead_p":"{w} win ahead of {n} others",
  "pal.won1":"Won",
  "pal.lost1":"Lost",
  "pal.with":"with",
  "pal.clear":"Clear this game's history",
  "pal.clear.ok":"Confirm: clear {n} game",
  "pal.clear.ok_p":"Confirm: clear {n} games",
  "pal.tourmatch":"Tournament match",
  "pal.parts":"{n} participant",
  "pal.parts_p":"{n} participants",
  "pal.each":"a win for each",
  "pal.card":"Player card",
  "pal.card.rank":"{r} in the overall standings, out of {n} players",
  "pal.card.none":"Not ranked yet: no games played.",
  "pal.fig.games":"game played", "pal.fig.games_p":"games played",
  "pal.fig.wins":"win", "pal.fig.wins_p":"wins",
  "pal.fig.rate":"win rate",
  "pal.form":"Recent form",
  "pal.form.v":"W",
  "pal.form.d":"L",
  "pal.form.hint":"Latest games, newest on the right",
  "pal.streak":"{n} wins in a row",
  "pal.hisgames":"Games",
  "pal.h2h":"Head to head",
  "pal.h2h.note":"Their wins on the left, the opponent's on the right.",
  "pal.recent":"Recent games",
  "pal.edit":"Edit",
  "pal.del":"Remove from your players",
  "pal.del.ok":"Confirm removal",
  "pal.del.note":"Their games stay in the history, under the name they had.",
  "pal.nogames":"no games",
  "pal.ord.1":"1st",
  "pal.ord.2":"2nd",
  "pal.ord.3":"3rd",
  "pal.ord.n":"{n}th",
  "pal.solo":"Solo",
  "pal.solo.h":"{w} played solo",
  "hf.title":"Achievements",
  "hf.count":"{n} of {t}",
  "hf.got":"Earned on {d}",
  "hf.gotshort":"earned",
  "hf.notyet":"Not earned yet",
  "hf.times":"{n} time",
  "hf.times_p":"{n} times",
  "hf.premiere":"First win",
  "hf.premiere.d":"Win a game against others.",
  "hf.fanny":"La Fanny",
  "hf.fanny.d":"Win 13–0 at pétanque.",
  "hf.blanc":"Shutout",
  "hf.blanc.d":"Win without the opponent scoring a single point, in any game but pétanque.",
  "hf.fil":"By a whisker",
  "hf.fil.d":"Win by a single point.",
  "hf.serie3":"On a roll",
  "hf.serie3.d":"Win three games in a row.",
  "hf.serie5":"Untouchable",
  "hf.serie5.d":"Win five games in a row.",
  "hf.equipe":"Team spirit",
  "hf.equipe.d":"Win five games as part of a team.",
  "hf.touche":"All-rounder",
  "hf.touche.d":"Win at three different games.",
  "hf.terrains":"All terrain",
  "hf.terrains.d":"Win outdoors, indoors and at the table.",
  "hf.yams300":"The 300 club",
  "hf.yams300.d":"Score 300 or more at Yams.",
  "hf.fidele":"Regular",
  "hf.fidele.d":"Play twenty-five games.",
  "hf.nemesis":"Nemesis",
  "hf.nemesis.d":"Beat the same opponent three times without ever losing to them.",
  "hf.nemesis.de":"{nom}'s nemesis",
  "rules.title":"How to play",
  "about.title":"About",
  "about.version":"Version {v}",
  "about.lang":"Language", "about.lang.auto":"Phone",
  "about.support":"Support", "about.support.label":"Buy the developer a coffee",
  "about.privacy":"Privacy", "about.privacy.label":"What the app does with your data",
  "about.source":"Source code", "about.source.label":"The project on GitHub",
  "about.foot":"No data leaves your phone. Games, tournaments and records are stored locally, are never transmitted, and disappear if you uninstall the app.",
  "sheet.quit.confirm":"Confirm ending",
  "over.void":"Void frames",
  "about.theme":"Theme",
  "about.theme.auto":"Phone",
  "about.theme.light":"Light",
  "about.theme.dark":"Dark",
  "data.title":"Your data",
  "data.export":"Export a backup",
  "data.import":"Restore a backup",
  "data.hint":"The backup holds your records, the running tournament and the current game. Keep one before switching phones.",
  "data.done":"Backup saved",
  "data.imported":"Backup restored",
  "data.bad":"Unreadable file",
  "data.confirm":"Replace the current data?",
  "share.result":"Share the result",
  "share.game":"{a} {sa} – {sb} {b} · {n} frame · ScoreToss","share.game_p":"{a} {sa} – {sb} {b} · {n} frames · ScoreToss",
  "share.bracket":"Share the bracket",
  "share.copied":"Copied to the clipboard",
  "color.rouge":"Red","color.ambre":"Amber","color.or":"Gold","color.vert":"Green",
  "color.sarcelle":"Teal","color.bleu":"Blue","color.violet":"Purple",
  "color.rose":"Pink","color.ardoise":"Slate"
},
es:{
  "app.tagline":"Marcador de puntos",
  "cat.eyebrow":"Elige una categoría", "cat.back":"Categorías", "cat.soon":"Próximamente",
  "cat.exterieur":"Exterior", "cat.interieur":"Interior", "cat.societe":"Juegos de mesa",
  "cat.count":"{n} juego", "cat.count_p":"{n} juegos",
  "games.soon":"En preparación", "games.soon.sub":"Petanca…",
  "games.change":"Cambiar de juego",
  "app.desc":"Marcador de puntos para juegos de exterior, de interior y de mesa. Cornhole, petanca, palet bretón, mölkky, bibock, dardos, tossit y yams, individual, por parejas o por equipos, torneos de eliminación directa e historial de enfrentamientos.",
  "nav.home":"Inicio", "nav.close":"Cerrar",
  "mode.single":"Individual", "mode.single.sub":"1 v 1",
  "mode.double":"Parejas", "mode.double.sub":"2 v 2",
  "setup.target":"Puntos para ganar",
  "setup.start":"Empezar la partida",
  "setup.rules.eyebrow":"Cómo se juega",
  "setup.rules.label":"Cómo se anotan los puntos",
  "setup.about.eyebrow":"Acerca de", "setup.about.label":"Ajustes, copia de seguridad e idioma",
  "team.a":"Equipo A", "team.b":"Equipo B",
  "player.a":"Jugador A", "player.b":"Jugador B",
  "team.name.aria":"Nombre del equipo", "player.name.aria":"Nombre del jugador",
  "team.player":"Jugador",
  "color.aria":"Color",
  "game.frame":"Ronda", "game.target":"Se juega a",
  "game.first":"Lanza primero",
  "game.validate":"Confirmar",
  "game.scores":"{name} anota {n} punto", "game.scores_p":"{name} anota {n} puntos",
  "toss.draw":"Sorteo",
  "toss.who":"Quién lanza primero",
  "toss.running":"Sorteando",
  "toss.result":"{name} lanza primero",
  "order.draw":"Sortear orden", "order.who":"Orden de juego", "order.first":"Empieza {name}", "order.ok":"¡A jugar!",
  "sheet.title":"Hoja de puntuación",
  "sheet.frame":"Ronda",
  "sheet.empty":"Todavía no se ha jugado ninguna ronda.",
  "sheet.hint":"Toca una ronda para corregir su recuento. La puntuación se recalcula en toda la partida.",
  "sheet.undo":"Deshacer la última ronda",
  "sheet.quit":"Terminar la partida",
  "sheet.quit.tour":"Abandonar el partido",
  "sheet.fix.aria":"Corregir la ronda {n}",
  "edit.title":"Corrección · ronda {n}",
  "edit.cancel":"Cancelar",
  "edit.save":"Guardar la corrección",
  "edit.delete":"Eliminar esta ronda",
  "over.done":"Partida terminada en {n} ronda","over.done_p":"Partida terminada en {n} rondas",
  "over.wins":"Gana {name}",
  "over.nframes":"{n} ronda","over.nframes_p":"{n} rondas",
  "over.best":"Mejor ronda",
  "over.points":"Puntos",
  "over.won":"Rondas ganadas",
  "over.prog":"Progresión",
  "over.stats":"Estadísticas",
  "over.goal":"Objetivo {n}",
  "over.chart.aria":"Progresión de puntos: {a} {sa}, {b} {sb}, en {n} ronda","over.chart.aria_p":"Progresión de puntos: {a} {sa}, {b} {sb}, en {n} rondas",
  "over.rematch":"Revancha",
  "over.newsetup":"Nueva configuración",
  "over.next":"Siguiente partido",
  "over.nextline":"A continuación: {a} contra {b}.",
  "over.champion":"Ver el ganador del torneo",
  "over.bracket":"Volver al cuadro",
  "tour.title":"Torneo",
  "tour.eyebrow":"Eliminación directa",
  "tour.teams":"Equipos inscritos",
  "tour.target":"Puntos para ganar — todos los partidos",
  "tour.create":"Crear el cuadro",
  "tour.add":"Añadir un equipo", "tour.remove":"Quitar un equipo",
  "tour.bracketof":"Cuadro de {n}",
  "tour.byes.none":"sin exentos",
  "tour.byes":"{n} equipo exento de la primera ronda", "tour.byes_p":"{n} equipos exentos de la primera ronda",
  "tour.teamn":"Equipo {n}",
  "tour.team.aria":"Nombre del equipo {n}",
  "tour.color.aria":"Color del equipo {n}",
  "tour.menu":"Opciones del torneo",
  "tour.state":"Estado del cuadro",
  "tour.summary":"{t} equipos · {m} partido jugado · {s}", "tour.summary_p":"{t} equipos · {m} partidos jugados · {s}",
  "tour.warn":"Abandonar borra el cuadro y sus resultados. Las partidas ya jugadas se conservan en el historial.",
  "tour.restart":"Empezar un cuadro nuevo",
  "tour.abandon":"Abandonar el torneo",
  "tour.abandon.confirm":"Confirmar el abandono",
  "tour.head":"{t} equipos · {m} partido", "tour.head_p":"{t} equipos · {m} partidos",
  "tour.next":"Siguiente partido · {r}",
  "tour.play":"Jugar",
  "tour.winner":"Ganador del torneo",
  "tour.new":"Nuevo",
  "tour.waiting":"Cuadro en espera.",
  "tour.tbd":"Por definir",
  "tour.bye":"Exento",
  "tour.done":"terminado", "tour.pending":"en espera",
  "tour.live":"Torneo en curso", "tour.over":"Torneo terminado",
  "round.final":"Final", "round.semi":"Semifinales",
  "round.quarter":"Cuartos de final", "round.16":"Octavos", "round.n":"Ronda {n}",
  "hall.title":"Historial", "hall.aria":"Historial",
  "hall.count":"{n} partida guardada", "hall.count_p":"{n} partidas guardadas",
  "hall.tie":"Empate",
  "pl.count":"{n} jugador","pl.count_p":"{n} jugadores",
  "pl.empty":"Aquí no hay nadie todavía. Añade a quienes juegan contigo: su nombre se propondrá en todos los juegos.",
  "pl.empty.pick":"No hay jugadores. Escribe un nombre y añádelo desde aquí.",
  "pl.none":"Ningún jugador con ese nombre.",
  "pl.hint":"Estos nombres se proponen en todos los juegos. Un invitado siempre se puede escribir a mano.",
  "pl.new":"Nuevo jugador", "pl.new.ph":"Nombre o apodo", "pl.add":"Añadir",
  "pl.pick":"Elegir un jugador", "pl.search":"Buscar",
  "pl.addname":"Añadir «{name}» a tus jugadores", "pl.clear":"Vaciar el campo",
  "pl.name.aria":"Nombre del jugador",
  "pl.nogame":"Ninguna partida registrada para este jugador. Elige su nombre al empezar una partida y contará aquí.",
  "data.wipe.title":"Empezar de cero", "data.wipe":"Borrar todas las clasificaciones",
  "data.wipe.confirm":"Confirmar el borrado", "data.wipe.done":"Clasificaciones borradas",
  "data.wipe.hint":"Borra de una vez las partidas registradas de los ocho juegos. Tus jugadores, la partida en curso y los torneos no se tocan.",
  "about.what":"Ocho juegos para contar puntos, en tres categorías: fuera cornhole, petanca, palet bretón, mölkky y bibock; dentro dardos y tossit; en la mesa yams.",
  "about.what2":"Cada juego tiene sus reglas, su anotación y su clasificación; los de dos bandos además tienen torneos. Tus jugadores valen para todos. Nada sale del teléfono y todo funciona sin conexión.",
  "pl.vs":"contra",
  "pal.tab.rank":"Clasificación",
  "pal.tab.hist":"Historial",
  "pal.tab.people":"Jugadores",
  "pal.filter":"Filtrar por juego",
  "pal.all":"Todos los juegos",
  "pal.none":"Todavía no hay partidas. Aparecerán aquí al terminar cada partida.",
  "pal.none.game":"Todavía no hay partidas de este juego.",
  "pal.rank":"Clasificación",
  "pal.rank.rest":"El resto de la clasificación",
  "pal.rank.note":"Clasificados por victorias, todos los juegos juntos. En equipo, la victoria cuenta para cada miembro; un nombre escrito a mano aparece como invitado. Las partidas en solitario no cuentan.",
  "pal.rank.note.game":"Clasificados por victorias en este juego. En equipo, la victoria cuenta para cada miembro; un nombre escrito a mano aparece como invitado. Las partidas en solitario no cuentan.",
  "pal.wins":"{n} victoria",
  "pal.wins_p":"{n} victorias",
  "pal.games":"{n} partida",
  "pal.games_p":"{n} partidas",
  "pal.wins.of":"{v} en {n}",
  "pal.won":"ganadas",
  "pal.pct":"{n} %",
  "pal.guest":"invitado",
  "pal.today":"Hoy",
  "pal.yesterday":"Ayer",
  "pal.tour":"torneo",
  "pal.beat":"{w} gana a {l}",
  "pal.beat_p":"{w} ganan a {l}",
  "pal.ahead":"{w} gana por delante de {n} rivales",
  "pal.ahead_p":"{w} ganan por delante de {n} rivales",
  "pal.won1":"Ganada",
  "pal.lost1":"Perdida",
  "pal.with":"con",
  "pal.clear":"Borrar las partidas de este juego",
  "pal.clear.ok":"Confirmar: borrar {n} partida",
  "pal.clear.ok_p":"Confirmar: borrar {n} partidas",
  "pal.tourmatch":"Partido de torneo",
  "pal.parts":"{n} participante",
  "pal.parts_p":"{n} participantes",
  "pal.each":"victoria para cada uno",
  "pal.card":"Ficha de jugador",
  "pal.card.rank":"{r} de la clasificación general, entre {n} jugadores",
  "pal.card.none":"Aún sin clasificar: ninguna partida jugada.",
  "pal.fig.games":"partida jugada", "pal.fig.games_p":"partidas jugadas",
  "pal.fig.wins":"victoria", "pal.fig.wins_p":"victorias",
  "pal.fig.rate":"de victorias",
  "pal.form":"Forma reciente",
  "pal.form.v":"V",
  "pal.form.d":"D",
  "pal.form.hint":"Últimas partidas, la más reciente a la derecha",
  "pal.streak":"{n} victorias seguidas",
  "pal.hisgames":"Sus juegos",
  "pal.h2h":"Cara a cara",
  "pal.h2h.note":"Sus victorias a la izquierda, las del rival a la derecha.",
  "pal.recent":"Sus últimas partidas",
  "pal.edit":"Editar",
  "pal.del":"Quitar de tus jugadores",
  "pal.del.ok":"Confirmar",
  "pal.del.note":"Sus partidas siguen en el historial, con el nombre que tenían.",
  "pal.nogames":"ninguna partida",
  "pal.ord.1":"1.º",
  "pal.ord.2":"2.º",
  "pal.ord.3":"3.º",
  "pal.ord.n":"{n}.º",
  "pal.solo":"En solitario",
  "pal.solo.h":"{w} en solitario",
  "hf.title":"Logros",
  "hf.count":"{n} de {t}",
  "hf.got":"Conseguido el {d}",
  "hf.gotshort":"conseguido",
  "hf.notyet":"Aún no conseguido",
  "hf.times":"{n} vez",
  "hf.times_p":"{n} veces",
  "hf.premiere":"Primera victoria",
  "hf.premiere.d":"Ganar una partida contra otros.",
  "hf.fanny":"La Fanny",
  "hf.fanny.d":"Ganar 13 a 0 a la petanca.",
  "hf.blanc":"Blanqueo",
  "hf.blanc.d":"Ganar sin que el rival marque un solo punto, en cualquier juego salvo la petanca.",
  "hf.fil":"Por los pelos",
  "hf.fil.d":"Ganar por un solo punto.",
  "hf.serie3":"En racha",
  "hf.serie3.d":"Ganar tres partidas seguidas.",
  "hf.serie5":"Intocable",
  "hf.serie5.d":"Ganar cinco partidas seguidas.",
  "hf.equipe":"Espíritu de equipo",
  "hf.equipe.d":"Ganar cinco partidas en equipo.",
  "hf.touche":"Polivalente",
  "hf.touche.d":"Ganar en tres juegos distintos.",
  "hf.terrains":"Todoterreno",
  "hf.terrains.d":"Ganar en exterior, en interior y en la mesa.",
  "hf.yams300":"El club de los 300",
  "hf.yams300.d":"Marcar 300 puntos o más al yams.",
  "hf.fidele":"Habitual",
  "hf.fidele.d":"Jugar veinticinco partidas.",
  "hf.nemesis":"Bestia negra",
  "hf.nemesis.d":"Ganar tres veces al mismo rival sin perder nunca contra él.",
  "hf.nemesis.de":"Bestia negra de {nom}",
  "rules.title":"Cómo se juega",
  "about.title":"Acerca de",
  "about.version":"Versión {v}",
  "about.lang":"Idioma", "about.lang.auto":"Teléfono",
  "about.support":"Apoyar", "about.support.label":"Invita un café al desarrollador",
  "about.privacy":"Privacidad", "about.privacy.label":"Qué hace la aplicación con tus datos",
  "about.source":"Código fuente", "about.source.label":"El proyecto en GitHub",
  "about.foot":"Ningún dato sale de tu teléfono. Las partidas, los torneos y el historial se guardan localmente, nunca se transmiten, y desaparecen si desinstalas la aplicación.",
  "sheet.quit.confirm":"Confirmar el final",
  "over.void":"Rondas nulas",
  "about.theme":"Tema",
  "about.theme.auto":"Teléfono",
  "about.theme.light":"Claro",
  "about.theme.dark":"Oscuro",
  "data.title":"Tus datos",
  "data.export":"Exportar una copia de seguridad",
  "data.import":"Restaurar una copia de seguridad",
  "data.hint":"La copia contiene el historial, el torneo en curso y la partida en curso. Guárdala antes de cambiar de teléfono.",
  "data.done":"Copia guardada",
  "data.imported":"Copia restaurada",
  "data.bad":"Archivo ilegible",
  "data.confirm":"¿Reemplazar los datos actuales?",
  "share.result":"Compartir el resultado",
  "share.game":"{a} {sa} – {sb} {b} · {n} ronda · ScoreToss","share.game_p":"{a} {sa} – {sb} {b} · {n} rondas · ScoreToss",
  "share.bracket":"Compartir el cuadro",
  "share.copied":"Copiado al portapapeles",
  "color.rouge":"Rojo","color.ambre":"Ámbar","color.or":"Oro","color.vert":"Verde",
  "color.sarcelle":"Turquesa","color.bleu":"Azul","color.violet":"Morado",
  "color.rose":"Rosa","color.ardoise":"Pizarra"
}
};

/* Chaque jeu ajoute ses propres textes : ils rejoignent le dictionnaire
   commun, qui ne garde que ceux que partagent plusieurs jeux ou l'accueil. */
function ajouterTextes(textes){
  for(var l in textes){
    if(!TXT[l]) TXT[l]={};
    for(var k in textes[l]) TXT[l][k]=textes[l][k];
  }
}
@@jeux:textes.js@@

/* Le theme suit l'appareil par defaut ; un choix explicite le fige via
   l'attribut `data-theme`, que la feuille de style traite deja. */
var THEME_KEY = "cornhole.theme";
var THEME = null;

function detectTheme(){
  var v=null;
  try{ v=localStorage.getItem(THEME_KEY); }catch(e){}
  return (v==="light" || v==="dark") ? v : null;
}

/* La couleur de barre systeme est declaree par deux balises `media` qui
   suivent l'appareil. Un choix explicite doit passer devant : on insere
   une balise sans `media` en tete, la premiere qui correspond gagnant. */
function paintThemeColor(){
  var m=document.getElementById("tcFixed");
  if(m && m.parentNode) m.parentNode.removeChild(m);
  if(!THEME) return;
  m=document.createElement("meta");
  m.id="tcFixed";
  m.setAttribute("name","theme-color");
  m.setAttribute("content", THEME==="dark" ? "#0D1012" : "#EFF2F2");
  document.head.insertBefore(m, document.head.firstChild);
}

function applyTheme(){
  if(THEME) document.documentElement.setAttribute("data-theme", THEME);
  else document.documentElement.removeAttribute("data-theme");
  paintThemeColor();
}

/* Chromium ne réévalue pas `color-mix()` sur les éléments déjà construits
   quand une propriété personnalisée change : un élément créé après la
   bascule prend la bonne valeur, ses voisins gardent l'ancienne — et
   trente-cinq règles en dépendent, couleurs d'équipe comprises. Masquer
   puis réafficher la racine force un restyle complet. Tout tient dans la
   même tâche, le navigateur ne peignant qu'à la fin : aucune image
   intermédiaire, donc aucun clignotement. */
function forceRestyle(){
  var h=document.documentElement, d=h.style.display;
  h.style.display="none";
  void h.offsetHeight;
  h.style.display=d;
}

function setTheme(v){
  THEME = (v==="light" || v==="dark") ? v : null;
  try{
    if(THEME) localStorage.setItem(THEME_KEY, THEME);
    else localStorage.removeItem(THEME_KEY);
  }catch(e){}
  applyTheme();
  forceRestyle();
  buzz(6);
  fillAbout();          /* repeindre la position retenue du sélecteur */
}

var LANG = "fr";
var DATE_LOCALE = {fr:"fr-FR", en:"en-GB", es:"es-ES"};
function t(k){
  var d=TXT[LANG]||TXT.fr;
  /* un jeu peut renommer une clé commune pour lui seul : voir le registre */
  if(S){
    var p=k+"@"+curGame();
    if(d[p]!==undefined) return d[p];
  }
  return d[k]!==undefined ? d[k] : (TXT.fr[k]!==undefined ? TXT.fr[k] : k);
}
/* Pluriel simple : suffixe _p au-delà de un, suffisant pour le français
   comme pour l'anglais sur les tournures employées ici. */
function tn(k,n){ return t(n>1 ? k+"_p" : k).replace(/\{n\}/g,n); }
/* Pour un jeu donné plutôt que pour le jeu courant : l'historique mêle
   tous les jeux, et une partie de pétanque se compte toujours en mènes. */
function tPour(id,k){
  var d=TXT[LANG]||TXT.fr, p=k+"@"+id;
  if(d[p]!==undefined) return d[p];
  if(d[k]!==undefined) return d[k];
  return TXT.fr[k]!==undefined ? TXT.fr[k] : k;
}
function tnPour(id,k,n){ return tPour(id, n>1 ? k+"_p" : k).replace(/\{n\}/g,n); }
function tf(k,vals){
  var s=t(k);
  for(var p in vals) s=s.replace(new RegExp("\\{"+p+"\\}","g"), vals[p]);
  return s;
}

function applyStaticText(){
  var n,i;
  n=document.querySelectorAll("[data-i18n]");
  for(i=0;i<n.length;i++) n[i].textContent=t(n[i].getAttribute("data-i18n"));
  n=document.querySelectorAll("[data-i18n-ph]");
  for(i=0;i<n.length;i++) n[i].placeholder=t(n[i].getAttribute("data-i18n-ph"));
  n=document.querySelectorAll("[data-i18n-aria]");
  for(i=0;i<n.length;i++){
    var s=t(n[i].getAttribute("data-i18n-aria"));
    n[i].setAttribute("aria-label",s);
    n[i].title=s;
  }
  document.title = "ScoreToss — "+t("app.tagline");
}

/* l vaut "fr", "en", ou null pour revenir au suivi du téléphone. */
function setLang(l){
  try{
    if(l===null) localStorage.removeItem(LANG_KEY);
    else localStorage.setItem(LANG_KEY, l);
  }catch(e){}
  LANG = (l===null) ? detectLang() : l;
  document.documentElement.lang=LANG;
  applyStaticText();
  renderCategories();
  if($("s-cat").classList.contains("on")) peindreCategorie();
  renderCards(); renderRules(); renderTSetup();
  pourChaqueJeu("changementDeLangue");
  fillRules("rulesBody");
  refreshTourBtn(); refreshHallLink();
  if(G) renderGame(true);
  if(T && $("s-bracket").classList.contains("on")) renderBracket();
  if($("s-hall").classList.contains("on")) renderPalmares();
  if($("s-fiche").classList.contains("on")) renderFiche();
  if($("s-over").classList.contains("on") && G && G.over) renderOver();
  if($("aboutWrap").classList.contains("on")) fillAbout();
}

/* Un choix explicite l'emporte toujours. Sinon on suit le téléphone, en
   parcourant toute sa liste de langues et non la seule première : un
   appareil réglé en allemand puis français doit donner du français.
   Repli en anglais, la langue la plus probable hors de nos deux cas. */
function detectLang(){
  var saved=null;
  try{ saved=localStorage.getItem(LANG_KEY); }catch(e){}
  if(saved==="fr"||saved==="en"||saved==="es") return saved;

  var list=(navigator.languages && navigator.languages.length)
             ? navigator.languages
             : [navigator.language || navigator.userLanguage || ""];
  for(var i=0;i<list.length;i++){
    var l=String(list[i]).toLowerCase();
    if(l.indexOf("fr")===0) return "fr";
    if(l.indexOf("es")===0) return "es";
    if(l.indexOf("en")===0) return "en";
  }
  return "en";
}

function color(id){
  for(var i=0;i<COLORS.length;i++){ if(COLORS[i].id===id) return COLORS[i]; }
  return COLORS[0];
}

/* Fiche des règles, ouverte par-dessus l'écran courant depuis l'accueil
   comme depuis la préparation d'un tournoi. Elle suit le jeu en cours :
   chaque jeu fournit la sienne. */
function fillRules(id){
  var host=$(id);
  if(!host) return;
  host.innerHTML="";
  jeu(curGame()).regles(host);
}
/* Une fiche de règles se bâtit de deux sortes de blocs : un barème — le
   chiffre en gras, ce qu'il récompense à côté — et un déroulé, des phrases
   dont le cœur est en gras, rangées sous les clés prefixe.1a, 1b, 1c… */
function blocBareme(host, titre, lignes){
  var b=el("div","block");
  b.appendChild(el("p","eyebrow",titre));
  var pts=el("div","pts");
  lignes.forEach(function(r){
    var row=el("div","pt-row");
    row.appendChild(el("b",null,r[0]));
    row.appendChild(el("span",null,r[1]));
    pts.appendChild(row);
  });
  b.appendChild(pts);
  host.appendChild(b);
}
function blocDeroule(host, prefixe, n){
  var b=el("div","block");
  b.appendChild(el("p","eyebrow",t(prefixe+".flow")));
  var list=el("ul","rulist");
  for(var k=1;k<=n;k++){
    var li=document.createElement("li");
    li.appendChild(document.createTextNode(t(prefixe+"."+k+"a")));
    li.appendChild(el("b",null,t(prefixe+"."+k+"b")));
    li.appendChild(document.createTextNode(t(prefixe+"."+k+"c")));
    list.appendChild(li);
  }
  b.appendChild(list);
  host.appendChild(b);
}

/* état de préparation */
var S = {
  game:jeuxDuel()[0], mode:"simple", target:21, palets:4,
  /* un score par jeu : jouer une belle au palet ne doit pas ramener
     le cornhole a 15 au retour */
  tgt:ciblesParDefaut(),
  teams:[
    {name:"", mates:["",""], color:"rouge"},
    {name:"", mates:["",""], color:"bleu"}
  ]
};

/* état de partie */
var G = null;

