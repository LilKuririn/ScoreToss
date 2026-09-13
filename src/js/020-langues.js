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
  "games.soon":"En chantier", "games.soon.sub":"Pétanque, bibock…",
  "games.change":"Changer de jeu",
  "app.desc":"Compteur de points pour les jeux d'extérieur. Cornhole, palet breton et mölkky, en simple, en double ou en équipes, tournois à élimination directe et palmarès entre joueurs.",
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
  "games.soon":"In the works", "games.soon.sub":"Pétanque, Bibock…",
  "games.change":"Change game",
  "app.desc":"A score keeper for outdoor games. Cornhole, Breton palet and Mölkky, singles, doubles or teams, single-elimination tournaments, and a record of who beats whom.",
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
  "app.tagline":"Marcador",
  "cat.eyebrow":"Elige una categoría", "cat.back":"Categorías", "cat.soon":"Próximamente",
  "cat.exterieur":"Exterior", "cat.interieur":"Interior", "cat.societe":"Juegos de mesa",
  "cat.count":"{n} juego", "cat.count_p":"{n} juegos",
  "games.soon":"En preparación", "games.soon.sub":"Petanca, bibock…",
  "games.change":"Cambiar de juego",
  "app.desc":"Marcador para juegos de exterior. Cornhole, palet bretón y mölkky, individual, por parejas o por equipos, torneos de eliminación directa e historial de enfrentamientos.",
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
  renderCategories();
  if($("s-cat").classList.contains("on")) peindreCategorie();
  renderCards(); renderRules(); renderTSetup();
  pourChaqueJeu("changementDeLangue");
  fillRules("rulesBody");
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
   comme depuis la préparation d'un tournoi. Elle suit le jeu en cours :
   chaque jeu fournit la sienne. */
function fillRules(id){
  var host=$(id);
  if(!host) return;
  host.innerHTML="";
  jeu(curGame()).regles(host);
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

