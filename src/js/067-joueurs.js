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
/* Les derniers joués en premier : c'est presque toujours la même tablée
   qui reprend une partie. */
function joueursTries(){
  return J.slice().sort(function(a,b){
    return (b.vu||0)-(a.vu||0) || a.nom.localeCompare(b.nom,LANG);
  });
}

/* --- l'écran du carnet -------------------------------------------- */
var jrArme = null;          /* la suppression demande deux touchers */

function renderJoueurs(){
  var host=$("jrListe");
  host.innerHTML="";
  host.style.display="flex";
  host.style.flexDirection="column";
  host.style.gap="0";

  $("jrCount").textContent = J.length ? tn("pl.count",J.length) : t("pl.carnet");

  if(!J.length){
    host.appendChild(el("p","empty",t("pl.empty")));
    return;
  }

  J.forEach(function(j){
    var ligne=el("div","jr-ligne");

    var pastille=el("button","pick");
    pastille.type="button";
    pastille.style.setProperty("--c",color(j.couleur).hex);
    pastille.setAttribute("aria-label",tf("pl.color.aria",{name:j.nom}));
    pastille.appendChild(el("i"));
    pastille.addEventListener("click",function(){
      var suite=COLORS[(COLORS.map(function(c){ return c.id; }).indexOf(j.couleur)+1) % COLORS.length];
      j.couleur=suite.id;
      pastille.style.setProperty("--c",suite.hex);
      save();
    });
    ligne.appendChild(pastille);

    var nom=el("input","field-input");
    nom.type="text";
    nom.value=j.nom;
    nom.maxLength=22;
    nom.setAttribute("aria-label",t("pl.name.aria"));
    nom.addEventListener("input",function(){ j.nom=nom.value; save(); });
    ligne.appendChild(nom);

    var sup=el("button","jr-sup");
    sup.type="button";
    sup.setAttribute("aria-label",tf("pl.del.aria",{name:j.nom}));
    sup.innerHTML='<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">'+
      '<path d="M3 4.5h10M6.5 4.5V3h3v1.5M5 4.5l.6 8.2h4.8L11 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    sup.addEventListener("click",function(){
      if(jrArme!==j.id){
        jrArme=j.id;
        sup.classList.add("arme");
        setTimeout(function(){ if(jrArme===j.id){ jrArme=null; sup.classList.remove("arme"); } },2600);
        return;
      }
      jrArme=null;
      supprimerJoueur(j.id);
      renderJoueurs();
      refreshJoueursLink();
    });
    ligne.appendChild(sup);

    host.appendChild(ligne);
  });
}

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

/* Le lien de l'accueil annonce ce que le carnet contient. Son texte n'est
   pas statique : applyStaticText le remettrait à l'invite à chaque écran. */
function refreshJoueursLink(){
  var b=$("openJoueurs").querySelector("b");
  if(b) b.textContent = J.length ? tn("pl.count",J.length) : t("pl.link.empty");
}

/* --- choisir un joueur pour un champ de nom ----------------------- */
var jrChamp = null, jrPorteur = null, jrCle = null;

function champDeJoueur(input, porteur, cle){
  var wrap=el("span","jr-champ");
  input.parentNode.insertBefore(wrap, input);
  wrap.appendChild(input);

  var b=el("button","jr-btn"+(porteur && porteur[cle] ? " tenu" : ""));
  b.type="button";
  b.setAttribute("aria-label",t("pl.pick"));
  b.innerHTML='<svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">'+
    '<circle cx="9" cy="6.4" r="3" stroke="currentColor" stroke-width="1.6"/>'+
    '<path d="M3.6 15c.6-2.8 2.8-4.3 5.4-4.3s4.8 1.5 5.4 4.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  b.addEventListener("click",function(){ ouvrirChoixJoueur(input, porteur, cle, b); });
  wrap.appendChild(b);

  /* taper un nom à la main détache le joueur : c'est un invité */
  input.addEventListener("input",function(){
    if(jrPose || !porteur || !porteur[cle]) return;
    porteur[cle]=null;
    b.classList.remove("tenu");
    save();          /* le jeu a déjà enregistré son nom avant nous */
  });
}

function poserJoueur(j){
  var input=jrChamp, porteur=jrPorteur, cle=jrCle;
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
}

function ouvrirChoixJoueur(input, porteur, cle, bouton){
  jrChamp=input; jrPorteur=porteur; jrCle=cle;
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
