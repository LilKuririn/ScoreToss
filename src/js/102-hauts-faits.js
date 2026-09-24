/* ==================================================================
   HAUTS FAITS — des distinctions dans la fiche d'un joueur

   Tout se calcule sur l'historique, tel qu'il est archivé : le jeu, la
   date, les scores finaux, le vainqueur et les joueurs de chaque camp.
   Rien n'est enregistré à part, rien ne change dans les parties ; un
   haut fait s'obtient donc aussi pour des parties jouées avant lui. Ce
   que l'archive ne garde pas — le déroulé d'une partie — ne peut pas en
   faire un : pas de « remontée », faute de savoir d'où l'on remontait.

   Chacun donne s'il est obtenu, la date de la partie qui l'a décroché,
   et combien de fois quand le compte a un sens.
================================================================== */
var HF_ICONES = {
  etoile:'<path d="M10 2.8l2.1 4.4 4.8.6-3.5 3.3.9 4.7L10 13.5l-4.3 2.3.9-4.7-3.5-3.3 4.8-.6z" stroke-linejoin="round"/>',
  flamme:'<path d="M10 17.5c-3 0-5-2-5-4.8 0-2.4 1.6-3.8 2.6-5.2.4 1.5 1.2 2.3 2.1 2.6C9.3 7 10.4 4.6 12.6 2.8c-.2 2.4.9 3.8 2 5.2 1 1.3 1.4 2.5 1.4 3.9 0 3.2-2.6 5.6-6 5.6z" stroke-linejoin="round"/>',
  eclair:'<path d="M11 2.5L4.5 11h4.3l-1 6.5L15.5 9h-4.4z" stroke-linejoin="round"/>',
  equipe:'<path d="M7 8.2a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6zM13.4 8.2a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2zM2.8 16c.5-2.8 2.1-4.3 4.2-4.3s3.7 1.5 4.2 4.3M11.6 12c.6-.3 1.2-.4 1.8-.4 1.9 0 3.4 1.4 3.8 4.1" stroke-linecap="round"/>',
  jeux:'<path d="M3.5 3.5h5v5h-5zM11.5 3.5h5v5h-5zM7.5 11.5h5v5h-5z" stroke-linejoin="round"/>',
  monde:'<path d="M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM3 10h14M10 3c2 2 2.8 4.3 2.8 7s-.8 5-2.8 7c-2-2-2.8-4.3-2.8-7S8 5 10 3z"/>'
};

/* Les parties d'un joueur, de la plus ancienne à la plus récente : les
   séries se lisent dans l'ordre où elles ont été jouées. */
function hautsFaits(k, toutes){
  var chrono=toutes.slice().reverse();
  var aPlusieurs=chrono.filter(function(x){ return compte(x.g); });
  var gagnees=aPlusieurs.filter(function(x){ return x.g.w===x.i; });
  function adv(x){ return x.g.s[1-x.i]; }
  function ecart(x){ return x.g.s[x.i]-adv(x); }
  function duel(x){ return x.g.n.length===2; }
  function jeuX(x){ return jeuDePartie(x.g); }

  /* un haut fait « compté » : la liste des parties qui le remplissent */
  function parCompte(liste, seuil){
    return { obtenu:liste.length>=seuil, date:liste.length>=seuil ? liste[seuil-1].g.d : null };
  }

  var fanny=gagnees.filter(function(x){ return duel(x) && jeuX(x)==="petanque" && adv(x)===0; });
  var blanc=gagnees.filter(function(x){ return duel(x) && jeuX(x)!=="petanque" && adv(x)===0; });
  var fil=gagnees.filter(function(x){ return duel(x) && ecart(x)===1; });
  var equipe=gagnees.filter(function(x){ return membres(x.g,x.i).length>1 || campPluriel(x.g,x.i); });
  var yams=chrono.filter(function(x){ return jeuX(x)==="yams" && x.g.s[x.i]>=300; });

  /* la plus longue série de victoires, et quand elle a atteint 3 puis 5 */
  var serie=0, a3=null, a5=null;
  aPlusieurs.forEach(function(x){
    serie = x.g.w===x.i ? serie+1 : 0;
    if(serie===3 && !a3) a3=x.g.d;
    if(serie===5 && !a5) a5=x.g.d;
  });

  /* gagner à trois jeux, et dans les trois catégories */
  var jeuxGagnes=[], cats=[], dJeux=null, dCats=null;
  gagnees.forEach(function(x){
    var id=jeuX(x), c=JEUX[id] ? jeu(id).categorie : null;
    if(jeuxGagnes.indexOf(id)<0){ jeuxGagnes.push(id); if(jeuxGagnes.length===3) dJeux=x.g.d; }
    if(c && cats.indexOf(c)<0){ cats.push(c); if(cats.length===CATEGORIES.length) dCats=x.g.d; }
  });

  /* la bête noire : un adversaire battu au moins trois fois, jamais perdu */
  var face={}, ordre=[];
  aPlusieurs.forEach(function(x){
    if(x.g.w<0) return;
    for(var i=0;i<x.g.n.length;i++){
      if(i===x.i) continue;
      membres(x.g,i).forEach(function(o){
        if(!face[o]){ face[o]={g:0, p:0, d:null}; ordre.push(o); }
        if(x.g.w===x.i){ face[o].g++; if(face[o].g===3) face[o].d=x.g.d; }
        else if(x.g.w===i) face[o].p++;
      });
    }
  });
  var proie=null;
  ordre.forEach(function(o){
    var f=face[o];
    if(f.g>=3 && !f.p && (!proie || f.g>face[proie].g)) proie=o;
  });

  return [
    {id:"premiere", icone:"etoile", obtenu:gagnees.length>0, date:gagnees.length ? gagnees[0].g.d : null},
    {id:"fanny",   marque:"13–0", obtenu:fanny.length>0, date:fanny.length ? fanny[0].g.d : null, fois:fanny.length||null},
    {id:"blanc",   marque:"0",    obtenu:blanc.length>0, date:blanc.length ? blanc[0].g.d : null, fois:blanc.length||null},
    {id:"fil",     marque:"+1",   obtenu:fil.length>0,   date:fil.length ? fil[0].g.d : null,     fois:fil.length||null},
    {id:"serie3",  icone:"flamme", obtenu:!!a3, date:a3},
    {id:"serie5",  icone:"eclair", obtenu:!!a5, date:a5},
    Object.assign({id:"equipe", icone:"equipe"}, parCompte(equipe,5)),
    {id:"touche",  icone:"jeux",  obtenu:!!dJeux, date:dJeux},
    {id:"terrains",icone:"monde", obtenu:!!dCats, date:dCats},
    {id:"yams300", marque:"300",  obtenu:yams.length>0, date:yams.length ? yams[0].g.d : null, fois:yams.length||null},
    Object.assign({id:"fidele", marque:"25"}, parCompte(chrono,25)),
    {id:"nemesis", marque:proie ? (nomDe(proie).trim().charAt(0)||"?").toUpperCase() : "?",
     proie:proie, obtenu:!!proie, date:proie ? face[proie].d : null}
  ];
}

function titreHautFait(h){
  return h.id==="nemesis" && h.proie ? tf("hf.nemesis.de",{nom:nomDe(h.proie)}) : t("hf."+h.id);
}

/* Une grille de médailles, et sous elle la légende de celle qu'on touche :
   par défaut la dernière obtenue. */
function peindreHautsFaits(host, j, k, toutes){
  var liste=hautsFaits(k, toutes);
  var obtenus=liste.filter(function(h){ return h.obtenu; });
  var bloc=el("div","block pal-hf");
  var tete=el("div","pal-hf-tete");
  tete.appendChild(el("p","eyebrow",t("hf.title")));
  tete.appendChild(el("p","eyebrow",tf("hf.count",{n:obtenus.length, t:liste.length})));
  bloc.appendChild(tete);

  var grille=el("div","pal-hf-grille"), legende=el("div","pal-hf-legende");
  legende.setAttribute("aria-live","polite");
  var teinte=color(j.couleur).hex, boutons=[];

  function montrer(h){
    boutons.forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.hf===h.id ? "true" : "false"); });
    legende.innerHTML="";
    legende.appendChild(el("b",null,titreHautFait(h)));
    legende.appendChild(el("span",null,t("hf."+h.id+".d")));
    var etat = h.obtenu
      ? tf("hf.got",{d:dateCourte(h.date)})+(h.fois>1 ? " · "+tn("hf.times",h.fois) : "")
      : t("hf.notyet");
    legende.appendChild(el("em",h.obtenu ? "oui" : null,etat));
  }

  liste.forEach(function(h){
    var b=el("button","pal-medaille"+(h.obtenu ? " on" : ""));
    b.type="button";
    b.dataset.hf=h.id;
    b.setAttribute("aria-label",titreHautFait(h)+" · "+(h.obtenu ? t("hf.gotshort") : t("hf.notyet")));
    var m=el("span","m");
    if(h.obtenu){
      var c = h.id==="nemesis" ? teinteDe(h.proie) : teinte;
      m.style.setProperty("--c",c);
    }
    if(h.icone){
      m.innerHTML='<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">'+HF_ICONES[h.icone]+'</svg>';
    }else{
      m.appendChild(el("span","txt"+(h.marque.length>2 ? " long" : ""),h.marque));
    }
    b.appendChild(m);
    b.appendChild(el("span","t",titreHautFait(h)));
    b.addEventListener("click",function(){ montrer(h); });
    boutons.push(b);
    grille.appendChild(b);
  });
  bloc.appendChild(grille);
  bloc.appendChild(legende);

  /* la dernière obtenue, sinon la première à décrocher */
  var derniere=null;
  obtenus.forEach(function(h){ if(!derniere || (h.date||0)>(derniere.date||0)) derniere=h; });
  montrer(derniere || liste[0]);
  host.appendChild(bloc);
}
