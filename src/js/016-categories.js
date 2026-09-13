
/* ------------------------------------------------------------------
   Catégories de jeux

   L'accueil propose d'abord une catégorie, puis la liste de ses jeux.
   Chaque jeu déclare la sienne dans le registre. Une catégorie sans jeu
   reste annoncée sur l'accueil, mais ne s'ouvre pas.
------------------------------------------------------------------ */
var CATEGORIES = [
  {id:"exterieur", bientot:"games.soon.sub"},
  {id:"interieur"},
  {id:"societe"}
];
var CATEGORIE = CATEGORIES[0].id;      /* celle dont la liste est affichée */

function categorie(id){
  for(var i=0;i<CATEGORIES.length;i++) if(CATEGORIES[i].id===id) return CATEGORIES[i];
  return CATEGORIES[0];
}
function jeuxDeCategorie(id){
  return ORDRE_JEUX.filter(function(j){ return JEUX[j].categorie===id; });
}

/* Les tuiles de l'accueil : un seul jeu s'annonce par son nom, plusieurs
   par leur nombre, aucun par « bientôt ». */
function renderCategories(){
  CATEGORIES.forEach(function(c){
    var b=document.querySelector('#categories [data-categorie="'+c.id+'"]');
    if(!b) return;
    var jeux=jeuxDeCategorie(c.id);
    b.classList.toggle("soon", !jeux.length);
    if(jeux.length) b.removeAttribute("aria-disabled");
    else b.setAttribute("aria-disabled","true");
    b.querySelector(".tile-sub").textContent = !jeux.length ? t("cat.soon")
      : (jeux.length===1 ? JEUX[jeux[0]].nom() : tn("cat.count", jeux.length));
  });
}

/* La liste d'une catégorie : ses tuiles de jeu, et l'annonce de ceux à
   venir si elle en a une. */
function peindreCategorie(){
  var c=categorie(CATEGORIE);
  var h1=$("catTitle");
  if(h1 && h1.firstChild) h1.firstChild.nodeValue = t("cat."+c.id);
  var tuiles=$("catGames").querySelectorAll(".tile[data-jeu]");
  for(var i=0;i<tuiles.length;i++) tuiles[i].hidden = jeu(tuiles[i].dataset.jeu).categorie!==c.id;
  $("catSoon").hidden = !c.bientot;
  if(c.bientot) $("catSoonSub").textContent = t(c.bientot);
}
function ouvrirCategorie(id){
  CATEGORIE=categorie(id).id;
  peindreCategorie();
  show("cat");
}
/* « Changer de jeu » ramène à la liste de la catégorie du jeu en cours. */
function retourAuxJeux(){ ouvrirCategorie(jeu(S.game).categorie); }

$("categories").addEventListener("click",function(e){
  var b=e.target.closest("button[data-categorie]");
  if(!b || b.classList.contains("soon")) return;
  ouvrirCategorie(b.dataset.categorie);
});
$("catBack").addEventListener("click",function(){ show("games"); });
