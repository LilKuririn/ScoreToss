/* ------------------------------------------------------------------
   Le carnet de joueurs

   Huit jeux, huit palmarès : un même nom y vivait huit fois sans jamais
   se rejoindre. Le carnet donne à chaque joueur un identifiant stable,
   que les jeux rangent à côté du nom qu'ils affichent déjà — les parties
   pourront ainsi se croiser, quel que soit le jeu.

   Rien n'est obligatoire : un champ de nom reste un champ de texte, et
   l'invité du dimanche se tape à la main comme avant. Le carnet n'est
   qu'une liste de noms proposés, et le bouton qui l'ouvre.
------------------------------------------------------------------ */
var J = [];                 /* {id, nom, couleur, vu} */
var jrPose = false;         /* vrai le temps qu'un choix remplisse un champ */

function joueur(id){
  for(var i=0;i<J.length;i++) if(J[i].id===id) return J[i];
  return null;
}
function jrNouvelId(){
  var n=1;
  while(joueur("j"+n)) n++;
  return "j"+n;
}
/* la première couleur que personne n'a encore, sinon on recommence */
function jrCouleur(){
  for(var i=0;i<COLORS.length;i++){
    var libre=true;
    for(var k=0;k<J.length;k++) if(J[k].couleur===COLORS[i].id) libre=false;
    if(libre) return COLORS[i].id;
  }
  return COLORS[J.length % COLORS.length].id;
}
function ajouterJoueur(nom){
  nom=(nom||"").trim();
  if(!nom) return null;
  var j={id:jrNouvelId(), nom:nom, couleur:jrCouleur(), vu:Date.now()};
  J.push(j);
  save();
  return j;
}
function supprimerJoueur(id){
  for(var i=0;i<J.length;i++) if(J[i].id===id){ J.splice(i,1); break; }
  save();
}
/* Les joueurs du carnet retenus par un camp : celui du champ principal,
   puis ses coéquipiers, sans doublon. C'est ce que la partie archive. */
function idsDe(porteur, nb){
  var out=[], mids=(porteur && porteur.mids) || [];
  function pousser(id){ if(id && joueur(id) && out.indexOf(id)<0) out.push(id); }
  pousser(porteur && porteur.pid);
  for(var k=0;k<nb;k++) pousser(mids[k]);
  return out;
}
/* Les derniers joués en premier : c'est presque toujours la même tablée
   qui reprend une partie. */
function joueursTries(){
  return J.slice().sort(function(a,b){
    return (b.vu||0)-(a.vu||0) || a.nom.localeCompare(b.nom,LANG);
  });
}

/* --- l'écran du carnet -------------------------------------------- */
var jrArme = null;          /* la suppression demande deux touchers */

/* --- ce que l'historique sait d'un joueur -------------------------- */
/* Une partie appartient à un joueur dès que son identifiant est dans l'un
   des camps ; en équipe, la victoire compte pour chacun de ses membres. */
function partiesDuJoueur(id){
  var out=[];
  H.forEach(function(g){
    if(!g.p) return;
    for(var i=0;i<g.p.length;i++){
      if((g.p[i]||[]).indexOf(id)<0) continue;
      out.push({g:g, i:i, gagne:g.w===i, nulle:g.w<0});
      return;
    }
  });
  return out;
}
function statsJoueur(id){
  var parties=partiesDuJoueur(id), v=0, d=0, parJeu={}, ordre=[];
  parties.forEach(function(x){
    var cle=x.g.g||jeuHistorique();
    if(!parJeu[cle]){ parJeu[cle]={id:cle, n:0, v:0}; ordre.push(cle); }
    parJeu[cle].n++;
    if(x.gagne){ v++; parJeu[cle].v++; }
    else if(!x.nulle) d++;
  });
  ordre.sort(function(a,b){ return parJeu[b].n-parJeu[a].n; });
  return {
    parties:parties, n:parties.length, v:v, d:d,
    jeux:ordre.map(function(k){ return parJeu[k]; })
  };
}
/* Le classement croisé : tous les jeux confondus, ceux qui ont joué. */
function classementGeneral(){
  var l=[];
  J.forEach(function(j){
    var s=statsJoueur(j.id);
    if(s.n) l.push({j:j, n:s.n, v:s.v, d:s.d});
  });
  l.sort(function(a,b){
    return (b.v-a.v) || (b.n-a.n) || a.j.nom.localeCompare(b.j.nom,LANG);
  });
  return l;
}

/* --- l'écran : le classement, puis le carnet ---------------------- */
function renderJoueurs(){
  var host=$("jrListe");
  host.innerHTML="";

  $("jrCount").textContent = J.length ? tn("pl.count",J.length) : t("pl.carnet");

  if(!J.length){
    host.appendChild(el("p","empty",t("pl.empty")));
    return;
  }

  var cl=classementGeneral();
  if(cl.length>1){
    var bloc=el("div","block");
    bloc.appendChild(el("p","eyebrow",t("pl.rank")));
    var table=el("table","rank");
    var thead=el("thead"), htr=el("tr");
    htr.appendChild(el("th",null,t("hall.team")));
    htr.appendChild(el("th",null,t("hall.w")));
    htr.appendChild(el("th",null,t("hall.l")));
    htr.appendChild(el("th",null,t("hall.rate")));
    thead.appendChild(htr);
    table.appendChild(thead);
    var tb=el("tbody");
    cl.forEach(function(x){
      var tr=el("tr");
      var td=el("td");
      var who=el("div","who");
      var dot=el("span","dot");
      dot.style.background=color(x.j.couleur).hex;
      who.appendChild(dot);
      who.appendChild(el("span",null,x.j.nom));
      td.appendChild(who);
      tr.appendChild(td);
      tr.appendChild(el("td",null,String(x.v)));
      tr.appendChild(el("td",null,String(x.d)));
      tr.appendChild(el("td","pct", (x.v+x.d) ? Math.round(x.v/(x.v+x.d)*100)+" %" : "—"));
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    bloc.appendChild(table);
    host.appendChild(bloc);
  }

  var liste=el("div","block");
  liste.appendChild(el("p","eyebrow",t("pl.list")));
  J.forEach(function(j){
    var s=statsJoueur(j.id);
    var b=el("button","jr-ligne");
    b.type="button";
    b.setAttribute("aria-label",tf("pl.fiche.aria",{name:j.nom}));

    var dot=el("span","jr-dot");
    dot.style.background=color(j.couleur).hex;
    b.appendChild(dot);
    b.appendChild(el("span","jr-nom",j.nom));
    b.appendChild(el("span","jr-bilan num", s.n ? s.v+"–"+s.d : "—"));
    var chev=el("span","jr-chev");
    chev.innerHTML='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">'+
      '<path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    b.appendChild(chev);

    b.addEventListener("click",function(){ ouvrirFiche(j.id); });
    liste.appendChild(b);
  });
  host.appendChild(liste);
}

/* --- la fiche d'un joueur ----------------------------------------- */
var jrFicheId = null;

function ouvrirFiche(id){
  jrFicheId=id;
  jrArme=null;
  peindreFiche();
  $("jrFiche").classList.add("on");
}
function fermerFiche(){
  $("jrFiche").classList.remove("on");
  jrFicheId=null;
  renderJoueurs();
  refreshJoueursLink();
}
function peindreFiche(){
  var j=joueur(jrFicheId);
  if(!j){ fermerFiche(); return; }
  var body=$("jrFicheBody");
  body.innerHTML="";
  $("jrFicheTitre").textContent=j.nom;

  /* nom et couleur : la fiche est aussi l'endroit où l'on corrige */
  var ident=el("div","block");
  var nom=el("input","field-input");
  nom.type="text";
  nom.value=j.nom;
  nom.maxLength=22;
  nom.setAttribute("aria-label",t("pl.name.aria"));
  nom.addEventListener("input",function(){
    j.nom=nom.value;
    $("jrFicheTitre").textContent=j.nom;
    save();
  });
  ident.appendChild(nom);

  var sw=el("div","swatches");
  COLORS.forEach(function(col){
    var b=el("button","sw");
    b.type="button";
    b.style.setProperty("--c",col.hex);
    b.setAttribute("aria-pressed", col.id===j.couleur ? "true":"false");
    b.setAttribute("aria-label",t("color.aria")+" "+t("color."+col.id));
    b.addEventListener("click",function(){ j.couleur=col.id; save(); peindreFiche(); });
    sw.appendChild(b);
  });
  ident.appendChild(sw);
  body.appendChild(ident);

  var s=statsJoueur(j.id);
  if(!s.n){
    body.appendChild(el("p","empty",t("pl.nogame")));
  }else{
    var chiffres=el("div","jr-chiffres");
    [[String(s.n), t("pl.played")], [String(s.v), t("hall.w2")],
     [(s.v+s.d) ? Math.round(s.v/(s.v+s.d)*100)+" %" : "—", t("hall.rate")]
    ].forEach(function(c){
      var cell=el("div","jr-chiffre");
      cell.appendChild(el("b","num",c[0]));
      cell.appendChild(el("span",null,c[1]));
      chiffres.appendChild(cell);
    });
    body.appendChild(chiffres);

    var bj=el("div","block");
    bj.appendChild(el("p","eyebrow",t("pl.bygame")));
    var tj=el("table","rank");
    var tbj=el("tbody");
    s.jeux.forEach(function(x){
      var tr=el("tr");
      tr.appendChild(el("td",null,JEUX[x.id] ? jeu(x.id).nom() : x.id));
      tr.appendChild(el("td",null,tn("pl.count.games",x.n)));
      tr.appendChild(el("td","pct", x.v+" "+t("hall.w")));
      tbj.appendChild(tr);
    });
    tj.appendChild(tbj);
    bj.appendChild(tj);
    body.appendChild(bj);

    var br=el("div","block");
    br.appendChild(el("p","eyebrow",t("hall.recent")));
    s.parties.slice(0,8).forEach(function(x){
      var row=el("div","rec");
      var dt=new Date(x.g.d);
      row.appendChild(el("p","d", dt.toLocaleDateString(DATE_LOCALE[LANG]||"en-GB",{day:"numeric",month:"short"})));
      var m=el("p","m");
      m.appendChild(el("b",null, JEUX[x.g.g||jeuHistorique()] ? jeu(x.g.g||jeuHistorique()).nom() : (x.g.g||"")));
      m.appendChild(document.createTextNode(" · "+(x.nulle ? t("hall.tie") : t(x.gagne ? "pl.won" : "pl.lost"))));
      row.appendChild(m);
      row.appendChild(el("p","sc", String(x.g.s[x.i])));
      br.appendChild(row);
    });
    body.appendChild(br);
  }

  var sup=el("button","cta ghost danger");
  sup.type="button";
  sup.textContent=t("pl.del");
  sup.addEventListener("click",function(){
    if(jrArme!==j.id){
      jrArme=j.id;
      sup.textContent=t("pl.del.ok");
      sup.classList.add("arme");
      setTimeout(function(){
        if(jrArme!==j.id) return;
        jrArme=null; sup.textContent=t("pl.del"); sup.classList.remove("arme");
      },2600);
      return;
    }
    jrArme=null;
    supprimerJoueur(j.id);
    fermerFiche();
  });
  body.appendChild(sup);
}
$("jrFicheScrim").addEventListener("click",fermerFiche);
$("jrFicheClose").addEventListener("click",fermerFiche);

function creerDepuisLeChamp(){
  var champ=$("jrNouveau");
  if(!ajouterJoueur(champ.value)) return;
  champ.value="";
  renderJoueurs();
  refreshJoueursLink();
  buzz(8);
}
$("jrAjouter").addEventListener("click",creerDepuisLeChamp);
$("jrNouveau").addEventListener("keydown",function(e){ if(e.key==="Enter") creerDepuisLeChamp(); });
$("jrBack").addEventListener("click",function(){ show("games"); });
$("openJoueurs").addEventListener("click",function(){
  jrArme=null;
  renderJoueurs();
  show("joueurs");
});

/* Le bouton de l'accueil : une icône, et ce que le carnet contient dit
   au lecteur d'écran comme à l'appui long. */
function refreshJoueursLink(){
  var b=$("openJoueurs");
  var s=J.length ? t("pl.title")+" · "+tn("pl.count",J.length) : t("pl.title");
  b.setAttribute("aria-label",s);
  b.title=s;
}

/* --- choisir un joueur pour un champ de nom ----------------------- */
var jrChamp = null, jrPorteur = null, jrCle = null, jrGroupe = null, jrRepeindre = null;

/* `groupe` et `repeindre` sont facultatifs : le jeu les fournit pour que
   le camp prenne la couleur du joueur choisi, sans doublon chez le voisin. */
function champDeJoueur(input, porteur, cle, groupe, repeindre){
  var wrap=el("span","jr-champ");
  input.parentNode.insertBefore(wrap, input);
  wrap.appendChild(input);

  var b=el("button","jr-btn"+(porteur && porteur[cle] ? " tenu" : ""));
  b.type="button";
  b.setAttribute("aria-label",t("pl.pick"));
  b.innerHTML='<svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">'+
    '<circle cx="9" cy="6.4" r="3" stroke="currentColor" stroke-width="1.6"/>'+
    '<path d="M3.6 15c.6-2.8 2.8-4.3 5.4-4.3s4.8 1.5 5.4 4.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  b.addEventListener("click",function(){ ouvrirChoixJoueur(input, porteur, cle, b, groupe, repeindre); });
  wrap.appendChild(b);

  /* taper un nom à la main détache le joueur : c'est un invité */
  input.addEventListener("input",function(){
    if(jrPose || !porteur || !porteur[cle]) return;
    porteur[cle]=null;
    b.classList.remove("tenu");
    save();          /* le jeu a déjà enregistré son nom avant nous */
  });
}

/* Le camp prend la couleur du joueur, comme si l'on avait touché sa
   pastille : si le voisin la portait déjà, les deux l'échangent. */
function poserCouleur(porteur, couleur, groupe){
  if(!porteur || !porteur.color || !couleur || porteur.color===couleur) return false;
  if(groupe){
    for(var i=0;i<groupe.length;i++){
      if(groupe[i]!==porteur && groupe[i].color===couleur){ groupe[i].color=porteur.color; break; }
    }
  }
  porteur.color=couleur;
  return true;
}

function poserJoueur(j){
  var input=jrChamp, porteur=jrPorteur, cle=jrCle;
  var groupe=jrGroupe, repeindre=jrRepeindre;
  fermerChoixJoueur();
  if(!input) return;
  jrPose=true;
  input.value = j ? j.nom : "";
  input.dispatchEvent(new Event("input",{bubbles:true}));
  jrPose=false;
  if(porteur) porteur[cle] = j ? j.id : null;
  if(j) j.vu=Date.now();
  var b=input.parentNode.querySelector(".jr-btn");
  if(b) b.classList.toggle("tenu", !!j);
  buzz(8);
  save();
  /* la couleur en dernier : repeindre reconstruit la rangée */
  if(j && poserCouleur(porteur, j.couleur, groupe)){
    save();
    if(repeindre) repeindre();
  }
}

function ouvrirChoixJoueur(input, porteur, cle, bouton, groupe, repeindre){
  jrChamp=input; jrPorteur=porteur; jrCle=cle;
  jrGroupe=groupe||null; jrRepeindre=repeindre||null;
  peindreChoixJoueur("");
  var wrap=$("jrWrap");
  wrap.classList.add("on");
  if(bouton) bouton.setAttribute("aria-expanded","true");
}
function fermerChoixJoueur(){
  $("jrWrap").classList.remove("on");
  var b=jrChamp && jrChamp.parentNode ? jrChamp.parentNode.querySelector(".jr-btn") : null;
  if(b) b.setAttribute("aria-expanded","false");
}

function peindreChoixJoueur(filtre){
  var body=$("jrChoix");
  body.innerHTML="";
  var courant = jrPorteur ? jrPorteur[jrCle] : null;
  var saisi = (jrChamp && jrChamp.value || "").trim();

  if(J.length>6){
    var rech=el("input","field-input jr-search");
    rech.type="text";
    rech.value=filtre||"";
    rech.placeholder=t("pl.search");
    rech.setAttribute("aria-label",t("pl.search"));
    rech.addEventListener("input",function(){
      peindreChoixJoueur(rech.value);
      var suite=$("jrChoix").querySelector(".jr-search");
      if(suite){ suite.focus(); suite.setSelectionRange(suite.value.length, suite.value.length); }
    });
    body.appendChild(rech);
  }

  var liste=el("div","jr-choix");
  var f=(filtre||"").trim().toLocaleLowerCase("fr");
  var vus=joueursTries().filter(function(j){
    return !f || j.nom.toLocaleLowerCase("fr").indexOf(f)>=0;
  });

  if(!vus.length) liste.appendChild(el("p","jr-vide",t(J.length ? "pl.none" : "pl.empty.pick")));

  vus.forEach(function(j){
    var b=el("button",j.id===courant ? "on" : null);
    b.type="button";
    var dot=el("i");
    dot.style.setProperty("--c",color(j.couleur).hex);
    b.appendChild(dot);
    b.appendChild(el("span",null,j.nom));
    b.addEventListener("click",function(){ poserJoueur(j); });
    liste.appendChild(b);
  });

  var autres=[];
  /* un nom tapé à la main entre au carnet d'un toucher */
  if(saisi && !J.some(function(j){ return j.nom.toLocaleLowerCase("fr")===saisi.toLocaleLowerCase("fr"); })){
    autres.push([tf("pl.addname",{name:saisi}), function(){ poserJoueur(ajouterJoueur(saisi)); }]);
  }
  if(saisi) autres.push([t("pl.clear"), function(){ poserJoueur(null); }]);

  if(autres.length){
    liste.appendChild(el("div","jr-sep"));
    autres.forEach(function(a){
      var b=el("button","jr-autre");
      b.type="button";
      b.appendChild(el("span",null,a[0]));
      b.addEventListener("click",a[1]);
      liste.appendChild(b);
    });
  }
  body.appendChild(liste);
}

$("jrScrim").addEventListener("click",fermerChoixJoueur);
$("jrClose").addEventListener("click",fermerChoixJoueur);
