/* ------------------------------------------------------------------
   Navigation, persistance, écran allumé
------------------------------------------------------------------ */
/* Chaque tuile de l'accueil porte l'identifiant du jeu qu'elle ouvre. Un
   jeu à deux camps partage l'écran de préparation ; les autres fournissent
   leur propre ouverture. */
function ouvrirJeu(id){
  var d=jeu(id);
  if(d.ouvrir){ d.ouvrir(); return; }
  applyGame(id);
  show("setup");
}
/* Un jeu à tour de rôle devient le jeu courant : celui à deux camps qu'on
   quitte range son score, son tableau et son brouillon, et la fiche de
   règles passe à celles du nouveau jeu. */
function devenirJeuCourant(id){
  rangerJeuDuel();
  S.game=id;
  T=null;
  fillRules("rulesBody");
  save();
}

/* Après chaque coup d'un jeu à tour de rôle. La partie qui vient de se
   terminer est archivée AVANT d'être sauvegardée : fermer l'application sur
   l'écran de fin ne doit pas la faire perdre au palmarès. L'écran de fin
   arrive ensuite, le temps de voir le dernier coup.
     fermerFeuille, archiver, peindre, peindreFin, delai
     feuille, peindreFeuille  la feuille de match, repeinte si elle est ouverte */
function apresUnCoup(finie, o){
  if(finie){
    o.fermerFeuille();
    o.archiver();
    save();
    o.peindre();
    setTimeout(o.peindreFin, o.delai || 620);
  }else{
    save();
    o.peindre();
    if($(o.feuille).classList.contains("on")) o.peindreFeuille();
  }
}

$("catGames").addEventListener("click",function(e){
  var b=e.target.closest("button[data-jeu]");
  if(b) ouvrirJeu(b.dataset.jeu);
});
$("backToGames").addEventListener("click",retourAuxJeux);

$("openTour").addEventListener("click",function(){
  if(T){ openBracket(); }
  else { show("tsetup"); renderTSetup(); }
});
$("tsBack").addEventListener("click",function(){ show("setup"); });
$("bkHome").addEventListener("click",function(){ show("setup"); });

/* --- options du tournoi, dont la sortie ------------------------- */
function armAbandon(on){
  var b=$("bkAbandon");
  b.dataset.armed = on ? "1" : "0";
  b.textContent = t(on ? "tour.abandon.confirm" : "tour.abandon");
}
function openBkSheet(){
  if(!T) return;
  var body=$("bkSheetBody");
  body.innerHTML="";

  var played=0;
  for(var k=0;k<T.matches.length;k++){
    if(T.matches[k].done && !T.matches[k].bye) played++;
  }
  var next=nextMatch();
  var etat = T.champion>=0 ? t("tour.done")
           : (next>=0 ? roundName(T.matches[next].r).toLocaleLowerCase(LANG) : t("tour.pending"));

  body.appendChild(el("p","eyebrow",t("tour.state")));
  body.appendChild(el("p","sheet-note",
    tf(played>1?"tour.summary_p":"tour.summary",{t:T.teams.length,m:played,s:etat})));
  var sh=el("button","share-btn",t("share.bracket"));
  sh.type="button";
  sh.style.marginTop="16px";
  sh.addEventListener("click",shareBracket);
  body.appendChild(sh);

  body.appendChild(el("p","hint",t("tour.warn")));

  armAbandon(false);
  $("bkSheetWrap").classList.add("on");
}
function closeBkSheet(){
  $("bkSheetWrap").classList.remove("on");
  armAbandon(false);
}
$("bkMenu").addEventListener("click",openBkSheet);
$("bkSheetClose").addEventListener("click",closeBkSheet);
$("bkScrim").addEventListener("click",closeBkSheet);
$("bkRestart").addEventListener("click",function(){
  closeBkSheet();
  show("tsetup");
  renderTSetup();
});
$("bkAbandon").addEventListener("click",function(){
  var b=$("bkAbandon");
  if(b.dataset.armed!=="1"){
    armAbandon(true);
    setTimeout(function(){ if(b.dataset.armed==="1") armAbandon(false); },4000);
    return;
  }
  closeBkSheet();
  T=null;
  TOUR[S.game]=null;
  if(G && G.tour) G=null;      /* un match du tournoi n'a plus de tableau */
  buzz(12);
  save();
  show("setup");
});

function refreshTourBtn(){
  var live = !!(T && T.champion<0);
  var btn = $("openTour");
  $("tourPip").hidden = !live;
  btn.classList.toggle("live", live);
  btn.title = T ? t(live ? "tour.live" : "tour.over") : t("tour.title");
  btn.setAttribute("aria-label", btn.title);
}

function show(name){
  applyStaticText();      /* les mots du jeu courant : « mène » à la pétanque seulement */
  ["games","cat","setup","tsetup","bracket","hall","fiche","game","over"].concat(ecransDesJeux()).forEach(function(n){
    $("s-"+n).classList.toggle("on", n===name);
  });
  if(name!=="game") closeSheet();
  pourChaqueJeu("auChangementDEcran", name);
  if(name==="setup"){ refreshTourBtn(); refreshHallLink(); }
}

/* Le tableau, le brouillon et le score d'un jeu à deux camps vivent dans
   T, TS et S.target tant qu'il est le jeu courant : on les range avant de
   le quitter comme avant d'écrire. Un jeu à tour de rôle n'a rien à ranger
   là — l'écrire rangeait le brouillon du dernier jeu à deux camps sous
   son nom, en double dans chaque sauvegarde. */
function rangerJeuDuel(){
  if(!S.tgt) S.tgt=ciblesParDefaut();
  if(jeu(S.game).famille!=="duel") return;
  S.tgt[S.game]=S.target;
  TOUR[S.game]=T;
  DRAFT[S.game]=TS;
}

function save(){
  rangerJeuDuel();
  var o={s:S,g:G,tg:TOUR,ds:DRAFT,h:H,j:J};
  pourChaqueJeu("sauver", o);
  try{ localStorage.setItem(KEY, JSON.stringify(o)); }catch(e){}
}

/* Un état enregistré peut venir de n'importe quelle version : celui du
   téléphone au démarrage, comme une sauvegarde importée. Les deux chemins
   passent par ces fonctions : recopiées de part et d'autre, elles avaient
   divergé. Un jeu qui garde son propre état fournit les siennes, par
   charger et importer. */
function normS(s){
  if(!s || typeof s!=="object") s={};
  if(!JEUX[s.game]) s.game=jeuHistorique();
  if(!s.tgt || typeof s.tgt!=="object") s.tgt=ciblesParDefaut();
  if(!s.palets) s.palets=paletDefault(s.mode);
  if(!Array.isArray(s.teams) || s.teams.length!==2) s.teams=[{},{}];
  s.teams=s.teams.map(function(team,i){
    if(!team || typeof team!=="object") team={};
    if(typeof team.name!=="string") team.name="";
    if(!Array.isArray(team.mates)) team.mates=["",""];
    team.color=color(team.color || (i ? "bleu" : "rouge")).id;
    return team;
  });
  if(!s.mode) s.mode="simple";
  if(modesDuJeu(s.game).indexOf(s.mode)<0) s.mode="double";
  return s;
}
/* Une partie archivée se lit par ses noms et ses scores : ce qui n'en a
   pas est écarté, plutôt que de bloquer le palmarès — et le démarrage. */
function normH(h){
  if(!Array.isArray(h)) return [];
  return h.filter(function(g){
    return g && typeof g==="object" && Array.isArray(g.n) && Array.isArray(g.s);
  }).map(function(g){
    if(!Array.isArray(g.c)) g.c=[];
    if(typeof g.w!=="number") g.w=-1;
    return g;
  });
}
function normJ(liste){
  if(!liste || !liste.length) return [];
  return liste.filter(function(j){ return j && j.id && j.nom; }).map(function(j){
    return {id:j.id, nom:String(j.nom).slice(0,22), couleur:color(j.couleur).id, vu:j.vu||0};
  });
}
function normG(g){
  if(!g || typeof g!=="object" || !Array.isArray(g.teams) || g.teams.length!==2 ||
     !g.teams[0] || !g.teams[1]) return null;
  if(!Array.isArray(g.rounds)) g.rounds=[];
  g.rounds=g.rounds.filter(function(rd){ return rd && Array.isArray(rd.gain); });
  if(!g.game) g.game=jeuHistorique();
  if(!g.max) g.max=4;
  if(g.mpass===undefined) g.mpass=0;
  if(!g.entry) g.entry=newEntry(g.game);
  return g;
}

/* Les enregistrements d'avant le palet ne connaissent qu'un tableau et
   qu'un brouillon : ils reviennent au cornhole. */
function adoptTour(d){
  if(d.tg) TOUR = reprendreCarte(d.tg);
  else if(d.t && d.t.matches && d.t.teams) TOUR[d.t.game||jeuHistorique()] = d.t;

  if(d.ds) DRAFT = reprendreCarte(d.ds);
  else if(d.ts && d.ts.teams && d.ts.teams.length===16) DRAFT[d.ts.game||jeuHistorique()] = d.ts;

  T  = TOUR[S.game] || null;
  TS = DRAFT[S.game] || freshDraft(S.game);
  TS.open = -1;
}
/* Ce qui n'a pas pu être relu n'est pas perdu : la prochaine sauvegarde
   écraserait la clé, on en garde donc une copie à côté. */
var KEY_SECOURS = KEY+".secours";
function mettreDeCote(raw){
  try{ localStorage.setItem(KEY_SECOURS, raw); }catch(e){}
}
/* Chaque jeu relit son propre état ; celui qui échoue repart de zéro sans
   entraîner les autres. */
function chargerLesJeux(d, cle){
  ORDRE_JEUX.forEach(function(id){
    var j=JEUX[id];
    if(!j[cle]) return;
    try{ j[cle](d); }
    catch(e){ try{ if(j.importer) j.importer({}); }catch(e2){} }
  });
}

function load(){
  var raw;
  try{ raw=localStorage.getItem(KEY); }catch(e){ return; }
  if(!raw) return;
  var d;
  try{ d=JSON.parse(raw); }catch(e){ mettreDeCote(raw); return; }
  if(!d || typeof d!=="object" || Array.isArray(d)){ mettreDeCote(raw); return; }
  try{ restaurer(d); }
  catch(e){
    /* un état que rien n'a su relire : l'application démarre quand même,
       vierge, et l'original reste de côté */
    mettreDeCote(raw);
    S=normS(null); TOUR=carteVide(); DRAFT=carteVide(); T=null;
    TS=freshDraft(S.game); G=null; H=[]; J=[];
    chargerLesJeux({}, "importer");
    show("games");
  }
}
function restaurer(d){
  if(d.s) S=normS(d.s);
  adoptTour(d);
  renderTSetup();
  chargerLesJeux(d, "charger");
  H=normH(d.h);
  J=normJ(d.j);
  refreshTourBtn();
  refreshHallLink();

  /* un jeu qui a son propre écran de partie la reprend lui-même */
  var courant=jeu(S.game), repris=false;
  try{ repris = !!(courant.reprendre && courant.reprendre()); }catch(e){ show("games"); }
  if(!repris && d.g){
    G=normG(d.g);
    if(!G) return;
    recompute();
    if(G.over){ renderOver(); }
    else { show("game"); renderGame(true); keepAwake(); }
  }
}

var lock=null;
function keepAwake(){
  if(!("wakeLock" in navigator)) return;
  navigator.wakeLock.request("screen").then(function(l){ lock=l; }).catch(function(){});
}
/* Le système rend le verrou dès que l'application passe en arrière-plan :
   on le redemande au retour si une partie est à l'écran. Toutes les
   parties se jouent sur un écran dont l'identifiant finit par « game » —
   celui des jeux à deux camps, comme celui de chaque jeu à tour de rôle ;
   ne tester que G laissait le mölkky ou les fléchettes s'éteindre. */
function partieALEcran(){
  var e=document.querySelector(".screen.on");
  return !!(e && /game$/.test(e.id));
}
document.addEventListener("visibilitychange",function(){
  if(document.visibilityState==="hidden"){ lock=null; return; }
  if(!lock && partieALEcran()) keepAwake();
});

$("start").addEventListener("click",newGame);

THEME=detectTheme();
applyTheme();
LANG=detectLang();
document.documentElement.lang=LANG;
applyStaticText();

/* L'état est restauré avant tout affichage : dans l'autre ordre, l'accueil
   se dessinait avec les valeurs par défaut, puis load() remplaçait l'état
   sans redessiner — une partie en double reprise après fermeture montrait
   la bascule sur Simple et deux champs au lieu de six. */
load();
renderCategories();

renderCards();
renderRules();
fillRules("rulesBody");

renderTSetup();
refreshTourBtn();
refreshHallLink();

/* installation sur l'écran d'accueil et fonctionnement hors ligne */
if("serviceWorker" in navigator && location.protocol.indexOf("http")===0){
  window.addEventListener("load",function(){
    navigator.serviceWorker.register("sw.js").catch(function(){});
  });
}
