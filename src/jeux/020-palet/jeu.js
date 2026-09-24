/* Palet breton.

   Sur planche, au laiton. Seule l'équipe la plus proche du maître marque,
   un point par palet mieux placé que le meilleur adverse : la saisie tient
   en un seul compte par équipe, et saisir pour l'une remet l'autre à zéro.
   Deux zéros valent manche nulle. La partie se joue en 12 points, la belle
   en 15. */
declarerJeu({
  id:"palet",
  famille:"duel",
  categorie:"exterieur",
  cibles:[12,15], cible:12,
  nom:function(){ return t("palet.name"); },
  regles:fillPaletRules,

  saisie:{ types:["p"], retirer:{p:"game.rm.pt"}, ajouter:{p:"game.add.pt"}, entetes:["over.points"] },
  entreeVide:function(){ return [{p:0},{p:0}]; },
  entreeDeManche:function(rd){ return [{p:(rd.p?rd.p[0]:rd.gain[0])},{p:(rd.p?rd.p[1]:rd.gain[1])}]; },
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
  annonceNulle:function(){ return t("game.void"); },
  titreConsole:function(max){ return tf("game.palets",{n:max}); },

  compteNulles:true,
  statistiques:function(f,w,l,fmt){
    return [
      [t("over.points"), G.scores[w],    G.scores[l],    fmt.plain],
      [t("over.won"),    f.won[w],       f.won[l],       fmt.plain],
      [t("over.best"),   f.best[w],      f.best[l],      fmt.gain],
      [t("over.avg"),    fmt.moyenne(w), fmt.moyenne(l), fmt.plain]
    ];
  },

  /* quatre palets par équipe quel que soit le format */
  auChoix:function(){ if(!S.palets) S.palets=paletDefault(S.mode); },
  auChangementDeMode:function(){ S.palets=paletDefault(S.mode); },
  peindrePreparation:function(){ fillChips($("palets"), [2,3,4], S.palets, "palets"); },

  main:function(){ return G.first ^ ((G.mpass||0) & 1); },
  peindre:paintMaitre
});

$("palets").addEventListener("click",function(e){
  var b=e.target.closest("button[data-palets]");
  if(!b) return;
  S.palets=+b.dataset.palets;
  renderRules(); save();
});

/* --- le maître --------------------------------------------------- */
/* Au palet, c'est celui qui pose le maitre qui a la main. Trois essais
   manques et le lancer passe a l'adversaire, qui prend la main s'il y
   parvient — et la rend sinon, indefiniment. Seule la parite des passes
   compte, l'ecran n'ayant a dire qu'une chose : a qui revient le lancer.
   `G.first` reste l'honneur herite de la mene precedente ; les passes le
   decalent pour la mene en cours, et repartent de zero a la validation. */
function paintMaitre(){
  var row=$("mtr");
  var montrer = G && !G.over && (G.tossed || G.rounds.length);
  row.hidden = !montrer;
  if(!montrer) return;
  var k=handTeam();
  $("mtrDot").style.background = G.teams[k].hex;
  $("mtrWho").textContent = G.teams[k].label;
  $("mtrMiss").setAttribute("aria-label", tf("game.missed.aria",{name:G.teams[1-k].label}));
}

function maitreMiss(){
  if(!G || G.over) return;
  G.mpass = (G.mpass||0)+1;
  buzz(10);
  paintHonor(); paintMaitre();
  save();
}
$("mtrMiss").addEventListener("click",maitreMiss);

/* Le palet compte autrement : pas de bareme a deux valeurs, mais un point
   par palet mieux place. La fiche suit donc une autre trame. */
function fillPaletRules(host){
  blocBareme(host, t("prules.count"), [["1",t("prules.pt")]]);
  blocDeroule(host, "prules", 6);
}
