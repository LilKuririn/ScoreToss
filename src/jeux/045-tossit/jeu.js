/* Tossit.

   Des fléchettes à ventouse sur une surface lisse. On lance d'abord la
   fléchette noire, le jack ; le plus proche du jack gagne la manche et
   marque un point par fléchette collée — les autres, rien. Des bonus
   récompensent les coups rares, dont deux qui changent tout : Sautez
   par-dessus remet les adversaires à zéro, le Jackover gagne la partie.
   Premier à 13. Seules les règles de base et les bonus sont suivis. */
declarerJeu({
  id:"tossit",
  famille:"tours",
  categorie:"interieur",
  nom:function(){ return t("ti.name"); },
  regles:fillTossitRules,
  ecrans:["isetup","igame"],
  lienPalmares:"tiHall",
  retour:{
    fiches:[["tiSheetWrap","tiSheetClose"]],
    ecrans:[["s-isetup","tiToGames"]]
  },

  auChangementDEcran:function(nom){
    if(nom!=="igame") tiFermerFeuille();
    if(nom==="isetup") refreshHallLink();
  },
  sauver:function(o){ o.is=TIS; o.i=TI; },
  charger:function(d){
    if(d && d.is && d.is.players && d.is.players.length===TI_MAX) TIS=tiNormIS(d.is);
    if(d && d.i && d.i.players && d.i.players.length>=TI_MIN){ TI=tiNormI(d.i); TIE=tiRejouer(); }
    renderISetup();
  },
  importer:function(d){
    TIS = tiNormIS((d.is && d.is.players && d.is.players.length===TI_MAX) ? d.is : {players:tiJoueursVides()});
    TI  = (d.i && d.i.players && d.i.players.length>=TI_MIN) ? tiNormI(d.i) : null;
    TIE = TI ? tiRejouer() : null;
    renderISetup();
  },
  reprendre:function(){
    if(!TI || !TIE || TIE.gagnant>=0) return false;
    show("igame");
    renderIGame();
    keepAwake();
    return true;
  },
  changementDeLangue:function(){
    renderISetup();
    if(TI && $("s-igame").classList.contains("on")) renderIGame();
  },

  ouvrir:function(){
    if(!S.tgt) S.tgt=ciblesParDefaut();
    if(jeu(S.game).famille==="duel"){
      S.tgt[S.game]=S.target;
      TOUR[S.game]=T;
      DRAFT[S.game]=TS;
    }
    S.game="tossit";
    T=null;
    fillRules("rulesBody");
    save();
    show("isetup");
    renderISetup();
  }
});

var TI_CIBLE = 13;
var TI_MIN = 2;
var TI_MAX = 8;
var TI_PER_MIN = 2;
var TI_PER_MAX = 4;
var TI_FLECHETTES = [3, 4, 5, 6];
var TI_TEINTES = ["rouge","bleu","vert","ambre","violet","sarcelle","rose","or"];
var TI_TYPES = ["gain","quake","jackoff","jack0"];

function tiJoueursVides(){
  var a=[];
  for(var i=0;i<TI_MAX;i++) a.push({name:"", color:TI_TEINTES[i], mates:["","","",""]});
  return a;
}
var TIS = { count:2, mode:"solo", per:2, darts:3, open:-1, players:tiJoueursVides() };
var TI  = null;      /* la partie : ses joueurs, ses manches, la saisie en cours */
var TIE = null;      /* ce qui s'en déduit, recalculé à chaque changement */
var TIEDIT = null;   /* la manche en cours de correction */

function tiNom(i){
  var v=(TIS.players[i].name||"").trim();
  return v || tf(TIS.mode==="team" ? "ti.teamn" : "ti.playern",{n:i+1});
}
function tiCoequipier(i,j){
  var v=((TIS.players[i].mates||[])[j]||"").trim();
  return v || (t("team.player")+" "+(j+1));
}

/* --- calcul ------------------------------------------------------ */
function tiSaisieVide(){
  return { type:"gain", j:-1, f:0, kiss:0, french:0, jackiss:0, saut:0, jackover:0, lancees:0 };
}
/* le nombre de fléchettes d'un joueur, ou d'une équipe entière */
function tiMax(){ return TI.darts*(TI.mode==="team" ? TI.per : 1); }

/* Ce que rapporte une manche à celui qui marque. Le gagnant compte ses
   fléchettes collées et ses bonus ; les trois fins spéciales valent un
   point, plus un par fléchette lancée pour le Jackquake. */
function tiPoints(m){
  switch(m.type){
    case "gain":  return m.f + 2*m.kiss + 3*m.french + 3*m.jackiss + 9*m.saut;
    case "quake": return 1 + m.lancees;
  }
  return 1;
}

/* Tout se déduit des manches jouées : corriger une manche ancienne, même
   un Sautez par-dessus, recalcule toute la partie. */
function tiRejouer(){
  var n=TI.players.length, i;
  var e={ scores:[], gagnees:[], bonus:[], gagnant:-1, jackover:false, fin:-1, cumuls:[], jack:0 };
  for(i=0;i<n;i++){ e.scores.push(0); e.gagnees.push(0); e.bonus.push(0); }
  for(var k=0;k<TI.manches.length;k++){
    var m=TI.manches[k], p=tiPoints(m);
    if(m.j<0 || m.j>=n) continue;
    e.scores[m.j]+=p;
    e.gagnees[m.j]++;
    e.bonus[m.j] += m.type==="gain" ? p-m.f : p;
    if(m.type==="gain" && m.saut){ for(i=0;i<n;i++) if(i!==m.j) e.scores[i]=0; }
    e.cumuls.push(e.scores.slice());
    /* le gagnant de la manche lance le jack de la suivante */
    e.jack=m.j;
    if(m.type==="gain" && m.jackover){ e.gagnant=m.j; e.jackover=true; e.fin=k; break; }
    if(e.scores[m.j]>=TI_CIBLE){ e.gagnant=m.j; e.fin=k; break; }
  }
  e.manche=TI.manches.length+1;
  return e;
}

/* qui marque pour une saisie : au Jack-0, celui qui a lancé le jack */
function tiMarqueur(s, jack){ return s.type==="jack0" ? jack : s.j; }

/* --- préparation ------------------------------------------------- */
function renderISetup(){
  var eq = TIS.mode==="team";
  var kids=$("tiMode").children, i;
  for(i=0;i<kids.length;i++) kids[i].classList.toggle("on", kids[i].dataset.mode===TIS.mode);
  fillChips($("tiDarts"), TI_FLECHETTES, TIS.darts, "darts");

  $("tiCountLab").textContent=t(eq ? "ti.teams" : "ti.players");
  $("tiNote").textContent=tf(eq ? "ti.note.team" : "ti.note",{n:TIS.count});
  $("tiVal").textContent=TIS.count;
  $("tiMinus").disabled = TIS.count<=TI_MIN;
  $("tiPlus").disabled  = TIS.count>=TI_MAX;

  $("tiPerBlock").hidden = !eq;
  $("tiPerVal").textContent=TIS.per;
  $("tiPerMinus").disabled = TIS.per<=TI_PER_MIN;
  $("tiPerPlus").disabled  = TIS.per>=TI_PER_MAX;

  renderIRows();
}

function renderIRows(){
  var host=$("tiRows");
  host.innerHTML="";
  var eq = TIS.mode==="team";
  for(var k=0;k<TIS.count;k++){
    (function(k){
      var pl=TIS.players[k];
      var row=el("div","trow");
      row.appendChild(el("span","seed",String(k+1).padStart(2,"0")));

      var pick=el("button","pick");
      pick.type="button";
      pick.style.setProperty("--c",color(pl.color).hex);
      pick.setAttribute("aria-label",tf("ti.color.aria",{n:k+1}));
      pick.setAttribute("aria-expanded", TIS.open===k ? "true":"false");
      pick.appendChild(el("i"));
      pick.addEventListener("click",function(){
        TIS.open = TIS.open===k ? -1 : k;
        renderIRows();
      });
      row.appendChild(pick);

      var name=el("input","field-input");
      name.type="text";
      name.value=pl.name;
      name.maxLength=22;
      name.placeholder=tf(eq ? "ti.teamn" : "ti.playern",{n:k+1});
      name.setAttribute("aria-label",tf(eq ? "ti.team.aria" : "ti.player.aria",{n:k+1}));
      name.addEventListener("input",function(){ pl.name=name.value; save(); });
      row.appendChild(name);
      champDeJoueur(name, pl, "pid", TIS.players, renderIRows);
      host.appendChild(row);

      if(eq){
        var mates=el("div","mates ti-mates");
        for(var j=0;j<TIS.per;j++){
          (function(j){
            var mi=el("input","field-input");
            mi.type="text";
            mi.value=pl.mates[j]||"";
            mi.maxLength=16;
            mi.placeholder=t("team.player")+" "+(j+1);
            mi.setAttribute("aria-label",tf("ti.mate.aria",{j:j+1, n:k+1}));
            mi.addEventListener("input",function(){ pl.mates[j]=mi.value; save(); });
            mates.appendChild(mi);
            champDeJoueur(mi, pl.mids || (pl.mids=[]), j);
          })(j);
        }
        host.appendChild(mates);
      }

      var sw=el("div","trow-sw swatches");
      sw.hidden = TIS.open!==k;
      COLORS.forEach(function(col){
        var b=el("button","sw");
        b.type="button";
        b.style.setProperty("--c",col.hex);
        b.setAttribute("aria-pressed", col.id===pl.color ? "true":"false");
        b.setAttribute("aria-label",t("color.aria")+" "+t("color."+col.id));
        b.addEventListener("click",function(){
          pl.color=col.id; TIS.open=-1;
          renderIRows(); save();
        });
        sw.appendChild(b);
      });
      host.appendChild(sw);
    })(k);
  }
}

function tiNouvellePartie(){
  TI={ darts:TIS.darts, mode:TIS.mode, per:TIS.per, players:[], manches:[], saisie:tiSaisieVide() };
  for(var i=0;i<TIS.count;i++){
    var mates=[];
    if(TIS.mode==="team"){ for(var j=0;j<TIS.per;j++) mates.push(tiCoequipier(i,j)); }
    TI.players.push({ label:tiNom(i), hex:color(TIS.players[i].color).hex, mates:mates, ids:idsDe(TIS.players[i], mates.length) });
  }
  TIE=tiRejouer();
  TIEDIT=null;
  show("igame");
  renderIGame();
  save();
  keepAwake();
}

/* --- la saisie d'une manche -------------------------------------- */
function tiReglette(v, max, change, ariaMoins, ariaPlus){
  var st=el("div","step");
  var a=el("button",null,"−");
  a.type="button";
  a.disabled = v<=0;
  a.setAttribute("aria-label",ariaMoins);
  a.addEventListener("click",function(){ change(-1); });
  var b=el("button",null,"+");
  b.type="button";
  b.disabled = v>=max;
  b.setAttribute("aria-label",ariaPlus);
  b.addEventListener("click",function(){ change(1); });
  st.appendChild(a);
  st.appendChild(el("div","v"+(v>0 ? " hot" : ""),String(v)));
  st.appendChild(b);
  return st;
}
/* une ligne : son libellé, ce qu'elle rapporte, sa réglette */
function tiLigne(lib, pts, champ, s, max, apres){
  var row=el("div","ti-ligne");
  var lab=el("p","lab");
  lab.appendChild(el("span",null,lib));
  lab.appendChild(el("b",null,pts));
  row.appendChild(lab);
  row.appendChild(tiReglette(s[champ], max, function(d){
    var v=s[champ]+d;
    if(v<0 || v>max) return;
    s[champ]=v;
    apres(d>0 ? 10 : 6);
  }, tf("ti.moins",{what:lib}), tf("ti.plus",{what:lib})));
  return row;
}
function tiBascule(lib, pts, champ, s, apres){
  var b=el("button","ti-bascule"+(s[champ] ? " on" : ""));
  b.type="button";
  b.setAttribute("aria-pressed", s[champ] ? "true" : "false");
  b.appendChild(el("span",null,lib));
  b.appendChild(el("b",null,pts));
  b.addEventListener("click",function(){ s[champ] = s[champ] ? 0 : 1; apres(s[champ] ? 12 : 6); });
  return b;
}

/* Les quatre façons de finir une manche. */
function tiPeindreTypes(host, s, apres){
  host.innerHTML="";
  TI_TYPES.forEach(function(ty){
    var b=el("button",s.type===ty ? "on" : null,t("ti.type."+ty));
    b.type="button";
    b.setAttribute("aria-pressed", s.type===ty ? "true" : "false");
    b.addEventListener("click",function(){
      if(s.type===ty) return;
      s.type=ty;
      apres(8);
    });
    host.appendChild(b);
  });
}

/* Le corps de la saisie, selon la façon dont la manche a fini. La console
   de la partie et l'éditeur de la feuille partagent ce rendu. */
function tiPeindreCorps(host, s, jack, apres){
  host.innerHTML="";
  var max=tiMax();
  if(s.type==="gain"){
    host.appendChild(tiLigne(t("ti.f"), "×1", "f", s, max, apres));
    var bonus=el("div","ti-bonus");
    bonus.appendChild(tiLigne(t("ti.b.kiss"), "+2", "kiss", s, max, apres));
    bonus.appendChild(tiLigne(t("ti.b.french"), "+3", "french", s, max, apres));
    host.appendChild(bonus);
    var bas=el("div","ti-bascules");
    bas.appendChild(tiBascule(t("ti.b.jackiss"), "+3", "jackiss", s, apres));
    bas.appendChild(tiBascule(t("ti.b.saut"), "+9", "saut", s, apres));
    bas.appendChild(tiBascule(t("ti.b.jackover"), "★", "jackover", s, apres));
    host.appendChild(bas);
  }else if(s.type==="quake"){
    host.appendChild(tiLigne(t("ti.lancees"), "+1", "lancees", s, max, apres));
    host.appendChild(el("p","ti-aide",t("ti.aide.quake")));
  }else if(s.type==="jackoff"){
    host.appendChild(el("p","ti-aide",t("ti.aide.jackoff")));
  }else{
    host.appendChild(el("p","ti-aide",tf("ti.aide.jack0",{name:TI.players[jack].label})));
  }
}

/* ce que la saisie rapporte, écrit en toutes lettres */
function tiAnnonce(hote, s, jack){
  hote.innerHTML="";
  var j=tiMarqueur(s, jack);
  if(j<0){ hote.textContent=t("ti.choose"); return; }
  var nom=TI.players[j].label;
  if(s.type==="gain" && s.jackover){ hote.appendChild(el("b",null,tf("ti.win.jackover",{name:nom}))); return; }
  var p=tiPoints(s);
  var parts=tf(p>1 ? "game.scores_p" : "game.scores",{name:" ", n:p}).split(" ");
  hote.appendChild(document.createTextNode(parts[0]||""));
  hote.appendChild(el("b",null,nom));
  hote.appendChild(document.createTextNode(parts[1]||""));
}

/* --- la partie --------------------------------------------------- */
function renderIGame(){
  if(!TI) return;
  if(!TIE) TIE=tiRejouer();
  var e=TIE, fini=e.gagnant>=0, s=TI.saisie, n=TI.players.length;

  $("tiMancheLabel").textContent = fini ? t("ti.done") : t("game.frame")+" "+e.manche;
  $("tiCibleLabel").textContent = t("game.target")+" "+TI_CIBLE;
  /* l'ordre de jeu se tire au sort avant la première manche, une seule fois */
  var tirable = !fini && !TI.tire && !TI.manches.length && n>1;
  $("tiTirer").hidden = !tirable;
  $("tiCibleLabel").hidden = tirable;

  var marqueur = fini ? e.gagnant : tiMarqueur(s, e.jack);
  var host=$("tiScores");
  host.innerHTML="";
  TI.players.forEach(function(pl,i){
    var b=el("button","ti-score"+(i===marqueur ? " on" : "")+(fini && i===e.gagnant ? " win" : ""));
    b.type="button";
    b.style.setProperty("--c",pl.hex);
    b.disabled = fini || s.type==="jack0";
    b.setAttribute("aria-pressed", i===marqueur ? "true" : "false");
    var haut=el("span","haut");
    haut.appendChild(el("i","dot"));
    haut.appendChild(el("span","who",pl.label));
    b.appendChild(haut);
    var bas=el("span","bas");
    bas.appendChild(el("span","sc num",String(e.scores[i])));
    if(i===e.jack && !fini) bas.appendChild(el("span","ti-jack",t("ti.jack")));
    b.appendChild(bas);
    var mini=el("span","ti-mini"), f=el("i");
    f.style.width=Math.min(100, e.scores[i]/TI_CIBLE*100)+"%";
    mini.appendChild(f);
    b.appendChild(mini);
    b.addEventListener("click",function(){
      if(TIE.gagnant>=0 || TI.saisie.type==="jack0") return;
      TI.saisie.j = TI.saisie.j===i ? -1 : i;
      buzz(8); save(); renderIGame();
    });
    host.appendChild(b);
  });
  var actif=host.children[marqueur>=0 ? marqueur : e.jack];
  if(actif && host.scrollWidth>host.clientWidth) actif.scrollIntoView({block:"nearest", inline:"nearest"});

  tiPeindreApercu(marqueur, fini);

  var apres=function(vib){ buzz(vib); save(); renderIGame(); };
  tiPeindreTypes($("tiTypes"), s, apres);
  tiPeindreCorps($("tiCorps"), s, e.jack, apres);
  tiAnnonce($("tiOutcome"), s, e.jack);
  $("tiValider").disabled = fini || marqueur<0;
  var boutons=$("tiTypes").children;
  for(var k=0;k<boutons.length;k++) boutons[k].disabled=fini;
}

/* L'aperçu de la manche : le joueur choisi, son score avant et après, et
   ce que la manche déclenche — victoire, remise à zéro, Jackover. */
function tiPeindreApercu(j, fini){
  var host=$("tiApercu");
  host.innerHTML="";
  if(j<0){
    host.className="ti-apercu vide";
    host.style.removeProperty("--c");
    host.appendChild(el("p","consigne",t("ti.choose")));
    host.appendChild(el("p","detail",tf("ti.jack.who",{name:TI.players[TIE.jack].label})));
    return;
  }
  var pl=TI.players[j], s=TI.saisie, avant=TIE.scores[j];
  host.className="ti-apercu";
  host.style.setProperty("--c",pl.hex);
  var qui=el("p","nom");
  qui.appendChild(el("i","dot"));
  qui.appendChild(el("span",null,pl.label));
  host.appendChild(qui);
  var ligne=el("div","ligne");
  if(fini){
    ligne.appendChild(el("span","apres num",String(avant)));
    host.appendChild(ligne);
    host.appendChild(el("p","detail",t("ti.done")));
    return;
  }
  var p=tiPoints(s), apresScore=avant+p, jackover = s.type==="gain" && s.jackover;
  ligne.appendChild(el("span","avant num",String(avant)));
  ligne.appendChild(el("span","fleche","→"));
  ligne.appendChild(el("span","apres num",jackover ? "★" : String(apresScore)));
  if(!jackover) ligne.appendChild(el("span","gain num","+"+p));
  host.appendChild(ligne);
  var mots=[];
  if(s.type==="gain" && s.jackover) mots.push(t("ti.effet.jackover"));
  else if(apresScore>=TI_CIBLE) mots.push(t("ti.effet.victoire"));
  if(s.type==="gain" && s.saut && !s.jackover) mots.push(t("ti.effet.saut"));
  if(s.type!=="gain" && !mots.length) mots.push(t("ti.effet.fin"));
  if(!mots.length) mots.push(tf("ti.effet.reste",{n:TI_CIBLE-apresScore}));
  host.appendChild(el("p","detail",mots.join(" · ")));
}

function tiValider(){
  if(!TI || !TIE || TIE.gagnant>=0) return;
  var s=TI.saisie, j=tiMarqueur(s, TIE.jack);
  if(j<0) return;
  var m={ type:s.type, j:j };
  if(s.type==="gain"){ m.f=s.f; m.kiss=s.kiss; m.french=s.french; m.jackiss=s.jackiss; m.saut=s.saut; m.jackover=s.jackover; }
  if(s.type==="quake") m.lancees=s.lancees;
  TI.manches.push(tiNormManche(m));
  TI.saisie=tiSaisieVide();
  tiApresChangement(m.saut || m.jackover ? [20,50,30] : 14);
}

function tiApresChangement(vibration){
  var avant = TIE ? TIE.gagnant : -1;
  TIE=tiRejouer();
  buzz(vibration);
  /* l'archivage précède la sauvegarde : fermer l'app sur l'écran de fin
     ne doit pas faire perdre la partie au palmarès */
  if(TIE.gagnant>=0 && avant<0){
    tiFermerFeuille();
    tiArchiver();
    save();
    renderIGame();
    setTimeout(renderIOver, 620);
  }else{
    save();
    renderIGame();
    if($("tiSheetWrap").classList.contains("on")) renderISheet();
  }
}

/* L'ordre de jeu se tire au sort avant la première manche : le premier
   tiré lance le jack. */
function tiTirer(){
  if(!TI || TI.tire || TI.manches.length) return;
  tirerOrdre(TI.players, function(ordre){
    TI.players=ordre;
    TI.tire=true;
    TI.saisie.j=-1;
    TIE=tiRejouer();
    save();
    renderIGame();
  });
}

/* --- feuille de match -------------------------------------------- */
function tiDetail(m){
  if(m.type!=="gain") return t("ti.type."+m.type)+(m.type==="quake" ? " · "+tf("ti.lancees.n",{n:m.lancees}) : "");
  var d=[tf("ti.f.n",{n:m.f})];
  if(m.kiss) d.push(t("ti.b.kiss")+(m.kiss>1 ? " ×"+m.kiss : ""));
  if(m.french) d.push(t("ti.b.french")+(m.french>1 ? " ×"+m.french : ""));
  if(m.jackiss) d.push(t("ti.b.jackiss"));
  if(m.saut) d.push(t("ti.b.saut"));
  if(m.jackover) d.push(t("ti.b.jackover"));
  return d.join(" · ");
}

function renderISheet(){
  var body=$("tiSheetBody");
  body.innerHTML="";
  $("tiEdSave").hidden = !TIEDIT;
  $("tiEdDel").hidden  = !TIEDIT;
  $("tiUndo").hidden   = !!TIEDIT;
  $("tiQuit").hidden   = !!TIEDIT;
  if(TIEDIT){ renderIEditeur(body); return; }
  $("tiUndo").disabled = !TI.manches.length || TIE.gagnant>=0;

  if(!TI.manches.length){
    body.appendChild(el("p","empty",t("sheet.empty")));
    return;
  }
  var table=el("table","log ti-log");
  var thead=el("thead"), htr=el("tr");
  [t("sheet.frame"), t("ti.col.who"), t("ti.col.how"), t("over.points")].forEach(function(x){ htr.appendChild(el("th",null,x)); });
  thead.appendChild(htr);
  table.appendChild(thead);
  var tbody=el("tbody");
  TI.manches.forEach(function(m,k){
    var tr=el("tr");
    tr.setAttribute("aria-label",tf("sheet.fix.aria",{n:k+1}));
    tr.appendChild(el("td",null,String(k+1).padStart(2,"0")));
    var pl=TI.players[m.j], qui=el("span","qui",pl ? pl.label : "—");
    if(pl) qui.style.color=teamInk(pl.hex);
    var tdq=el("td"); tdq.appendChild(qui); tr.appendChild(tdq);
    tr.appendChild(el("td","comment",tiDetail(m)));
    var tdp=el("td");
    tdp.appendChild(el("span","pt",m.type==="gain" && m.jackover ? "★" : "+"+tiPoints(m)));
    tr.appendChild(tdp);
    tr.addEventListener("click",function(){ tiOuvrirEditeur(k); });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  body.appendChild(table);
  body.appendChild(el("p","hint",t("ti.sheet.hint")));
}

function tiOuvrirEditeur(k){
  var m=TI.manches[k];
  if(!m) return;
  var s=tiSaisieVide();
  for(var c in s) if(m[c]!==undefined) s[c]=m[c];
  TIEDIT={ k:k, s:s };
  renderISheet();
}
function tiFermerEditeur(){ TIEDIT=null; renderISheet(); }

/* le lanceur du jack d'une manche passée : le gagnant de la précédente */
function tiJackDe(k){ return k>0 ? TI.manches[k-1].j : 0; }

function renderIEditeur(body){
  var s=TIEDIT.s, jack=tiJackDe(TIEDIT.k);
  var head=el("div","ed-head");
  head.appendChild(el("p","eyebrow",tf("edit.title",{n:TIEDIT.k+1})));
  var back=el("button","ed-back",t("edit.cancel"));
  back.type="button";
  back.addEventListener("click",tiFermerEditeur);
  head.appendChild(back);
  body.appendChild(head);

  var apres=function(vib){ buzz(vib); renderISheet(); };
  var types=el("div","ti-types");
  tiPeindreTypes(types, s, apres);
  body.appendChild(types);

  if(s.type!=="jack0"){
    var choix=el("div","ti-choix");
    TI.players.forEach(function(pl,i){
      var b=el("button","ti-chip"+(s.j===i ? " on" : ""));
      b.type="button";
      b.style.setProperty("--c",pl.hex);
      b.setAttribute("aria-pressed", s.j===i ? "true" : "false");
      b.appendChild(el("i","dot"));
      b.appendChild(el("span",null,pl.label));
      b.addEventListener("click",function(){ s.j=i; apres(8); });
      choix.appendChild(b);
    });
    body.appendChild(choix);
  }
  var corps=el("div","ti-corps");
  tiPeindreCorps(corps, s, jack, apres);
  body.appendChild(corps);
  var out=el("p","outcome ed-out");
  tiAnnonce(out, s, jack);
  body.appendChild(out);
  $("tiEdSave").disabled = tiMarqueur(s, jack)<0;
}

function tiOuvrirFeuille(){
  TIEDIT=null;
  renderISheet();
  tiArmerQuitter(false);
  $("tiSheetWrap").classList.add("on");
}
function tiFermerFeuille(){
  $("tiSheetWrap").classList.remove("on");
  TIEDIT=null;
}
function tiArmerQuitter(on){
  var b=$("tiQuit");
  b.dataset.armed = on ? "1" : "0";
  b.textContent = on ? t("sheet.quit.confirm") : t("sheet.quit");
}

/* --- archivage et fin de partie ---------------------------------- */
function tiArchiver(){
  if(!TI || TI.archived || !TIE || TIE.gagnant<0) return;
  H.unshift({
    d:Date.now(), g:"tossit",
    n:TI.players.map(function(p){ return p.label; }),
    p:TI.players.map(function(x){ return x.ids||[]; }),
    c:TI.players.map(function(p){ return p.hex; }),
    s:TIE.scores.slice(), w:TIE.gagnant, r:TIE.fin+1, t:false
  });
  if(H.length>200) H.length=200;
  TI.archived=true;
}

function tiClassement(){
  var w=TIE.gagnant;
  return TI.players.map(function(p,i){ return i; }).sort(function(a,b){
    if(a===w) return -1;
    if(b===w) return 1;
    return (TIE.scores[b]-TIE.scores[a]) || (a-b);
  });
}

function renderIOver(){
  if(!TI || !TIE || TIE.gagnant<0) return;
  var e=TIE, w=e.gagnant, box=$("over");
  box.innerHTML="";
  box.style.setProperty("--team",TI.players[w].hex);

  var head=el("div","over-head reveal");
  head.appendChild(el("p","eyebrow",tn("over.done",e.fin+1)));
  head.appendChild(el("h2",null,tf("over.wins",{name:TI.players[w].label})));
  var fin=el("div","final");
  fin.appendChild(el("span","a",e.jackover ? "★" : String(e.scores[w])));
  fin.appendChild(el("span","s",e.jackover ? t("ti.b.jackover") : t("ti.points")));
  head.appendChild(fin);
  if(e.jackover) head.appendChild(el("p","note",t("ti.note.jackover")));
  box.appendChild(head);

  var card=el("div","tale reveal");
  card.style.animationDelay="80ms";
  var top=el("div","tale-top");
  top.appendChild(el("p","eyebrow",t("ti.rank")));
  top.appendChild(el("p","eyebrow",tf("over.goal",{n:TI_CIBLE})));
  card.appendChild(top);
  var table=el("table","ti-rang"), thead=el("thead"), htr=el("tr");
  ["", t("ti.col.won"), t("ti.col.bonus"), t("over.points")].forEach(function(x){ htr.appendChild(el("th",null,x)); });
  thead.appendChild(htr);
  table.appendChild(thead);
  var tbody=el("tbody");
  tiClassement().forEach(function(i,rang){
    var p=TI.players[i];
    var tr=el("tr", i===w ? "win" : null);
    var td=el("td"), who=el("div","who"), dot=el("i");
    dot.style.background=p.hex;
    who.appendChild(dot);
    who.appendChild(el("span",null,(rang+1)+". "+p.label));
    td.appendChild(who);
    tr.appendChild(td);
    tr.appendChild(el("td",null,String(e.gagnees[i])));
    tr.appendChild(el("td",null, e.bonus[i] ? "+"+e.bonus[i] : "—"));
    tr.appendChild(el("td","total",String(e.scores[i])));
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  card.appendChild(table);
  box.appendChild(card);

  var acts=el("div","over-acts reveal");
  acts.style.animationDelay="160ms";
  var share=el("button","share-btn",t("share.result"));
  share.type="button";
  share.addEventListener("click",tiPartager);
  acts.appendChild(share);
  var again=el("button","cta",t("over.rematch"));
  again.type="button";
  again.addEventListener("click",tiNouvellePartie);
  acts.appendChild(again);
  var back=el("button","cta ghost",t("over.newsetup"));
  back.type="button";
  back.addEventListener("click",function(){ TI=null; TIE=null; save(); show("isetup"); renderISetup(); });
  acts.appendChild(back);
  box.appendChild(acts);

  show("over");
  buzz([14,60,26]);
}

function tiPartager(){
  if(!TI || !TIE || TIE.gagnant<0) return;
  var lignes=[t("ti.name")+" · "+tf("over.goal",{n:TI_CIBLE})];
  tiClassement().forEach(function(i,rang){
    lignes.push((rang+1)+". "+TI.players[i].label+" — "+TIE.scores[i]);
  });
  lignes.push("ScoreToss");
  shareText(lignes.join("\n"));
}

/* --- état enregistré --------------------------------------------- */
function tiEntier(v, min, max){ return (typeof v==="number" && v>=min && v<=max) ? Math.floor(v) : min; }
function tiNormManche(m){
  var r={ type: TI_TYPES.indexOf(m.type)>=0 ? m.type : "gain", j: typeof m.j==="number" ? m.j : -1 };
  if(r.type==="gain"){
    ["f","kiss","french"].forEach(function(c){ r[c]=tiEntier(m[c],0,48); });
    ["jackiss","saut","jackover"].forEach(function(c){ r[c]=m[c] ? 1 : 0; });
  }
  if(r.type==="quake") r.lancees=tiEntier(m.lancees,0,48);
  return r;
}
function tiNormIS(is){
  is.open=-1;
  if(is.mode!=="team") is.mode="solo";
  if(TI_FLECHETTES.indexOf(is.darts)<0) is.darts=TI_FLECHETTES[0];
  if(!is.count || is.count<TI_MIN || is.count>TI_MAX) is.count=TI_MIN;
  if(!is.per || is.per<TI_PER_MIN || is.per>TI_PER_MAX) is.per=TI_PER_MIN;
  is.players.forEach(function(pl,i){
    if(typeof pl.name!=="string") pl.name="";
    if(!pl.color) pl.color=TI_TEINTES[i];
    if(!pl.mates || pl.mates.length!==4) pl.mates=["","","",""];
  });
  return is;
}
function tiNormI(ti){
  if(TI_FLECHETTES.indexOf(ti.darts)<0) ti.darts=TI_FLECHETTES[0];
  if(ti.mode!=="team") ti.mode="solo";
  if(!ti.per) ti.per=TI_PER_MIN;
  ti.manches=(ti.manches||[]).map(tiNormManche).filter(function(m){ return m.j>=0 && m.j<ti.players.length; });
  var s=ti.saisie, v=tiSaisieVide();
  if(s && typeof s==="object"){
    for(var c in v) if(typeof s[c]===typeof v[c]) v[c]=s[c];
    if(TI_TYPES.indexOf(v.type)<0) v.type="gain";
    if(v.j>=ti.players.length) v.j=-1;
  }
  ti.saisie=v;
  ti.tire=!!ti.tire;
  ti.players.forEach(function(p){ if(!p.mates) p.mates=[]; });
  return ti;
}

/* --- commandes --------------------------------------------------- */
$("tiToGames").addEventListener("click",retourAuxJeux);
$("tiHall").addEventListener("click",function(){ HALL_BACK="isetup"; renderHall(); show("hall"); });
$("tiMode").addEventListener("click",function(e){
  var b=e.target.closest("button[data-mode]");
  if(!b || b.dataset.mode===TIS.mode) return;
  TIS.mode=b.dataset.mode;
  /* un joueur n'est pas une équipe : ce qui était nommé n'a plus de sens */
  TIS.players.forEach(function(pl){ pl.name=""; pl.mates=["","","",""]; });
  TIS.open=-1;
  renderISetup(); save();
});
$("tiDarts").addEventListener("click",function(e){
  var b=e.target.closest("button[data-darts]");
  if(!b) return;
  TIS.darts=+b.dataset.darts;
  renderISetup(); save();
});
$("tiMinus").addEventListener("click",function(){
  if(TIS.count>TI_MIN){ TIS.count--; TIS.open=-1; renderISetup(); save(); }
});
$("tiPlus").addEventListener("click",function(){
  if(TIS.count<TI_MAX){ TIS.count++; TIS.open=-1; renderISetup(); save(); }
});
$("tiPerMinus").addEventListener("click",function(){
  if(TIS.per>TI_PER_MIN){ TIS.per--; TIS.open=-1; renderISetup(); save(); }
});
$("tiPerPlus").addEventListener("click",function(){
  if(TIS.per<TI_PER_MAX){ TIS.per++; TIS.open=-1; renderISetup(); save(); }
});
$("tiOpenRules").addEventListener("click",openRules);
$("tiOpenAbout").addEventListener("click",openAbout);
$("tiStart").addEventListener("click",tiNouvellePartie);

$("tiTirer").addEventListener("click",tiTirer);
$("tiValider").addEventListener("click",tiValider);
$("tiSheetBtn").addEventListener("click",tiOuvrirFeuille);
$("tiSheetClose").addEventListener("click",tiFermerFeuille);
$("tiScrim").addEventListener("click",tiFermerFeuille);
$("tiEdSave").addEventListener("click",function(){
  if(!TIEDIT) return;
  var s=TIEDIT.s, j=tiMarqueur(s, tiJackDe(TIEDIT.k));
  if(j<0) return;
  s.j=j;
  TI.manches[TIEDIT.k]=tiNormManche(s);
  TIEDIT=null;
  tiApresChangement(10);
});
$("tiEdDel").addEventListener("click",function(){
  if(!TIEDIT) return;
  TI.manches.splice(TIEDIT.k,1);
  TIEDIT=null;
  tiApresChangement(10);
});
/* Annuler la dernière manche rend sa saisie : il ne reste qu'à la corriger. */
$("tiUndo").addEventListener("click",function(){
  if(!TI || !TI.manches.length || (TIE && TIE.gagnant>=0)) return;
  var m=TI.manches.pop(), s=tiSaisieVide();
  for(var c in s) if(m[c]!==undefined) s[c]=m[c];
  TI.saisie=s;
  tiFermerFeuille();
  tiApresChangement(10);
});
$("tiQuit").addEventListener("click",function(){
  var b=$("tiQuit");
  if(b.dataset.armed!=="1"){
    tiArmerQuitter(true);
    setTimeout(function(){ if(b.dataset.armed==="1") tiArmerQuitter(false); },4000);
    return;
  }
  tiFermerFeuille();
  TI=null;
  TIE=null;
  buzz(12);
  save();
  show("isetup");
  renderISetup();
});

/* --- fiche de règles --------------------------------------------- */
function fillTossitRules(host){
  function bloc(titre, lignes){
    var b=el("div","block");
    b.appendChild(el("p","eyebrow",titre));
    var pts=el("div","pts");
    lignes.forEach(function(r){
      var row=el("div","pt-row");
      row.appendChild(el("b",null,r[0]));
      row.appendChild(el("span",null,r[1]));
      pts.appendChild(row);
    });
    b.appendChild(pts);
    host.appendChild(b);
  }
  bloc(t("tirules.count"), [["1",t("tirules.pt")]]);
  bloc(t("tirules.bonus"), [
    ["+2",t("tirules.kiss")], ["+3",t("tirules.french")], ["+3",t("tirules.jackiss")],
    ["+9",t("tirules.saut")], ["★",t("tirules.jackover")]
  ]);
  bloc(t("tirules.fins"), [
    ["+1",t("tirules.quake")], ["+1",t("tirules.jackoff")], ["+1",t("tirules.jack0")]
  ]);

  var deroule=el("div","block");
  deroule.appendChild(el("p","eyebrow",t("tirules.flow")));
  var list=el("ul","rulist");
  [1,2,3,4,5].forEach(function(k){
    var li=document.createElement("li");
    li.appendChild(document.createTextNode(t("tirules."+k+"a")));
    li.appendChild(el("b",null,t("tirules."+k+"b")));
    li.appendChild(document.createTextNode(t("tirules."+k+"c")));
    list.appendChild(li);
  });
  deroule.appendChild(list);
  host.appendChild(deroule);
}
