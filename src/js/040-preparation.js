/* ------------------------------------------------------------------
   Écran de préparation
------------------------------------------------------------------ */
function renderCards(){
  var wrap=$("cards");
  wrap.innerHTML="";
  wrap.style.display="flex";
  wrap.style.flexDirection="column";
  wrap.style.gap="12px";

  S.teams.forEach(function(team,i){
    var c=color(team.color);
    var card=el("div","card");
    card.style.setProperty("--team",c.hex);

    var head=el("div","card-head");
    head.appendChild(el("p","eyebrow", defaultName(i)));
    head.appendChild(el("p","cname",t("color."+c.id)));
    card.appendChild(head);

    var sw=el("div","swatches");
    COLORS.forEach(function(col){
      var b=el("button","sw");
      b.type="button";
      b.style.setProperty("--c",col.hex);
      b.setAttribute("aria-pressed", col.id===team.color ? "true":"false");
      b.setAttribute("aria-label",t("color.aria")+" "+t("color."+col.id));
      b.addEventListener("click",function(){
        var other=S.teams[1-i];
        if(other.color===col.id) other.color=team.color;   /* échange plutôt que blocage */
        team.color=col.id;
        renderCards();
        save();
      });
      sw.appendChild(b);
    });
    card.appendChild(sw);

    var name=el("input","field-input");
    name.type="text";
    name.value=team.name;
    name.maxLength=22;
    name.placeholder=defaultName(i);
    name.setAttribute("aria-label",t(coequipiers(S.mode)?"team.name.aria":"player.name.aria")+" "+(i===0?"A":"B"));
    name.addEventListener("input",function(){ team.name=name.value; save(); });
    card.appendChild(name);
    champDeJoueur(name, team, "pid");

    var nb=coequipiers(S.mode);
    if(nb){
      var mates=el("div","mates"+(nb===3 ? " trio" : ""));
      while(team.mates.length<nb) team.mates.push("");
      team.mates.slice(0,nb).forEach(function(_,k){
        var m=el("input","field-input");
        m.type="text";
        m.value=team.mates[k];
        m.maxLength=16;
        m.placeholder=t("team.player")+" "+(k+1);
        m.setAttribute("aria-label",t("team.player")+" "+(k+1)+" — "+t(i===0?"team.a":"team.b"));
        m.addEventListener("input",function(){ team.mates[k]=m.value; save(); });
        mates.appendChild(m);
        champDeJoueur(m, team.mids || (team.mids=[]), k);
      });
      card.appendChild(mates);
    }

    wrap.appendChild(card);
  });
}

/* Les scores proposés changent d'un jeu à l'autre : on reconstruit la
   rangée plutôt que d'en masquer des morceaux. */
function fillChips(host, vals, cur, attr){
  host.innerHTML="";
  vals.forEach(function(v){
    var b=el("button","chip",String(v));
    b.type="button";
    b.setAttribute("data-"+attr, String(v));
    if(v===cur) b.classList.add("on");
    host.appendChild(b);
  });
}

/* Bascule l'écran de préparation sur un jeu : titre, scores proposés,
   réglage des palets, cartes d'équipe et fiche de règles. */
function applyGame(id){
  if(!S.tgt) S.tgt=ciblesParDefaut();
  S.tgt[S.game] = S.target;          /* on range le score du jeu qu'on quitte */
  TOUR[S.game]  = T;                 /* ainsi que son tableau et son brouillon */
  DRAFT[S.game] = TS;
  S.game = id;
  /* la triplette n'existe qu'à la pétanque : on se replie sur le double */
  if(modesDuJeu(id).indexOf(S.mode)<0) changerMode("double");
  applyStaticText();                /* ses propres mots, « mène » à la pétanque */
  T  = TOUR[id] || null;
  TS = DRAFT[id] || freshDraft(id);
  TS.open = -1;
  var d = jeuDuel(id);
  S.target = S.tgt[id] || d.cible;   /* et on ressort le sien */
  if(d.cibles.indexOf(S.target)<0) S.target = d.cible;
  if(d.auChoix) d.auChoix();
  renderRules();
  renderCards();
  fillRules("rulesBody");
  renderTSetup();
  refreshTourBtn();
  refreshHallLink();
  save();
}

function renderRules(){
  /* une cible retenue pour un jeu peut ne plus exister dans l'autre */
  var gd=jeuDuel(S.game);
  if(gd.cibles.indexOf(S.target)<0) S.target=gd.cible;
  var h1=$("setupTitle");
  if(h1 && h1.firstChild) h1.firstChild.nodeValue = gd.nom();
  fillChips($("target"), gd.cibles, S.target, "target");
  montrerPropres($("s-setup"), S.game);
  if(gd.peindrePreparation) gd.peindrePreparation();
  /* le mode n'était synchronisé qu'au clic : au rechargement d'une partie
     en double, la bascule restait affichée sur Simple. */
  peindreModes($("mode"), S.game, S.mode);
}

$("mode").addEventListener("click",function(e){
  var b=e.target.closest("button[data-mode]");
  if(!b || b.dataset.mode===S.mode) return;   /* rien à faire si c'est déjà le mode courant */

  changerMode(b.dataset.mode);
  renderCards();
  renderRules();
  save();
});
/* Changer de format change la nature de ce qu'on nomme : un joueur devient
   une équipe. Les noms précédents n'ont plus de sens, on repart de zéro.
   Les couleurs, elles, restent. */
function changerMode(mode){
  S.mode=mode;
  S.teams.forEach(function(team){
    team.name="";
    team.mates=coequipiers(mode)===3 ? ["","",""] : ["",""];
  });
  var d=jeuDuel(S.game);
  if(d.auChangementDeMode) d.auChangementDeMode();
}
$("target").addEventListener("click",function(e){
  var b=e.target.closest("button[data-target]");
  if(!b) return;
  S.target=+b.dataset.target;
  if(!S.tgt) S.tgt=ciblesParDefaut();
  S.tgt[S.game]=S.target;
  renderRules(); save();
});

