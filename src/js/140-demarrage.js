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
  ["games","cat","joueurs","setup","tsetup","bracket","hall","game","over"].concat(ecransDesJeux()).forEach(function(n){
    $("s-"+n).classList.toggle("on", n===name);
  });
  if(name!=="game") closeSheet();
  pourChaqueJeu("auChangementDEcran", name);
  if(name==="setup"){ refreshTourBtn(); refreshHallLink(); }
}

function save(){
  TOUR[S.game]=T; DRAFT[S.game]=TS;   /* le jeu courant avant d'ecrire */
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
  if(!JEUX[s.game]) s.game=jeuHistorique();
  if(!s.tgt) s.tgt=ciblesParDefaut();
  if(!s.palets) s.palets=paletDefault(s.mode);
  if(!s.teams || s.teams.length!==2) s.teams=[{name:"",mates:["",""],color:"rouge"},{name:"",mates:["",""],color:"bleu"}];
  if(modesDuJeu(s.game).indexOf(s.mode)<0) s.mode="double";
  s.teams.forEach(function(team){ if(!team.mates) team.mates=["",""]; });
  return s;
}
function normJ(liste){
  if(!liste || !liste.length) return [];
  return liste.filter(function(j){ return j && j.id && j.nom; }).map(function(j){
    return {id:j.id, nom:String(j.nom).slice(0,22), couleur:color(j.couleur).id, vu:j.vu||0};
  });
}
function normG(g){
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
function load(){
  var raw;
  try{ raw=localStorage.getItem(KEY); }catch(e){ return; }
  if(!raw) return;
  var d;
  try{ d=JSON.parse(raw); }catch(e){ return; }
  if(d && d.s) S=normS(d.s);
  adoptTour(d);
  renderTSetup();
  pourChaqueJeu("charger", d);
  if(d && d.h && d.h.length) H=d.h;
  J=normJ(d && d.j);
  refreshJoueursLink();
  refreshTourBtn();
  refreshHallLink();

  /* un jeu qui a son propre écran de partie la reprend lui-même */
  var courant=jeu(S.game);
  if(!(courant.reprendre && courant.reprendre()) && d && d.g && d.g.teams){
    G=normG(d.g);
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
document.addEventListener("visibilitychange",function(){
  if(document.visibilityState==="visible" && G && !G.over && !lock) keepAwake();
  if(document.visibilityState==="hidden") lock=null;
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
refreshJoueursLink();

/* installation sur l'écran d'accueil et fonctionnement hors ligne */
if("serviceWorker" in navigator && location.protocol.indexOf("http")===0){
  window.addEventListener("load",function(){
    navigator.serviceWorker.register("sw.js").catch(function(){});
  });
}
