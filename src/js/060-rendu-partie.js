/* ------------------------------------------------------------------
   Rendu de la partie
------------------------------------------------------------------ */
function buildFields(){
  var wrap=$("fields");
  wrap.innerHTML="";
  G.teams.forEach(function(team,i){
    var f=el("div","tfield");
    f.style.setProperty("--team",team.hex);
    f.dataset.i=String(i);

    var sc=el("div","t-score");
    var id=el("div","t-id");
    var name=el("h2","t-name");
    name.appendChild(el("span","dot"));
    name.appendChild(el("span",null,team.label));
    id.appendChild(name);
    id.appendChild(el("p","t-mates",team.mates));
    var honor=el("div","t-honor");
    honor.appendChild(el("span","honor",t("game.first")));
    id.appendChild(honor);
    sc.appendChild(id);
    sc.appendChild(el("div","t-num num","0"));
    sc.appendChild(el("div","t-gain",""));
    f.appendChild(sc);

    var ticks=el("div","ticks");
    ticks.setAttribute("aria-hidden","true");
    for(var k=0;k<G.target;k++) ticks.appendChild(document.createElement("i"));
    f.appendChild(ticks);

    wrap.appendChild(f);
  });
}

function buildRows(){
  var wrap=$("rows");
  wrap.innerHTML="";
  wrap.style.display="flex";
  wrap.style.flexDirection="column";
  wrap.style.gap="8px";

  var s=jeuDuel(G.game).saisie;
  G.teams.forEach(function(team,i){
    var row=el("div","crow"+(s.types.length===1 ? " solo" : ""));
    var who=el("div","who");
    var dot=el("span","dot");
    dot.style.background=team.hex;
    who.appendChild(dot);
    who.appendChild(el("span",null,team.label));
    row.appendChild(who);

    s.types.forEach(function(kind){
      var st=el("div","step");
      st.style.setProperty("--team",team.hex);
      var minus=el("button",null,"−");
      minus.type="button";
      minus.setAttribute("aria-label",t(s.retirer[kind])+" — "+team.label);
      var val=el("div","v","0");
      var plus=el("button",null,"+");
      plus.type="button";
      plus.setAttribute("aria-label",t(s.ajouter[kind])+" — "+team.label);
      minus.addEventListener("click",function(){ bump(i,kind,-1); });
      plus.addEventListener("click",function(){ bump(i,kind,1); });
      st.appendChild(minus); st.appendChild(val); st.appendChild(plus);
      st.dataset.team=String(i); st.dataset.kind=kind;
      row.appendChild(st);
    });

    wrap.appendChild(row);
  });
}

function bump(i,kind,d){
  if(G.entry[i][kind]+d<0) return;
  if(!jeuDuel(G.game).ajuster(G.entry, i, kind, d, G.max)) return;
  buzz(6);
  renderConsole();
  save();
}

/* --- tirage au sort du premier lanceur -------------------------- */
/* Qui a la main : l'honneur hérité de la manche précédente, sauf si le
   jeu en décide autrement. */
function handTeam(){
  var d=jeuDuel(G.game);
  return d.main ? d.main() : G.first;
}

function paintHonor(){
  var fields=$("fields").children;
  var k=handTeam();
  for(var i=0;i<2;i++){
    var h=fields[i] && fields[i].querySelector(".t-honor");
    if(h) h.hidden = !(k===i && !G.over);
  }
}

var CELL=72;          /* hauteur d'une case du rouleau, cf. .cell */
var tossLanded=false;

function closeToss(){
  if(!tossLanded) return;
  $("tossWrap").hidden=true;
}
$("tossWrap").addEventListener("click",closeToss);

function doToss(){
  if(!G || G.tossed || G.rounds.length) return;
  G.tossed=true;
  tossLanded=false;

  var final=Math.random()<0.5 ? 0 : 1;
  var wrap=$("tossWrap"), strip=$("reelStrip"), reel=$("reel"), out=$("tossOut");

  /* la case d'arrivée doit porter l'équipe tirée : les paires alternent */
  var cells=22+Math.floor(Math.random()*4)*2;
  if(cells%2 !== final) cells+=1;

  strip.innerHTML="";
  strip.style.transform="translateY(0)";
  strip.style.filter="none";
  reel.classList.remove("locked");
  out.textContent=t("toss.running");
  wrap.style.setProperty("--flash",G.teams[0].hex);

  for(var i=0;i<=cells;i++){
    var tm=G.teams[i%2];
    var c=el("div","cell");
    c.style.setProperty("--c",tm.hex);
    c.appendChild(el("i"));
    c.appendChild(el("span",null,tm.label));
    strip.appendChild(c);
  }
  wrap.hidden=false;

  function land(){
    strip.style.filter="none";
    strip.style.transform="translateY("+(-cells*CELL)+"px)";
    G.first=final;
    G.tossFirst=final;
    G.mpass=0;              /* le tire au sort pose le maitre le premier */
    tossLanded=true;

    reel.style.setProperty("--win",G.teams[final].hex);
    reel.classList.add("locked");
    wrap.style.setProperty("--flash",G.teams[final].hex);

    out.innerHTML="";
    var parts=tf("toss.result",{name:"\u0000"}).split("\u0000");
    out.appendChild(document.createTextNode(parts[0]||""));
    var b=el("b",null,G.teams[final].label);
    b.style.color="color-mix(in oklab,"+G.teams[final].hex+" 62%,var(--tone))";
    out.appendChild(b);
    out.appendChild(document.createTextNode(parts[1]||""));

    buzz([16,55,30]);
    paintHonor();
    save();
    renderGame();
    setTimeout(function(){ if(tossLanded) wrap.hidden=true; }, 1600);
  }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  if(reduce){ land(); return; }

  var dur=2500, t0=null, prev=0, idx=-1;
  function frame(now){
    if(t0===null) t0=now;
    var prog=Math.min(1,(now-t0)/dur);
    var off=(1-Math.pow(1-prog,4))*cells*CELL;
    var v=off-prev; prev=off;

    strip.style.transform="translateY("+(-off)+"px)";
    strip.style.filter = v>1.5 ? "blur("+Math.min(5,v*0.22)+"px)" : "none";

    var i=Math.round(off/CELL);
    if(i!==idx){
      idx=i;
      wrap.style.setProperty("--flash",G.teams[i%2].hex);
      if(v<14) buzz(3);      /* le cliquetis n'apparaît qu'au ralenti */
    }
    if(prog<1) requestAnimationFrame(frame); else land();
  }
  requestAnimationFrame(frame);
}

function renderConsole(){
  var steps=document.querySelectorAll(".console .step");
  for(var k=0;k<steps.length;k++){
    var st=steps[k];
    var i=+st.dataset.team, kind=st.dataset.kind;
    var e=G.entry[i], v=e[kind];
    var val=st.querySelector(".v");
    val.textContent=v;
    val.classList.toggle("hot", v>0);
    st.children[0].disabled = v===0;
    st.children[2].disabled = jeuDuel(G.game).plein(G.entry, i, kind, G.max);
  }

  var g=pending();
  var out=$("outcome");
  out.innerHTML="";
  if(!g[0] && !g[1]){
    out.textContent = jeuDuel(G.game).annonceNulle(G.entry);
  }else{
    var w=g[0]?0:1;
    outcomeInto(out, G.teams[w].label, g[w]);
  }
}

function renderGame(rebuild, gains){
  if(rebuild){ buildFields(); buildRows(); }

  var ctx = (G.tour && T && T.matches[G.tour.mid]) ? roundName(T.matches[G.tour.mid].r)+" · " : "";
  $("roundLabel").textContent = ctx+t("game.frame")+" "+(G.rounds.length+1);
  $("targetLabel").textContent = t("game.target")+" "+G.target;

  var ch=$("consoleTitle");
  ch.innerHTML="";
  if(!G.rounds.length && !G.tossed && !G.over){
    var tb=el("button","toss",t("toss.draw"));
    tb.type="button";
    tb.addEventListener("click",doToss);
    ch.appendChild(tb);
  }else{
    ch.textContent = jeuDuel(G.game).titreConsole(G.max);
  }
  montrerPropres($("s-game"), G.game);
  if(jeuDuel(G.game).peindre) jeuDuel(G.game).peindre();

  var main=handTeam();
  var fields=$("fields").children;
  for(var i=0;i<2;i++){
    var f=fields[i];
    var num=f.querySelector(".t-num");
    var score=G.scores[i];
    num.textContent=score;
    f.classList.toggle("lead", score>G.scores[1-i]);
    f.querySelector(".t-honor").hidden = !(main===i && !G.over);

    var ticks=f.querySelectorAll(".ticks i");
    var filled=Math.min(score,G.target);
    for(var k=0;k<ticks.length;k++){
      ticks[k].classList.toggle("f", k<filled);
      ticks[k].classList.toggle("last", k===filled-1);
    }

    if(gains && gains[i]>0){
      var gEl=f.querySelector(".t-gain");
      gEl.textContent="+"+gains[i];
      gEl.classList.remove("play");
      void gEl.offsetWidth;
      gEl.classList.add("play");
      f.classList.remove("bloom");
      void f.offsetWidth;
      f.classList.add("bloom");
    }
  }
  renderConsole();
  $("undo").disabled = !G.rounds.length;
}

