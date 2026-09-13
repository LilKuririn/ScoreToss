
/* ------------------------------------------------------------------
   Données
------------------------------------------------------------------ */
var COLORS = [
  {id:"rouge",    hex:"#E14434"},
  {id:"ambre",    hex:"#E2892C"},
  {id:"or",       hex:"#D9BE38"},
  {id:"vert",     hex:"#3FA96A"},
  {id:"sarcelle", hex:"#22A69D"},
  {id:"bleu",     hex:"#3B76E8"},
  {id:"violet",   hex:"#8B5CF0"},
  {id:"rose",     hex:"#DE4597"},
  {id:"ardoise",  hex:"#8A949B"}
];
var KEY = "cornhole.v1";
var LANG_KEY = "cornhole.lang";
var BAGS = 4;              /* sacs lancés par équipe et par manche */

/* Au palet, le nombre de palets par joueur varie d'une fédération à
   l'autre : on en fait un réglage plutôt qu'un dogme. Quatre palets par
   équipe dans les deux formats. */
function paletDefault(mode){ return mode==="double" ? 2 : 4; }
function paletMax(mode,per){ return per*(mode==="double" ? 2 : 1); }
/* le jeu qui fait foi : celui en cours s'il y en a un, sinon la préparation */
function curGame(){
  if(jeu(S.game).famille!=="duel") return S.game;
  return (G && !G.over) ? G.game : S.game;
}
function newEntry(g){ return g==="palet" ? [{p:0},{p:0}] : [{h:0,b:0},{h:0,b:0}]; }

