/* Mölkky.
   Il ne partage ni l'écran de préparation ni le moteur à deux camps : il
   ouvre les siens. Le jeu courant bascule quand même, pour que le palmarès
   filtre juste, et le jeu quitté range son score, son tableau et son
   brouillon. */
declarerJeu({
  id:"molkky",
  famille:"tours",
  categorie:"exterieur",
  nom:function(){ return t("molkky.name"); },
  regles:fillMolkkyRules,
  ecrans:["msetup","mgame"],
  lienPalmares:"mkHall",
  retour:{
    fiches:[["mkSheetWrap","mkSheetClose"], ["mkLayoutWrap","mkLayoutClose"]],
    ecrans:[["s-msetup","mkToGames"]]
  },

  auChangementDEcran:function(nom){
    if(nom!=="mgame") mCloseSheet();
    if(nom==="msetup") refreshHallLink();
  },
  sauver:function(o){ o.ms=MS; o.m=M; },
  charger:function(d){
    if(d && d.ms && d.ms.players && d.ms.players.length===MK_MAX) MS=normMS(d.ms);
    if(d && d.m && d.m.players && d.m.players.length>=MK_MIN){ M=normM(d.m); mRecompute(); }
    renderMSetup();
  },
  importer:function(d){
    MS = normMS((d.ms && d.ms.players && d.ms.players.length===MK_MAX) ? d.ms : {count:4, players:mFreshPlayers()});
    M = (d.m && d.m.players && d.m.players.length>=MK_MIN) ? normM(d.m) : null;
    if(M) mRecompute();
    renderMSetup();
  },
  reprendre:function(){
    if(!M || M.over) return false;
    show("mgame");
    buildMPad();
    renderMGame();
    keepAwake();
    return true;
  },
  changementDeLangue:function(){
    renderMSetup();
    if(M && $("s-mgame").classList.contains("on")) renderMGame();
  },

  ouvrir:function(){
    devenirJeuCourant("molkky");
    show("msetup");
    renderMSetup();
  }
});

/* ==================================================================
   MÖLKKY

   Le premier jeu qui ne se joue pas à deux camps : chacun son score,
   et l'élimination frappe les joueurs un à un. Le moteur commun, câblé
   sur deux équipes, ne s'y prête pas — le mölkky a donc ses écrans et
   son décompte, mais la même grammaire : historique rejoué, correction
   après coup, palmarès partagé.

   Un lancer vaut de 0 à 12, et c'est tout : le numéro de l'unique
   quille renversée, ou le nombre de quilles s'il y en a plusieurs. Les
   deux cas donnant le même chiffre, la saisie tient en un appui.
================================================================== */
var MK_TARGET = 50;
var MK_BACK   = 25;   /* score après un dépassement */
var MK_OUT    = 3;    /* ratés consécutifs qui éliminent */
var MK_MIN    = 2;
var MK_MAX    = 8;

/* La formation officielle, relevée sur le schéma de molkky.world :
   quatre rangées, le 1 et le 2 face aux lanceurs. Redessinée à la
   maille des quilles — le schéma d'origine est en perspective, ses
   écarts de pixels ne sont pas des écarts de terrain. */
var MK_FORM = [[7,9,8],[5,11,12,6],[3,10,4],[1,2]];

var MK_PER_MIN = 2;
var MK_PER_MAX = 4;

function mFreshPlayers(){
  var a=[];
  for(var i=0;i<MK_MAX;i++) a.push({name:"", color:COLORS[i%COLORS.length].id, mates:["","","",""]});
  return a;
}
var MS = { count:4, mode:"solo", per:2, open:-1, players:mFreshPlayers() };
var M  = null;

function mName(i){
  var v=(MS.players[i].name||"").trim();
  return v || tf(MS.mode==="team" ? "mk.teamn" : "mk.playern",{n:i+1});
}
function mMateName(i,j){
  var m=MS.players[i].mates || [];
  var v=(m[j]||"").trim();
  return v || (t("team.player")+" "+(j+1));
}

/* --- préparation ------------------------------------------------- */
function renderMCount(){
  var eq = MS.mode==="team";
  $("mkVal").textContent=MS.count;
  $("mkCountLab").textContent=t(eq ? "mk.teams" : "mk.players");
  $("mkNote").textContent=tf(eq ? "mk.note.team" : "mk.note",{n:MS.count});
  $("mkMinus").disabled = MS.count<=MK_MIN;
  $("mkPlus").disabled  = MS.count>=MK_MAX;

  $("mkPerBlock").hidden = !eq;
  $("mkPerVal").textContent=MS.per;
  $("mkPerMinus").disabled = MS.per<=MK_PER_MIN;
  $("mkPerPlus").disabled  = MS.per>=MK_PER_MAX;

  var kids=$("mkMode").children;
  for(var i=0;i<kids.length;i++) kids[i].classList.toggle("on", kids[i].dataset.mode===MS.mode);
}

function renderMRows(){
  var eq = MS.mode==="team";
  peindreRangees({
    hote:$("mkRows"), etat:MS, liste:MS.players, nombre:MS.count, flex:true,
    cleCouleur:"mk.color.aria",
    nomParDefaut:function(k){ return tf(eq ? "mk.teamn" : "mk.playern",{n:k+1}); },
    nomAria:function(k){ return tf(eq ? "mk.team.aria" : "mk.player.aria",{n:k+1}); },
    coequipiers: eq ? MS.per : 0, classeCoequipiers:"mk-mates", cleCoequipier:"mk.mate.aria",
    repeindre:renderMRows
  });
}
function renderMSetup(){ renderMCount(); renderMRows(); }

/* --- décompte ---------------------------------------------------- */
function mNewGame(){
  mkVu=[]; mkVuLancers=0;
  M={ target:MK_TARGET, mode:MS.mode, per:MS.per, players:[], throws:[], turn:0, over:false, winner:-1 };
  for(var i=0;i<MS.count;i++){
    var mates=[];
    if(MS.mode==="team"){ for(var j=0;j<MS.per;j++) mates.push(mMateName(i,j)); }
    M.players.push({ label:mName(i), hex:color(MS.players[i].color).hex, mates:mates, ids:idsDe(MS.players[i], mates.length) });
  }
  mRecompute();
  show("mgame");
  buildMPad();
  renderMGame();
  save();
  keepAwake();
}

/* Les membres d'une équipe lancent à tour de rôle. Celui qui lance se
   déduit du nombre de lancers déjà faits par l'équipe : rien à stocker,
   et une correction d'un lancer ancien reste juste. L'élimination, elle,
   frappe l'équipe — le décompte des ratés la suit, comme son score. */
function mThrowsBy(p, jusqua){
  var n=0, fin=(jusqua===undefined) ? M.throws.length : jusqua;
  for(var k=0;k<fin;k++) if(M.throws[k].p===p) n++;
  return n;
}
function mMemberAt(p, rang){
  var pl=M.players[p];
  if(M.mode!=="team" || !pl || !pl.mates || !pl.mates.length) return null;
  return pl.mates[rang % pl.mates.length];
}

/* Le joueur suivant encore en lice après `from`. */
function mNext(from){
  var n=M.players.length;
  for(var k=1;k<=n;k++){
    var i=(from+k+n)%n;
    if(!M.out[i]) return i;
  }
  return -1;
}

/* Tout se déduit de l'historique : corriger un lancer d'il y a dix
   tours reste exact, dépassements et éliminations compris. */
function mRecompute(){
  var n=M.players.length, i;
  M.score=[]; M.miss=[]; M.out=[];
  for(i=0;i<n;i++){ M.score[i]=0; M.miss[i]=0; M.out[i]=false; }
  M.over=false; M.winner=-1; M.reset=-1;

  for(var k=0;k<M.throws.length;k++){
    if(M.over) break;
    var th=M.throws[k], pl=th.p, v=th.v;
    if(pl<0 || pl>=n) continue;
    var dernier = (k===M.throws.length-1);
    if(dernier) M.reset=-1;
    if(v>0){
      M.miss[pl]=0;
      M.score[pl]+=v;
      if(M.score[pl]>M.target){
        M.score[pl]=MK_BACK;
        if(dernier) M.reset=pl;      /* on ne le signale que sur le coup */
      }
      if(M.score[pl]===M.target){ M.over=true; M.winner=pl; }
    }else{
      M.miss[pl]++;
      if(M.miss[pl]>=MK_OUT) M.out[pl]=true;
    }
  }

  /* dernier joueur en lice : il l'emporte sans avoir à atteindre 50 */
  if(!M.over && n>1){
    var vivants=[];
    for(i=0;i<n;i++) if(!M.out[i]) vivants.push(i);
    if(vivants.length<=1){
      M.over=true;
      M.winner = vivants.length ? vivants[0] : -1;
    }
  }

  M.turn = M.over ? -1 : mNext(M.throws.length ? M.throws[M.throws.length-1].p : -1);
}

function mThrow(v){
  if(!M || M.over || M.turn<0) return;
  M.throws.push({p:M.turn, v:v});
  mRecompute();
  buzz(v>0 ? 14 : 8);
  if(M.over){ mArchive(); renderMGame(); setTimeout(renderMOver, 620); }
  else renderMGame();
  save();
}

function mUndo(){
  if(!M || !M.throws.length) return;
  M.throws.pop();
  mAfterChange();
}

function mAfterChange(){
  mRecompute();
  buzz(10);
  apresUnCoup(M.over, {
    fermerFeuille:mCloseSheet, archiver:mArchive, peindre:renderMGame, peindreFin:renderMOver, delai:380,
    feuille:"mkSheetWrap", peindreFeuille:renderMSheet
  });
}

/* L'ordre de jeu se tire au sort avant le premier lancer, une seule fois ;
   en équipes, ce sont les équipes qui sont tirées. */
function mTirer(){
  if(!M || M.tire || M.throws.length || M.over) return;
  tirerOrdre(M.players, function(ordre){
    M.players=ordre;
    M.tire=true;
    mRecompute();
    save();
    renderMGame();
  });
}

/* --- rendu de la partie ------------------------------------------ */
function buildMPad(){
  var host=$("mkPad");
  host.innerHTML="";
  for(var v=1;v<=12;v++){
    (function(v){
      var b=el("button","mk-key",String(v));
      b.type="button";
      b.addEventListener("click",function(){ mThrow(v); });
      host.appendChild(b);
    })(v);
  }
}

function renderMGame(){
  if(!M) return;
  if(!$("mkPad").children.length) buildMPad();

  var actif=M.turn;
  var nom = actif>=0 ? M.players[actif].label : "";
  var membre = actif>=0 ? mMemberAt(actif, mThrowsBy(actif)) : null;
  $("mkTurn").textContent = actif<0
    ? tf("mk.done",{n:M.throws.length})
    : (membre ? tf("mk.turn.team",{team:nom, name:membre}) : tf("mk.turn",{name:nom}));
  $("mkTargetLabel").textContent = t("game.target")+" "+M.target;
  /* l'ordre de jeu se tire au sort avant le premier lancer, une seule fois */
  var tirable = !M.over && !M.tire && !M.throws.length && M.players.length>1;
  $("mkTirer").hidden = !tirable;
  $("mkTargetLabel").hidden = tirable;

  mPeindreListe(actif, membre);

  var off = M.over || actif<0;
  var keys=$("mkPad").children;
  for(var k=0;k<keys.length;k++){
    keys[k].disabled=off;
    keys[k].setAttribute("aria-label", tf(k>0 ? "mk.throw.aria_p" : "mk.throw.aria",{name:membre||nom, n:k+1}));
  }
  var lst=$("mkList");
  lst.classList.remove("centre");
  if(lst.scrollHeight<=lst.clientHeight) lst.classList.add("centre");

  var mb=$("mkMissBtn");
  mb.disabled=off;
  mb.setAttribute("aria-label", tf("mk.miss.aria",{name:membre||nom}));
  $("mkUndo").disabled = !M.throws.length;

  mkVu=M.score.slice();
  mkVuLancers=M.throws.length;
}

/* --- la scène : chacun à sa place, celui qui lance en avant ------- */
/* Ce que l'écran a déjà montré : les pistes s'animent depuis l'ancien
   score, et seul le joueur qui vient de lancer s'éclaire. */
var mkVu=[], mkVuLancers=0;

function mDernier(i){
  for(var k=M.throws.length-1;k>=0;k--) if(M.throws[k].p===i) return M.throws[k].v;
  return null;
}
/* le dernier lancer d'un joueur en une étiquette : +7, raté, ou le retour à 25 */
function mEtiquette(i){
  var v=mDernier(i);
  if(v===null) return null;
  if(M.reset===i){
    var b=el("span","last back","↺ 25");
    b.title=t("mk.back25");
    b.setAttribute("aria-label",t("mk.back25"));
    return b;
  }
  return el("span","last"+(v ? "" : " rate"), v ? "+"+v : t("mk.miss"));
}
/* ce qu'il manque pour 50 ; dès qu'une quille suffit, laquelle */
function mIdee(reste){
  if(reste>12) return tf("mk.encore",{n:Math.ceil(reste/12)});
  return reste===1 ? t("mk.idee.1") : tf("mk.idee",{n:reste});
}
/* la piste vers 50, marquée à 25, là où ramène un dépassement */
function mPiste(i, grande){
  var p=el("div","mk-piste"+(grande ? " grande" : ""));
  var f=el("i","fill");
  var de = mkVu[i]!==undefined ? mkVu[i] : M.score[i];
  f.style.setProperty("--de",(de/M.target*100)+"%");
  f.style.width=(M.score[i]/M.target*100)+"%";
  p.appendChild(f);
  p.appendChild(el("b","mi"));
  return p;
}
/* les trois ratés éliminatoires, en trois petites quilles qui rougissent */
function mQuilles(i){
  var q=el("div","mk-quilles");
  q.setAttribute("aria-label",tn("mk.misses",M.miss[i]));
  for(var d=0;d<MK_OUT;d++) q.appendChild(el("i", d<M.miss[i] ? "f" : null));
  return q;
}

/* La carte de celui qui lance : son score en grand, ce qu'il lui manque,
   et la quille qui suffit quand il est tout près. */
function mCarte(i, membre){
  var pl=M.players[i];
  var h=el("div","mk-hero");
  h.style.setProperty("--c",pl.hex);

  var haut=el("div","hero-haut"), qui=el("div","qui");
  qui.appendChild(el("i","dot"));
  qui.appendChild(el("span","nom",pl.label));
  if(membre) qui.appendChild(el("span","mate",membre));
  haut.appendChild(qui);
  if(!M.over) haut.appendChild(mQuilles(i));
  h.appendChild(haut);

  var mil=el("div","hero-mil");
  mil.appendChild(el("span","hero-sc num",String(M.score[i])));
  if(!M.over){
    var reste=M.target-M.score[i], info=el("div","hero-info");
    info.appendChild(el("p","reste",tf("mk.left",{n:reste})));
    info.appendChild(el("p","idee",mIdee(reste)));
    mil.appendChild(info);
  }
  h.appendChild(mil);
  h.appendChild(mPiste(i,true));
  return h;
}

/* Chacun garde sa place, dans l'ordre de la partie : seul celui qui lance
   s'agrandit en carte, et le suivant est signalé. Déplacer les joueurs à
   chaque lancer brouillait la lecture. */
function mPeindreListe(actif, membre){
  var host=$("mkList");
  host.innerHTML="";
  var vedette = actif>=0 ? actif : M.winner;
  var suivant = (actif>=0 && !M.over) ? mNext(actif) : -1;
  var lanceur = M.throws.length ? M.throws[M.throws.length-1].p : -1;
  var neuf = M.throws.length>mkVuLancers;

  M.players.forEach(function(pl,i){
    if(i===vedette){ host.appendChild(mCarte(i, actif>=0 ? membre : null)); return; }
    var row=el("div","mk-ligne"+(M.out[i] ? " out" : "")+(neuf && i===lanceur ? " vient" : "")+(M.reset===i ? " retour" : ""));
    row.style.setProperty("--c",pl.hex);
    row.appendChild(el("i","dot"));
    var col=el("div","col"), l1=el("div","l1");
    l1.appendChild(el("span","who",pl.label));
    if(i===suivant) l1.appendChild(el("span","suite",t("mk.next")));
    col.appendChild(l1);
    col.appendChild(mPiste(i,false));
    row.appendChild(col);
    if(M.out[i]){
      row.appendChild(el("span","tag",t("mk.out")));
    }else{
      var et=mEtiquette(i);
      if(et) row.appendChild(et);
      row.appendChild(mQuilles(i));
    }
    row.appendChild(el("span","sc num",String(M.score[i])));
    host.appendChild(row);
  });

  /* à huit, la liste défile : la carte de celui qui lance reste en vue */
  var carte=host.querySelector(".mk-hero");
  if(carte && host.scrollHeight>host.clientHeight) carte.scrollIntoView({block:"nearest"});
}

/* --- le placement des quilles ------------------------------------ */
function buildMLayout(host){
  host.innerHTML="";
  var R=25, JEU=5, PAS=2*R+JEU;
  var W=4*PAS+16, H=MK_FORM.length*PAS+56;

  var svg=document.createElementNS(SVGNS,"svg");
  svg.setAttribute("viewBox","0 0 "+W+" "+H);
  svg.setAttribute("class","mk-form");
  svg.setAttribute("role","img");
  svg.setAttribute("aria-label",t("mk.layout"));

  MK_FORM.forEach(function(rang,r){
    var y=8+R+r*PAS;
    var x0=(W-(rang.length*PAS-JEU))/2;
    rang.forEach(function(n,c){
      var cx=x0+R+c*PAS;
      var q=document.createElementNS(SVGNS,"circle");
      q.setAttribute("cx",cx); q.setAttribute("cy",y); q.setAttribute("r",R);
      q.setAttribute("stroke-width","1.4");
      q.setAttribute("class","pin");
      svg.appendChild(q);
      var tx=document.createElementNS(SVGNS,"text");
      tx.setAttribute("x",cx); tx.setAttribute("y",y);
      tx.setAttribute("class","num");
      tx.textContent=String(n);
      svg.appendChild(tx);
    });
  });

  /* la ligne de lancer, face au 1 et au 2 */
  var ly=8+MK_FORM.length*PAS+14;
  var ln=document.createElementNS(SVGNS,"line");
  ln.setAttribute("x1",12); ln.setAttribute("x2",W-12);
  ln.setAttribute("y1",ly); ln.setAttribute("y2",ly);
  ln.setAttribute("stroke-width","1.6");
  ln.setAttribute("class","line");
  svg.appendChild(ln);
  var lab=document.createElementNS(SVGNS,"text");
  lab.setAttribute("x",W/2); lab.setAttribute("y",ly+20);
  lab.setAttribute("class","lab");
  lab.textContent=t("mk.thrower");
  svg.appendChild(lab);

  host.appendChild(svg);

  var d=el("div","mk-dist");
  d.appendChild(el("b",null,t("mrules.5b")));
  host.appendChild(d);
  host.appendChild(el("p","hint",t("mk.layout.hint")));
}

function mOpenLayout(){ buildMLayout($("mkLayoutBody")); $("mkLayoutWrap").classList.add("on"); }
function mCloseLayout(){ $("mkLayoutWrap").classList.remove("on"); }

/* --- feuille de match -------------------------------------------- */
var MEDIT=null;

function renderMSheet(){
  var body=$("mkSheetBody");
  body.innerHTML="";
  $("mkEdSave").hidden = !MEDIT;
  $("mkEdDel").hidden  = !MEDIT;
  $("mkUndo").hidden   = !!MEDIT;
  $("mkQuit").hidden   = !!MEDIT;
  if(MEDIT){ renderMEditor(body); return; }

  if(!M.throws.length){
    body.appendChild(el("p","empty",t("mk.sheet.empty")));
    $("mkUndo").disabled=true;
    return;
  }

  var table=el("table","log");
  var thead=el("thead"), tr=el("tr");
  tr.appendChild(el("th",null,"#"));
  tr.appendChild(el("th",null,t("mk.players")));
  tr.appendChild(el("th",null,t("over.points")));
  thead.appendChild(tr);
  table.appendChild(thead);

  var tbody=el("tbody");
  var compte={};
  M.throws.forEach(function(th,idx){
    var rang = compte[th.p]||0;
    compte[th.p] = rang+1;
    var membre = mMemberAt(th.p, rang);

    var row=el("tr");
    row.appendChild(el("td",null,String(idx+1).padStart(2,"0")));

    var td=el("td");
    var etiq = (M.players[th.p] ? M.players[th.p].label : "?") + (membre ? " · "+membre : "");
    var w=el("span","pt", etiq);
    if(M.players[th.p]) w.style.color=teamInk(M.players[th.p].hex);
    td.appendChild(w);
    row.appendChild(td);

    var tv=el("td");
    tv.appendChild(el("span", th.v ? "pt" : "pt zero", th.v ? "+"+th.v : t("mk.miss")));
    row.appendChild(tv);

    row.setAttribute("role","button");
    row.tabIndex=0;
    row.setAttribute("aria-label",tf("mk.fix.aria",{n:idx+1}));
    row.addEventListener("click",function(){ mOpenEditor(idx); });
    row.addEventListener("keydown",function(ev){
      if(ev.key==="Enter"||ev.key===" "){ ev.preventDefault(); mOpenEditor(idx); }
    });
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  body.appendChild(table);
  body.appendChild(el("p","hint",t("mk.sheet.hint")));
  $("mkUndo").disabled=false;
}

function mOpenEditor(idx){
  if(!M.throws[idx]) return;
  MEDIT={idx:idx, v:M.throws[idx].v};
  renderMSheet();
}
function mCloseEditor(){ MEDIT=null; renderMSheet(); }

function renderMEditor(body){
  var th=M.throws[MEDIT.idx];
  var head=el("div","ed-head");
  head.appendChild(el("p","eyebrow",tf("mk.edit.title",{n:String(MEDIT.idx+1).padStart(2,"0")})));
  var back=el("button","ed-back",t("edit.cancel"));
  back.type="button";
  back.addEventListener("click",mCloseEditor);
  head.appendChild(back);
  body.appendChild(head);

  if(M.players[th.p]){
    var mbr=mMemberAt(th.p, mThrowsBy(th.p, MEDIT.idx));
    var qui=el("p","eyebrow",M.players[th.p].label + (mbr ? " · "+mbr : ""));
    qui.style.paddingBottom="8px";
    body.appendChild(qui);
  }

  var pad=el("div","mk-pad");
  for(var v=1;v<=12;v++){
    (function(v){
      var b=el("button","mk-key"+(MEDIT.v===v?" on":""),String(v));
      b.type="button";
      b.addEventListener("click",function(){ MEDIT.v=v; renderMSheet(); });
      pad.appendChild(b);
    })(v);
  }
  body.appendChild(pad);

  var miss=el("button","mk-miss"+(MEDIT.v===0?" on":""),t("mk.miss"));
  miss.type="button";
  miss.addEventListener("click",function(){ MEDIT.v=0; renderMSheet(); });
  body.appendChild(miss);
}

function mOpenSheet(){
  MEDIT=null;
  renderMSheet();
  mArmQuit(false);
  $("mkSheetWrap").classList.add("on");
}
function mCloseSheet(){
  $("mkSheetWrap").classList.remove("on");
  MEDIT=null;
}
function mArmQuit(on){
  var b=$("mkQuit");
  b.dataset.armed = on ? "1" : "0";
  b.textContent = on ? t("sheet.quit.confirm") : t("sheet.quit");
}

/* --- archivage et fin de partie ---------------------------------- */
function mArchive(){
  if(!M || M.archived || M.winner<0) return;
  H.unshift({
    d:Date.now(), g:"molkky",
    n:M.players.map(function(pl){ return pl.label; }),
    p:M.players.map(function(x){ return x.ids||[]; }),
    c:M.players.map(function(pl){ return pl.hex; }),
    s:M.score.slice(),
    w:M.winner, r:M.throws.length, t:false
  });
  if(H.length>200) H.length=200;
  M.archived=true;
}

function mRank(){
  var w=M.winner;
  return M.players.map(function(pl,i){ return i; }).sort(function(a,b){
    if(a===w) return -1;
    if(b===w) return 1;
    if(M.out[a]!==M.out[b]) return M.out[a] ? 1 : -1;
    return M.score[b]-M.score[a];
  });
}

function renderMOver(){
  var box=$("over");
  box.innerHTML="";
  var w=M.winner;
  if(w>=0) box.style.setProperty("--team",M.players[w].hex);

  var head=el("div","over-head reveal");
  head.appendChild(el("p","eyebrow",tf("mk.done",{n:M.throws.length})));
  if(w>=0){
    head.appendChild(el("h2",null,tf("over.wins",{name:M.players[w].label})));
    var fin=el("div","final");
    fin.appendChild(el("span","a",String(M.score[w])));
    head.appendChild(fin);
  }
  box.appendChild(head);

  var card=el("div","tale reveal");
  card.style.animationDelay="80ms";
  var top=el("div","tale-top");
  top.appendChild(el("p","eyebrow",t("mk.rank")));
  top.appendChild(el("p","eyebrow",tf("over.goal",{n:M.target})));
  card.appendChild(top);

  mRank().forEach(function(i,rang){
    var row=el("div","mk-row"+(M.out[i]?" out":""));
    row.style.setProperty("--c",M.players[i].hex);
    row.style.marginTop="7px";
    row.appendChild(el("i","dot"));
    row.appendChild(el("span","who",(rang+1)+". "+M.players[i].label));
    if(M.out[i]) row.appendChild(el("span","tag",t("mk.out")));
    row.appendChild(el("div","sc num",String(M.score[i])));
    card.appendChild(row);
  });
  box.appendChild(card);

  var acts=el("div","over-acts reveal");
  acts.style.animationDelay="160ms";

  var share=el("button","share-btn",t("share.result"));
  share.type="button";
  share.addEventListener("click",mShare);
  acts.appendChild(share);

  var again=el("button","cta",t("over.rematch"));
  again.type="button";
  again.addEventListener("click",function(){ mNewGame(); });
  acts.appendChild(again);

  var back=el("button","cta ghost",t("over.newsetup"));
  back.type="button";
  back.addEventListener("click",function(){ M=null; save(); show("msetup"); renderMSetup(); });
  acts.appendChild(back);

  box.appendChild(acts);
  show("over");
  buzz([14,60,26]);
}

function mShare(){
  if(!M || M.winner<0) return;
  var lignes=[t("molkky.name")+" · "+tf("over.goal",{n:M.target})];
  mRank().forEach(function(i,rang){
    lignes.push((rang+1)+". "+M.players[i].label+" — "+M.score[i]+(M.out[i] ? " ("+t("mk.out")+")" : ""));
  });
  lignes.push("ScoreToss");
  shareText(lignes.join("\n"));
}

/* --- commandes -------------------------------------------------- */
$("mkToGames").addEventListener("click",retourAuxJeux);
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
$("mkTirer").addEventListener("click",mTirer);
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
$("mkHall").addEventListener("click",function(){ HALL_BACK="msetup"; renderHall(); show("hall"); });

/* --- état enregistré -------------------------------------------- */
/* Normalisation de ce que le démarrage et l'import relisent. Elle vivait
   en double, et les copies avaient divergé : importer une sauvegarde
   d'avant le mölkky en équipes laissait le nombre de joueurs par équipe
   vide, et ses boutons sans effet. */
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
  m.tire=!!m.tire;
  return m;
}

/* --- fiche de règles -------------------------------------------- */
function fillMolkkyRules(host){
  blocBareme(host, t("mrules.count"), [["1",t("mrules.one")],["2+",t("mrules.many")]]);
  blocDeroule(host, "mrules", 5);
}
