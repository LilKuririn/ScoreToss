/* ------------------------------------------------------------------
   Le carnet de joueurs

   Huit jeux, huit palmarès : un même nom y vivait huit fois sans jamais
   se rejoindre. Le carnet donne à chaque joueur un identifiant stable,
   que les jeux rangent à côté du nom qu'ils affichent déjà — les parties
   pourront ainsi se croiser, quel que soit le jeu.

   Rien n'est obligatoire : un champ de nom reste un champ de texte, et
   l'invité du dimanche se tape à la main comme avant. Le carnet n'est
   qu'une liste de noms proposés, et le bouton qui l'ouvre ; il se gère,
   avec les fiches des joueurs, depuis le palmarès (100-palmares.js).
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
