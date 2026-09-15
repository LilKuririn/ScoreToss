/* Yams.

   Cinq dés, treize cases par joueur, trois lancers au plus par tour. On
   joue avec de vrais dés : l'application ne lance rien. Elle reçoit les
   cinq valeurs du dernier lancer, montre ce que rapporterait chaque case
   libre, et inscrit celle que le joueur choisit — à 0 si les dés n'y
   correspondent pas. Le haut rapporte 35 points de bonus dès 63. */
declarerJeu({
  id:"yams",
  famille:"tours",
  categorie:"societe",
  nom:function(){ return t("ya.name"); },
  regles:fillYamsRules,
  ecrans:["ysetup","ygame"],
  lienPalmares:"yaHall",
  records:"ya.records",
  retour:{
    fiches:[["yaTirage","yaTirageOk"], ["yaSheetWrap","yaSheetClose"]],
    ecrans:[["s-ysetup","yaToGames"]]
  },

  auChangementDEcran:function(nom){
    if(nom!=="ygame") yaFermerFeuille();
    if(nom==="ysetup") refreshHallLink();
  },
  sauver:function(o){ o.ys=YS; o.y=Y; },
  charger:function(d){
    if(d && d.ys && d.ys.players && d.ys.players.length===YA_MAX) YS=yaNormYS(d.ys);
    if(d && d.y && d.y.players && d.y.players.length>=YA_MIN){ Y=yaNormY(d.y); YE=yaRejouer(); }
    renderYSetup();
  },
  importer:function(d){
    YS = yaNormYS((d.ys && d.ys.players && d.ys.players.length===YA_MAX) ? d.ys : {players:yaJoueursVides()});
    Y  = (d.y && d.y.players && d.y.players.length>=YA_MIN) ? yaNormY(d.y) : null;
    YE = Y ? yaRejouer() : null;
    renderYSetup();
  },
  reprendre:function(){
    if(!Y || !YE || YE.fini) return false;
    show("ygame");
    renderYGame();
    keepAwake();
    return true;
  },
  changementDeLangue:function(){
    renderYSetup();
    if(Y && $("s-ygame").classList.contains("on")) renderYGame();
  },

  ouvrir:function(){
    if(!S.tgt) S.tgt=ciblesParDefaut();
    if(jeu(S.game).famille==="duel"){
      S.tgt[S.game]=S.target;
      TOUR[S.game]=T;
      DRAFT[S.game]=TS;
    }
    S.game="yams";
    T=null;
    fillRules("rulesBody");
    save();
    show("ysetup");
    renderYSetup();
  }
});

var YA_MIN = 1;
var YA_MAX = 8;
var YA_TOURS = 13;
var YA_SEUIL = 63;
var YA_BONUS = 35;
var YA_TEINTES = ["rouge","bleu","vert","ambre","violet","sarcelle","rose","or"];

/* Les treize cases, dans l'ordre de la fiche : le haut, puis le bas. */
var YA_CASES = [
  {id:"1", haut:true}, {id:"2", haut:true}, {id:"3", haut:true},
  {id:"4", haut:true}, {id:"5", haut:true}, {id:"6", haut:true},
  {id:"brelan"}, {id:"carre"}, {id:"full"}, {id:"psuite"}, {id:"gsuite"}, {id:"yams"}, {id:"chance"}
];
var YA_IDS = YA_CASES.map(function(c){ return c.id; });

function yaJoueursVides(){
  var a=[];
  for(var i=0;i<YA_MAX;i++) a.push({name:"", color:YA_TEINTES[i]});
  return a;
}
var YS = { count:2, open:-1, players:yaJoueursVides() };
var Y  = null;      /* la partie : ses joueurs, ses tours, la saisie en cours */
var YE = null;      /* ce qui s'en déduit, recalculé à chaque changement */
var YEDIT = null;   /* le tour en cours de correction */
var yaDernier = null;   /* le dé qui vient d'être ajouté, pour l'animer */

function yaNom(i){
  var v=(YS.players[i].name||"").trim();
  return v || tf("ya.playern",{n:i+1});
}

/* --- calcul ------------------------------------------------------ */
/* Ce que rapportent cinq dés dans une case : la condition non remplie
   vaut 0. Un yams est aussi un brelan et un carré ; une grande suite est
   aussi une petite. */
function yaPoints(id, des){
  if(!des || des.length!==5) return 0;
  var n=[0,0,0,0,0,0,0], somme=0;
  des.forEach(function(v){ n[v]++; somme+=v; });
  if(/^[1-6]$/.test(id)) return n[+id]*(+id);
  var max=Math.max.apply(null,n);
  function suite(a,b){
    for(var v=a;v<=b;v++) if(!n[v]) return false;
    return true;
  }
  switch(id){
    case "brelan": return max>=3 ? somme : 0;
    case "carre":  return max>=4 ? somme : 0;
    case "full":   return (n.indexOf(3)>0 && n.indexOf(2)>0) ? 25 : 0;
    case "psuite": return (suite(1,4) || suite(2,5) || suite(3,6)) ? 30 : 0;
    case "gsuite": return (suite(1,5) || suite(2,6)) ? 40 : 0;
    case "yams":   return max===5 ? 50 : 0;
    case "chance": return somme;
  }
  return 0;
}

/* Tout se déduit des tours joués, chacun à son tour : corriger les dés
   d'un tour ancien, ou le changer de case, recalcule toute la fiche. */
function yaRejouer(){
  var n=Y.players.length, fiches=[], i;
  for(i=0;i<n;i++) fiches.push({ cases:{}, tours:{} });
  Y.tours.forEach(function(tr,k){
    var f=fiches[k%n];
    f.cases[tr.c]=yaPoints(tr.c, tr.d);
    f.tours[tr.c]=k;
  });
  fiches.forEach(function(f){
    f.haut=0; f.bas=0; f.remplies=0;
    YA_CASES.forEach(function(c){
      var v=f.cases[c.id];
      if(v===undefined) return;
      f.remplies++;
      if(c.haut) f.haut+=v; else f.bas+=v;
    });
    f.bonus = f.haut>=YA_SEUIL ? YA_BONUS : 0;
    f.total = f.haut+f.bonus+f.bas;
  });
  var e={
    fiches:fiches,
    joueur:Y.tours.length%n,
    tour:Math.floor(Y.tours.length/n)+1,
    fini:Y.tours.length>=YA_TOURS*n,
    gagnant:-1, egalite:false, premiers:[]
  };
  if(e.fini){
    var best=Math.max.apply(null, fiches.map(function(f){ return f.total; }));
    fiches.forEach(function(f,i){ if(f.total===best) e.premiers.push(i); });
    e.egalite = e.premiers.length>1;
    e.gagnant = e.egalite ? -1 : e.premiers[0];
  }
  return e;
}

/* --- préparation ------------------------------------------------- */
function renderYSetup(){
  $("yaNote").textContent=tn("ya.note",YS.count);
  $("yaVal").textContent=YS.count;
  $("yaMinus").disabled = YS.count<=YA_MIN;
  $("yaPlus").disabled  = YS.count>=YA_MAX;
  renderYRows();
}

function renderYRows(){
  var host=$("yaRows");
  host.innerHTML="";
  for(var k=0;k<YS.count;k++){
    (function(k){
      var pl=YS.players[k];
      var row=el("div","trow");
      row.appendChild(el("span","seed",String(k+1).padStart(2,"0")));

      var pick=el("button","pick");
      pick.type="button";
      pick.style.setProperty("--c",color(pl.color).hex);
      pick.setAttribute("aria-label",tf("ya.color.aria",{n:k+1}));
      pick.setAttribute("aria-expanded", YS.open===k ? "true":"false");
      pick.appendChild(el("i"));
      pick.addEventListener("click",function(){
        YS.open = YS.open===k ? -1 : k;
        renderYRows();
      });
      row.appendChild(pick);

      var name=el("input","field-input");
      name.type="text";
      name.value=pl.name;
      name.maxLength=22;
      name.placeholder=tf("ya.playern",{n:k+1});
      name.setAttribute("aria-label",tf("ya.player.aria",{n:k+1}));
      name.addEventListener("input",function(){ pl.name=name.value; save(); });
      row.appendChild(name);
      host.appendChild(row);

      var sw=el("div","trow-sw swatches");
      sw.hidden = YS.open!==k;
      COLORS.forEach(function(col){
        var b=el("button","sw");
        b.type="button";
        b.style.setProperty("--c",col.hex);
        b.setAttribute("aria-pressed", col.id===pl.color ? "true":"false");
        b.setAttribute("aria-label",t("color.aria")+" "+t("color."+col.id));
        b.addEventListener("click",function(){
          pl.color=col.id; YS.open=-1;
          renderYRows(); save();
        });
        sw.appendChild(b);
      });
      host.appendChild(sw);
    })(k);
  }
}

function yaNouvellePartie(){
  Y={ players:[], tours:[], saisie:[], choix:null };
  for(var i=0;i<YS.count;i++){
    Y.players.push({ label:yaNom(i), hex:color(YS.players[i].color).hex });
  }
  YE=yaRejouer();
  YEDIT=null;
  show("ygame");
  renderYGame();
  save();
  keepAwake();
}

/* --- les dés ----------------------------------------------------- */
var YA_NS = "http://www.w3.org/2000/svg";
var YA_POINTS = {
  1:[[20,20]],
  2:[[11,11],[29,29]],
  3:[[11,11],[20,20],[29,29]],
  4:[[11,11],[29,11],[11,29],[29,29]],
  5:[[11,11],[29,11],[20,20],[11,29],[29,29]],
  6:[[11,11],[29,11],[11,20],[29,20],[11,29],[29,29]]
};
function yaForme(tag, attrs){
  var e=document.createElementNS(YA_NS,tag);
  for(var k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}
/* Un dé dessiné, face blanche et points sombres ; le point unique de l'as
   est rouge, comme sur les dés de table. */
function yaDe(v){
  var svg=yaForme("svg",{viewBox:"0 0 40 40","class":"ya-de","aria-hidden":"true"});
  svg.appendChild(yaForme("rect",{x:2, y:2, width:36, height:36, rx:9, "class":"face"}));
  YA_POINTS[v].forEach(function(p){
    svg.appendChild(yaForme("circle",{cx:p[0], cy:p[1], r:v===1 ? 5.2 : 3.6, "class":"pip"+(v===1 ? " as" : "")}));
  });
  return svg;
}

/* Les cinq emplacements, rangés du plus petit au plus grand pour se lire
   d'un coup d'œil, et le pavé des six faces. Toucher un dé posé le retire. */
function yaPeindreDes(hoteDes, hotePave, des, ajouter, retirer, fige){
  var tries=des.slice().sort(function(a,b){ return a-b; });
  var neuf = yaDernier ? tries.indexOf(yaDernier) : -1;
  yaDernier=null;
  hoteDes.innerHTML="";
  for(var i=0;i<5;i++){
    (function(i){
      var v=tries[i];
      if(!v){ hoteDes.appendChild(el("div","ya-slot")); return; }
      var b=el("button","ya-slot plein"+(i===neuf ? " neuf" : ""));
      b.type="button";
      b.disabled=!!fige;
      b.setAttribute("aria-label",tf("ya.die.remove",{n:v}));
      b.appendChild(yaDe(v));
      b.addEventListener("click",function(){ retirer(v); });
      hoteDes.appendChild(b);
    })(i);
  }
  hotePave.innerHTML="";
  for(var v=1;v<=6;v++){
    (function(v){
      var k=el("button","ya-touche");
      k.type="button";
      k.disabled = !!fige || des.length>=5;
      k.setAttribute("aria-label",tf("ya.die.add",{n:v}));
      k.appendChild(yaDe(v));
      k.addEventListener("click",function(){ ajouter(v); });
      hotePave.appendChild(k);
    })(v);
  }
}

function yaAjouter(v){
  if(!Y || !YE || YE.fini || Y.saisie.length>=5) return;
  Y.saisie.push(v);
  yaDernier=v;
  buzz(8);
  save();
  renderYGame();
}
function yaRetirer(v){
  if(!Y) return;
  var i=Y.saisie.indexOf(v);
  if(i<0) return;
  Y.saisie.splice(i,1);
  buzz(6);
  save();
  renderYGame();
}

/* --- la partie --------------------------------------------------- */
function renderYGame(){
  if(!Y) return;
  if(!YE) YE=yaRejouer();
  var e=YE, j = e.fini ? e.premiers[0] : e.joueur, pl=Y.players[j];

  $("yaTurn").textContent = e.fini ? t("ya.done") : tf("ya.turn",{name:pl.label});
  $("yaTourLabel").textContent = tf("ya.tour",{n:Math.min(e.tour, YA_TOURS)});
  $("s-ygame").style.setProperty("--c", pl.hex);
  /* l'ordre se tire au sort avant le premier tour, une seule fois */
  var tirable = !e.fini && !Y.tire && !Y.tours.length && Y.players.length>1;
  $("yaTirer").hidden = !tirable;
  $("yaTourLabel").hidden = tirable;

  var host=$("yaScores");
  host.innerHTML="";
  Y.players.forEach(function(p,i){
    var row=el("div","ya-score"+(i===j && !e.fini ? " on" : "")+(e.fini && e.premiers.indexOf(i)>=0 ? " win" : ""));
    row.style.setProperty("--c",p.hex);
    row.appendChild(el("i","dot"));
    row.appendChild(el("span","who",p.label));
    row.appendChild(el("span","sc num",String(e.fiches[i].total)));
    host.appendChild(row);
  });
  var actif=host.children[j];
  if(actif && host.scrollWidth>host.clientWidth) actif.scrollIntoView({block:"nearest", inline:"nearest"});

  $("yaDesLab").textContent = tf("ya.dice.count",{n:Y.saisie.length});
  $("yaEffacer").disabled = e.fini || !Y.saisie.length;
  yaPeindreDes($("yaDes"), $("yaPave"), Y.saisie, yaAjouter, yaRetirer, e.fini);
  yaPeindreFiche(e.fiches[j], e.fini);

  var btn=$("yaValider"), complet=Y.saisie.length===5;
  btn.classList.remove("barrer");
  if(e.fini){ btn.disabled=true; btn.textContent=t("ya.done"); }
  else if(!complet){ btn.disabled=true; btn.textContent=t("ya.enter"); }
  else if(!Y.choix){ btn.disabled=true; btn.textContent=t("ya.pick"); }
  else{
    var p=yaPoints(Y.choix, Y.saisie), nom=t("ya.c."+Y.choix);
    btn.disabled=false;
    btn.textContent = p ? tf("ya.write",{n:p, "case":nom}) : tf("ya.cross",{"case":nom});
    btn.classList.toggle("barrer", !p);
  }
}

/* La fiche du joueur qui lance : ce qui est inscrit, et pour chaque case
   libre ce qu'elle rapporterait avec les dés saisis. */
function yaPeindreFiche(f, fini){
  var host=$("yaFiche"), complet=Y.saisie.length===5;
  host.innerHTML="";
  [true,false].forEach(function(haut){
    var col=el("div","ya-col");
    col.appendChild(el("p","eyebrow",t(haut ? "ya.upper" : "ya.lower")));
    YA_CASES.filter(function(c){ return !!c.haut===haut; }).forEach(function(c){
      var pris = f.cases[c.id]!==undefined;
      var b=el("button","ya-case");
      b.type="button";
      b.appendChild(el("span","lab",t("ya.c."+c.id)));
      var val="";
      if(pris){
        b.classList.add("prise");
        if(!f.cases[c.id]) b.classList.add("barree");
        b.disabled=true;
        val=String(f.cases[c.id]);
      }else{
        if(complet){
          var p=yaPoints(c.id, Y.saisie);
          b.classList.add("pot");
          if(!p) b.classList.add("zero");
          val=String(p);
        }
        if(Y.choix===c.id) b.classList.add("on");
        b.disabled=fini;
        b.setAttribute("aria-pressed", Y.choix===c.id ? "true" : "false");
        b.addEventListener("click",function(){
          Y.choix = Y.choix===c.id ? null : c.id;
          buzz(6);
          save();
          renderYGame();
        });
      }
      b.appendChild(el("span","val num",val));
      col.appendChild(b);
    });
    if(haut){
      var st=el("div","ya-bilan");
      st.appendChild(el("span",null,t("ya.subtotal")));
      st.appendChild(el("b","num",f.haut+" / "+YA_SEUIL));
      col.appendChild(st);
      var bo=el("div","ya-bilan"+(f.bonus ? " ok" : ""));
      bo.appendChild(el("span",null,t("ya.bonus")));
      bo.appendChild(el("b","num", f.bonus ? "+"+YA_BONUS : "—"));
      col.appendChild(bo);
    }else{
      var tot=el("div","ya-bilan total");
      tot.appendChild(el("span",null,t("ya.total")));
      tot.appendChild(el("b","num",String(f.total)));
      col.appendChild(tot);
    }
    host.appendChild(col);
  });
}

function yaValider(){
  if(!Y || !YE || YE.fini || Y.saisie.length!==5 || !Y.choix) return;
  if(YE.fiches[YE.joueur].cases[Y.choix]!==undefined) return;
  var p=yaPoints(Y.choix, Y.saisie);
  Y.tours.push({ c:Y.choix, d:Y.saisie.slice() });
  Y.saisie=[];
  Y.choix=null;
  yaApresChangement(p ? 14 : [12,40,12]);
}

function yaApresChangement(vibration){
  var avant = YE ? YE.fini : false;
  YE=yaRejouer();
  buzz(vibration);
  /* l'archivage précède la sauvegarde : fermer l'app sur l'écran de fin
     ne doit pas faire perdre la partie au palmarès */
  if(YE.fini && !avant){
    yaFermerFeuille();
    yaArchiver();
    save();
    renderYGame();
    setTimeout(renderYOver, 620);
  }else{
    save();
    renderYGame();
    if($("yaSheetWrap").classList.contains("on")) renderYSheet();
  }
}

/* --- tirage au sort de l'ordre ----------------------------------- */
/* Le rouleau du cornhole, rang par rang : il s'arrête sur l'un des joueurs
   qui restent, qui prend la place suivante. Le dernier n'a pas besoin de
   tirage. L'ordre ne s'enregistre qu'une fois tiré en entier : fermer
   l'app pendant le rouleau laisse la partie telle qu'elle était. */
var YA_CELL = 72;          /* hauteur d'une case du rouleau, cf. .cell */
var yaTirageFini = true;

function yaTirer(){
  if(!Y || Y.tire || Y.tours.length || Y.players.length<2 || !yaTirageFini) return;
  Y.tire=true;
  yaTirageFini=false;
  var restants=Y.players.slice(), ordre=[];
  var wrap=$("yaTirage"), strip=$("yaReelStrip"), reel=$("yaReel"), liste=$("yaOrdre"), out=$("yaTirageOut");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  liste.innerHTML="";
  out.textContent=t("toss.running");
  $("yaTirageOk").hidden=true;
  wrap.style.setProperty("--flash", restants[0].hex);
  wrap.hidden=false;
  wrap.classList.add("on");

  function placer(p){
    ordre.push(p);
    restants.splice(restants.indexOf(p),1);
    var li=el("li");
    li.style.setProperty("--c",p.hex);
    li.appendChild(el("span","n num",String(ordre.length)));
    li.appendChild(el("i"));
    li.appendChild(el("b",null,p.label));
    liste.appendChild(li);
  }
  function suivant(){
    if(restants.length===1){ placer(restants[0]); finir(); return; }
    var gagnant=restants[Math.floor(Math.random()*restants.length)];
    tourner(gagnant, ordre.length ? 950 : 1700, function(){ placer(gagnant); suivant(); });
  }
  function finir(){
    Y.players=ordre;
    YE=yaRejouer();
    yaTirageFini=true;
    var premier=ordre[0];
    out.innerHTML="";
    var parts=tf("ya.draw.first",{name:" "}).split(" ");
    out.appendChild(document.createTextNode(parts[0]||""));
    var b=el("b",null,premier.label);
    b.style.color="color-mix(in oklab,"+premier.hex+" 62%,var(--tone))";
    out.appendChild(b);
    out.appendChild(document.createTextNode(parts[1]||""));
    /* le rouleau finit sur celui qui commence, pas sur le dernier tiré */
    strip.innerHTML="";
    strip.style.transform="translateY(0)";
    strip.style.filter="none";
    var c=el("div","cell");
    c.style.setProperty("--c",premier.hex);
    c.appendChild(el("i"));
    c.appendChild(el("span",null,premier.label));
    strip.appendChild(c);
    reel.classList.remove("locked");
    void reel.offsetWidth;
    reel.style.setProperty("--win",premier.hex);
    reel.classList.add("locked");
    wrap.style.setProperty("--flash",premier.hex);
    $("yaTirageOk").hidden=false;
    buzz([16,55,30]);
    save();
    renderYGame();
  }
  /* un tour de rouleau parmi les joueurs restants, arrêté sur `gagnant` :
     les cases défilent dans l'ordre des restants, la dernière le porte */
  function tourner(gagnant, dur, fin){
    var m=restants.length, base=14+m;
    var cells=base+((restants.indexOf(gagnant)-base)%m+m)%m;
    strip.innerHTML="";
    strip.style.transform="translateY(0)";
    strip.style.filter="none";
    reel.classList.remove("locked");
    for(var i=0;i<=cells;i++){
      var p=restants[i%m], c=el("div","cell");
      c.style.setProperty("--c",p.hex);
      c.appendChild(el("i"));
      c.appendChild(el("span",null,p.label));
      strip.appendChild(c);
    }
    function land(){
      strip.style.filter="none";
      strip.style.transform="translateY("+(-cells*YA_CELL)+"px)";
      void reel.offsetWidth;          /* relance l'animation de verrouillage */
      reel.style.setProperty("--win",gagnant.hex);
      reel.classList.add("locked");
      wrap.style.setProperty("--flash",gagnant.hex);
      buzz(14);
      if(reduce) fin(); else setTimeout(fin, 520);
    }
    if(reduce){ land(); return; }
    var t0=null, prev=0, idx=-1;
    function frame(now){
      if(t0===null) t0=now;
      var prog=Math.min(1,(now-t0)/dur);
      var off=(1-Math.pow(1-prog,4))*cells*YA_CELL;
      var v=off-prev; prev=off;
      strip.style.transform="translateY("+(-off)+"px)";
      strip.style.filter = v>1.5 ? "blur("+Math.min(5,v*0.22)+"px)" : "none";
      var k=Math.round(off/YA_CELL);
      if(k!==idx){
        idx=k;
        wrap.style.setProperty("--flash",restants[k%m].hex);
        if(v<14) buzz(3);      /* le cliquetis n'apparaît qu'au ralenti */
      }
      if(prog<1) requestAnimationFrame(frame); else land();
    }
    requestAnimationFrame(frame);
  }
  suivant();
}
function yaFermerTirage(){
  if(!yaTirageFini) return;
  var wrap=$("yaTirage");
  wrap.hidden=true;
  wrap.classList.remove("on");
}

/* --- feuille de match -------------------------------------------- */
function renderYSheet(){
  var body=$("yaSheetBody");
  body.innerHTML="";
  $("yaEdSave").hidden = !YEDIT;
  $("yaUndo").hidden   = !!YEDIT;
  $("yaQuit").hidden   = !!YEDIT;
  if(YEDIT){ renderYEditeur(body); return; }
  $("yaUndo").disabled = !Y.tours.length || YE.fini;

  if(!Y.tours.length){
    body.appendChild(el("p","empty",t("ya.sheet.empty")));
    return;
  }
  var wrap=el("div","ya-table-wrap"), table=el("table","ya-table");
  var thead=el("thead"), htr=el("tr");
  htr.appendChild(el("th"));
  Y.players.forEach(function(p){
    var th=el("th"), qui=el("span","qui"), dot=el("i");
    dot.style.background=p.hex;
    qui.appendChild(dot);
    qui.appendChild(el("span",null,p.label));
    th.appendChild(qui);
    htr.appendChild(th);
  });
  thead.appendChild(htr);
  table.appendChild(thead);

  var tbody=el("tbody");
  function bilan(cls, lib, valeur){
    var tr=el("tr",cls);
    tr.appendChild(el("td",null,lib));
    YE.fiches.forEach(function(f){ tr.appendChild(el("td","num",valeur(f))); });
    tbody.appendChild(tr);
  }
  YA_CASES.forEach(function(c){
    var tr=el("tr");
    tr.appendChild(el("td",null,t("ya.c."+c.id)));
    YE.fiches.forEach(function(f){
      var td=el("td");
      if(f.cases[c.id]===undefined){
        td.appendChild(el("span","libre","·"));
      }else{
        var k=f.tours[c.id];
        var b=el("button","ya-cell num"+(f.cases[c.id] ? "" : " zero"),String(f.cases[c.id]));
        b.type="button";
        b.setAttribute("aria-label",tf("ya.fix.aria",{"case":t("ya.c."+c.id), name:Y.players[k%Y.players.length].label}));
        b.addEventListener("click",function(){ yaOuvrirEditeur(k); });
        td.appendChild(b);
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
    if(c.id==="6"){
      bilan("bilan", t("ya.subtotal"), function(f){ return String(f.haut); });
      bilan("bilan", t("ya.bonus"), function(f){ return f.bonus ? "+"+YA_BONUS : "—"; });
    }
  });
  bilan("total", t("ya.total"), function(f){ return String(f.total); });
  table.appendChild(tbody);
  wrap.appendChild(table);
  body.appendChild(wrap);
  body.appendChild(el("p","hint",t("ya.sheet.hint")));
}

function yaOuvrirEditeur(k){
  var tr=Y.tours[k];
  if(!tr) return;
  YEDIT={ k:k, d:tr.d.slice(), c:tr.c };
  renderYSheet();
}
function yaFermerEditeur(){ YEDIT=null; renderYSheet(); }

/* Corriger un tour : ses dés, et sa case parmi celles encore libres pour
   ce joueur — la sienne comprise. */
function renderYEditeur(body){
  var n=Y.players.length, j=YEDIT.k%n, pl=Y.players[j], f=YE.fiches[j];
  var head=el("div","ed-head");
  head.appendChild(el("p","eyebrow",tf("ya.edit.title",{name:pl.label, n:Math.floor(YEDIT.k/n)+1})));
  var back=el("button","ed-back",t("edit.cancel"));
  back.type="button";
  back.addEventListener("click",yaFermerEditeur);
  head.appendChild(back);
  body.appendChild(head);

  var ed=el("div","ya-ed");
  ed.style.setProperty("--c",pl.hex);
  ed.appendChild(el("p","eyebrow",tf("ya.dice.count",{n:YEDIT.d.length})));
  var des=el("div","ya-des"), pave=el("div","ya-pave");
  ed.appendChild(des);
  ed.appendChild(pave);
  yaPeindreDes(des, pave, YEDIT.d,
    function(v){ if(YEDIT.d.length<5){ YEDIT.d.push(v); yaDernier=v; renderYSheet(); } },
    function(v){ var i=YEDIT.d.indexOf(v); if(i>=0){ YEDIT.d.splice(i,1); renderYSheet(); } });

  ed.appendChild(el("p","eyebrow",t("ya.edit.case")));
  var choix=el("div","ya-choix"), sienne=Y.tours[YEDIT.k].c;
  YA_CASES.forEach(function(c){
    if(f.cases[c.id]!==undefined && c.id!==sienne) return;
    var b=el("button","ya-chip"+(YEDIT.c===c.id ? " on" : ""));
    b.type="button";
    b.setAttribute("aria-pressed", YEDIT.c===c.id ? "true" : "false");
    b.appendChild(el("span",null,t("ya.c."+c.id)));
    b.appendChild(el("b","num", YEDIT.d.length===5 ? String(yaPoints(c.id, YEDIT.d)) : "·"));
    b.addEventListener("click",function(){ YEDIT.c=c.id; renderYSheet(); });
    choix.appendChild(b);
  });
  ed.appendChild(choix);
  body.appendChild(ed);
  $("yaEdSave").disabled = YEDIT.d.length!==5;
}

function yaOuvrirFeuille(){
  YEDIT=null;
  renderYSheet();
  yaArmerQuitter(false);
  $("yaSheetWrap").classList.add("on");
}
function yaFermerFeuille(){
  $("yaSheetWrap").classList.remove("on");
  YEDIT=null;
}
function yaArmerQuitter(on){
  var b=$("yaQuit");
  b.dataset.armed = on ? "1" : "0";
  b.textContent = on ? t("sheet.quit.confirm") : t("sheet.quit");
}

/* --- archivage et fin de partie ---------------------------------- */
/* Une égalité s'archive sans vainqueur (w à -1). Le record se mesure aux
   parties de yams déjà enregistrées : la toute première n'en bat aucun. */
function yaArchiver(){
  if(!Y || Y.archived || !YE || !YE.fini) return;
  var totaux=YE.fiches.map(function(f){ return f.total; });
  var passees=H.filter(function(x){ return x.g==="yams"; });
  var avant=0;
  passees.forEach(function(x){ x.s.forEach(function(v){ if(v>avant) avant=v; }); });
  Y.record = passees.length>0 && Math.max.apply(null,totaux)>avant;
  H.unshift({
    d:Date.now(), g:"yams",
    n:Y.players.map(function(p){ return p.label; }),
    c:Y.players.map(function(p){ return p.hex; }),
    s:totaux, w:YE.gagnant, r:YA_TOURS, t:false
  });
  if(H.length>200) H.length=200;
  Y.archived=true;
}

function yaClassement(){
  return Y.players.map(function(p,i){ return i; }).sort(function(a,b){
    return (YE.fiches[b].total-YE.fiches[a].total) || (a-b);
  });
}
function yaRang(i){
  var mien=YE.fiches[i].total, r=1;
  YE.fiches.forEach(function(f){ if(f.total>mien) r++; });
  return r;
}

function renderYOver(){
  if(!Y || !YE || !YE.fini) return;
  var e=YE, box=$("over"), tete=e.premiers[0], solo=Y.players.length===1;
  box.innerHTML="";
  box.style.setProperty("--team",Y.players[tete].hex);

  var head=el("div","over-head reveal");
  head.appendChild(el("p","eyebrow",tf("ya.over.eyebrow",{n:YA_TOURS})));
  head.appendChild(el("h2",null, e.egalite ? t("ya.tie")
    : (solo ? tf("ya.solo",{name:Y.players[0].label}) : tf("over.wins",{name:Y.players[e.gagnant].label}))));
  var fin=el("div","final");
  fin.appendChild(el("span","a",String(e.fiches[tete].total)));
  fin.appendChild(el("span","s",t("ya.points")));
  head.appendChild(fin);
  if(Y.record) head.appendChild(el("span","ya-record",t("ya.record")));
  box.appendChild(head);

  var card=el("div","tale reveal");
  card.style.animationDelay="80ms";
  var top=el("div","tale-top");
  top.appendChild(el("p","eyebrow",t(solo ? "ya.sheet" : "ya.rank")));
  top.appendChild(el("p","eyebrow",t("ya.name")));
  card.appendChild(top);

  var table=el("table","ya-rang"), thead=el("thead"), htr=el("tr");
  ["", t("ya.upper"), t("ya.bonus"), t("ya.lower"), t("ya.total")].forEach(function(x){ htr.appendChild(el("th",null,x)); });
  thead.appendChild(htr);
  table.appendChild(thead);
  var tbody=el("tbody");
  yaClassement().forEach(function(i){
    var p=Y.players[i], f=e.fiches[i];
    var tr=el("tr", e.premiers.indexOf(i)>=0 ? "win" : null);
    var td=el("td"), who=el("div","who"), dot=el("i");
    dot.style.background=p.hex;
    who.appendChild(dot);
    who.appendChild(el("span",null,(solo ? "" : yaRang(i)+". ")+p.label));
    td.appendChild(who);
    tr.appendChild(td);
    tr.appendChild(el("td",null,String(f.haut)));
    tr.appendChild(el("td",null, f.bonus ? "+"+YA_BONUS : "—"));
    tr.appendChild(el("td",null,String(f.bas)));
    tr.appendChild(el("td","total",String(f.total)));
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  card.appendChild(table);
  box.appendChild(card);

  var acts=el("div","over-acts reveal");
  acts.style.animationDelay="160ms";
  var share=el("button","share-btn",t("share.result"));
  share.type="button";
  share.addEventListener("click",yaPartager);
  acts.appendChild(share);
  var again=el("button","cta",t(solo ? "ya.again" : "over.rematch"));
  again.type="button";
  again.addEventListener("click",yaNouvellePartie);
  acts.appendChild(again);
  var back=el("button","cta ghost",t("over.newsetup"));
  back.type="button";
  back.addEventListener("click",function(){ Y=null; YE=null; save(); show("ysetup"); renderYSetup(); });
  acts.appendChild(back);
  box.appendChild(acts);

  show("over");
  buzz([14,60,26]);
}

function yaPartager(){
  if(!Y || !YE || !YE.fini) return;
  var lignes=[t("ya.name")];
  yaClassement().forEach(function(i){
    lignes.push((Y.players.length>1 ? yaRang(i)+". " : "")+Y.players[i].label+" — "+YE.fiches[i].total);
  });
  lignes.push("ScoreToss");
  shareText(lignes.join("\n"));
}

/* --- état enregistré --------------------------------------------- */
function yaNormYS(ys){
  ys.open=-1;
  if(!ys.count || ys.count<YA_MIN || ys.count>YA_MAX) ys.count=2;
  ys.players.forEach(function(pl,i){
    if(typeof pl.name!=="string") pl.name="";
    if(!pl.color) pl.color=YA_TEINTES[i];
  });
  return ys;
}
function yaDeValide(v){ return v===1 || v===2 || v===3 || v===4 || v===5 || v===6; }
function yaNormY(y){
  y.tours=(y.tours||[]).filter(function(tr){
    return tr && YA_IDS.indexOf(tr.c)>=0 && tr.d && tr.d.length===5 && tr.d.every(yaDeValide);
  });
  y.saisie=(y.saisie||[]).filter(yaDeValide).slice(0,5);
  if(YA_IDS.indexOf(y.choix)<0) y.choix=null;
  y.tire=!!y.tire;
  return y;
}

/* --- commandes --------------------------------------------------- */
$("yaToGames").addEventListener("click",retourAuxJeux);
$("yaHall").addEventListener("click",function(){ HALL_BACK="ysetup"; renderHall(); show("hall"); });
$("yaMinus").addEventListener("click",function(){
  if(YS.count>YA_MIN){ YS.count--; YS.open=-1; renderYSetup(); save(); }
});
$("yaPlus").addEventListener("click",function(){
  if(YS.count<YA_MAX){ YS.count++; YS.open=-1; renderYSetup(); save(); }
});
$("yaOpenRules").addEventListener("click",openRules);
$("yaOpenAbout").addEventListener("click",openAbout);
$("yaStart").addEventListener("click",yaNouvellePartie);

$("yaEffacer").addEventListener("click",function(){
  if(!Y || !Y.saisie.length) return;
  Y.saisie=[];
  buzz(8);
  save();
  renderYGame();
});
$("yaValider").addEventListener("click",yaValider);
$("yaTirer").addEventListener("click",yaTirer);
$("yaTirage").addEventListener("click",yaFermerTirage);

$("yaSheetBtn").addEventListener("click",yaOuvrirFeuille);
$("yaSheetClose").addEventListener("click",yaFermerFeuille);
$("yaScrim").addEventListener("click",yaFermerFeuille);
$("yaEdSave").addEventListener("click",function(){
  if(!YEDIT || YEDIT.d.length!==5) return;
  Y.tours[YEDIT.k]={ c:YEDIT.c, d:YEDIT.d.slice() };
  YEDIT=null;
  yaApresChangement(10);
});
/* Annuler le dernier tour rend ses dés à la saisie : il ne reste qu'à
   choisir une autre case. */
$("yaUndo").addEventListener("click",function(){
  if(!Y || !Y.tours.length || (YE && YE.fini)) return;
  var tr=Y.tours.pop();
  Y.saisie=tr.d.slice();
  Y.choix=null;
  yaFermerFeuille();
  yaApresChangement(10);
});
$("yaQuit").addEventListener("click",function(){
  var b=$("yaQuit");
  if(b.dataset.armed!=="1"){
    yaArmerQuitter(true);
    setTimeout(function(){ if(b.dataset.armed==="1") yaArmerQuitter(false); },4000);
    return;
  }
  yaFermerFeuille();
  Y=null;
  YE=null;
  buzz(12);
  save();
  show("ysetup");
  renderYSetup();
});

/* --- fiche de règles --------------------------------------------- */
function fillYamsRules(host){
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
  bloc(t("yrules.upper"), [["1–6",t("yrules.upper.sum")], ["+35",t("yrules.bonus")]]);
  bloc(t("yrules.lower"), [
    ["Σ",t("yrules.brelan")], ["Σ",t("yrules.carre")], ["25",t("yrules.full")],
    ["30",t("yrules.psuite")], ["40",t("yrules.gsuite")], ["50",t("yrules.yams")], ["Σ",t("yrules.chance")]
  ]);

  var deroule=el("div","block");
  deroule.appendChild(el("p","eyebrow",t("yrules.flow")));
  var list=el("ul","rulist");
  [1,2,3,4,5].forEach(function(k){
    var li=document.createElement("li");
    li.appendChild(document.createTextNode(t("yrules."+k+"a")));
    li.appendChild(el("b",null,t("yrules."+k+"b")));
    li.appendChild(document.createTextNode(t("yrules."+k+"c")));
    list.appendChild(li);
  });
  deroule.appendChild(list);
  host.appendChild(deroule);
}
