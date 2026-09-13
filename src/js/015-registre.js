
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

   Un jeu de la famille "duel" fournit :
     cibles, cible             les scores proposés, et celui par défaut
     nom()                     le titre de l'écran de préparation
     regles(hote)              la fiche de règles
     saisie                    les colonnes de saisie d'une manche :
                               { types, retirer, ajouter, entetes } — les
                               deux derniers et entetes sont des clés de texte
     entreeVide()              une saisie à zéro pour les deux camps
     entreeDeManche(manche)    la saisie qui a produit une manche enregistrée
     gain(entree)              ce qu'elle rapporte à chaque camp, [a, b]
     manche(entree, gain)      la manche telle qu'elle est enregistrée
     ajuster(entree, i, type, d, max)
                               applique +1 ou −1, et répond faux si c'est interdit
     plein(entree, i, type, max)
                               vrai quand le bouton + doit être désactivé
     annonceNulle(entree)      le texte d'une saisie qui ne rapporte rien
     titreConsole(max)         l'en-tête de la console de saisie
     statistiques(f, w, l, fmt)
                               les lignes du face-à-face de fin de partie
   et, s'il en a besoin :
     historique                reprend les enregistrements sans nom de jeu
     compteNulles              annonce le nombre de manches nulles en fin de partie
     main()                    l'équipe qui a la main, si ce n'est pas l'honneur
     peindre()                 ce qu'il affiche en plus dans la console
     auChoix(), auChangementDeMode(), peindrePreparation()
                               ses propres réglages sur l'écran de préparation

   Tout jeu peut aussi fournir, s'il garde ses propres écrans ou son
   propre état :
     ouvrir()                  son ouverture depuis l'accueil
     ecrans                    ses écrans, identifiants sans le préfixe s-
     lienPalmares              l'identifiant de son bouton vers le palmarès
     auChangementDEcran(nom)   ce qu'il ferme ou rafraîchit quand l'écran change
     sauver(o)                 ce qu'il ajoute à l'état enregistré
     charger(d), importer(d)   le relire au démarrage, ou d'une sauvegarde
     reprendre()               reprendre sa partie en cours au démarrage ;
                               vrai s'il l'a fait
     changementDeLangue()      se redessiner dans la nouvelle langue

   Le HTML et le CSS propres à un jeu vivent dans son dossier et entrent
   par des repères @@jeux:fichier@@ ; ses éléments portent
   data-propre="identifiant", et le code commun ne les affiche que pour lui.
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

/* Appelle la fonction `nom` de chaque jeu qui la fournit, dans l'ordre. */
function pourChaqueJeu(nom, arg){
  ORDRE_JEUX.forEach(function(id){
    if(JEUX[id][nom]) JEUX[id][nom](arg);
  });
}
function ecransDesJeux(){
  var e=[];
  ORDRE_JEUX.forEach(function(id){ e=e.concat(JEUX[id].ecrans||[]); });
  return e;
}
function liensPalmares(){
  return ORDRE_JEUX.map(function(id){ return JEUX[id].lienPalmares; }).filter(Boolean);
}

/* Les éléments propres à un jeu ne s'affichent que pour lui. */
function montrerPropres(racine, id){
  var n=racine.querySelectorAll("[data-propre]");
  for(var i=0;i<n.length;i++) n[i].hidden = n[i].getAttribute("data-propre")!==id;
}

@@jeux:jeu.js@@
