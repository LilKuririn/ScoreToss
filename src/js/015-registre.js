
/* ------------------------------------------------------------------
   Registre des jeux

   Chaque jeu se déclare dans src/jeux/ : sa famille, ce qu'il propose,
   ce qu'il fournit. Le code commun interroge ce registre plutôt que de
   nommer les jeux — en ajouter un ne touche pas les fichiers partagés.
   Les déclarations sont insérées juste en dessous, avant tout code qui
   lit le registre à son chargement.

   Familles : "duel", deux camps qui jouent des manches et peuvent
   s'affronter en tournoi ; "tours", des participants qui lancent chacun
   à leur tour.
------------------------------------------------------------------ */
var JEUX = {};
var ORDRE_JEUX = [];

function declarerJeu(def){
  JEUX[def.id] = def;
  ORDRE_JEUX.push(def.id);
}
function jeu(id){ return JEUX[id] || JEUX[ORDRE_JEUX[0]]; }

function jeuxDuel(){
  return ORDRE_JEUX.filter(function(id){ return JEUX[id].famille==="duel"; });
}
/* Un jeu à deux camps, ou à défaut le premier d'entre eux : l'écran de
   préparation se redessine aussi quand un autre jeu est choisi. */
function jeuDuel(id){
  var d=JEUX[id];
  return (d && d.famille==="duel") ? d : JEUX[jeuxDuel()[0]];
}
/* Les enregistrements d'avant l'arrivée des autres jeux ne portent pas de
   nom de jeu : celui qui se déclare historique les reprend. */
function jeuHistorique(){
  for(var i=0;i<ORDRE_JEUX.length;i++) if(JEUX[ORDRE_JEUX[i]].historique) return ORDRE_JEUX[i];
  return ORDRE_JEUX[0];
}

/* Une valeur par jeu à deux camps, dans l'ordre du registre : le score
   retenu, le tableau de tournoi, son brouillon. */
function carteVide(){
  var o={};
  jeuxDuel().forEach(function(id){ o[id]=null; });
  return o;
}
function reprendreCarte(source){
  var o=carteVide();
  for(var id in o) o[id]=source[id]||null;
  return o;
}
function ciblesParDefaut(){
  var o={};
  jeuxDuel().forEach(function(id){ o[id]=JEUX[id].cible; });
  return o;
}

@@jeux:jeu.js@@
