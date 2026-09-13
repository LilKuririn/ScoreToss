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
document.querySelector("#s-games .games").addEventListener("click",function(e){
  var b=e.target.closest("button[data-jeu]");
  if(b) ouvrirJeu(b.dataset.jeu);
});
$("mkToGames").addEventListener("click",function(){ show("games"); });
$("mkMinus").addEventListener("click",function(){
  if(MS.count>MK_MIN){ MS.count--; MS.open=-1; renderMSetup(); save(); }
});
$("mkPlus").addEventListener("click",function(){
  if(MS.count<MK_MAX){ MS.count++; MS.open=-1; renderMSetup(); save(); }
});
$("mkMode").addEventListener("click",function(e){
  var b=e.target.closest("button[data-mode]");
  if(!b || b.dataset.mode===MS.mode) return;
  MS.mode=b.dataset.mode;
  /* un joueur n'est pas une équipe : ce qui était nommé n'a plus de sens */
  MS.players.forEach(function(pl){ pl.name=""; pl.mates=["","","",""]; });
  MS.open=-1;
  renderMSetup(); save();
});
$("mkPerMinus").addEventListener("click",function(){
  if(MS.per>MK_PER_MIN){ MS.per--; MS.open=-1; renderMSetup(); save(); }
});
$("mkPerPlus").addEventListener("click",function(){
  if(MS.per<MK_PER_MAX){ MS.per++; MS.open=-1; renderMSetup(); save(); }
});
$("mkStart").addEventListener("click",mNewGame);
$("mkOpenLayout").addEventListener("click",mOpenLayout);
$("mkLayoutBtn").addEventListener("click",mOpenLayout);
$("mkLayoutClose").addEventListener("click",mCloseLayout);
$("mkLayoutScrim").addEventListener("click",mCloseLayout);
$("mkOpenRules").addEventListener("click",openRules);
$("mkOpenAbout").addEventListener("click",openAbout);
$("mkSheetBtn").addEventListener("click",mOpenSheet);
$("mkSheetClose").addEventListener("click",mCloseSheet);
$("mkScrim").addEventListener("click",mCloseSheet);
$("mkMissBtn").addEventListener("click",function(){ mThrow(0); });
$("mkUndo").addEventListener("click",mUndo);
$("mkEdSave").addEventListener("click",function(){
  if(!MEDIT) return;
  M.throws[MEDIT.idx].v = MEDIT.v;
  MEDIT=null;
  mAfterChange();
});
$("mkEdDel").addEventListener("click",function(){
  if(!MEDIT) return;
  M.throws.splice(MEDIT.idx,1);
  MEDIT=null;
  mAfterChange();
});
$("mkQuit").addEventListener("click",function(){
  var b=$("mkQuit");
  if(b.dataset.armed!=="1"){
    mArmQuit(true);
    setTimeout(function(){ if(b.dataset.armed==="1") mArmQuit(false); },4000);
    return;
  }
  mCloseSheet();
  M=null;
  buzz(12);
  save();
  show("msetup");
  renderMSetup();
});
$("mtrMiss").addEventListener("click",maitreMiss);
$("backToGames").addEventListener("click",function(){ show("games"); });

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
  ["games","setup","tsetup","bracket","hall","game","over","msetup","mgame"].forEach(function(n){
    $("s-"+n).classList.toggle("on", n===name);
  });
  if(name!=="game") closeSheet();
  if(name!=="mgame") mCloseSheet();
  if(name==="setup"){ refreshTourBtn(); refreshHallLink(); }
  if(name==="msetup") refreshHallLink();
}

function save(){
  TOUR[S.game]=T; DRAFT[S.game]=TS;   /* le jeu courant avant d'ecrire */
  try{ localStorage.setItem(KEY, JSON.stringify({s:S,g:G,tg:TOUR,ds:DRAFT,h:H,ms:MS,m:M})); }catch(e){}
}

/* Un état enregistré peut venir de n'importe quelle version : celui du
   téléphone au démarrage, comme une sauvegarde importée. Les deux chemins
   passent par ces fonctions. Recopiées de part et d'autre, elles avaient
   divergé : importer une sauvegarde d'avant le mölkky en équipes laissait
   le nombre de joueurs par équipe vide, et ses boutons sans effet. */
function normS(s){
  if(!JEUX[s.game]) s.game=jeuHistorique();
  if(!s.tgt) s.tgt=ciblesParDefaut();
  if(!s.palets) s.palets=paletDefault(s.mode);
  if(!s.teams || s.teams.length!==2) s.teams=[{name:"",mates:["",""],color:"rouge"},{name:"",mates:["",""],color:"bleu"}];
  return s;
}
function normMS(ms){
  ms.open=-1;
  if(ms.mode!=="team") ms.mode="solo";
  if(!ms.per || ms.per<MK_PER_MIN || ms.per>MK_PER_MAX) ms.per=MK_PER_MIN;
  ms.players.forEach(function(pl){ if(!pl.mates) pl.mates=["","","",""]; });
  return ms;
}
function normM(m){
  if(!m.throws) m.throws=[];
  if(!m.mode) m.mode="solo";
  if(!m.per) m.per=MK_PER_MIN;
  return m;
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
  if(d && d.ms && d.ms.players && d.ms.players.length===MK_MAX) MS=normMS(d.ms);
  if(d && d.m && d.m.players && d.m.players.length>=MK_MIN){ M=normM(d.m); mRecompute(); }
  renderMSetup();
  if(d && d.h && d.h.length) H=d.h;
  refreshTourBtn();
  refreshHallLink();

  /* le mölkky reprend d'abord : il a son propre écran de partie */
  if(S.game==="molkky" && M && !M.over){
    show("mgame");
    buildMPad();
    renderMGame();
    keepAwake();
  }else if(d && d.g && d.g.teams){
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
