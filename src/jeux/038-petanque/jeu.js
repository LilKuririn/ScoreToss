/* Pétanque.

   Règlement officiel de la FIPJP, repris tel quel par la FFPJP. Triplette,
   doublette ou tête-à-tête : deux boules par joueur en triplette, trois
   sinon, donc six boules par équipe et trois en tête-à-tête. Seule l'équipe
   la plus proche du but marque, un point par boule mieux placée que la
   meilleure adverse : la saisie tient en un compte par équipe, comme au
   palet, et saisir pour l'une remet l'autre à zéro. Deux zéros font une
   mène nulle, et le but reste à l'équipe qui avait marqué. Partie en 13
   points, en 11 dans les poules et les cadrages.

   La pétanque dit « mène » là où les autres jeux disent « manche » : ses
   textes renomment les clés communes, voir textes.js. */
declarerJeu({
  id:"petanque",
  famille:"duel",
  categorie:"exterieur",
  cibles:[11,13], cible:13,
  modes:["simple","double","triple"],
  maxParManche:function(mode){ return mode==="simple" ? 3 : 6; },
  nom:function(){ return t("pe.name"); },
  regles:fillPetanqueRules,

  saisie:{ types:["p"], retirer:{p:"pe.rm"}, ajouter:{p:"pe.add"}, entetes:["over.points"] },
  entreeVide:function(){ return [{p:0},{p:0}]; },
  entreeDeManche:function(rd){ return [{p:rd.p[0]},{p:rd.p[1]}]; },
  gain:function(e){ return [e[0].p, e[1].p]; },
  manche:function(e,gain){ return { p:[e[0].p,e[1].p], gain:gain }; },
  ajuster:function(e,i,kind,d,max){
    var next=e[i].p+d;
    if(next>max) return false;
    e[i].p=next;
    if(next>0) e[1-i].p=0;
    return true;
  },
  plein:function(e,i,kind,max){ return e[i].p>=max; },
  annonceNulle:function(){ return t("pe.void"); },
  titreConsole:function(max){ return tf("pe.console",{n:max}); },

  compteNulles:true,
  statistiques:function(f,w,l,fmt){
    return [
      [t("over.points"), G.scores[w],    G.scores[l],    fmt.plain],
      [t("over.won"),    f.won[w],       f.won[l],       fmt.plain],
      [t("over.best"),   f.best[w],      f.best[l],      fmt.gain],
      [t("over.avg"),    fmt.moyenne(w), fmt.moyenne(l), fmt.plain]
    ];
  },

  peindre:peindreChrono,
  auChangementDEcran:function(nom){ if(nom!=="game") arreterChrono(); }
});

/* --- le chrono d'une minute ---------------------------------------- */
/* Une minute pour jouer chaque boule, et pour lancer le but (art. 21).
   Rien d'obligatoire : on le lance d'un appui, un second l'arrête. Il ne
   s'enregistre pas, et repart à zéro à chaque mène validée. */
var PE_DUREE = 60000;
var peFin = 0, peMinuteur = null, peMenes = -1;

function arreterChrono(){
  if(peMinuteur) clearInterval(peMinuteur);
  peMinuteur = null; peFin = 0;
  var c=$("peChrono");
  if(c){ c.classList.remove("court","presse","fini"); c.style.setProperty("--reste","1"); }
  afficherChrono(PE_DUREE);
}
function afficherChrono(ms){
  var s=Math.ceil(ms/1000);
  $("peTemps").textContent = Math.floor(s/60)+":"+("0"+(s%60)).slice(-2);
  $("peBouton").textContent = t(peFin ? "pe.chrono.stop" : "pe.chrono.go");
}
function tictac(){
  var reste=Math.max(0, peFin-Date.now()), c=$("peChrono");
  c.style.setProperty("--reste", String(reste/PE_DUREE));
  c.classList.toggle("presse", reste>0 && reste<=10000);
  if(reste<=0){
    clearInterval(peMinuteur); peMinuteur=null; peFin=0;
    c.classList.remove("court","presse");
    c.classList.add("fini");
    $("peTemps").textContent = t("pe.chrono.out");
    $("peBouton").textContent = t("pe.chrono.again");
    buzz([120,80,120]);
    return;
  }
  afficherChrono(reste);
}
function lancerChrono(){
  if(peFin){ arreterChrono(); return; }
  arreterChrono();
  peFin = Date.now()+PE_DUREE;
  $("peChrono").classList.add("court");
  buzz(8);
  tictac();
  peMinuteur = setInterval(tictac, 200);
}
$("peBouton").addEventListener("click", lancerChrono);

function peindreChrono(){
  var c=$("peChrono");
  var montrer = G && !G.over;
  c.hidden = !montrer;
  /* une mène validée ou annulée : le chrono repart de zéro */
  if(!montrer || G.rounds.length!==peMenes){ peMenes = G ? G.rounds.length : -1; arreterChrono(); }
  else if(!peFin) afficherChrono(PE_DUREE);
}

/* --- la fiche de règles -------------------------------------------- */
/* Six chapitres, dans l'ordre du règlement. Chaque règle est une phrase
   dont la partie entre astérisques s'affiche en gras. */
var PE_CHAPITRES = [
  ["materiel", 3], ["equipes", 4], ["but", 5], ["mene", 5], ["points", 4], ["discipline", 4]
];
function phraseEnGras(li, s){
  s.split("*").forEach(function(morceau, k){
    if(!morceau) return;
    if(k%2) li.appendChild(el("b",null,morceau));
    else li.appendChild(document.createTextNode(morceau));
  });
}
function fillPetanqueRules(host){
  var comptage=el("div","block");
  comptage.appendChild(el("p","eyebrow",t("pe.r.count")));
  var pts=el("div","pts");
  [["1",t("pe.r.pt")],["13",t("pe.r.win")]].forEach(function(p){
    var row=el("div","pt-row");
    row.appendChild(el("b",null,p[0]));
    row.appendChild(el("span",null,p[1]));
    pts.appendChild(row);
  });
  comptage.appendChild(pts);
  host.appendChild(comptage);

  PE_CHAPITRES.forEach(function(c){
    var bloc=el("div","block");
    bloc.appendChild(el("p","eyebrow",t("pe.r."+c[0])));
    var list=el("ul","rulist");
    for(var k=1;k<=c[1];k++){
      var li=document.createElement("li");
      phraseEnGras(li, t("pe.r."+c[0]+"."+k));
      list.appendChild(li);
    }
    bloc.appendChild(list);
    host.appendChild(bloc);
  });
}
