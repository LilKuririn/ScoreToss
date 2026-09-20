/* ------------------------------------------------------------------
   Bouton retour d'Android

   La coquille Android demande à l'application ce que fait le bouton
   retour : fermer ce qui est ouvert, ou remonter d'un écran. Elle ne
   connaît ainsi ni les écrans ni les jeux ; un jeu qui apporte ses
   propres fiches ou ses propres écrans les déclare dans son `retour`.

   Les fiches passent avant les écrans. Celles d'un jeu passent avant les
   fiches communes des règles et d'à propos, ses écrans avant celui de la
   préparation. Pendant une partie et sur l'accueil, le geste ne sert pas :
   la coquille propose alors de quitter, la partie restant enregistrée.
------------------------------------------------------------------ */
function retourAndroid(){
  var tirage=$("tossWrap");
  if(tirage && !tirage.hidden) return true;   /* le tirage au sort se termine seul */

  var fiches=[["jrWrap","jrClose"], ["ordreWrap","ordreOk"], ["sheetWrap","closeSheet"], ["bkSheetWrap","bkSheetClose"]];
  var ecrans=[["s-hall","hallBack"], ["s-joueurs","jrBack"], ["s-tsetup","tsBack"], ["s-bracket","bkHome"], ["s-cat","catBack"]];
  ORDRE_JEUX.forEach(function(id){
    var r=JEUX[id].retour;
    if(!r) return;
    fiches=fiches.concat(r.fiches||[]);
    ecrans=ecrans.concat(r.ecrans||[]);
  });
  fiches.push(["rulesWrap","rulesClose"], ["aboutWrap","aboutClose"]);
  ecrans.push(["s-setup","backToGames"]);

  var paires=fiches.concat(ecrans);
  for(var i=0;i<paires.length;i++){
    var e=$(paires[i][0]);
    if(e && e.classList.contains("on")){ $(paires[i][1]).click(); return true; }
  }
  return false;
}

/* Le seul nom que l'application expose : la coquille l'appelle, et lit
   "1" quand le geste a servi. */
window.scoretossRetour=function(){ return retourAndroid() ? "1" : "0"; };
