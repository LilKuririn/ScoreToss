/* Fléchettes.

   501 et 301, fin obligatoire sur un double, en une seule manche. Chacun
   lance trois fléchettes par volée, dont le total est retiré de son score.
   Passer sous 0, tomber à 1 ou atteindre 0 sans double annule la volée :
   le score revient à celui de son début.

   La saisie se fait sur une cible dessinée : on pose le doigt, on glisse
   pour ajuster, et la fléchette compte au lever du doigt. Les anneaux
   double et triple sont élargis : aux vraies proportions, ils ne feraient
   que quelques pixels sur un téléphone. */
declarerJeu({
  id:"flechettes",
  famille:"tours",
  categorie:"interieur",
  nom:function(){ return t("fl.name"); },
  regles:fillFlechettesRules,
  ecrans:["fsetup","fgame"],
  lienPalmares:"flHall",
  retour:{
    fiches:[["flSheetWrap","flSheetClose"]],
    ecrans:[["s-fsetup","flToGames"]]
  },

  auChangementDEcran:function(nom){
    if(nom!=="fgame") flFermerFeuille();
    if(nom==="fsetup") refreshHallLink();
  },
  sauver:function(o){ o.fs=FS; o.f=F; },
  charger:function(d){
    if(d && d.fs && d.fs.players && d.fs.players.length===FL_MAX) FS=flNormFS(d.fs);
    if(d && d.f && d.f.players && d.f.players.length>=FL_MIN){ F=flNormF(d.f); FE=flRejouer(); }
    renderFSetup();
  },
  importer:function(d){
    FS = flNormFS((d.fs && d.fs.players && d.fs.players.length===FL_MAX) ? d.fs : {players:flJoueursVides()});
    F = (d.f && d.f.players && d.f.players.length>=FL_MIN) ? flNormF(d.f) : null;
    FE = F ? flRejouer() : null;
    renderFSetup();
  },
  reprendre:function(){
    if(!F || !FE || FE.gagnant>=0) return false;
    show("fgame");
    renderFGame();
    keepAwake();
    return true;
  },
  changementDeLangue:function(){
    renderFSetup();
    if(F && $("s-fgame").classList.contains("on")) renderFGame();
  },

  ouvrir:function(){
    if(!S.tgt) S.tgt=ciblesParDefaut();
    if(jeu(S.game).famille==="duel"){
      S.tgt[S.game]=S.target;
      TOUR[S.game]=T;
      DRAFT[S.game]=TS;
    }
    S.game="flechettes";
    T=null;
    fillRules("rulesBody");
    save();
    show("fsetup");
    renderFSetup();
  }
});

var FL_MIN = 2;
var FL_MAX = 8;
var FL_PER_MIN = 2;
var FL_PER_MAX = 4;
var FL_DEPARTS = [501, 301];
var FL_TEINTES = ["rouge","bleu","vert","ambre","violet","sarcelle","rose","or"];

/* L'ordre des secteurs, dans le sens des aiguilles d'une montre depuis le
   20, et les rayons des anneaux en fraction du rayon extérieur du double. */
var FL_ORDRE = [20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];
var FL_ANNEAUX = {db:.085, bull:.17, tIn:.44, tOut:.60, dIn:.80};

function flJoueursVides(){
  var a=[];
  for(var i=0;i<FL_MAX;i++) a.push({name:"", color:FL_TEINTES[i], mates:["","","",""]});
  return a;
}
var FS = { count:2, mode:"solo", per:2, depart:501, open:-1, players:flJoueursVides() };
var F  = null;      /* la partie : ses joueurs et ses fléchettes, rien d'autre */
var FE = null;      /* ce qui s'en déduit, recalculé à chaque changement */
var FEDIT = null;   /* la fléchette en cours de correction */

function flNom(i){
  var v=(FS.players[i].name||"").trim();
  return v || tf(FS.mode==="team" ? "fl.teamn" : "fl.playern",{n:i+1});
}
function flCoequipier(i,j){
  var v=((FS.players[i].mates||[])[j]||"").trim();
  return v || (t("team.player")+" "+(j+1));
}

/* Le nom d'une fléchette : 20, D20, T20, 25, 50, ou Raté. */
function flLib(d){
  if(!d.m) return t("fl.miss");
  if(d.s===25) return String(d.v);
  return (d.m===3 ? "T" : d.m===2 ? "D" : "")+d.s;
}

/* --- préparation ------------------------------------------------- */
function renderFSetup(){
  var eq = FS.mode==="team";
  var kids=$("flMode").children, i;
  for(i=0;i<kids.length;i++) kids[i].classList.toggle("on", kids[i].dataset.mode===FS.mode);
  fillChips($("flDepart"), FL_DEPARTS, FS.depart, "depart");

  $("flCountLab").textContent=t(eq ? "fl.teams" : "fl.players");
  $("flNote").textContent=tf(eq ? "fl.note.team" : "fl.note",{n:FS.count, d:FS.depart});
  $("flVal").textContent=FS.count;
  $("flMinus").disabled = FS.count<=FL_MIN;
  $("flPlus").disabled  = FS.count>=FL_MAX;

  $("flPerBlock").hidden = !eq;
  $("flPerVal").textContent=FS.per;
  $("flPerMinus").disabled = FS.per<=FL_PER_MIN;
  $("flPerPlus").disabled  = FS.per>=FL_PER_MAX;

  renderFRows();
}

function renderFRows(){
  var host=$("flRows");
  host.innerHTML="";
  host.style.display="flex";
  host.style.flexDirection="column";
  host.style.gap="0";
  var eq = FS.mode==="team";

  for(var k=0;k<FS.count;k++){
    (function(k){
      var pl=FS.players[k];
      var row=el("div","trow");
      row.appendChild(el("span","seed",String(k+1).padStart(2,"0")));

      var pick=el("button","pick");
      pick.type="button";
      pick.style.setProperty("--c",color(pl.color).hex);
      pick.setAttribute("aria-label",tf("fl.color.aria",{n:k+1}));
      pick.setAttribute("aria-expanded", FS.open===k ? "true":"false");
      pick.appendChild(el("i"));
      pick.addEventListener("click",function(){
        FS.open = FS.open===k ? -1 : k;
        renderFRows();
      });
      row.appendChild(pick);

      var name=el("input","field-input");
      name.type="text";
      name.value=pl.name;
      name.maxLength=22;
      name.placeholder=tf(eq ? "fl.teamn" : "fl.playern",{n:k+1});
      name.setAttribute("aria-label",tf(eq ? "fl.team.aria" : "fl.player.aria",{n:k+1}));
      name.addEventListener("input",function(){ pl.name=name.value; save(); });
      row.appendChild(name);
      host.appendChild(row);

      if(eq){
        if(!pl.mates) pl.mates=["","","",""];
        var mates=el("div","mates fl-mates");
        for(var j=0;j<FS.per;j++){
          (function(j){
            var mi=el("input","field-input");
            mi.type="text";
            mi.value=pl.mates[j]||"";
            mi.maxLength=16;
            mi.placeholder=t("team.player")+" "+(j+1);
            mi.setAttribute("aria-label",tf("fl.mate.aria",{j:j+1, n:k+1}));
            mi.addEventListener("input",function(){ pl.mates[j]=mi.value; save(); });
            mates.appendChild(mi);
          })(j);
        }
        host.appendChild(mates);
      }

      var sw=el("div","trow-sw swatches");
      sw.hidden = FS.open!==k;
      COLORS.forEach(function(col){
        var b=el("button","sw");
        b.type="button";
        b.style.setProperty("--c",col.hex);
        b.setAttribute("aria-pressed", col.id===pl.color ? "true":"false");
        b.setAttribute("aria-label",t("color.aria")+" "+t("color."+col.id));
        b.addEventListener("click",function(){
          pl.color=col.id; FS.open=-1;
          renderFRows(); save();
        });
        sw.appendChild(b);
      });
      host.appendChild(sw);
    })(k);
  }
}

/* --- décompte ---------------------------------------------------- */
function flNouvellePartie(){
  F={ depart:FS.depart, mode:FS.mode, players:[], darts:[] };
  for(var i=0;i<FS.count;i++){
    var mates=[];
    if(FS.mode==="team"){ for(var j=0;j<FS.per;j++) mates.push(flCoequipier(i,j)); }
    F.players.push({ label:flNom(i), hex:color(FS.players[i].color).hex, mates:mates });
  }
  FE=flRejouer();
  FEDIT=null;
  show("fgame");
  renderFGame();
  save();
  keepAwake();
}

/* En équipe, les membres lancent à tour de rôle, une volée chacun ; celui
   qui lance se déduit du nombre de volées déjà jouées par l'équipe. */
function flMembre(p, rang){
  var pl=F.players[p];
  if(F.mode!=="team" || !pl || !pl.mates || !pl.mates.length) return null;
  return pl.mates[rang % pl.mates.length];
}

/* Tout se déduit des fléchettes : qui lance, les volées, les busts, le
   vainqueur. Corriger une fléchette d'il y a dix volées rejoue la suite. */
function flRejouer(){
  var n=F.players.length, score=[], parJoueur=[], i;
  for(i=0;i<n;i++){ score.push(F.depart); parJoueur.push(0); }
  var e={ score:score, volees:[], gagnant:-1 };
  var j=0, debut=F.depart, volee=[];
  for(var k=0;k<F.darts.length;k++){
    var d=F.darts[k];
    volee.push(k);
    var reste=score[j]-d.v;
    var bust = reste<0 || reste===1 || (reste===0 && d.m!==2);
    score[j] = bust ? debut : reste;
    var gagne = !bust && reste===0;
    if(bust || gagne || volee.length===3){
      e.volees.push({ joueur:j, membre:flMembre(j, parJoueur[j]), darts:volee, bust:bust, debut:debut, reste:score[j] });
      parJoueur[j]++;
      if(gagne){ e.gagnant=j; break; }
      j=(j+1)%n;
      debut=score[j];
      volee=[];
    }
  }
  e.joueur=j;
  e.debut=debut;
  e.volee=e.gagnant>=0 ? [] : volee;
  e.membre=e.gagnant>=0 ? null : flMembre(j, parJoueur[j]);
  return e;
}

function flLancer(d){
  if(!F || !FE || FE.gagnant>=0) return;
  F.darts.push({ s:d.s, m:d.m, v:d.v });
  flApresChangement(d.v ? 12 : 6);
}

function flApresChangement(vibration){
  var avant = FE ? FE.gagnant : -1;
  FE=flRejouer();
  var der=FE.volees[FE.volees.length-1];
  var bust = der && der.bust && der.darts[der.darts.length-1]===F.darts.length-1;
  buzz(bust ? [20,50,20] : vibration);
  /* l'archivage précède la sauvegarde : fermer l'app sur l'écran de
     victoire ne doit pas faire perdre la partie au palmarès */
  if(FE.gagnant>=0 && avant<0){
    flFermerFeuille();
    flArchiver();
    save();
    renderFGame();
    setTimeout(renderFOver, 620);
  }else{
    save();
    renderFGame();
    if($("flSheetWrap").classList.contains("on")) renderFSheet();
  }
}

/* --- la cible ---------------------------------------------------- */
var FL_NS = "http://www.w3.org/2000/svg";
function flPoint(r,deg){ var a=(deg-90)*Math.PI/180; return [r*Math.cos(a), r*Math.sin(a)]; }
function flSecteur(r0,r1,d0,d1){
  var A=flPoint(r1,d0), B=flPoint(r1,d1), C=flPoint(r0,d1), D=flPoint(r0,d0);
  return "M"+A[0].toFixed(2)+" "+A[1].toFixed(2)+"A"+r1+" "+r1+" 0 0 1 "+B[0].toFixed(2)+" "+B[1].toFixed(2)+
         "L"+C[0].toFixed(2)+" "+C[1].toFixed(2)+"A"+r0+" "+r0+" 0 0 0 "+D[0].toFixed(2)+" "+D[1].toFixed(2)+"Z";
}
function flDisque(r){ return "M"+(-r)+" 0A"+r+" "+r+" 0 1 0 "+r+" 0A"+r+" "+r+" 0 1 0 "+(-r)+" 0Z"; }
function flBandes(){
  var a=FL_ANNEAUX;
  return [[a.bull*100,a.tIn*100,1],[a.tIn*100,a.tOut*100,3],[a.tOut*100,a.dIn*100,1],[a.dIn*100,100,2]];
}
function flForme(tag, attrs){
  var e=document.createElementNS(FL_NS,tag);
  for(var k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

/* Le segment sous un point du plan de la cible, ou null hors cible. */
function flSegment(x,y){
  var r=Math.hypot(x,y)/100, a=FL_ANNEAUX;
  if(r>1) return null;
  if(r<=a.db)   return {s:25, m:2, v:50, forme:flDisque(a.db*100)};
  if(r<=a.bull) return {s:25, m:1, v:25, forme:flDisque(a.bull*100)+flDisque(a.db*100)};
  var deg=(Math.atan2(x,-y)*180/Math.PI+369)%360;
  var i=Math.floor(deg/18), n=FL_ORDRE[i], d0=i*18-9;
  var b=flBandes().filter(function(z){ return r<=z[1]/100; })[0];
  return {s:n, m:b[2], v:n*b[2], forme:flSecteur(b[0],b[1],d0,d0+18)};
}
/* Le contour d'une fléchette déjà choisie, pour la montrer sur la cible. */
function flFormeDe(d){
  if(!d || !d.m) return "";
  var a=FL_ANNEAUX;
  if(d.s===25) return d.m===2 ? flDisque(a.db*100) : flDisque(a.bull*100)+flDisque(a.db*100);
  var i=FL_ORDRE.indexOf(d.s), d0=i*18-9;
  var bande = d.m===2 ? flBandes()[3] : d.m===3 ? flBandes()[1] : flBandes()[2];
  return flSecteur(bande[0],bande[1],d0,d0+18);
}

/* Décalage de la visée au doigt, en pixels CSS : environ 1 cm en haut à
   gauche du contact sur un téléphone. */
var FL_DECALAGE = {x:-37, y:-52};

/* Une fléchette dessinée pointe à l'origine, empennage vers +x, sur 100
   unités ; le doigt tient l'ailette, à FL_DARD_DOIGT de la pointe. Rapporté au
   décalage, ce repère fixe aussi la taille de la fléchette à l'écran. */
var FL_DARD_DOIGT = 86;
function flDard(){
  var g=flForme("g",{"class":"fl-dard"}), corps=flForme("g",{"class":"fl-dard-corps"});
  corps.appendChild(flForme("path",{d:"M0 0L31 -1.3L31 1.3Z","class":"pointe"}));
  corps.appendChild(flForme("rect",{x:30, y:-3.2, width:27, height:6.4, rx:2.4, "class":"fut"}));
  corps.appendChild(flForme("rect",{x:56, y:-1.2, width:22, height:2.4, "class":"tige"}));
  corps.appendChild(flForme("path",{d:"M72 0L86 -10L100 -10L94 0L100 10L86 10Z","class":"ailette"}));
  g.appendChild(corps);
  return g;
}

/* Dessine une cible dans `hote`. Pendant l'appui, `suivre` reçoit le
   segment visé ; au lever du doigt, `choisir` reçoit celui où il se trouve,
   ou null s'il est sorti de la cible. */
function flCible(hote, suivre, choisir){
  var svg=flForme("svg",{viewBox:"-121 -121 242 242","class":"fl-plan","aria-hidden":"true"});
  svg.appendChild(flForme("circle",{r:120,"class":"cadre"}));
  FL_ORDRE.forEach(function(n,i){
    var d0=i*18-9, clair=i%2===1;
    flBandes().forEach(function(b){
      svg.appendChild(flForme("path",{
        d:flSecteur(b[0],b[1],d0,d0+18),
        "class":"seg "+(b[2]===1 ? (clair ? "creme" : "noir") : (clair ? "vert" : "rouge"))
      }));
    });
    var q=flPoint(110,i*18);
    var tx=flForme("text",{x:q[0].toFixed(2), y:q[1].toFixed(2), dy:"0.35em", "class":"n"});
    tx.textContent=n;
    svg.appendChild(tx);
  });
  svg.appendChild(flForme("circle",{r:FL_ANNEAUX.bull*100,"class":"seg vert"}));
  svg.appendChild(flForme("circle",{r:FL_ANNEAUX.db*100,"class":"seg rouge"}));
  var choix=flForme("path",{d:"","class":"choix"});
  var surb=flForme("path",{d:"","class":"surb"});
  var dard=flDard();
  /* une fois plantée et effacée, la fléchette quitte l'affichage */
  dard.addEventListener("animationend",function(){ dard.classList.remove("plante"); });
  svg.appendChild(choix);
  svg.appendChild(surb);
  svg.appendChild(dard);
  hote.appendChild(svg);

  var appui=false;
  /* Le point visé, dans le plan de la cible. Au doigt, il est décalé en haut
     à gauche du contact, pour que le segment ne soit pas caché dessous ; la
     souris et le stylet, eux, visent exactement. */
  function viser(e){
    var m=svg.getScreenCTM();
    if(!m) return {d:null};
    var inv=m.inverse(), doigt=e.pointerType==="touch";
    var p=new DOMPoint(e.clientX+(doigt ? FL_DECALAGE.x : 0), e.clientY+(doigt ? FL_DECALAGE.y : 0)).matrixTransform(inv);
    return {d:flSegment(p.x,p.y), p:p, doigt:doigt ? new DOMPoint(e.clientX,e.clientY).matrixTransform(inv) : null};
  }
  /* La fléchette va du point visé au doigt : sa pointe marque la visée, son
     ailette est sous le doigt, et l'écart entre les deux paraît naturel. */
  function poserDard(v){
    var dx=v.doigt.x-v.p.x, dy=v.doigt.y-v.p.y;
    dard.setAttribute("transform",
      "translate("+v.p.x.toFixed(2)+" "+v.p.y.toFixed(2)+")"+
      " rotate("+(Math.atan2(dy,dx)*180/Math.PI).toFixed(1)+")"+
      " scale("+(Math.hypot(dx,dy)/FL_DARD_DOIGT).toFixed(3)+")");
  }
  function montrerVisee(v){
    surb.setAttribute("d", v.d ? v.d.forme : "");
    if(v.doigt) poserDard(v);
    suivre(v.d);
  }
  hote.addEventListener("pointerdown",function(e){
    if(hote.classList.contains("fini")) return;
    appui=true;
    try{ hote.setPointerCapture(e.pointerId); }catch(x){}
    var v=viser(e);
    dard.classList.remove("plante");
    dard.classList.toggle("vise", !!v.doigt);
    montrerVisee(v);
  });
  hote.addEventListener("pointermove",function(e){
    if(!appui) return;
    montrerVisee(viser(e));
  });
  hote.addEventListener("pointerup",function(e){
    if(!appui) return;
    appui=false;
    surb.setAttribute("d","");
    var v=viser(e);
    /* plantée si elle touche la cible, sinon elle disparaît simplement */
    if(dard.classList.contains("vise") && v.d) dard.classList.add("plante");
    dard.classList.remove("vise");
    choisir(v.d);
  });
  hote.addEventListener("pointercancel",function(){
    appui=false;
    surb.setAttribute("d","");
    dard.classList.remove("vise");
    suivre(null);
  });
  return {
    enAppui:function(){ return appui; },
    montrer:function(d){ choix.setAttribute("d", flFormeDe(d)); }
  };
}

/* --- rendu de la partie ------------------------------------------ */
var flMinuterie=null;
function flViser(d){
  var v=$("flVise");
  clearTimeout(flMinuterie);
  flMinuterie=null;
  if(d){ v.className=""; v.textContent=flLib(d)+" · "+d.v; }
  else { v.className="attente"; v.textContent=t("fl.aim"); }
}

/* Le nom de la fléchette reste un instant, le temps de le lire : il est
   affiché, et sa minuterie armée, avant que la partie ne se redessine. */
var FL_CIBLE = flCible($("flCible"), flViser, function(d){
  if(!d){ flViser(null); return; }
  flViser(d);
  flMinuterie=setTimeout(function(){
    flMinuterie=null;
    if(!FL_CIBLE.enAppui()) flViser(null);
  }, 900);
  flLancer(d);
});

function renderFGame(){
  if(!F) return;
  if(!FE) FE=flRejouer();
  var e=FE, fini=e.gagnant>=0, j=fini ? e.gagnant : e.joueur, pl=F.players[j];

  $("flTurn").textContent = fini ? t("fl.done")
    : (e.membre ? tf("fl.turn.team",{team:pl.label, name:e.membre}) : tf("fl.turn",{name:pl.label}));
  $("flStartLabel").textContent = tf("fl.start",{n:F.depart});

  var host=$("flScores");
  host.innerHTML="";
  F.players.forEach(function(p,i){
    var row=el("div","fl-score"+(i===j && !fini ? " on" : "")+(i===e.gagnant ? " win" : ""));
    row.style.setProperty("--c",p.hex);
    row.appendChild(el("i","dot"));
    row.appendChild(el("span","who",p.label));
    row.appendChild(el("span","sc num",String(e.score[i])));
    host.appendChild(row);
  });
  var actif=host.children[j];
  if(actif && host.scrollWidth>host.clientWidth) actif.scrollIntoView({block:"nearest", inline:"nearest"});

  var der=e.volees[e.volees.length-1];
  var darts = fini ? der.darts : e.volee;
  var V=$("flVolee"), total=0;
  V.innerHTML="";
  for(var s=0;s<3;s++){
    var d = darts[s]!==undefined ? F.darts[darts[s]] : null;
    var slot=el("div","fl-slot"+(d ? "" : " vide"));
    slot.appendChild(el("b",null, d ? flLib(d) : "—"));
    slot.appendChild(el("small",null, d ? String(d.v) : ""));
    if(d) total+=d.v;
    V.appendChild(slot);
  }
  var tot=el("div","fl-total");
  tot.appendChild(el("span","eyebrow",t("fl.total")));
  tot.appendChild(el("b","num",String(total)));
  V.appendChild(tot);

  var msg=$("flMsg");
  msg.className="fl-msg";
  msg.textContent="";
  var toutDerniere = der && der.darts[der.darts.length-1]===F.darts.length-1;
  if(fini){
    msg.classList.add("gagne");
    msg.textContent=tf("fl.won",{name:pl.label, lib:flLib(F.darts[der.darts[der.darts.length-1]])});
  }else if(toutDerniere && der.bust){
    msg.classList.add("bust");
    msg.textContent=tf("fl.bust",{name:F.players[der.joueur].label, n:der.debut});
  }

  if(!FL_CIBLE.enAppui() && !flMinuterie) flViser(null);
  $("flCible").classList.toggle("fini",fini);
  $("flMiss").disabled=fini;
  $("flCancel").disabled = fini || !F.darts.length;
}

/* --- feuille de match -------------------------------------------- */
var FL_ED_CIBLE = flCible($("flEdCible"), function(){}, function(d){
  if(!d || !FEDIT) return;
  FEDIT.d={ s:d.s, m:d.m, v:d.v };
  renderFSheet();
});

function renderFSheet(){
  var body=$("flSheetBody");
  body.innerHTML="";
  $("flEditeur").hidden = !FEDIT;
  $("flEdSave").hidden  = !FEDIT;
  $("flEdDel").hidden   = !FEDIT;
  $("flQuit").hidden    = !!FEDIT;
  if(FEDIT){ renderFEditeur(body); return; }

  if(!F.darts.length){
    body.appendChild(el("p","empty",t("fl.sheet.empty")));
    return;
  }
  var table=el("table","fl-log");
  var thead=el("thead"), tr=el("tr");
  tr.appendChild(el("th",null,"#"));
  tr.appendChild(el("th",null,t(F.mode==="team" ? "fl.teams" : "fl.players")));
  tr.appendChild(el("th",null,t("fl.col.volee")));
  tr.appendChild(el("th",null,t("fl.col.left")));
  thead.appendChild(tr);
  table.appendChild(thead);

  var tbody=el("tbody");
  var liste=FE.volees.slice();
  if(FE.volee.length) liste.push({ joueur:FE.joueur, membre:FE.membre, darts:FE.volee, bust:false, enCours:true });
  liste.forEach(function(v,idx){
    var row=el("tr", v.bust ? "bust" : null);
    row.appendChild(el("td","nv",String(idx+1).padStart(2,"0")));
    var p=F.players[v.joueur];
    var qui=el("span","qui", p.label+(v.membre ? " · "+v.membre : ""));
    qui.style.color=teamInk(p.hex);
    var tdq=el("td"); tdq.appendChild(qui); row.appendChild(tdq);

    var tdd=el("td"), box=el("div","darts");
    v.darts.forEach(function(k,pos){
      var b=el("button","fl-dart",flLib(F.darts[k]));
      b.type="button";
      b.setAttribute("aria-label",tf("fl.fix.aria",{n:k+1}));
      b.addEventListener("click",function(){ flOuvrirEditeur(k, idx+1, pos+1); });
      box.appendChild(b);
    });
    tdd.appendChild(box);
    row.appendChild(tdd);
    row.appendChild(el("td","reste", v.enCours ? "…" : (v.bust ? "Bust · "+v.reste : String(v.reste))));
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  body.appendChild(table);
  body.appendChild(el("p","hint",t("fl.sheet.hint")));
}

function flOuvrirEditeur(k, volee, position){
  var d=F.darts[k];
  if(!d) return;
  FEDIT={ k:k, volee:volee, position:position, d:{ s:d.s, m:d.m, v:d.v } };
  renderFSheet();
}
function flFermerEditeur(){ FEDIT=null; renderFSheet(); }

function renderFEditeur(body){
  var head=el("div","ed-head");
  head.appendChild(el("p","eyebrow",tf("fl.edit.title",{v:String(FEDIT.volee).padStart(2,"0"), n:FEDIT.position})));
  var back=el("button","ed-back",t("edit.cancel"));
  back.type="button";
  back.addEventListener("click",flFermerEditeur);
  head.appendChild(back);
  body.appendChild(head);
  var avant=F.darts[FEDIT.k];
  body.appendChild(el("p","fl-choix", flLib(avant)+" → "+flLib(FEDIT.d)+" · "+FEDIT.d.v));
  FL_ED_CIBLE.montrer(FEDIT.d);
  $("flEdMiss").classList.toggle("on", !FEDIT.d.m);
}

function flOuvrirFeuille(){
  FEDIT=null;
  renderFSheet();
  flArmerQuitter(false);
  $("flSheetWrap").classList.add("on");
}
function flFermerFeuille(){
  $("flSheetWrap").classList.remove("on");
  FEDIT=null;
}
function flArmerQuitter(on){
  var b=$("flQuit");
  b.dataset.armed = on ? "1" : "0";
  b.textContent = on ? t("sheet.quit.confirm") : t("sheet.quit");
}

/* --- archivage et fin de partie ---------------------------------- */
/* Le palmarès garde les points marqués — 501 contre 260 se lit mieux
   que 0 contre 241. */
function flArchiver(){
  if(!F || F.archived || !FE || FE.gagnant<0) return;
  H.unshift({
    d:Date.now(), g:"flechettes",
    n:F.players.map(function(p){ return p.label; }),
    c:F.players.map(function(p){ return p.hex; }),
    s:FE.score.map(function(r){ return F.depart-r; }),
    w:FE.gagnant, r:FE.volees.length, t:false
  });
  if(H.length>200) H.length=200;
  F.archived=true;
}

function flClassement(){
  var w=FE.gagnant;
  return F.players.map(function(p,i){ return i; }).sort(function(a,b){
    if(a===w) return -1;
    if(b===w) return 1;
    return FE.score[a]-FE.score[b];
  });
}

/* Moyenne sur trois fléchettes : points marqués rapportés aux fléchettes
   lancées, une volée annulée comptant pour rien. */
function flStats(){
  var st=F.players.map(function(){ return { points:0, darts:0, meilleure:0, busts:0 }; });
  FE.volees.forEach(function(v){
    var s=st[v.joueur], total=0;
    v.darts.forEach(function(k){ total+=F.darts[k].v; });
    s.darts+=v.darts.length;
    if(v.bust){ s.busts++; return; }
    s.points+=total;
    if(total>s.meilleure) s.meilleure=total;
  });
  return st;
}

function renderFOver(){
  if(!F || !FE || FE.gagnant<0) return;
  var e=FE, w=e.gagnant, box=$("over");
  box.innerHTML="";
  box.style.setProperty("--team",F.players[w].hex);
  var der=e.volees[e.volees.length-1];

  var head=el("div","over-head reveal");
  head.appendChild(el("p","eyebrow",tn("fl.done.volees", e.volees.length)));
  head.appendChild(el("h2",null,tf("over.wins",{name:F.players[w].label})));
  var fin=el("div","final");
  fin.appendChild(el("span","a", flLib(F.darts[der.darts[der.darts.length-1]])));
  fin.appendChild(el("span","s", tf("fl.checkout",{n:der.debut})));
  head.appendChild(fin);
  box.appendChild(head);

  var card=el("div","tale reveal");
  card.style.animationDelay="80ms";
  var top=el("div","tale-top");
  top.appendChild(el("p","eyebrow",t("fl.rank")));
  top.appendChild(el("p","eyebrow",tf("fl.start",{n:F.depart})));
  card.appendChild(top);

  var st=flStats();
  var dec=(LANG==="en") ? "." : ",";
  var table=el("table","fl-rang"), thead=el("thead"), htr=el("tr");
  ["", t("fl.left"), t("fl.avg"), t("fl.best"), t("fl.busts")].forEach(function(x){ htr.appendChild(el("th",null,x)); });
  thead.appendChild(htr);
  table.appendChild(thead);
  var tbody=el("tbody");
  flClassement().forEach(function(i,rang){
    var p=F.players[i], s=st[i];
    var tr=el("tr", i===w ? "win" : null);
    var td=el("td"), who=el("div","who"), dot=el("i");
    dot.style.background=p.hex;
    who.appendChild(dot);
    who.appendChild(el("span",null,(rang+1)+". "+p.label));
    td.appendChild(who);
    tr.appendChild(td);
    tr.appendChild(el("td","reste",String(e.score[i])));
    tr.appendChild(el("td",null, s.darts ? (s.points/s.darts*3).toFixed(1).replace(".",dec) : "—"));
    tr.appendChild(el("td",null, s.meilleure ? String(s.meilleure) : "—"));
    tr.appendChild(el("td",null, String(s.busts)));
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  card.appendChild(table);
  box.appendChild(card);

  var acts=el("div","over-acts reveal");
  acts.style.animationDelay="160ms";
  var share=el("button","share-btn",t("share.result"));
  share.type="button";
  share.addEventListener("click",flPartager);
  acts.appendChild(share);
  var again=el("button","cta",t("over.rematch"));
  again.type="button";
  again.addEventListener("click",flNouvellePartie);
  acts.appendChild(again);
  var back=el("button","cta ghost",t("over.newsetup"));
  back.type="button";
  back.addEventListener("click",function(){ F=null; FE=null; save(); show("fsetup"); renderFSetup(); });
  acts.appendChild(back);
  box.appendChild(acts);

  show("over");
  buzz([14,60,26]);
}

function flPartager(){
  if(!F || !FE || FE.gagnant<0) return;
  var lignes=[t("fl.name")+" · "+tf("fl.start",{n:F.depart})];
  flClassement().forEach(function(i,rang){
    lignes.push((rang+1)+". "+F.players[i].label+" — "+FE.score[i]);
  });
  lignes.push("ScoreToss");
  shareText(lignes.join("\n"));
}

/* --- état enregistré --------------------------------------------- */
function flNormFS(fs){
  fs.open=-1;
  if(fs.mode!=="team") fs.mode="solo";
  if(FL_DEPARTS.indexOf(fs.depart)<0) fs.depart=FL_DEPARTS[0];
  if(!fs.count || fs.count<FL_MIN || fs.count>FL_MAX) fs.count=FL_MIN;
  if(!fs.per || fs.per<FL_PER_MIN || fs.per>FL_PER_MAX) fs.per=FL_PER_MIN;
  fs.players.forEach(function(pl){ if(!pl.mates) pl.mates=["","","",""]; });
  return fs;
}
function flNormF(f){
  if(!f.darts) f.darts=[];
  if(FL_DEPARTS.indexOf(f.depart)<0) f.depart=FL_DEPARTS[0];
  if(f.mode!=="team") f.mode="solo";
  return f;
}

/* --- commandes --------------------------------------------------- */
$("flToGames").addEventListener("click",retourAuxJeux);
$("flHall").addEventListener("click",function(){ HALL_BACK="fsetup"; renderHall(); show("hall"); });
$("flMode").addEventListener("click",function(e){
  var b=e.target.closest("button[data-mode]");
  if(!b || b.dataset.mode===FS.mode) return;
  FS.mode=b.dataset.mode;
  /* un joueur n'est pas une équipe : ce qui était nommé n'a plus de sens */
  FS.players.forEach(function(pl){ pl.name=""; pl.mates=["","","",""]; });
  FS.open=-1;
  renderFSetup(); save();
});
$("flDepart").addEventListener("click",function(e){
  var b=e.target.closest("button[data-depart]");
  if(!b) return;
  FS.depart=+b.dataset.depart;
  renderFSetup(); save();
});
$("flMinus").addEventListener("click",function(){
  if(FS.count>FL_MIN){ FS.count--; FS.open=-1; renderFSetup(); save(); }
});
$("flPlus").addEventListener("click",function(){
  if(FS.count<FL_MAX){ FS.count++; FS.open=-1; renderFSetup(); save(); }
});
$("flPerMinus").addEventListener("click",function(){
  if(FS.per>FL_PER_MIN){ FS.per--; FS.open=-1; renderFSetup(); save(); }
});
$("flPerPlus").addEventListener("click",function(){
  if(FS.per<FL_PER_MAX){ FS.per++; FS.open=-1; renderFSetup(); save(); }
});
$("flOpenRules").addEventListener("click",openRules);
$("flOpenAbout").addEventListener("click",openAbout);
$("flStart").addEventListener("click",flNouvellePartie);

$("flMiss").addEventListener("click",function(){ flLancer({ s:0, m:0, v:0 }); });
$("flCancel").addEventListener("click",function(){
  if(!F || !F.darts.length || (FE && FE.gagnant>=0)) return;
  F.darts.pop();
  flApresChangement(10);
});

$("flSheetBtn").addEventListener("click",flOuvrirFeuille);
$("flSheetClose").addEventListener("click",flFermerFeuille);
$("flScrim").addEventListener("click",flFermerFeuille);
$("flEdMiss").addEventListener("click",function(){
  if(!FEDIT) return;
  FEDIT.d={ s:0, m:0, v:0 };
  renderFSheet();
});
$("flEdSave").addEventListener("click",function(){
  if(!FEDIT) return;
  F.darts[FEDIT.k]=FEDIT.d;
  FEDIT=null;
  flApresChangement(10);
});
$("flEdDel").addEventListener("click",function(){
  if(!FEDIT) return;
  F.darts.splice(FEDIT.k,1);
  FEDIT=null;
  flApresChangement(10);
});
$("flQuit").addEventListener("click",function(){
  var b=$("flQuit");
  if(b.dataset.armed!=="1"){
    flArmerQuitter(true);
    setTimeout(function(){ if(b.dataset.armed==="1") flArmerQuitter(false); },4000);
    return;
  }
  flFermerFeuille();
  F=null;
  FE=null;
  buzz(12);
  save();
  show("fsetup");
  renderFSetup();
});

/* --- fiche de règles --------------------------------------------- */
function fillFlechettesRules(host){
  var comptage=el("div","block");
  comptage.appendChild(el("p","eyebrow",t("frules.count")));
  var pts=el("div","pts");
  [["×1",t("frules.single")],["×2",t("frules.double")],["×3",t("frules.triple")],
   ["25",t("frules.bull")],["50",t("frules.dbull")]].forEach(function(r){
    var row=el("div","pt-row");
    row.appendChild(el("b",null,r[0]));
    row.appendChild(el("span",null,r[1]));
    pts.appendChild(row);
  });
  comptage.appendChild(pts);
  host.appendChild(comptage);

  var deroule=el("div","block");
  deroule.appendChild(el("p","eyebrow",t("frules.flow")));
  var list=el("ul","rulist");
  [1,2,3,4,5].forEach(function(k){
    var li=document.createElement("li");
    li.appendChild(document.createTextNode(t("frules."+k+"a")));
    li.appendChild(el("b",null,t("frules."+k+"b")));
    li.appendChild(document.createTextNode(t("frules."+k+"c")));
    list.appendChild(li);
  });
  deroule.appendChild(list);
  host.appendChild(deroule);
}
