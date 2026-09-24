/* ==================================================================
   PALMARÈS — le classement, l'historique, les joueurs et leurs fiches

   Un seul endroit pour tout ce qui a été joué, et il se lit par
   personnes : en équipe, la victoire compte pour chacun de ses membres ;
   un nom tapé à la main compte sous ce nom, comme invité. Un filtre
   restreint le tout à un jeu — c'est ainsi que l'ouvre le bouton palmarès
   de chaque jeu. Les parties archivées gardent leur format : noms `n`,
   couleurs `c`, scores `s`, vainqueur `w` (-1 pour une égalité), joueurs
   du carnet `p`, jeu `g`, date `d`, manches `r`, tournoi `t`.
================================================================== */
var H=[];

function archiveGame(){
  if(!G || G.archived || G.winner<0) return;
  var holes=[0,0];
  G.rounds.forEach(function(r){ if(r.h){ holes[0]+=r.h[0]; holes[1]+=r.h[1]; } });
  H.unshift({
    d:Date.now(), g:G.game, mode:G.mode,
    n:[G.teams[0].label,G.teams[1].label],
    c:[G.teams[0].hex,G.teams[1].hex],
    s:[G.scores[0],G.scores[1]],
    w:G.winner, r:G.rounds.length, ho:holes,
    p:G.teams.map(function(tm){ return tm.ids||[]; }),
    t:!!G.tour
  });
  if(H.length>200) H.length=200;
  G.archived=true;
}

/* L'enregistrement le plus ancien ne nomme pas son jeu : c'est le cornhole. */
function jeuDePartie(g){ return g.g||jeuHistorique(); }
function partiesDuJeu(id){ return H.filter(function(g){ return jeuDePartie(g)===id; }); }
function HG(){ return partiesDuJeu(S.game); }

function nameKey(s){ return (s||"").trim().toLocaleLowerCase("fr"); }

/* Une partie qui retient un joueur du carnet s'affiche sous le nom qu'il
   porte aujourd'hui : le renommer ne laisse pas deux personnes derrière. */
function nomDeCamp(g,i){
  var ids=g.p && g.p[i];
  if(ids && ids.length===1){
    var j=joueur(ids[0]);
    if(j) return j.nom;
  }
  return g.n[i];
}

/* --- qui a joué ----------------------------------------------------- */
/* Les membres d'un camp : ses joueurs du carnet — « j:identifiant » —,
   sinon son nom, celui d'un invité — « n:nom ». Un joueur supprimé depuis
   n'y compte plus ; le camp qui n'en garde aucun retombe sous son nom. */
function membres(g,i){
  var out=[];
  ((g.p && g.p[i]) || []).forEach(function(id){ if(joueur(id)) out.push("j:"+id); });
  if(!out.length) out.push("n:"+nameKey(g.n[i]));
  return out;
}
function estInvite(k){ return k.charAt(0)==="n"; }
/* un invité s'affiche sous le nom et la couleur de sa dernière partie */
function invite(k){
  for(var a=0;a<H.length;a++){
    var g=H[a];
    for(var i=0;i<g.n.length;i++){
      if("n:"+nameKey(g.n[i])===k) return {nom:g.n[i], hex:g.c[i]||COLORS[8].hex};
    }
  }
  return {nom:k.slice(2), hex:COLORS[8].hex};
}
function nomDe(k){
  if(estInvite(k)) return invite(k).nom;
  var j=joueur(k.slice(2));
  return j ? j.nom : "";
}
function teinteDe(k){
  if(estInvite(k)) return invite(k).hex;
  var j=joueur(k.slice(2));
  return color(j ? j.couleur : "ardoise").hex;
}

/* Le classement : au nombre de victoires, puis à la part de parties
   gagnées. Une égalité se joue, mais ne se gagne ni ne se perd ; une
   partie jouée seul n'y compte pas — on n'y gagne contre personne. */
function compte(g){ return g.n.length>1; }
function classement(filtre){
  var m={}, liste=[];
  H.forEach(function(g){
    if(!compte(g) || (filtre && jeuDePartie(g)!==filtre)) return;
    for(var i=0;i<g.n.length;i++){
      membres(g,i).forEach(function(k){
        if(!m[k]){ m[k]={k:k, n:0, v:0, d:0}; liste.push(m[k]); }
        m[k].n++;
        if(g.w===i) m[k].v++; else if(g.w>=0) m[k].d++;
      });
    }
  });
  return liste.sort(function(a,b){
    return (b.v-a.v) || (b.v/b.n - a.v/a.n) || nomDe(a.k).localeCompare(nomDe(b.k),LANG);
  });
}
function taux(v,n){ return n ? Math.round(v/n*100) : 0; }
/* les parties d'un membre, de la plus récente à la plus ancienne */
function partiesDe(k){
  var out=[];
  H.forEach(function(g){
    for(var i=0;i<g.n.length;i++){
      if(membres(g,i).indexOf(k)>=0){ out.push({g:g, i:i}); return; }
    }
  });
  return out;
}
/* une équipe se conjugue au pluriel : « battent », « l'emportent » */
function campPluriel(g,i){
  return g.mode==="double" || g.mode==="triple" ||
         ((g.p && g.p[i]) || []).length>1 || /&/.test(g.n[i]);
}

/* --- les mots ------------------------------------------------------- */
function ordinal(n){
  var k="pal.ord."+n;
  return (TXT[LANG]||TXT.fr)[k]!==undefined ? t(k) : tf("pal.ord.n",{n:n});
}
function pourcent(n){ return tf("pal.pct",{n:n}); }
function nomJeu(id){ return JEUX[id] ? jeu(id).nom() : id; }
function jourDe(ts){
  var d=new Date(ts), a=new Date(), j=new Date(ts);
  a.setHours(0,0,0,0); j.setHours(0,0,0,0);
  var ecart=Math.round((a-j)/864e5);
  if(ecart===0) return t("pal.today");
  if(ecart===1) return t("pal.yesterday");
  var o = d.getFullYear()===a.getFullYear()
    ? {weekday:"long", day:"numeric", month:"long"}
    : {day:"numeric", month:"long", year:"numeric"};
  var s=d.toLocaleDateString(DATE_LOCALE[LANG]||"en-GB", o);
  return s.charAt(0).toUpperCase()+s.slice(1);
}
function heureDe(ts){
  return new Date(ts).toLocaleTimeString(DATE_LOCALE[LANG]||"en-GB",{hour:"2-digit", minute:"2-digit"});
}
function dateCourte(ts){
  return new Date(ts).toLocaleDateString(DATE_LOCALE[LANG]||"en-GB",{day:"numeric", month:"short"});
}
function pastille(hex){
  var d=el("span","dot");
  d.style.background=hex;
  return d;
}
function avatar(k,cls){
  var a=el("span",cls||"pal-av",(nomDe(k).trim().charAt(0)||"?").toUpperCase());
  a.style.background=teinteDe(k);
  return a;
}
var CHEVRON='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">'+
  '<path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* --- l'écran --------------------------------------------------------- */
var PAL = {onglet:"rang", jeu:null, retour:"games"};

/* `jeuId` filtre d'emblée — le bouton palmarès d'un jeu —, et `retour` est
   l'écran que le fil d'Ariane ramène. */
function ouvrirPalmares(jeuId, retour){
  PAL.jeu=jeuId||null;
  PAL.onglet="rang";
  PAL.retour=retour||"games";
  renderPalmares();
  show("hall");
  $("hallBody").scrollTop=0;
}
/* renderHall garde son nom pour les appels venus d'ailleurs */
function renderHall(){ renderPalmares(); }

function renderPalmares(){
  $("hallBackLab").textContent = PAL.retour==="games" ? t("nav.home") : nomJeu(S.game);
  $("hallCount").textContent = tn("hall.count",H.length)+" · "+tn("pl.count",J.length);
  var tabs=$("palTabs").children;
  for(var i=0;i<tabs.length;i++){
    var on = tabs[i].dataset.onglet===PAL.onglet;
    tabs[i].classList.toggle("on", on);
    tabs[i].setAttribute("aria-selected", on ? "true" : "false");
  }
  peindreFiltres();
  $("palAjout").hidden = PAL.onglet!=="gens";
  var body=$("hallBody");
  body.innerHTML="";
  if(PAL.onglet==="rang") peindreClassement(body);
  else if(PAL.onglet==="hist") peindreHistorique(body);
  else peindreCarnet(body);
}

/* Les jeux réellement joués, du plus pratiqué au moins pratiqué ; celui
   qu'on vient de quitter reste proposé même sans partie. */
function peindreFiltres(){
  var f=$("palFiltres");
  f.innerHTML="";
  f.hidden = PAL.onglet==="gens";
  if(f.hidden) return;
  var comptes={};
  H.forEach(function(g){ var j=jeuDePartie(g); comptes[j]=(comptes[j]||0)+1; });
  var jeux=ORDRE_JEUX.filter(function(id){ return comptes[id] || id===PAL.jeu; });
  jeux.sort(function(a,b){ return (comptes[b]||0)-(comptes[a]||0); });
  [[null, t("pal.all"), H.length]].concat(jeux.map(function(id){
    return [id, nomJeu(id), comptes[id]||0];
  })).forEach(function(x){
    var p=el("button","pal-pill"+(PAL.jeu===x[0] ? " on" : ""));
    p.type="button";
    p.setAttribute("aria-pressed", PAL.jeu===x[0] ? "true" : "false");
    p.appendChild(document.createTextNode(x[1]));
    p.appendChild(el("small",null,String(x[2])));
    p.addEventListener("click",function(){
      PAL.jeu=x[0];
      renderPalmares();
      $("hallBody").scrollTop=0;
    });
    f.appendChild(p);
  });
  var choisi=f.querySelector(".on");
  if(choisi && PAL.jeu) f.scrollLeft = choisi.offsetLeft - 16;
}

/* --- Classement ------------------------------------------------------ */
function peindreClassement(host){
  var cl=classement(PAL.jeu);
  if(!cl.length){
    host.appendChild(el("p","empty",t(PAL.jeu ? "pal.none.game" : "pal.none")));
    return;
  }

  /* les meilleurs scores : un jeu qui se joue aussi seul les déclare */
  var titreRecords = PAL.jeu && jeu(PAL.jeu).records;
  if(titreRecords){
    var scores=[];
    partiesDuJeu(PAL.jeu).forEach(function(g){
      for(var i=0;i<g.n.length;i++) scores.push({g:g, i:i, s:g.s[i]});
    });
    scores.sort(function(a,b){ return (b.s-a.s) || (a.g.d-b.g.d); });
    var br=blocTitre(t(titreRecords));
    scores.slice(0,3).forEach(function(x,rang){
      var r=el("div","pal-best");
      r.appendChild(el("span","o",ordinal(rang+1)));
      var nm=el("span","n");
      nm.appendChild(pastille(x.g.c[x.i]||COLORS[8].hex));
      nm.appendChild(el("b",null,nomDeCamp(x.g,x.i)));
      nm.appendChild(el("span","d",dateCourte(x.g.d)));
      r.appendChild(nm);
      r.appendChild(el("span","s num",String(x.s)));
      br.appendChild(r);
    });
    host.appendChild(br);
  }

  /* le podium : les trois premiers, d'un coup d'œil */
  var depart=0;
  if(cl.length>=3){
    depart=3;
    var pod=el("div","pal-podium");
    [[1,"second"],[0,"first"],[2,"third"]].forEach(function(o){
      var x=cl[o[0]];
      var st=el("button","pal-step "+o[1]);
      st.type="button";
      var who=el("span","who");
      if(o[0]===0){
        var cr=el("span","crown");
        cr.innerHTML='<svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true"><path d="M1.5 10.5L3 3l4 3.5L9 1l2 5.5L15 3l1.5 7.5z" fill="currentColor"/></svg>';
        who.appendChild(cr);
      }
      who.appendChild(avatar(x.k));
      who.appendChild(el("span","nm",nomDe(x.k)));
      who.appendChild(el("span","v",tn("pal.wins",x.v)));
      st.appendChild(who);
      st.appendChild(el("span","plinth",String(o[0]+1)));
      st.setAttribute("aria-label",ordinal(o[0]+1)+" · "+nomDe(x.k)+" · "+tn("pal.wins",x.v));
      if(estInvite(x.k)) st.disabled=true;
      else st.addEventListener("click",function(){ ouvrirFiche(x.k.slice(2)); });
      pod.appendChild(st);
    });
    host.appendChild(pod);
  }

  /* la suite, à partir du quatrième */
  if(depart<cl.length){
    var bl=blocTitre(t(depart ? "pal.rank.rest" : "pal.rank"));
    var list=el("div","pal-list");
    cl.slice(depart).forEach(function(x,i){
      list.appendChild(ligneClassement(x, depart+i+1));
    });
    bl.appendChild(list);
    host.appendChild(bl);
  }
  host.appendChild(el("p","hint",tf(PAL.jeu ? "pal.rank.note.game" : "pal.rank.note",{jeu:PAL.jeu ? nomJeu(PAL.jeu) : ""})));
}
function blocTitre(titre){
  var b=el("div","block");
  b.appendChild(el("p","eyebrow",titre));
  return b;
}
function ligneClassement(x, rang){
  var r=el("button","pal-row");
  r.type="button";
  r.appendChild(el("span","rk",String(rang)));
  var main=el("span","main");
  var nm=el("span","nm");
  nm.appendChild(pastille(teinteDe(x.k)));
  nm.appendChild(el("span",null,nomDe(x.k)));
  if(estInvite(x.k)) nm.appendChild(el("span","pal-tag",t("pal.guest")));
  main.appendChild(nm);
  main.appendChild(el("span","sub",tf("pal.wins.of",{v:tn("pal.wins",x.v), n:tn("pal.games",x.n)})));
  r.appendChild(main);
  var pc=el("span","pc num",pourcent(taux(x.v,x.n)));
  pc.appendChild(el("small",null,t("pal.won")));
  r.appendChild(pc);
  var bar=el("span","bar"), fill=el("i");
  fill.style.width=taux(x.v,x.n)+"%";
  fill.style.background=teinteDe(x.k);
  bar.appendChild(fill);
  r.appendChild(bar);
  if(estInvite(x.k)) r.disabled=true;
  else r.addEventListener("click",function(){ ouvrirFiche(x.k.slice(2)); });
  return r;
}

/* --- Historique ------------------------------------------------------ */
/* Une partie en une phrase, le vainqueur en gras. `pov` raconte la partie
   du point de vue d'un camp, dans la fiche d'un joueur. */
function cartePartie(g, pov, moi){
  var c=el("button","pal-game");
  c.type="button";
  var top=el("span","top");
  top.appendChild(el("span","eyebrow",nomJeu(jeuDePartie(g))+(g.t ? " · "+t("pal.tour") : "")));
  top.appendChild(el("span","t", pov==null ? heureDe(g.d) : dateCourte(g.d)));
  c.appendChild(top);

  var say=el("span","say"), sc, n=g.n.length;
  if(pov==null){
    if(n===1){
      phraseAvecNom(say, tf("pal.solo.h",{w:"\u0000"}), nomDeCamp(g,0));
    }else if(g.w<0){
      say.appendChild(el("b",null,t("hall.tie")));
      say.appendChild(document.createTextNode(" · "+g.n.map(function(x,i){ return nomDeCamp(g,i); }).join(", ")));
    }else if(n===2){
      phraseAvecNom(say, tf(campPluriel(g,g.w) ? "pal.beat_p" : "pal.beat",{w:"\u0000", l:nomDeCamp(g,1-g.w)}), nomDeCamp(g,g.w));
    }else{
      phraseAvecNom(say, tf(campPluriel(g,g.w) ? "pal.ahead_p" : "pal.ahead",{w:"\u0000", n:n-1}), nomDeCamp(g,g.w));
    }
    var gagnant = g.w<0 ? 0 : g.w;
    sc=el("span","sc num", n===2 ? g.s[gagnant]+" – "+g.s[1-gagnant] : String(Math.max.apply(null,g.s)));
  }else if(n===1){
    say.appendChild(el("b",null,t("pal.solo")));
    sc=el("span","sc num",String(g.s[0]));
  }else{
    var autres=[];
    for(var i=0;i<n;i++) if(i!==pov) autres.push(nomDeCamp(g,i));
    say.appendChild(el("b",null,t(g.w<0 ? "hall.tie" : (g.w===pov ? "pal.won1" : "pal.lost1"))));
    say.appendChild(document.createTextNode(" "+t("pl.vs")+" "+
      (autres.length<=2 ? autres.join(", ") : autres.slice(0,2).join(", ")+" +"+(autres.length-2))));
    var avec=((g.p && g.p[pov]) || []).filter(function(id){ return id!==moi && joueur(id); })
      .map(function(id){ return joueur(id).nom; });
    if(avec.length) say.appendChild(document.createTextNode(", "+t("pal.with")+" "+avec.join(", ")));
    if(n===2) sc=el("span","sc num", g.s[pov]+" – "+g.s[1-pov]);
    else{
      var rang=1;
      for(var k=0;k<n;k++) if(k!==pov && (k===g.w || g.s[k]>g.s[pov])) rang++;
      if(g.w===pov) rang=1;
      sc=el("span","sc num", ordinal(rang)+" · "+g.s[pov]);
    }
    sc.classList.add(g.w===pov ? "win" : "loss");
  }
  c.appendChild(say);
  c.appendChild(sc);
  c.addEventListener("click",function(){ ouvrirDetail(g); });
  return c;
}

function peindreHistorique(host){
  var liste = PAL.jeu ? partiesDuJeu(PAL.jeu) : H;
  if(!liste.length){
    host.appendChild(el("p","empty",t(PAL.jeu ? "pal.none.game" : "pal.none")));
    return;
  }
  var jour=null, bloc=null;
  liste.forEach(function(g){
    var j=jourDe(g.d);
    if(j!==jour){
      jour=j;
      bloc=el("div","block");
      bloc.appendChild(el("p","eyebrow",j));
      host.appendChild(bloc);
    }
    bloc.appendChild(cartePartie(g));
  });
  if(PAL.jeu){
    var jeuFiltre=PAL.jeu;
    var del=el("button","pal-danger",t("pal.clear"));
    del.type="button";
    del.id="hallClear";
    del.addEventListener("click",function(){
      if(del.dataset.armed!=="1"){
        del.dataset.armed="1";
        del.classList.add("armed");
        del.textContent=tn("pal.clear.ok",liste.length);
        setTimeout(function(){
          if(del.dataset.armed!=="1") return;
          del.dataset.armed="0"; del.classList.remove("armed"); del.textContent=t("pal.clear");
        },4000);
        return;
      }
      H=H.filter(function(g){ return jeuDePartie(g)!==jeuFiltre; });
      save();
      refreshHallLink();
      renderPalmares();
    });
    host.appendChild(del);
  }
}

/* --- le détail d'une partie ----------------------------------------- */
function ouvrirDetail(g){
  var id=jeuDePartie(g);
  $("palDetailTitre").textContent=nomJeu(id)+" · "+jourDe(g.d)+", "+heureDe(g.d);
  var body=$("palDetailBody");
  body.innerHTML="";

  var meta=el("div","pal-meta"), duel=JEUX[id] && jeu(id).famille==="duel";
  if(duel && g.r) meta.appendChild(el("span",null,tnPour(id,"over.nframes",g.r)));
  if(duel && g.mode) meta.appendChild(el("span",null,tPour(id,{simple:"mode.single",double:"mode.double",triple:"mode.triple"}[g.mode]||"mode.single")));
  if(!duel) meta.appendChild(el("span",null,tn("pal.parts",g.n.length)));
  if(g.t) meta.appendChild(el("span",null,t("pal.tourmatch")));
  body.appendChild(meta);

  /* le vainqueur d'abord, puis au score */
  var ordre=g.n.map(function(x,i){ return i; }).sort(function(a,b){
    return (b===g.w)-(a===g.w) || (g.s[b]-g.s[a]);
  });
  var box=el("div");
  ordre.forEach(function(i,rang){
    var r=el("div","pal-place");
    r.appendChild(el("span","p"+(i===g.w ? " gold" : ""), g.w<0 ? "=" : ordinal(rang+1)));
    var nm=el("span","n");
    nm.appendChild(pastille(g.c[i]||COLORS[8].hex));
    nm.appendChild(el("span",null,nomDeCamp(g,i)));
    r.appendChild(nm);
    r.appendChild(el("span","s num",String(g.s[i])));
    var ids=((g.p && g.p[i]) || []).filter(function(x){ return joueur(x); });
    if(ids.length>1) r.appendChild(el("span","m",tn("pl.count",ids.length)+(i===g.w ? " · "+t("pal.each") : "")));
    if(ids.length===1){
      r.classList.add("lien");
      r.setAttribute("role","button");
      r.tabIndex=0;
      r.addEventListener("click",function(){ fermerDetail(); ouvrirFiche(ids[0]); });
    }
    box.appendChild(r);
  });
  body.appendChild(box);
  $("palDetail").classList.add("on");
}
function fermerDetail(){ $("palDetail").classList.remove("on"); }
$("palDetailClose").addEventListener("click",fermerDetail);
$("palDetailScrim").addEventListener("click",fermerDetail);

/* --- Joueurs : le carnet --------------------------------------------- */
function peindreCarnet(host){
  if(!J.length){
    host.appendChild(el("p","empty",t("pl.empty")));
    return;
  }
  var list=el("div","pal-list");
  J.forEach(function(j){
    var n=partiesDe("j:"+j.id).length;
    var r=el("button","pal-joueur");
    r.type="button";
    r.appendChild(pastille(color(j.couleur).hex));
    r.appendChild(el("span","nm",j.nom));
    r.appendChild(el("span","sub", n ? tn("pal.games",n) : t("pal.nogames")));
    var ch=el("span","chev");
    ch.innerHTML=CHEVRON;
    r.appendChild(ch);
    r.addEventListener("click",function(){ ouvrirFiche(j.id); });
    list.appendChild(r);
  });
  host.appendChild(list);
  host.appendChild(el("p","hint",t("pl.hint")));
}
function creerDepuisLeChamp(){
  var champ=$("jrNouveau");
  if(!ajouterJoueur(champ.value)) return;
  champ.value="";
  renderPalmares();
  buzz(8);
}
$("jrAjouter").addEventListener("click",creerDepuisLeChamp);
$("jrNouveau").addEventListener("keydown",function(e){ if(e.key==="Enter") creerDepuisLeChamp(); });

/* --- la fiche d'un joueur ------------------------------------------- */
var FICHE=null;

function ouvrirFiche(id){
  FICHE=id;
  renderFiche();
  show("fiche");
  $("ficheBody").scrollTop=0;
}
function renderFiche(){
  var j=joueur(FICHE);
  if(!j){ renderPalmares(); show("hall"); return; }
  var k="j:"+j.id, toutes=partiesDe(k), body=$("ficheBody");
  var mes=toutes.filter(function(x){ return compte(x.g); });
  body.innerHTML="";
  var v=0, d=0;
  mes.forEach(function(x){ if(x.g.w===x.i) v++; else if(x.g.w>=0) d++; });

  /* qui : son nom, et sa place au classement général */
  var hero=el("div","pal-hero");
  hero.appendChild(avatar(k,"pal-av grand"));
  var id=el("div","id");
  id.appendChild(el("p","eyebrow",t("pal.card")));
  var titre=el("h2",null,j.nom);
  id.appendChild(titre);
  var rang=el("p","rang");
  var general=classement(null).filter(function(x){ return !estInvite(x.k); });
  var place=general.findIndex(function(x){ return x.k===k; });
  if(place<0) rang.textContent=t("pal.card.none");
  else phraseAvecNom(rang, tf("pal.card.rank",{r:"\u0000", n:general.length}), ordinal(place+1));
  id.appendChild(rang);
  hero.appendChild(id);
  body.appendChild(hero);

  if(mes.length){
    var figs=el("div","pal-figs");
    [[String(mes.length),t(mes.length>1 ? "pal.fig.games_p" : "pal.fig.games")],[String(v),t(v>1 ? "pal.fig.wins_p" : "pal.fig.wins")],[pourcent(taux(v,mes.length)),t("pal.fig.rate")]].forEach(function(f){
      var x=el("div","fig");
      x.appendChild(el("b","num",f[0]));
      x.appendChild(el("span",null,f[1]));
      figs.appendChild(x);
    });
    body.appendChild(figs);

    /* la forme : les cinq dernières, la plus récente à droite */
    var fb=blocTitre(t("pal.form"));
    var form=el("div","pal-form");
    mes.slice(0,5).reverse().forEach(function(x){
      var r = x.g.w<0 ? "n" : (x.g.w===x.i ? "v" : "d");
      var i=el("i",r,{v:t("pal.form.v"), d:t("pal.form.d"), n:"="}[r]);
      i.title=nomJeu(jeuDePartie(x.g))+" · "+dateCourte(x.g.d);
      form.appendChild(i);
    });
    var serie=0;
    while(serie<mes.length && mes[serie].g.w===mes[serie].i) serie++;
    form.appendChild(el("span",null, serie>=2 ? tf("pal.streak",{n:serie}) : t("pal.form.hint")));
    fb.appendChild(form);
    body.appendChild(fb);

    peindreHautsFaits(body, j, k, toutes);

    /* ses jeux, du plus joué au moins joué */
    var par={}, ordre=[];
    mes.forEach(function(x){
      var g=jeuDePartie(x.g);
      if(!par[g]){ par[g]={n:0, v:0}; ordre.push(g); }
      par[g].n++;
      if(x.g.w===x.i) par[g].v++;
    });
    ordre.sort(function(a,b){ return par[b].n-par[a].n; });
    var jb=blocTitre(t("pal.hisgames"));
    ordre.forEach(function(g){
      var r=el("div","pal-kv");
      r.appendChild(el("span","k",nomJeu(g)));
      r.appendChild(el("span","v",tf("pal.wins.of",{v:tn("pal.wins",par[g].v), n:tn("pal.games",par[g].n)})));
      var bar=el("span","bar"), f=el("i");
      f.style.width=taux(par[g].v,par[g].n)+"%";
      f.style.background=color(j.couleur).hex;
      bar.appendChild(f);
      r.appendChild(bar);
      jb.appendChild(r);
    });
    body.appendChild(jb);

    /* face à face : chaque adversaire, du plus rencontré au moins */
    var vs={}, vus=[];
    mes.forEach(function(x){
      if(x.g.w<0) return;
      for(var i=0;i<x.g.n.length;i++){
        if(i===x.i) continue;
        membres(x.g,i).forEach(function(o){
          if(!vs[o]){ vs[o]={g:0, p:0}; vus.push(o); }
          if(x.g.w===x.i) vs[o].g++;
          else if(x.g.w===i) vs[o].p++;
        });
      }
    });
    vus=vus.filter(function(o){ return vs[o].g+vs[o].p; });
    if(vus.length){
      vus.sort(function(a,b){ return (vs[b].g+vs[b].p)-(vs[a].g+vs[a].p); });
      var hb=blocTitre(t("pal.h2h"));
      vus.slice(0,5).forEach(function(o){
        var x=vs[o], tot=x.g+x.p;
        var r=el("div","pal-kv vs");
        var kk=el("span","k");
        kk.appendChild(pastille(teinteDe(o)));
        kk.appendChild(el("span",null,nomDe(o)));
        if(estInvite(o)) kk.appendChild(el("span","pal-tag",t("pal.guest")));
        r.appendChild(kk);
        r.appendChild(el("b","v num",x.g+" – "+x.p));
        var bar=el("span","bar"), a=el("i"), c=el("i");
        a.style.width=(x.g/tot*100)+"%";
        a.style.background=color(j.couleur).hex;
        c.style.width=(x.p/tot*100)+"%";
        c.style.background=teinteDe(o);
        c.style.opacity=".55";
        bar.appendChild(a); bar.appendChild(c);
        r.appendChild(bar);
        hb.appendChild(r);
      });
      hb.appendChild(el("p","hint",t("pal.h2h.note")));
      body.appendChild(hb);
    }

  }
  /* sans partie à plusieurs, les hauts faits restent à décrocher : ils montrent où aller */
  if(!mes.length) peindreHautsFaits(body, j, k, toutes);
  if(toutes.length){
    var db=blocTitre(t("pal.recent"));
    toutes.slice(0,5).forEach(function(x){ db.appendChild(cartePartie(x.g, x.i, j.id)); });
    body.appendChild(db);
  }else{
    body.appendChild(el("p","empty",t("pl.nogame")));
  }

  /* modifier : son nom, sa couleur, ou le retirer du carnet */
  var eb=blocTitre(t("pal.edit"));
  var nom=el("input","field-input");
  nom.type="text";
  nom.value=j.nom;
  nom.maxLength=22;
  nom.setAttribute("aria-label",t("pl.name.aria"));
  nom.addEventListener("input",function(){ j.nom=nom.value; titre.textContent=j.nom; save(); });
  eb.appendChild(nom);
  var sw=el("div","swatches");
  COLORS.forEach(function(col){
    var b=el("button","sw");
    b.type="button";
    b.style.setProperty("--c",col.hex);
    b.setAttribute("aria-pressed", col.id===j.couleur ? "true":"false");
    b.setAttribute("aria-label",t("color.aria")+" "+t("color."+col.id));
    b.addEventListener("click",function(){ j.couleur=col.id; save(); renderFiche(); });
    sw.appendChild(b);
  });
  eb.appendChild(sw);
  var del=el("button","pal-danger",t("pal.del"));
  del.type="button";
  del.addEventListener("click",function(){
    if(del.dataset.armed!=="1"){
      del.dataset.armed="1";
      del.classList.add("armed");
      del.textContent=t("pal.del.ok");
      setTimeout(function(){
        if(del.dataset.armed!=="1") return;
        del.dataset.armed="0"; del.classList.remove("armed"); del.textContent=t("pal.del");
      },4000);
      return;
    }
    supprimerJoueur(j.id);
    PAL.onglet="gens";
    renderPalmares();
    show("hall");
  });
  eb.appendChild(del);
  eb.appendChild(el("p","hint",t("pal.del.note")));
  body.appendChild(eb);
}

/* --- navigation ----------------------------------------------------- */
$("palTabs").addEventListener("click",function(e){
  var b=e.target.closest("button[data-onglet]");
  if(!b || b.dataset.onglet===PAL.onglet) return;
  PAL.onglet=b.dataset.onglet;
  renderPalmares();
  $("hallBody").scrollTop=0;
});
$("hallBack").addEventListener("click",function(){ show(PAL.retour); });
$("ficheBack").addEventListener("click",function(){ renderPalmares(); show("hall"); });
$("openPalmares").addEventListener("click",function(){ ouvrirPalmares(null,"games"); });
$("openHall").addEventListener("click",function(){ ouvrirPalmares(S.game,"setup"); });
/* le bouton palmarès de chaque jeu à tour de rôle ramène à sa préparation */
ORDRE_JEUX.forEach(function(id){
  var d=JEUX[id];
  if(!d.lienPalmares) return;
  $(d.lienPalmares).addEventListener("click",function(){ ouvrirPalmares(id, (d.ecrans||["games"])[0]); });
});

/* Le bouton palmarès d'un jeu n'apparaît que s'il a des parties. */
function refreshHallLink(){
  var n=HG().length, titre=t("hall.aria")+" · "+tn("hall.count",n);
  ["openHall"].concat(liensPalmares()).forEach(function(id){
    var btn=$(id);
    if(!btn) return;
    btn.hidden = !n;
    btn.title = titre;
    btn.setAttribute("aria-label", titre);
  });
}
