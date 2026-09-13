/* Mölkky.
   Il ne partage ni l'écran de préparation ni le moteur à deux camps : il
   ouvre les siens. Le jeu courant bascule quand même, pour que le palmarès
   filtre juste, et le jeu quitté range son score, son tableau et son
   brouillon. */
declarerJeu({
  id:"molkky",
  famille:"tours",
  regles:fillMolkkyRules,
  ouvrir:function(){
    if(!S.tgt) S.tgt=ciblesParDefaut();
    if(jeu(S.game).famille==="duel"){
      S.tgt[S.game]=S.target;
      TOUR[S.game]=T;
      DRAFT[S.game]=TS;
    }
    S.game="molkky";
    T=null;
    fillRules("rulesBody");
    save();
    show("msetup");
    renderMSetup();
  }
});
