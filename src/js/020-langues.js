/* ==================================================================
   Langues — « manche » se dit frame au cornhole, à ne pas confondre
   avec les tours d'un tournoi (rounds).
================================================================== */
var TXT = {
fr:{
  "app.tagline":"Compteur de points",
  "games.eyebrow":"Choisir un jeu",
  "games.cornhole.sub":"Simple, double et tournois",
  "games.soon":"En chantier", "games.soon.sub":"Pétanque, palet vendéen…",
  "games.change":"Changer de jeu",
  "app.desc":"Compteur de points pour les jeux d'extérieur. Cornhole et palet breton, en simple ou en double, tournois à élimination directe et palmarès entre joueurs.",
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
  "game.bags":"{n} sacs par équipe",
  "game.hole":"Trou", "game.hole.pts":"3 pts",
  "game.board":"Planche", "game.board.pts":"1 pt",
  "game.first":"Lance en premier",
  "game.validate":"Valider",
  "game.none":"Aucun sac compté",
  "game.tie":"Manche nulle — 0 point",
  "game.scores":"{name} marque {n} point", "game.scores_p":"{name} marque {n} points",
  "game.add.hole":"Ajouter un sac dans le trou", "game.rm.hole":"Retirer un sac dans le trou",
  "game.add.board":"Ajouter un sac sur la planche", "game.rm.board":"Retirer un sac sur la planche",
  "toss.draw":"Tirer au sort",
  "toss.who":"Qui lance en premier",
  "toss.running":"Tirage en cours",
  "toss.result":"{name} lance en premier",
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
  "over.done":"Partie terminée en {n} manches",
  "over.wins":"{name} l'emporte",
  "over.frames":"Manches",
  "over.holes":"Sacs dans le trou",
  "over.board":"Sacs sur la planche",
  "over.best":"Meilleure manche",
  "over.points":"Points",
  "over.won":"Manches gagnées",
  "over.prog":"Progression",
  "over.stats":"Statistiques",
  "over.goal":"Objectif {n}",
  "over.chart.aria":"Progression des points : {a} {sa}, {b} {sb}, en {n} manches",
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
  "hall.empty":"Aucune partie enregistrée pour l'instant.",
  "hall.duels":"Confrontations",
  "hall.standings":"Classement",
  "hall.recent":"Dernières parties",
  "hall.team":"Nom", "hall.w":"V", "hall.l":"D", "hall.rate":"Ratio",
  "hall.beat":"{w} bat {l}",
  "hall.tag.solo":"1v1", "hall.tag.duo":"2v2",
  "hall.clear":"Effacer le palmarès",
  "hall.clear.confirm":"Confirmer l'effacement",
  "rules.title":"Règles du jeu",
  "rules.count":"Comptage",
  "rules.hole":"Sac dans le trou", "rules.board":"Sac sur la planche",
  "rules.flow":"Déroulé d'une manche",
  "rules.1a":"Chaque équipe lance ", "rules.1b":"4 sacs", "rules.1c":" par manche — en double, 2 sacs par joueur.",
  "rules.2a":"Seule la ", "rules.2b":"différence", "rules.2c":" est marquée : 5 points contre 3 rapportent 2 points, l'autre équipe n'en marque aucun.",
  "rules.3a":"L'équipe qui a marqué ", "rules.3b":"lance en premier", "rules.3c":" à la manche suivante. La toute première est tirée au sort.",
  "rules.4a":"La partie s'arrête dès qu'une équipe ", "rules.4b":"atteint le score visé", "rules.4c":".",
  "about.title":"À propos",
  "about.version":"Version {v}",
  "about.lang":"Langue", "about.lang.auto":"Téléphone",
  "about.support":"Soutenir", "about.support.label":"Offrir un café au développeur",
  "about.privacy":"Confidentialité", "about.privacy.label":"Ce que l'application fait de vos données",
  "about.source":"Code source", "about.source.label":"Le projet sur GitHub",
  "about.foot":"Aucune donnée ne quitte votre téléphone. Les parties, les tournois et le palmarès sont enregistrés localement, ne sont jamais transmis, et disparaissent si vous désinstallez l'application.",
  "sheet.quit.confirm":"Confirmer l'arrêt",
  "games.palet.sub":"Sur planche, simple et double",
  "palet.name":"Palet breton",
  "setup.palets":"Palets par joueur",
  "game.palets":"{n} palets par équipe",
  "game.perpalet":"1 pt par palet",
  "game.void":"Manche nulle",
  "game.add.pt":"Ajouter un point",
  "game.rm.pt":"Retirer un point",
  "prules.title":"Le palet breton",
  "prules.count":"Comptage",
  "prules.pt":"par palet mieux placé que le meilleur adverse",
  "prules.flow":"Déroulé",
  "prules.1a":"L'équipe qui a marqué pose le ","prules.1b":"maître","prules.1c":" sur la planche et lance en premier.",
  "prules.2a":"Elle a ","prules.2b":"trois essais","prules.2c":" pour l'y placer ; sans succès, l'adversaire tente à son tour, trois essais aussi.",
  "prules.3a":"L'équipe qui n'a pas le point relance ","prules.3b":"jusqu'à le reprendre","prules.3c":" ou épuiser ses palets.",
  "prules.4a":"Seule l'équipe la plus proche marque : ","prules.4b":"1 point par palet","prules.4c":" mieux placé que le meilleur adverse.",
  "prules.5a":"Un palet tombé de la planche ","prules.5b":"ne compte pas","prules.5c":".",
  "prules.6a":"Si le maître quitte la planche, la manche est ","prules.6b":"nulle","prules.6c":" et se rejoue.",
  "over.void":"Manches nulles",
  "over.avg":"Moyenne par manche",
  "setup.palet.hint":"La partie se joue en 12 points, la belle en 15.",
  "game.master":"Maître",
  "game.missed":"Manqué",
  "game.missed.aria":"Maître manqué en trois essais : passer le lancer à {name}",
  "about.theme":"Thème",
  "about.theme.auto":"Téléphone",
  "about.theme.light":"Clair",
  "about.theme.dark":"Sombre",
  "molkky.name":"Mölkky",
  "games.molkky.sub":"À plusieurs, quilles numérotées",
  "mk.players":"Joueurs",
  "mk.playern":"Joueur {n}",
  "mk.player.aria":"Nom du joueur {n}",
  "mk.color.aria":"Couleur du joueur {n}",
  "mk.note":"{n} joueurs · premier à 50 exactement",
  "mk.turn":"À {name}",
  "mk.miss":"Raté",
  "mk.throw.aria":"{name} marque {n} points",
  "mk.miss.aria":"{name} manque son lancer",
  "mk.out":"Éliminé",
  "mk.misses":"{n} ratés de suite",
  "mk.back25":"Dépassement — retour à 25",
  "mk.layout":"Placement des quilles",
  "mk.layout.open":"Voir le placement des quilles",
  "mk.layout.hint":"Formation de départ, à 3,50 m de la zone de lancer. Une quille renversée se relève là où elle est tombée, numéro vers les lanceurs — c'est ainsi qu'elles se dispersent.",
  "mk.thrower":"Zone de lancer",
  "mk.undo":"Annuler le dernier lancer",
  "mk.sheet.empty":"Aucun lancer pour l'instant.",
  "mk.sheet.hint":"Touchez un lancer pour le corriger. La partie est recalculée depuis le début.",
  "mk.fix.aria":"Corriger le lancer {n}",
  "mk.edit.title":"Correction · lancer {n}",
  "mk.done":"Partie terminée en {n} lancers",
  "mk.left":"Reste {n}",
  "mk.rank":"Classement final",
  "mrules.title":"Le mölkky",
  "mrules.count":"Comptage",
  "mrules.one":"une seule quille renversée : son numéro, de 1 à 12",
  "mrules.many":"plusieurs quilles renversées : leur nombre",
  "mrules.flow":"Déroulé",
  "mrules.1a":"Le premier à ","mrules.1b":"50 points exactement","mrules.1c":" l'emporte.",
  "mrules.2a":"Dépasser 50 ramène le score à ","mrules.2b":"25","mrules.2c":".",
  "mrules.3a":"","mrules.3b":"Trois lancers manqués","mrules.3c":" de suite éliminent le joueur.",
  "mrules.4a":"Une quille renversée se relève ","mrules.4b":"là où elle est tombée","mrules.4c":", sans être déplacée.",
  "mrules.5a":"On lance à ","mrules.5b":"3,50 m","mrules.5c":", chacun son tour.",
  "mk.pins.one":"1 quille",
  "mk.pins.one.v":"son n°",
  "mk.pins.many.v":"leur nombre",
  "mk.mode.solo":"Individuel",
  "mk.mode.solo.sub":"Chacun pour soi",
  "mk.mode.team":"Équipes",
  "mk.mode.team.sub":"Score commun",
  "mk.per":"Joueurs par équipe",
  "mk.teams":"Équipes",
  "mk.teamn":"Équipe {n}",
  "mk.team.aria":"Nom de l'équipe {n}",
  "mk.mate.aria":"Joueur {j} de l'équipe {n}",
  "mk.note.team":"{n} équipes · premier à 50 exactement",
  "mk.turn.team":"À {team} · {name}",
  "data.title":"Vos données",
  "data.export":"Exporter une sauvegarde",
  "data.import":"Restaurer une sauvegarde",
  "data.hint":"La sauvegarde contient le palmarès, le tournoi en cours et la partie en cours. Gardez-la avant de changer de téléphone.",
  "data.done":"Sauvegarde enregistrée",
  "data.imported":"Sauvegarde restaurée",
  "data.bad":"Fichier illisible",
  "data.confirm":"Remplacer les données actuelles ?",
  "share.result":"Partager le résultat",
  "share.game":"{a} {sa} – {sb} {b} · {n} manches · ScoreToss",
  "share.bracket":"Partager le tableau",
  "share.copied":"Copié dans le presse-papiers",
  "color.rouge":"Rouge","color.ambre":"Ambre","color.or":"Or","color.vert":"Vert",
  "color.sarcelle":"Sarcelle","color.bleu":"Bleu","color.violet":"Violet",
  "color.rose":"Rose","color.ardoise":"Ardoise"
},
en:{
  "app.tagline":"Score keeper",
  "games.eyebrow":"Pick a game",
  "games.cornhole.sub":"Singles, doubles and tournaments",
  "games.soon":"In the works", "games.soon.sub":"Pétanque, Vendée palet…",
  "games.change":"Change game",
  "app.desc":"A score keeper for outdoor games. Cornhole and Breton palet, singles or doubles, single-elimination tournaments, and a record of who beats whom.",
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
  "game.bags":"{n} bags per team",
  "game.hole":"Hole", "game.hole.pts":"3 pts",
  "game.board":"Board", "game.board.pts":"1 pt",
  "game.first":"Throws first",
  "game.validate":"Confirm",
  "game.none":"No bags counted",
  "game.tie":"Tied frame — no points",
  "game.scores":"{name} scores {n} point", "game.scores_p":"{name} scores {n} points",
  "game.add.hole":"Add a bag in the hole", "game.rm.hole":"Remove a bag in the hole",
  "game.add.board":"Add a bag on the board", "game.rm.board":"Remove a bag on the board",
  "toss.draw":"Coin toss",
  "toss.who":"Who throws first",
  "toss.running":"Tossing",
  "toss.result":"{name} throws first",
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
  "over.done":"Game finished in {n} frames",
  "over.wins":"{name} wins",
  "over.frames":"Frames",
  "over.holes":"Bags in the hole",
  "over.board":"Bags on the board",
  "over.best":"Best frame",
  "over.points":"Points",
  "over.won":"Frames won",
  "over.prog":"Progression",
  "over.stats":"Statistics",
  "over.goal":"Target {n}",
  "over.chart.aria":"Score progression: {a} {sa}, {b} {sb}, over {n} frames",
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
  "hall.empty":"No games recorded yet.",
  "hall.duels":"Head to head",
  "hall.standings":"Standings",
  "hall.recent":"Recent games",
  "hall.team":"Name", "hall.w":"W", "hall.l":"L", "hall.rate":"Win rate",
  "hall.beat":"{w} beat {l}",
  "hall.tag.solo":"1v1", "hall.tag.duo":"2v2",
  "hall.clear":"Clear the records",
  "hall.clear.confirm":"Confirm clearing",
  "rules.title":"How to play",
  "rules.count":"Scoring",
  "rules.hole":"Bag in the hole", "rules.board":"Bag on the board",
  "rules.flow":"How a frame goes",
  "rules.1a":"Each team throws ", "rules.1b":"4 bags", "rules.1c":" per frame — in doubles, 2 bags each.",
  "rules.2a":"Only the ", "rules.2b":"difference", "rules.2c":" counts: 5 points against 3 scores 2, and the other team scores nothing.",
  "rules.3a":"Whoever scored ", "rules.3b":"throws first", "rules.3c":" in the next frame. The very first is decided by a toss.",
  "rules.4a":"The game ends as soon as a team ", "rules.4b":"reaches the target score", "rules.4c":".",
  "about.title":"About",
  "about.version":"Version {v}",
  "about.lang":"Language", "about.lang.auto":"Phone",
  "about.support":"Support", "about.support.label":"Buy the developer a coffee",
  "about.privacy":"Privacy", "about.privacy.label":"What the app does with your data",
  "about.source":"Source code", "about.source.label":"The project on GitHub",
  "about.foot":"No data leaves your phone. Games, tournaments and records are stored locally, are never transmitted, and disappear if you uninstall the app.",
  "sheet.quit.confirm":"Confirm ending",
  "games.palet.sub":"On the board, singles and doubles",
  "palet.name":"Breton palet",
  "setup.palets":"Palets per player",
  "game.palets":"{n} palets per team",
  "game.perpalet":"1 pt per palet",
  "game.void":"Void frame",
  "game.add.pt":"Add a point",
  "game.rm.pt":"Remove a point",
  "prules.title":"Breton palet",
  "prules.count":"Scoring",
  "prules.pt":"per palet closer than the opponent's best",
  "prules.flow":"How it goes",
  "prules.1a":"The team that scored sets the ","prules.1b":"master","prules.1c":" on the board and throws first.",
  "prules.2a":"It gets ","prules.2b":"three attempts","prules.2c":" to land it; failing that, the opponent tries, also with three.",
  "prules.3a":"The team without the point keeps throwing ","prules.3b":"until it takes it back","prules.3c":" or runs out of palets.",
  "prules.4a":"Only the closest team scores: ","prules.4b":"1 point per palet","prules.4c":" closer than the opponent's best.",
  "prules.5a":"A palet that falls off the board ","prules.5b":"does not count","prules.5c":".",
  "prules.6a":"If the master leaves the board, the frame is ","prules.6b":"void","prules.6c":" and is replayed.",
  "over.void":"Void frames",
  "over.avg":"Average per frame",
  "setup.palet.hint":"A game is played to 12 points, the decider to 15.",
  "game.master":"Master",
  "game.missed":"Missed",
  "game.missed.aria":"Master missed in three attempts: pass the throw to {name}",
  "about.theme":"Theme",
  "about.theme.auto":"Phone",
  "about.theme.light":"Light",
  "about.theme.dark":"Dark",
  "molkky.name":"Mölkky",
  "games.molkky.sub":"Several players, numbered pins",
  "mk.players":"Players",
  "mk.playern":"Player {n}",
  "mk.player.aria":"Name of player {n}",
  "mk.color.aria":"Colour of player {n}",
  "mk.note":"{n} players · first to exactly 50",
  "mk.turn":"{name} to throw",
  "mk.miss":"Miss",
  "mk.throw.aria":"{name} scores {n} points",
  "mk.miss.aria":"{name} misses",
  "mk.out":"Out",
  "mk.misses":"{n} misses in a row",
  "mk.back25":"Overshot — back to 25",
  "mk.layout":"Pin layout",
  "mk.layout.open":"See the pin layout",
  "mk.layout.hint":"Starting formation, 3.50 m from the throwing line. A pin that falls is stood back up where it landed, number facing the throwers — which is how they spread out.",
  "mk.thrower":"Throwing line",
  "mk.undo":"Undo the last throw",
  "mk.sheet.empty":"No throws yet.",
  "mk.sheet.hint":"Tap a throw to correct it. The game is recalculated from the start.",
  "mk.fix.aria":"Correct throw {n}",
  "mk.edit.title":"Correction · throw {n}",
  "mk.done":"Game finished in {n} throws",
  "mk.left":"{n} to go",
  "mk.rank":"Final standings",
  "mrules.title":"Mölkky",
  "mrules.count":"Scoring",
  "mrules.one":"one pin down: its number, from 1 to 12",
  "mrules.many":"several pins down: how many",
  "mrules.flow":"How it goes",
  "mrules.1a":"First to ","mrules.1b":"exactly 50 points","mrules.1c":" wins.",
  "mrules.2a":"Going over 50 drops the score back to ","mrules.2b":"25","mrules.2c":".",
  "mrules.3a":"","mrules.3b":"Three missed throws","mrules.3c":" in a row put a player out.",
  "mrules.4a":"A fallen pin is stood back up ","mrules.4b":"where it landed","mrules.4c":", never moved.",
  "mrules.5a":"Throws are made from ","mrules.5b":"3.50 m","mrules.5c":", each in turn.",
  "mk.pins.one":"1 pin",
  "mk.pins.one.v":"its number",
  "mk.pins.many.v":"how many",
  "mk.mode.solo":"Individual",
  "mk.mode.solo.sub":"Each on their own",
  "mk.mode.team":"Teams",
  "mk.mode.team.sub":"Shared score",
  "mk.per":"Players per team",
  "mk.teams":"Teams",
  "mk.teamn":"Team {n}",
  "mk.team.aria":"Name of team {n}",
  "mk.mate.aria":"Player {j} of team {n}",
  "mk.note.team":"{n} teams · first to exactly 50",
  "mk.turn.team":"{team} · {name} to throw",
  "data.title":"Your data",
  "data.export":"Export a backup",
  "data.import":"Restore a backup",
  "data.hint":"The backup holds your records, the running tournament and the current game. Keep one before switching phones.",
  "data.done":"Backup saved",
  "data.imported":"Backup restored",
  "data.bad":"Unreadable file",
  "data.confirm":"Replace the current data?",
  "share.result":"Share the result",
  "share.game":"{a} {sa} – {sb} {b} · {n} frames · ScoreToss",
  "share.bracket":"Share the bracket",
  "share.copied":"Copied to the clipboard",
  "color.rouge":"Red","color.ambre":"Amber","color.or":"Gold","color.vert":"Green",
  "color.sarcelle":"Teal","color.bleu":"Blue","color.violet":"Purple",
  "color.rose":"Pink","color.ardoise":"Slate"
},
es:{
  "app.tagline":"Marcador",
  "games.eyebrow":"Elige un juego",
  "games.cornhole.sub":"Individual, parejas y torneos",
  "games.soon":"En preparación", "games.soon.sub":"Petanca, palet vendeano…",
  "games.change":"Cambiar de juego",
  "app.desc":"Marcador para juegos de exterior. Cornhole y palet bretón, individual o por parejas, torneos de eliminación directa e historial de enfrentamientos.",
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
  "game.bags":"{n} bolsas por equipo",
  "game.hole":"Hoyo", "game.hole.pts":"3 pts",
  "game.board":"Tabla", "game.board.pts":"1 pt",
  "game.first":"Lanza primero",
  "game.validate":"Confirmar",
  "game.none":"Ninguna bolsa contada",
  "game.tie":"Ronda empatada — sin puntos",
  "game.scores":"{name} anota {n} punto", "game.scores_p":"{name} anota {n} puntos",
  "game.add.hole":"Añadir una bolsa en el hoyo", "game.rm.hole":"Quitar una bolsa del hoyo",
  "game.add.board":"Añadir una bolsa en la tabla", "game.rm.board":"Quitar una bolsa de la tabla",
  "toss.draw":"Sorteo",
  "toss.who":"Quién lanza primero",
  "toss.running":"Sorteando",
  "toss.result":"{name} lanza primero",
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
  "over.done":"Partida terminada en {n} rondas",
  "over.wins":"Gana {name}",
  "over.frames":"Rondas",
  "over.holes":"Bolsas en el hoyo",
  "over.board":"Bolsas en la tabla",
  "over.best":"Mejor ronda",
  "over.points":"Puntos",
  "over.won":"Rondas ganadas",
  "over.prog":"Progresión",
  "over.stats":"Estadísticas",
  "over.goal":"Objetivo {n}",
  "over.chart.aria":"Progresión de puntos: {a} {sa}, {b} {sb}, en {n} rondas",
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
  "hall.empty":"Todavía no hay ninguna partida guardada.",
  "hall.duels":"Cara a cara",
  "hall.standings":"Clasificación",
  "hall.recent":"Últimas partidas",
  "hall.team":"Nombre", "hall.w":"V", "hall.l":"D", "hall.rate":"Ratio",
  "hall.beat":"{w} gana a {l}",
  "hall.tag.solo":"1v1", "hall.tag.duo":"2v2",
  "hall.clear":"Borrar el historial",
  "hall.clear.confirm":"Confirmar el borrado",
  "rules.title":"Cómo se juega",
  "rules.count":"Puntuación",
  "rules.hole":"Bolsa en el hoyo", "rules.board":"Bolsa en la tabla",
  "rules.flow":"Cómo transcurre una ronda",
  "rules.1a":"Cada equipo lanza ", "rules.1b":"4 bolsas", "rules.1c":" por ronda; en parejas, 2 bolsas cada uno.",
  "rules.2a":"Solo cuenta la ", "rules.2b":"diferencia", "rules.2c":": 5 puntos contra 3 anotan 2, y el otro equipo no anota nada.",
  "rules.3a":"Quien haya anotado ", "rules.3b":"lanza primero", "rules.3c":" en la ronda siguiente. La primera se decide por sorteo.",
  "rules.4a":"La partida termina en cuanto un equipo ", "rules.4b":"alcanza los puntos fijados", "rules.4c":".",
  "about.title":"Acerca de",
  "about.version":"Versión {v}",
  "about.lang":"Idioma", "about.lang.auto":"Teléfono",
  "about.support":"Apoyar", "about.support.label":"Invita un café al desarrollador",
  "about.privacy":"Privacidad", "about.privacy.label":"Qué hace la aplicación con tus datos",
  "about.source":"Código fuente", "about.source.label":"El proyecto en GitHub",
  "about.foot":"Ningún dato sale de tu teléfono. Las partidas, los torneos y el historial se guardan localmente, nunca se transmiten, y desaparecen si desinstalas la aplicación.",
  "sheet.quit.confirm":"Confirmar el final",
  "games.palet.sub":"Sobre tabla, individual y dobles",
  "palet.name":"Palet bretón",
  "setup.palets":"Paletes por jugador",
  "game.palets":"{n} paletes por equipo",
  "game.perpalet":"1 pt por palete",
  "game.void":"Ronda nula",
  "game.add.pt":"Añadir un punto",
  "game.rm.pt":"Quitar un punto",
  "prules.title":"El palet bretón",
  "prules.count":"Puntuación",
  "prules.pt":"por palete mejor colocado que el mejor rival",
  "prules.flow":"Desarrollo",
  "prules.1a":"El equipo que puntuó coloca el ","prules.1b":"maestro","prules.1c":" sobre la tabla y lanza primero.",
  "prules.2a":"Dispone de ","prules.2b":"tres intentos","prules.2c":" para colocarlo; si falla, lo intenta el rival, también con tres.",
  "prules.3a":"El equipo sin el punto vuelve a lanzar ","prules.3b":"hasta recuperarlo","prules.3c":" o agotar sus paletes.",
  "prules.4a":"Solo puntúa el equipo más cercano: ","prules.4b":"1 punto por palete","prules.4c":" mejor colocado que el mejor rival.",
  "prules.5a":"Un palete caído de la tabla ","prules.5b":"no cuenta","prules.5c":".",
  "prules.6a":"Si el maestro sale de la tabla, la ronda es ","prules.6b":"nula","prules.6c":" y se repite.",
  "over.void":"Rondas nulas",
  "over.avg":"Promedio por ronda",
  "setup.palet.hint":"La partida se juega a 12 puntos, la bella a 15.",
  "game.master":"Maestro",
  "game.missed":"Fallado",
  "game.missed.aria":"Maestro fallado en tres intentos: pasar el lanzamiento a {name}",
  "about.theme":"Tema",
  "about.theme.auto":"Teléfono",
  "about.theme.light":"Claro",
  "about.theme.dark":"Oscuro",
  "molkky.name":"Mölkky",
  "games.molkky.sub":"Varios jugadores, bolos numerados",
  "mk.players":"Jugadores",
  "mk.playern":"Jugador {n}",
  "mk.player.aria":"Nombre del jugador {n}",
  "mk.color.aria":"Color del jugador {n}",
  "mk.note":"{n} jugadores · el primero en 50 exactos",
  "mk.turn":"Turno de {name}",
  "mk.miss":"Fallo",
  "mk.throw.aria":"{name} anota {n} puntos",
  "mk.miss.aria":"{name} falla el lanzamiento",
  "mk.out":"Eliminado",
  "mk.misses":"{n} fallos seguidos",
  "mk.back25":"Se pasó — vuelta a 25",
  "mk.layout":"Colocación de los bolos",
  "mk.layout.open":"Ver la colocación de los bolos",
  "mk.layout.hint":"Formación inicial, a 3,50 m de la zona de lanzamiento. Un bolo derribado se levanta donde cayó, con el número hacia los lanzadores — así se van dispersando.",
  "mk.thrower":"Zona de lanzamiento",
  "mk.undo":"Deshacer el último lanzamiento",
  "mk.sheet.empty":"Todavía no hay lanzamientos.",
  "mk.sheet.hint":"Toca un lanzamiento para corregirlo. La partida se recalcula desde el principio.",
  "mk.fix.aria":"Corregir el lanzamiento {n}",
  "mk.edit.title":"Corrección · lanzamiento {n}",
  "mk.done":"Partida terminada en {n} lanzamientos",
  "mk.left":"Faltan {n}",
  "mk.rank":"Clasificación final",
  "mrules.title":"El mölkky",
  "mrules.count":"Puntuación",
  "mrules.one":"un solo bolo derribado: su número, del 1 al 12",
  "mrules.many":"varios bolos derribados: cuántos son",
  "mrules.flow":"Desarrollo",
  "mrules.1a":"Gana el primero en llegar a ","mrules.1b":"50 puntos exactos","mrules.1c":".",
  "mrules.2a":"Pasarse de 50 devuelve la puntuación a ","mrules.2b":"25","mrules.2c":".",
  "mrules.3a":"","mrules.3b":"Tres lanzamientos fallados","mrules.3c":" seguidos eliminan al jugador.",
  "mrules.4a":"Un bolo derribado se levanta ","mrules.4b":"donde cayó","mrules.4c":", sin moverlo.",
  "mrules.5a":"Se lanza desde ","mrules.5b":"3,50 m","mrules.5c":", por turnos.",
  "mk.pins.one":"1 bolo",
  "mk.pins.one.v":"su número",
  "mk.pins.many.v":"cuántos",
  "mk.mode.solo":"Individual",
  "mk.mode.solo.sub":"Cada uno por su cuenta",
  "mk.mode.team":"Equipos",
  "mk.mode.team.sub":"Puntuación común",
  "mk.per":"Jugadores por equipo",
  "mk.teams":"Equipos",
  "mk.teamn":"Equipo {n}",
  "mk.team.aria":"Nombre del equipo {n}",
  "mk.mate.aria":"Jugador {j} del equipo {n}",
  "mk.note.team":"{n} equipos · el primero en 50 exactos",
  "mk.turn.team":"Turno de {team} · {name}",
  "data.title":"Tus datos",
  "data.export":"Exportar una copia de seguridad",
  "data.import":"Restaurar una copia de seguridad",
  "data.hint":"La copia contiene el historial, el torneo en curso y la partida en curso. Guárdala antes de cambiar de teléfono.",
  "data.done":"Copia guardada",
  "data.imported":"Copia restaurada",
  "data.bad":"Archivo ilegible",
  "data.confirm":"¿Reemplazar los datos actuales?",
  "share.result":"Compartir el resultado",
  "share.game":"{a} {sa} – {sb} {b} · {n} rondas · ScoreToss",
  "share.bracket":"Compartir el cuadro",
  "share.copied":"Copiado al portapapeles",
  "color.rouge":"Rojo","color.ambre":"Ámbar","color.or":"Oro","color.vert":"Verde",
  "color.sarcelle":"Turquesa","color.bleu":"Azul","color.violet":"Morado",
  "color.rose":"Rosa","color.ardoise":"Pizarra"
}
};

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
  return d[k]!==undefined ? d[k] : (TXT.fr[k]!==undefined ? TXT.fr[k] : k);
}
/* Pluriel simple : suffixe _p au-delà de un, suffisant pour le français
   comme pour l'anglais sur les tournures employées ici. */
function tn(k,n){ return t(n>1 ? k+"_p" : k).replace(/\{n\}/g,n); }
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
  renderCards(); renderRules(); renderTSetup(); renderMSetup();
  fillRules("rulesBody");
  if(M && $("s-mgame").classList.contains("on")) renderMGame();
  refreshTourBtn(); refreshHallLink();
  if(G) renderGame(true);
  if(T && $("s-bracket").classList.contains("on")) renderBracket();
  if($("s-hall").classList.contains("on")) renderHall();
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
   comme depuis la préparation d'un tournoi. */
/* Le palet compte autrement : pas de bareme a deux valeurs, mais un point
   par palet mieux place. La fiche suit donc une autre trame. */
function fillPaletRules(host){
  var comptage=el("div","block");
  comptage.appendChild(el("p","eyebrow",t("prules.count")));
  var pts=el("div","pts");
  var row=el("div","pt-row");
  row.appendChild(el("b",null,"1"));
  row.appendChild(el("span",null,t("prules.pt")));
  pts.appendChild(row);
  comptage.appendChild(pts);
  host.appendChild(comptage);

  var deroule=el("div","block");
  deroule.appendChild(el("p","eyebrow",t("prules.flow")));
  var list=el("ul","rulist");
  [1,2,3,4,5,6].forEach(function(k){
    var li=document.createElement("li");
    li.appendChild(document.createTextNode(t("prules."+k+"a")));
    li.appendChild(el("b",null,t("prules."+k+"b")));
    li.appendChild(document.createTextNode(t("prules."+k+"c")));
    list.appendChild(li);
  });
  deroule.appendChild(list);
  host.appendChild(deroule);
}

function fillMolkkyRules(host){
  var comptage=el("div","block");
  comptage.appendChild(el("p","eyebrow",t("mrules.count")));
  var pts=el("div","pts");
  [["1",t("mrules.one")],["2+",t("mrules.many")]].forEach(function(r){
    var row=el("div","pt-row");
    row.appendChild(el("b",null,r[0]));
    row.appendChild(el("span",null,r[1]));
    pts.appendChild(row);
  });
  comptage.appendChild(pts);
  host.appendChild(comptage);

  var deroule=el("div","block");
  deroule.appendChild(el("p","eyebrow",t("mrules.flow")));
  var list=el("ul","rulist");
  [1,2,3,4,5].forEach(function(k){
    var li=document.createElement("li");
    li.appendChild(document.createTextNode(t("mrules."+k+"a")));
    li.appendChild(el("b",null,t("mrules."+k+"b")));
    li.appendChild(document.createTextNode(t("mrules."+k+"c")));
    list.appendChild(li);
  });
  deroule.appendChild(list);
  host.appendChild(deroule);
}

function fillRules(id){
  var host=$(id);
  if(!host) return;
  host.innerHTML="";

  if(curGame()==="molkky") return fillMolkkyRules(host);
  if(curGame()==="palet") return fillPaletRules(host);

  var comptage=el("div","block");
  comptage.appendChild(el("p","eyebrow",t("rules.count")));
  var pts=el("div","pts");
  [["3",t("rules.hole")],["1",t("rules.board")]].forEach(function(p){
    var row=el("div","pt-row");
    row.appendChild(el("b",null,p[0]));
    row.appendChild(el("span",null,p[1]));
    pts.appendChild(row);
  });
  comptage.appendChild(pts);
  host.appendChild(comptage);

  var deroule=el("div","block");
  deroule.appendChild(el("p","eyebrow",t("rules.flow")));
  var list=el("ul","rulist");
  [
    [t("rules.1a"),t("rules.1b"),t("rules.1c")],
    [t("rules.2a"),t("rules.2b"),t("rules.2c")],
    [t("rules.3a"),t("rules.3b"),t("rules.3c")],
    [t("rules.4a"),t("rules.4b"),t("rules.4c")]
  ].forEach(function(r){
    var li=document.createElement("li");
    li.appendChild(document.createTextNode(r[0]));
    li.appendChild(el("b",null,r[1]));
    li.appendChild(document.createTextNode(r[2]));
    list.appendChild(li);
  });
  deroule.appendChild(list);
  host.appendChild(deroule);
}

/* état de préparation */
var S = {
  game:"cornhole", mode:"simple", target:21, palets:4,
  /* un score par jeu : jouer une belle au palet ne doit pas ramener
     le cornhole a 15 au retour */
  tgt:{cornhole:21, palet:12},
  teams:[
    {name:"", mates:["",""], color:"rouge"},
    {name:"", mates:["",""], color:"bleu"}
  ]
};

/* état de partie */
var G = null;

