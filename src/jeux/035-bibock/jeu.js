/* Bibock.

   Deux équipes de 1 à 4 joueurs, huit Bocks à deux faces et un Maître.
   Seule l'équipe la plus proche du Maître marque : un point par Bock mieux
   placé que le meilleur adverse — un groupe compte en entier —, cinq par
   Bock à cheval sur le Maître. En fin de manche, chaque équipe récupère
   les Bocks de sa couleur, mangés compris : celle qui n'en a plus est
   éliminée. On gagne à 16 points, 9 en express, ou par élimination.
   Le règlement dit « mène » ; l'application dit manche, comme partout. */
declarerJeu({
  id:"bibock",
  famille:"tours",
  categorie:"exterieur",
  nom:function(){ return t("bi.name"); },
  regles:fillBibockRules,
  ecrans:["bsetup","bgame"],
  lienPalmares:"biHall",
  retour:{
    fiches:[["biSheetWrap","biSheetClose"]],
    ecrans:[["s-bsetup","biToGames"]]
  },

  auChangementDEcran:function(nom){
    if(nom!=="bgame") biFermerFeuille();
    if(nom==="bsetup") refreshHallLink();
  },
  sauver:function(o){ o.bs=BS; o.b=B; },
  charger:function(d){
    if(d && d.bs && d.bs.teams && d.bs.teams.length===2) BS=biNormBS(d.bs);
    if(d && d.b && d.b.teams && d.b.teams.length===2){ B=biNormB(d.b); BE=biRejouer(); }
    renderBSetup();
  },
  importer:function(d){
    BS = biNormBS((d.bs && d.bs.teams && d.bs.teams.length===2) ? d.bs : biReglagesVides());
    B  = (d.b && d.b.teams && d.b.teams.length===2) ? biNormB(d.b) : null;
    BE = B ? biRejouer() : null;
    renderBSetup();
  },
  reprendre:function(){
    if(!B || !BE || BE.gagnant>=0) return false;
    show("bgame");
    renderBGame();
    keepAwake();
    return true;
  },
  changementDeLangue:function(){
    renderBSetup();
    if(B && $("s-bgame").classList.contains("on")) renderBGame();
  },

  ouvrir:function(){
    if(!S.tgt) S.tgt=ciblesParDefaut();
    if(jeu(S.game).famille==="duel"){
      S.tgt[S.game]=S.target;
      TOUR[S.game]=T;
      DRAFT[S.game]=TS;
    }
    S.game="bibock";
    T=null;
    fillRules("rulesBody");
    save();
    show("bsetup");
    renderBSetup();
  }
});

var BI_BOCKS  = 8;     /* Bocks en jeu, les deux équipes ensemble */
var BI_DEPART = 4;     /* Bocks de chaque équipe au départ */
var BI_MAITRE = 5;     /* points d'un Bock à cheval sur le Maître */
var BI_CIBLES = [16, 9];
var BI_PER_MIN = 1;
var BI_PER_MAX = 4;

function biReglagesVides(){
  return { per:1, cible:16, open:-1, teams:[
    { name:"", color:"rouge", mates:["","","",""] },
    { name:"", color:"bleu",  mates:["","","",""] }
  ]};
}
var BS = biReglagesVides();
var B  = null;      /* la partie : ses équipes, ses manches, la saisie en cours */
var BE = null;      /* ce qui s'en déduit, recalculé à chaque changement */
var BEDIT = null;   /* la manche en cours de correction */

function biNom(i){
  var v=(BS.teams[i].name||"").trim();
  return v || t(BS.per>1 ? ["team.a","team.b"][i] : ["player.a","player.b"][i]);
}
function biCoequipier(i,j){
  var v=((BS.teams[i].mates||[])[j]||"").trim();
  return v || (t("team.player")+" "+(j+1));
}

/* --- calcul ------------------------------------------------------ */
function biSaisieVide(){ return { pp:[0,0], pm:[0,0], bocks:null }; }
/* ce que rapporte une manche : un point par Bock proche, cinq par Bock
   sur le Maître ; une seule équipe marque */
function biGain(m){ return [m.pp[0]+BI_MAITRE*m.pm[0], m.pp[1]+BI_MAITRE*m.pm[1]]; }

/* Tout se déduit des manches jouées : corriger une manche ancienne
   recalcule les scores, les Bocks et le vainqueur. */
function biRejouer(){
  var e={ scores:[0,0], bocks:[BI_DEPART,BI_DEPART], gagnant:-1, elimination:false,
          gagnees:[0,0], maitre:[0,0], meilleure:[0,0], cumuls:[], fin:-1 };
  for(var k=0;k<B.manches.length;k++){
    var m=B.manches[k], g=biGain(m);
    for(var i=0;i<2;i++){
      e.scores[i]+=g[i];
      e.maitre[i]+=m.pm[i];
      if(g[i]>0){ e.gagnees[i]++; if(g[i]>e.meilleure[i]) e.meilleure[i]=g[i]; }
    }
    e.bocks=m.b.slice();
    e.cumuls.push(e.scores.slice());
    if(e.scores[0]>=B.cible || e.scores[1]>=B.cible){
      e.gagnant = e.scores[0]>=B.cible ? 0 : 1;
      e.fin=k;
      break;
    }
    /* une équipe sans Bock est éliminée */
    if(!e.bocks[0] !== !e.bocks[1]){
      e.gagnant = e.bocks[0] ? 0 : 1;
      e.elimination=true;
      e.fin=k;
      break;
    }
  }
  e.manche = B.manches.length+1;
  e.main = biQuiCommence(e);
  return e;
}

/* Commence l'équipe qui a le plus de Bocks, puis celle qui a le plus de
   points ; à égalité parfaite — toujours le cas à la première manche —,
   un tirage au sort décide. -1 tant qu'il n'a pas eu lieu. */
function biQuiCommence(e){
  var k=B.manches.length, tire=B.departs[k];
  if(tire===0 || tire===1) return tire;
  if(e.bocks[0]!==e.bocks[1]) return e.bocks[0]>e.bocks[1] ? 0 : 1;
  if(e.scores[0]!==e.scores[1]) return e.scores[0]>e.scores[1] ? 0 : 1;
  return -1;
}

/* Saisir pour une équipe remet l'autre à zéro : une seule marque. Les
   Bocks proches et sur le Maître ne dépassent pas les huit en jeu. */
function biAjuster(s, i, type, d){
  var v=s[type][i]+d;
  if(v<0 || s.pp[i]+s.pm[i]+d>BI_BOCKS) return false;
  s[type][i]=v;
  if(d>0){ s.pp[1-i]=0; s.pm[1-i]=0; }
  return true;
}
/* Les Bocks récupérés : les neutres restent sur le terrain, le total ne
   dépasse donc jamais huit, mais peut rester en dessous. */
function biAjusterBocks(b, i, d){
  var v=b[i]+d;
  if(v<0 || b[0]+b[1]+d>BI_BOCKS) return false;
  b[i]=v;
  return true;
}

/* --- préparation ------------------------------------------------- */
function renderBSetup(){
  $("biVal").textContent=BS.per;
  $("biNote").textContent=tf("bi.note",{n:BS.per});
  $("biPerMinus").disabled = BS.per<=BI_PER_MIN;
  $("biPerPlus").disabled  = BS.per>=BI_PER_MAX;
  fillChips($("biCible"), BI_CIBLES, BS.cible, "cible");
  renderBRows();
}

function renderBRows(){
  var host=$("biRows");
  host.innerHTML="";
  var eq = BS.per>1;
  for(var k=0;k<2;k++){
    (function(k){
      var tm=BS.teams[k];
      var row=el("div","trow");
      row.appendChild(el("span","seed",String(k+1).padStart(2,"0")));

      var pick=el("button","pick");
      pick.type="button";
      pick.style.setProperty("--c",color(tm.color).hex);
      pick.setAttribute("aria-label",tf("bi.color.aria",{n:k+1}));
      pick.setAttribute("aria-expanded", BS.open===k ? "true":"false");
      pick.appendChild(el("i"));
      pick.addEventListener("click",function(){
        BS.open = BS.open===k ? -1 : k;
        renderBRows();
      });
      row.appendChild(pick);

      var name=el("input","field-input");
      name.type="text";
      name.value=tm.name;
      name.maxLength=22;
      name.placeholder=t(eq ? ["team.a","team.b"][k] : ["player.a","player.b"][k]);
      name.setAttribute("aria-label",tf("bi.team.aria",{n:k+1}));
      name.addEventListener("input",function(){ tm.name=name.value; save(); });
      row.appendChild(name);
      host.appendChild(row);

      if(eq){
        var mates=el("div","mates bi-mates");
        for(var j=0;j<BS.per;j++){
          (function(j){
            var mi=el("input","field-input");
            mi.type="text";
            mi.value=tm.mates[j]||"";
            mi.maxLength=16;
            mi.placeholder=t("team.player")+" "+(j+1);
            mi.setAttribute("aria-label",tf("bi.mate.aria",{j:j+1, n:k+1}));
            mi.addEventListener("input",function(){ tm.mates[j]=mi.value; save(); });
            mates.appendChild(mi);
          })(j);
        }
        host.appendChild(mates);
      }

      var sw=el("div","trow-sw swatches");
      sw.hidden = BS.open!==k;
      COLORS.forEach(function(col){
        var b=el("button","sw");
        b.type="button";
        b.style.setProperty("--c",col.hex);
        b.setAttribute("aria-pressed", col.id===tm.color ? "true":"false");
        b.setAttribute("aria-label",t("color.aria")+" "+t("color."+col.id));
        b.addEventListener("click",function(){
          tm.color=col.id; BS.open=-1;
          renderBRows(); save();
        });
        sw.appendChild(b);
      });
      host.appendChild(sw);
    })(k);
  }
}

function biNouvellePartie(){
  B={ cible:BS.cible, per:BS.per, teams:[], manches:[], saisie:biSaisieVide(), departs:{} };
  for(var i=0;i<2;i++){
    var mates=[];
    if(BS.per>1){ for(var j=0;j<BS.per;j++) mates.push(biCoequipier(i,j)); }
    B.teams.push({ label:biNom(i), hex:color(BS.teams[i].color).hex, mates:mates });
  }
  BE=biRejouer();
  BEDIT=null;
  show("bgame");
  renderBGame();
  save();
  keepAwake();
}

/* --- une réglette ------------------------------------------------ */
function biReglette(hex, v, moinsOff, plusOff, moins, plus, ariaMoins, ariaPlus){
  var st=el("div","step");
  st.style.setProperty("--team",hex);
  var a=el("button",null,"−");
  a.type="button";
  a.disabled=moinsOff;
  a.setAttribute("aria-label",ariaMoins);
  a.addEventListener("click",moins);
  var b=el("button",null,"+");
  b.type="button";
  b.disabled=plusOff;
  b.setAttribute("aria-label",ariaPlus);
  b.addEventListener("click",plus);
  st.appendChild(a);
  st.appendChild(el("div","v"+(v>0 ? " hot" : ""),String(v)));
  st.appendChild(b);
  return st;
}

/* Les deux lignes de points, une par équipe, et les Bocks récupérés :
   la console de la partie et l'éditeur de la feuille partagent ce rendu. */
function biPeindreSaisie(hotePoints, hoteBocks, s, bocks, apres){
  hotePoints.innerHTML="";
  B.teams.forEach(function(tm,i){
    var row=el("div","crow");
    var who=el("div","who"), dot=el("i","dot");
    dot.style.background=tm.hex;
    who.appendChild(dot);
    who.appendChild(el("span",null,tm.label));
    row.appendChild(who);
    ["pp","pm"].forEach(function(type){
      row.appendChild(biReglette(tm.hex, s[type][i],
        s[type][i]<=0, s.pp[i]+s.pm[i]>=BI_BOCKS,
        function(){ if(biAjuster(s,i,type,-1)) apres(6); },
        function(){ if(biAjuster(s,i,type,1)) apres(10); },
        tf("bi.rm."+type,{name:tm.label}), tf("bi.add."+type,{name:tm.label})));
    });
    hotePoints.appendChild(row);
  });

  hoteBocks.innerHTML="";
  B.teams.forEach(function(tm,i){
    var col=el("div","bi-rec-col");
    var who=el("div","who"), dot=el("i","dot");
    dot.style.background=tm.hex;
    who.appendChild(dot);
    who.appendChild(el("span",null,tm.label));
    col.appendChild(who);
    col.appendChild(biReglette(tm.hex, bocks[i],
      bocks[i]<=0, bocks[0]+bocks[1]>=BI_BOCKS,
      function(){ if(biAjusterBocks(bocks,i,-1)) apres(6); },
      function(){ if(biAjusterBocks(bocks,i,1)) apres(10); },
      tf("bi.rm.bk",{name:tm.label}), tf("bi.add.bk",{name:tm.label})));
    hoteBocks.appendChild(col);
  });
}

/* ce que la saisie rapporterait, écrit en toutes lettres */
function biAnnonce(hote, s){
  var g=biGain(s), w = g[0]>0 ? 0 : (g[1]>0 ? 1 : -1);
  hote.innerHTML="";
  if(w<0){ hote.textContent=t("game.void"); return; }
  var parts=tf(g[w]>1 ? "game.scores_p" : "game.scores",{name:" ", n:g[w]}).split(" ");
  hote.appendChild(document.createTextNode(parts[0]||""));
  hote.appendChild(el("b",null,B.teams[w].label));
  hote.appendChild(document.createTextNode(parts[1]||""));
}

/* --- la partie --------------------------------------------------- */
function renderBGame(){
  if(!B) return;
  if(!BE) BE=biRejouer();
  var e=BE, fini=e.gagnant>=0;

  $("biMancheLabel").textContent = fini ? t("bi.done") : t("game.frame")+" "+e.manche;
  $("biCibleLabel").textContent = t("game.target")+" "+B.cible;
  /* à égalité de Bocks et de points, un tirage décide qui commence */
  var tirable = !fini && e.main<0;
  $("biTirer").hidden = !tirable;
  $("biCibleLabel").hidden = tirable;

  var host=$("biFields");
  host.innerHTML="";
  B.teams.forEach(function(tm,i){
    var f=el("div","tfield"+(e.scores[i]>e.scores[1-i] ? " lead" : ""));
    f.style.setProperty("--team",tm.hex);
    var sc=el("div","t-score"), id=el("div","t-id");
    var nm=el("div","t-name");
    nm.appendChild(el("i","dot"));
    nm.appendChild(el("span",null,tm.label));
    id.appendChild(nm);
    id.appendChild(el("div","t-mates",tm.mates.join(" · ")));
    var stock=el("div","bi-stock");
    stock.setAttribute("aria-label",tn("bi.bocks",e.bocks[i]));
    for(var n=0;n<e.bocks[i];n++) stock.appendChild(el("i"));
    stock.appendChild(el("span",null,tn("bi.bocks",e.bocks[i])));
    id.appendChild(stock);
    if(e.main===i && !fini){
      var h=el("div","t-honor");
      h.appendChild(el("span","honor",t("game.first")));
      id.appendChild(h);
    }
    sc.appendChild(id);
    sc.appendChild(el("span","t-num num",String(e.scores[i])));
    f.appendChild(sc);
    host.appendChild(f);
  });

  var s=B.saisie;
  var bocks = s.bocks || e.bocks.slice();
  biPeindreSaisie($("biPoints"), $("biRec"), s, bocks, function(vib){
    if(!s.bocks) s.bocks=bocks;
    buzz(vib);
    save();
    renderBGame();
  });
  biAnnonce($("biOutcome"), s);
  $("biValider").disabled = fini;
}

function biValider(){
  if(!B || !BE || BE.gagnant>=0) return;
  var s=B.saisie;
  B.manches.push({ pp:s.pp.slice(), pm:s.pm.slice(), b:(s.bocks || BE.bocks).slice() });
  B.saisie=biSaisieVide();
  var g=biGain(B.manches[B.manches.length-1]);
  biApresChangement((g[0]||g[1]) ? 14 : [12,40,12]);
}

function biApresChangement(vibration){
  var avant = BE ? BE.gagnant : -1;
  BE=biRejouer();
  buzz(vibration);
  /* l'archivage précède la sauvegarde : fermer l'app sur l'écran de fin
     ne doit pas faire perdre la partie au palmarès */
  if(BE.gagnant>=0 && avant<0){
    biFermerFeuille();
    biArchiver();
    save();
    renderBGame();
    setTimeout(renderBOver, 620);
  }else{
    save();
    renderBGame();
    if($("biSheetWrap").classList.contains("on")) renderBSheet();
  }
}

/* Le tirage de la première manche, ou d'une égalité parfaite. */
function biTirer(){
  if(!B || !BE || BE.gagnant>=0 || BE.main>=0) return;
  tirerOrdre(B.teams, function(ordre){
    B.departs[B.manches.length]=B.teams.indexOf(ordre[0]);
    BE=biRejouer();
    save();
    renderBGame();
  });
}

/* --- feuille de match -------------------------------------------- */
function renderBSheet(){
  var body=$("biSheetBody");
  body.innerHTML="";
  $("biEdSave").hidden = !BEDIT;
  $("biEdDel").hidden  = !BEDIT;
  $("biUndo").hidden   = !!BEDIT;
  $("biQuit").hidden   = !!BEDIT;
  if(BEDIT){ renderBEditeur(body); return; }
  $("biUndo").disabled = !B.manches.length || BE.gagnant>=0;

  if(!B.manches.length){
    body.appendChild(el("p","empty",t("sheet.empty")));
    return;
  }
  var table=el("table","log");
  var thead=el("thead"), htr=el("tr");
  htr.appendChild(el("th",null,t("sheet.frame")));
  B.teams.forEach(function(tm){ htr.appendChild(el("th",null,tm.label)); });
  htr.appendChild(el("th",null,t("bi.col.bocks")));
  thead.appendChild(htr);
  table.appendChild(thead);

  var tbody=el("tbody");
  B.manches.forEach(function(m,k){
    var g=biGain(m), cumul=BE.cumuls[k];
    var tr=el("tr");
    tr.setAttribute("aria-label",tf("sheet.fix.aria",{n:k+1}));
    tr.appendChild(el("td",null,String(k+1).padStart(2,"0")));
    for(var i=0;i<2;i++){
      var td=el("td");
      td.appendChild(el("span","pt"+(g[i] ? "" : " zero"), g[i] ? "+"+g[i] : "0"));
      if(cumul) td.appendChild(el("span","run",String(cumul[i])));
      tr.appendChild(td);
    }
    tr.appendChild(el("td",null,m.b[0]+"–"+m.b[1]));
    tr.addEventListener("click",function(){ biOuvrirEditeur(k); });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  body.appendChild(table);
  body.appendChild(el("p","hint",t("bi.sheet.hint")));
}

function biOuvrirEditeur(k){
  var m=B.manches[k];
  if(!m) return;
  BEDIT={ k:k, m:{ pp:m.pp.slice(), pm:m.pm.slice(), b:m.b.slice() } };
  renderBSheet();
}
function biFermerEditeur(){ BEDIT=null; renderBSheet(); }

function renderBEditeur(body){
  var head=el("div","ed-head");
  head.appendChild(el("p","eyebrow",tf("edit.title",{n:BEDIT.k+1})));
  var back=el("button","ed-back",t("edit.cancel"));
  back.type="button";
  back.addEventListener("click",biFermerEditeur);
  head.appendChild(back);
  body.appendChild(head);

  var tete=el("div","console-head");
  tete.appendChild(el("p","eyebrow",t("over.points")));
  tete.appendChild(el("p","eyebrow",t("bi.col.pp")));
  tete.appendChild(el("p","eyebrow",t("bi.col.pm")));
  body.appendChild(tete);
  var points=el("div","bi-rows"), rec=el("div","bi-rec");
  body.appendChild(points);
  body.appendChild(el("p","eyebrow bi-rec-titre",t("bi.rec")));
  body.appendChild(rec);
  biPeindreSaisie(points, rec, BEDIT.m, BEDIT.m.b, function(vib){ buzz(vib); renderBSheet(); });
  var out=el("p","outcome ed-out");
  biAnnonce(out, BEDIT.m);
  body.appendChild(out);
}

function biOuvrirFeuille(){
  BEDIT=null;
  renderBSheet();
  biArmerQuitter(false);
  $("biSheetWrap").classList.add("on");
}
function biFermerFeuille(){
  $("biSheetWrap").classList.remove("on");
  BEDIT=null;
}
function biArmerQuitter(on){
  var b=$("biQuit");
  b.dataset.armed = on ? "1" : "0";
  b.textContent = on ? t("sheet.quit.confirm") : t("sheet.quit");
}

/* --- archivage et fin de partie ---------------------------------- */
function biArchiver(){
  if(!B || B.archived || !BE || BE.gagnant<0) return;
  H.unshift({
    d:Date.now(), g:"bibock",
    n:B.teams.map(function(tm){ return tm.label; }),
    c:B.teams.map(function(tm){ return tm.hex; }),
    s:BE.scores.slice(), w:BE.gagnant, r:BE.fin+1, t:false
  });
  if(H.length>200) H.length=200;
  B.archived=true;
}

function biQui(i, droite){
  var who=el("div","tale-who"+(droite ? " r" : "")), dot=el("i","dot");
  dot.style.background=B.teams[i].hex;
  who.appendChild(dot);
  who.appendChild(el("span",null,B.teams[i].label));
  return who;
}

function renderBOver(){
  if(!B || !BE || BE.gagnant<0) return;
  var e=BE, w=e.gagnant, l=1-w, box=$("over");
  box.innerHTML="";
  box.style.setProperty("--team",B.teams[w].hex);

  var head=el("div","over-head reveal");
  head.appendChild(el("p","eyebrow",tn("over.done",e.fin+1)));
  head.appendChild(el("h2",null,tf("over.wins",{name:B.teams[w].label})));
  var fin=el("div","final");
  fin.appendChild(el("span","a",String(e.scores[w])));
  fin.appendChild(el("span","s","–"));
  fin.appendChild(el("span","b",String(e.scores[l])));
  head.appendChild(fin);
  if(e.elimination) head.appendChild(el("p","note",tf("bi.elim.note",{name:B.teams[l].label})));
  box.appendChild(head);

  var card=el("div","tale reveal");
  card.style.animationDelay="80ms";
  var top=el("div","tale-top");
  top.appendChild(el("p","eyebrow",t("over.stats")));
  top.appendChild(el("p","eyebrow",tf("over.goal",{n:B.cible})));
  card.appendChild(top);
  var tete=el("div","tale-row head");
  tete.appendChild(biQui(w,false));
  tete.appendChild(el("span","tale-lab",""));
  tete.appendChild(biQui(l,true));
  card.appendChild(tete);
  function plus(v){ return v>0 ? "+"+v : "—"; }
  [
    [t("over.points"),     e.scores,    String],
    [t("over.won"),        e.gagnees,   String],
    [t("bi.stat.maitre"),  e.maitre,    String],
    [t("over.best"),       e.meilleure, plus],
    [t("bi.stat.bocks"),   e.bocks,     String]
  ].forEach(function(r){
    var row=el("div","tale-row");
    row.appendChild(el("span","tale-v"+(r[1][w] ? "" : " off"),r[2](r[1][w])));
    row.appendChild(el("span","tale-lab",r[0]));
    row.appendChild(el("span","tale-v b"+(r[1][l] ? "" : " off"),r[2](r[1][l])));
    card.appendChild(row);
  });
  box.appendChild(card);

  var acts=el("div","over-acts reveal");
  acts.style.animationDelay="160ms";
  var share=el("button","share-btn",t("share.result"));
  share.type="button";
  share.addEventListener("click",biPartager);
  acts.appendChild(share);
  var again=el("button","cta",t("over.rematch"));
  again.type="button";
  again.addEventListener("click",biNouvellePartie);
  acts.appendChild(again);
  var back=el("button","cta ghost",t("over.newsetup"));
  back.type="button";
  back.addEventListener("click",function(){ B=null; BE=null; save(); show("bsetup"); renderBSetup(); });
  acts.appendChild(back);
  box.appendChild(acts);

  show("over");
  buzz([14,60,26]);
}

function biPartager(){
  if(!B || !BE || BE.gagnant<0) return;
  var n=BE.fin+1;
  shareText(t("bi.name")+" · "+tf(n>1 ? "share.game_p" : "share.game",{
    a:B.teams[0].label, sa:BE.scores[0], sb:BE.scores[1], b:B.teams[1].label, n:n
  }));
}

/* --- état enregistré --------------------------------------------- */
function biNormBS(bs){
  bs.open=-1;
  if(!bs.per || bs.per<BI_PER_MIN || bs.per>BI_PER_MAX) bs.per=BI_PER_MIN;
  if(BI_CIBLES.indexOf(bs.cible)<0) bs.cible=BI_CIBLES[0];
  bs.teams.forEach(function(tm,i){
    if(typeof tm.name!=="string") tm.name="";
    if(!tm.color) tm.color = i ? "bleu" : "rouge";
    if(!tm.mates || tm.mates.length!==4) tm.mates=["","","",""];
  });
  return bs;
}
function biPaire(a){ return a && a.length===2 && a.every(function(v){ return typeof v==="number" && v>=0 && v<=BI_BOCKS; }); }
function biNormB(b){
  if(BI_CIBLES.indexOf(b.cible)<0) b.cible=BI_CIBLES[0];
  b.manches=(b.manches||[]).filter(function(m){ return m && biPaire(m.pp) && biPaire(m.pm) && biPaire(m.b); });
  var s=b.saisie;
  if(!s || !biPaire(s.pp) || !biPaire(s.pm) || (s.bocks && !biPaire(s.bocks))) b.saisie=biSaisieVide();
  if(!b.departs || typeof b.departs!=="object") b.departs={};
  b.teams.forEach(function(tm){ if(!tm.mates) tm.mates=[]; });
  return b;
}

/* --- commandes --------------------------------------------------- */
$("biToGames").addEventListener("click",retourAuxJeux);
$("biHall").addEventListener("click",function(){ HALL_BACK="bsetup"; renderHall(); show("hall"); });
$("biPerMinus").addEventListener("click",function(){
  if(BS.per>BI_PER_MIN){ BS.per--; BS.open=-1; renderBSetup(); save(); }
});
$("biPerPlus").addEventListener("click",function(){
  if(BS.per<BI_PER_MAX){ BS.per++; BS.open=-1; renderBSetup(); save(); }
});
$("biCible").addEventListener("click",function(e){
  var b=e.target.closest("button[data-cible]");
  if(!b) return;
  BS.cible=+b.dataset.cible;
  renderBSetup(); save();
});
$("biOpenRules").addEventListener("click",openRules);
$("biOpenAbout").addEventListener("click",openAbout);
$("biStart").addEventListener("click",biNouvellePartie);

$("biTirer").addEventListener("click",biTirer);
$("biValider").addEventListener("click",biValider);
$("biSheetBtn").addEventListener("click",biOuvrirFeuille);
$("biSheetClose").addEventListener("click",biFermerFeuille);
$("biScrim").addEventListener("click",biFermerFeuille);
$("biEdSave").addEventListener("click",function(){
  if(!BEDIT) return;
  B.manches[BEDIT.k]=BEDIT.m;
  BEDIT=null;
  biApresChangement(10);
});
$("biEdDel").addEventListener("click",function(){
  if(!BEDIT) return;
  var k=BEDIT.k;
  B.manches.splice(k,1);
  /* les tirages des manches suivantes n'ont plus de sens */
  Object.keys(B.departs).forEach(function(c){ if(+c>=k) delete B.departs[c]; });
  BEDIT=null;
  biApresChangement(10);
});
/* Annuler la dernière manche rend sa saisie : il ne reste qu'à la corriger. */
$("biUndo").addEventListener("click",function(){
  if(!B || !B.manches.length || (BE && BE.gagnant>=0)) return;
  var m=B.manches.pop();
  B.saisie={ pp:m.pp.slice(), pm:m.pm.slice(), bocks:m.b.slice() };
  biFermerFeuille();
  biApresChangement(10);
});
$("biQuit").addEventListener("click",function(){
  var b=$("biQuit");
  if(b.dataset.armed!=="1"){
    biArmerQuitter(true);
    setTimeout(function(){ if(b.dataset.armed==="1") biArmerQuitter(false); },4000);
    return;
  }
  biFermerFeuille();
  B=null;
  BE=null;
  buzz(12);
  save();
  show("bsetup");
  renderBSetup();
});

/* --- fiche de règles --------------------------------------------- */
function fillBibockRules(host){
  var comptage=el("div","block");
  comptage.appendChild(el("p","eyebrow",t("birules.count")));
  var pts=el("div","pts");
  [["1",t("birules.pt")],["5",t("birules.maitre")],["Σ",t("birules.groupe")]].forEach(function(r){
    var row=el("div","pt-row");
    row.appendChild(el("b",null,r[0]));
    row.appendChild(el("span",null,r[1]));
    pts.appendChild(row);
  });
  comptage.appendChild(pts);
  host.appendChild(comptage);

  var deroule=el("div","block");
  deroule.appendChild(el("p","eyebrow",t("birules.flow")));
  var list=el("ul","rulist");
  [1,2,3,4,5,6].forEach(function(k){
    var li=document.createElement("li");
    li.appendChild(document.createTextNode(t("birules."+k+"a")));
    li.appendChild(el("b",null,t("birules."+k+"b")));
    li.appendChild(document.createTextNode(t("birules."+k+"c")));
    list.appendChild(li);
  });
  deroule.appendChild(list);
  host.appendChild(deroule);
}
