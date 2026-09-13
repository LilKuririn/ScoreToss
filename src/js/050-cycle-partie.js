/* ------------------------------------------------------------------
   Cycle de vie de la partie
------------------------------------------------------------------ */
function newGame(){
  G={
    game:S.game, mode:S.mode, target:S.target,
    max:paletMax(S.mode,S.palets),
    teams:[
      {label:teamLabel(0), mates:matesLabel(0), hex:color(S.teams[0].color).hex},
      {label:teamLabel(1), mates:matesLabel(1), hex:color(S.teams[1].color).hex}
    ],
    rounds:[],
    entry:newEntry(S.game),
    scores:[0,0], first:0, mpass:0, over:false, winner:-1
  };
  show("game");
  renderGame(true);
  save();
  keepAwake();
}

/* rejoue l'historique — l'annulation d'une manche redevient exacte */
function recompute(){
  var s=[0,0], over=false, winner=-1;
  var first = (G.tossFirst===0 || G.tossFirst===1) ? G.tossFirst : 0;
  for(var r=0;r<G.rounds.length;r++){
    var rd=G.rounds[r];
    s[0]+=rd.gain[0];
    s[1]+=rd.gain[1];
    if(rd.gain[0]>rd.gain[1]) first=0;
    else if(rd.gain[1]>rd.gain[0]) first=1;
    if(!over){
      var w = s[0]>=G.target ? 0 : (s[1]>=G.target ? 1 : -1);
      if(w>=0){ over=true; winner=w; }
    }
  }
  G.scores=s; G.first=first; G.over=over; G.winner=winner;
}

function roundPoints(i){ return G.entry[i].h*3 + G.entry[i].b; }

/* Au cornhole les deux équipes lancent et seule la différence est marquée.
   Au palet une seule équipe marque, et le compte saisi est déjà son gain. */
function pending(){
  if(G.game==="palet") return [G.entry[0].p, G.entry[1].p];
  var d=roundPoints(0)-roundPoints(1);
  return d>0 ? [d,0] : [0,-d];
}

function validateRound(){
  if(!G || G.over) return;
  var gain=pending();
  G.rounds.push(G.game==="palet"
    ? { p:[G.entry[0].p,G.entry[1].p], gain:gain }
    : { h:[G.entry[0].h,G.entry[1].h], b:[G.entry[0].b,G.entry[1].b], gain:gain });
  var before=[G.scores[0],G.scores[1]];
  recompute();
  G.entry=newEntry(G.game);
  G.mpass=0;                  /* le maitre repart au vainqueur de la mene */
  buzz(gain[0]||gain[1] ? 18 : 8);

  if(G.over){ archiveGame(); applyMatchResult(); renderGame(); setTimeout(renderOver, 620); }
  else renderGame(false, [G.scores[0]-before[0], G.scores[1]-before[1]]);
  save();
}

function undoRound(){
  if(!G.rounds.length) return;
  G.rounds.pop();
  G.entry=newEntry(G.game);
  G.mpass=0;
  afterHistoryChange();
}

