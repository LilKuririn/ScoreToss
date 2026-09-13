/* Cornhole.

   Le premier jeu de l'application : les enregistrements d'avant l'arrivée
   des autres, qui ne portent aucun nom de jeu, sont les siens.

   Chaque équipe lance quatre sacs par manche, 3 points dans le trou et 1
   sur la planche. Les deux équipes lancent, mais seule la différence est
   marquée : 5 contre 3 rapportent 2 points à la première, rien à l'autre. */
var BAGS = 4;              /* sacs lancés par équipe et par manche */

declarerJeu({
  id:"cornhole",
  famille:"duel",
  historique:true,
  cibles:[11,15,21], cible:21,
  nom:function(){ return "Cornhole"; },
  regles:fillCornholeRules,

  saisie:{
    types:["h","b"],
    retirer:{h:"game.rm.hole", b:"game.rm.board"},
    ajouter:{h:"game.add.hole", b:"game.add.board"},
    entetes:["game.hole","game.board"]
  },
  entreeVide:function(){ return [{h:0,b:0},{h:0,b:0}]; },
  entreeDeManche:function(rd){ return [{h:rd.h[0],b:rd.b[0]},{h:rd.h[1],b:rd.b[1]}]; },
  gain:function(e){
    var d=(e[0].h*3+e[0].b)-(e[1].h*3+e[1].b);
    return d>0 ? [d,0] : [0,-d];
  },
  manche:function(e,gain){ return { h:[e[0].h,e[1].h], b:[e[0].b,e[1].b], gain:gain }; },
  ajuster:function(e,i,kind,d){
    if(e[i].h+e[i].b+d>BAGS) return false;
    e[i][kind]+=d;
    return true;
  },
  plein:function(e,i){ return (e[i].h+e[i].b)>=BAGS; },
  annonceNulle:function(e){ return t((e[0].h+e[0].b+e[1].h+e[1].b) ? "game.tie" : "game.none"); },
  titreConsole:function(){ return tf("game.bags",{n:BAGS}); },

  statistiques:function(f,w,l,fmt){
    var trous=[0,0], planches=[0,0];
    G.rounds.forEach(function(rd){
      for(var i=0;i<2;i++){
        trous[i]+=(rd.h && rd.h[i]) || 0;
        planches[i]+=(rd.b && rd.b[i]) || 0;
      }
    });
    return [
      [t("over.points"), G.scores[w],  G.scores[l],  fmt.plain],
      [t("over.won"),    f.won[w],     f.won[l],     fmt.plain],
      [t("over.holes"),  trous[w],     trous[l],     fmt.plain],
      [t("over.board"),  planches[w],  planches[l],  fmt.plain],
      [t("over.best"),   f.best[w],    f.best[l],    fmt.gain]
    ];
  }
});

function fillCornholeRules(host){
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
