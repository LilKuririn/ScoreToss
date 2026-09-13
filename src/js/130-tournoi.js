/* ==================================================================
   TOURNOI — élimination directe
================================================================== */
/* Chaque jeu a son tableau et son brouillon. Sans cela, un tournoi de
   cornhole en cours allumait la pastille du bouton en passant au palet,
   et le brouillon gardait les noms saisis pour l'autre jeu. `T` et `TS`
   restent les pointeurs actifs, echanges au changement de jeu. */
var TOUR  = {cornhole:null, palet:null};
var DRAFT = {cornhole:null, palet:null};

function freshDraft(id){
  var d = { game:id, count:4, mode:"simple",
            target:(GAMES[id]||GAMES.cornhole).target, open:-1, teams:[] };
  for(var i=0;i<16;i++) d.teams.push({name:"", color:COLORS[i%COLORS.length].id});
  return d;
}

var TS = freshDraft("cornhole");

var T = null;   /* tournoi en cours */

function tName(k){
  if(k==null || !T) return null;
  return (T.teams[k].name||"").trim() || tf("tour.teamn",{n:k+1});
}
function tHex(k){ return color(T.teams[k].color).hex; }

/* ordre de placement classique : 1 contre le dernier, etc. */
function seedOrder(n){
  var o=[1];
  while(o.length<n){
    var m=o.length*2+1, next=[];
    for(var i=0;i<o.length;i++){ next.push(o[i]); next.push(m-o[i]); }
    o=next;
  }
  return o;
}
function matchAt(r,i){
  for(var k=0;k<T.matches.length;k++){
    if(T.matches[k].r===r && T.matches[k].i===i) return T.matches[k];
  }
  return null;
}
function propagate(m){
  if(m.r+1>=T.rounds) return;
  var win = m.winner===0 ? m.a : m.b;
  var p = matchAt(m.r+1, m.i>>1);
  if(!p) return;
  if(m.i%2===0) p.a=win; else p.b=win;
}
function nextMatch(){
  for(var k=0;k<T.matches.length;k++){
    var m=T.matches[k];
    if(!m.done && m.a!=null && m.b!=null) return k;
  }
  return -1;
}
function roundName(r){
  var left=T.rounds-r;
  if(left===1) return t("round.final");
  if(left===2) return t("round.semi");
  if(left===3) return t("round.quarter");
  if(left===4) return t("round.16");
  return tf("round.n",{n:r+1});
}

function buildTournament(){
  var n=TS.count;
  var size=2; while(size<n) size*=2;
  var rounds=Math.round(Math.log(size)/Math.log(2));
  var order=seedOrder(size);

  var matches=[];
  for(var r=0;r<rounds;r++){
    var count=size>>(r+1);
    for(var i=0;i<count;i++) matches.push({r:r,i:i,a:null,b:null,winner:-1,score:[0,0],done:false,bye:false});
  }
  T={
    game:S.game, max:paletMax(TS.mode,S.palets),
    /* enregistre plus bas dans TOUR[S.game] */
    teams:TS.teams.slice(0,n).map(function(team,k){
      return {name:(team.name||"").trim() || tf("tour.teamn",{n:k+1}), color:team.color};
    }),
    size:size, rounds:rounds, matches:matches,
    mode:TS.mode, target:TS.target, champion:-1
  };

  /* placement du 1er tour, les rangs au-delà de n étant des exemptions */
  for(var j=0;j<size/2;j++){
    var m=matchAt(0,j);
    var sa=order[j*2], sb=order[j*2+1];
    m.a = sa<=n ? sa-1 : null;
    m.b = sb<=n ? sb-1 : null;
  }
  for(var k=0;k<matches.length;k++){
    var mm=matches[k];
    if(mm.r!==0) continue;
    if(mm.a!=null && mm.b==null){ mm.winner=0; mm.done=true; mm.bye=true; propagate(mm); }
    else if(mm.a==null && mm.b!=null){ mm.winner=1; mm.done=true; mm.bye=true; propagate(mm); }
  }
}

/* --- préparation ------------------------------------------------ */
function renderTCount(){
  $("tcVal").textContent=TS.count;
  $("tcMinus").disabled = TS.count<=2;
  $("tcPlus").disabled  = TS.count>=16;
  var size=2; while(size<TS.count) size*=2;
  var byes=size-TS.count;
  $("tcNote").textContent = tf("tour.bracketof",{n:size})+" · "+
    (byes===0 ? t("tour.byes.none") : tn("tour.byes",byes));
}
function renderTRows(){
  var host=$("trows");
  host.innerHTML="";
  host.style.display="flex";
  host.style.flexDirection="column";
  host.style.gap="0";

  for(var k=0;k<TS.count;k++){
    (function(k){
      var team=TS.teams[k];
      var row=el("div","trow");
      row.appendChild(el("span","seed",String(k+1).padStart(2,"0")));

      var pick=el("button","pick");
      pick.type="button";
      pick.style.setProperty("--c",color(team.color).hex);
      pick.setAttribute("aria-label",tf("tour.color.aria",{n:k+1}));
      pick.setAttribute("aria-expanded", TS.open===k ? "true":"false");
      pick.appendChild(el("i"));
      pick.addEventListener("click",function(){
        TS.open = TS.open===k ? -1 : k;
        renderTRows();
      });
      row.appendChild(pick);

      var name=el("input","field-input");
      name.type="text";
      name.value=team.name;
      name.maxLength=22;
      name.placeholder=tf("tour.teamn",{n:k+1});
      name.setAttribute("aria-label",tf("tour.team.aria",{n:k+1}));
      name.addEventListener("input",function(){ team.name=name.value; save(); });
      row.appendChild(name);
      host.appendChild(row);

      var sw=el("div","trow-sw swatches");
      sw.hidden = TS.open!==k;
      COLORS.forEach(function(col){
        var b=el("button","sw");
        b.type="button";
        b.style.setProperty("--c",col.hex);
        b.setAttribute("aria-pressed", col.id===team.color ? "true":"false");
        b.setAttribute("aria-label",t("color.aria")+" "+t("color."+col.id));
        b.addEventListener("click",function(){
          team.color=col.id; TS.open=-1;
          renderTRows(); save();
        });
        sw.appendChild(b);
      });
      host.appendChild(sw);
    })(k);
  }
}
function renderTRules(){
  var gd=GAMES[S.game]||GAMES.cornhole;
  if(gd.targets.indexOf(TS.target)<0) TS.target=gd.target;
  fillChips($("ttarget"), gd.targets, TS.target, "target");
  var a=$("ttarget").children, i;
  for(i=0;i<a.length;i++) a[i].classList.toggle("on", +a[i].dataset.target===TS.target);
  var mm=$("tmode").children;
  for(i=0;i<mm.length;i++) mm[i].classList.toggle("on", mm[i].dataset.mode===TS.mode);
}
function renderTSetup(){ renderTCount(); renderTRows(); renderTRules(); }

$("tcMinus").addEventListener("click",function(){
  if(TS.count<=2) return;
  TS.count--; if(TS.open>=TS.count) TS.open=-1;
  renderTCount(); renderTRows(); save();
});
$("tcPlus").addEventListener("click",function(){
  if(TS.count>=16) return;
  TS.count++;
  renderTCount(); renderTRows(); save();
});
$("tmode").addEventListener("click",function(e){
  var b=e.target.closest("button[data-mode]"); if(!b) return;
  TS.mode=b.dataset.mode; renderTRules(); save();
});
$("ttarget").addEventListener("click",function(e){
  var b=e.target.closest("button[data-target]"); if(!b) return;
  TS.target=+b.dataset.target; renderTRules(); save();
});
$("tstart").addEventListener("click",function(){
  buildTournament();
  openBracket();
  save();
});

/* --- le tableau -------------------------------------------------- */
var SVGNS="http://www.w3.org/2000/svg";

function bkSide(k, cls, score){
  var s=el("div","bk-side "+(cls||""));
  var dot=el("i");
  if(k!=null) dot.style.setProperty("--c",tHex(k));
  s.appendChild(dot);
  s.appendChild(el("span",null, k==null ? t("tour.tbd") : tName(k)));
  if(score!=null) s.appendChild(el("b",null,String(score)));
  if(k!=null) s.classList.add("named"); else s.classList.add("tbd");
  return s;
}

function renderBracket(){
  var host=$("bkScroll");
  host.innerHTML="";

  var MW=152, MH=58, GAP=14, COL=40, HEAD=26;
  var rounds=T.rounds, size=T.size;
  var bodyH=(size/2)*(MH+GAP);
  var totalW=rounds*MW+(rounds-1)*COL;
  var next=nextMatch();

  var canvas=el("div","bk-canvas");
  canvas.style.width=totalW+"px";
  canvas.style.height=(bodyH+HEAD)+"px";

  var svg=document.createElementNS(SVGNS,"svg");
  svg.setAttribute("class","bk-links");
  svg.setAttribute("width",totalW);
  svg.setAttribute("height",bodyH+HEAD);
  canvas.appendChild(svg);

  for(var r=0;r<rounds;r++){
    var count=size>>(r+1);
    var span=bodyH/count;
    var x=r*(MW+COL);

    var title=el("div","bk-col",roundName(r));
    title.style.left=x+"px";
    title.style.width=MW+"px";
    canvas.appendChild(title);

    for(var i=0;i<count;i++){
      var y=HEAD+span*i+span/2-MH/2;
      var m=matchAt(r,i);

      var card=el("button","bk-match");
      card.type="button";
      card.style.left=x+"px";
      card.style.top=y+"px";
      card.style.width=MW+"px";
      card.style.height=MH+"px";

      var playable = !m.done && m.a!=null && m.b!=null;
      var sa,sb;
      if(m.done && !m.bye){
        sa=bkSide(m.a, m.winner===0?"won":"lost", m.score[0]);
        sb=bkSide(m.b, m.winner===1?"won":"lost", m.score[1]);
      }else if(m.bye){
        sa=bkSide(m.winner===0?m.a:m.b,"won",null);
        sb=el("div","bk-side tbd");
        sb.appendChild(el("i"));
        sb.appendChild(el("span",null,t("tour.bye")));
      }else{
        sa=bkSide(m.a,null,null);
        sb=bkSide(m.b,null,null);
      }
      card.appendChild(sa);
      card.appendChild(el("div","bk-rule"));
      card.appendChild(sb);

      if(playable){
        card.classList.add("playable");
        (function(id){ card.addEventListener("click",function(){ playMatch(id); }); })(T.matches.indexOf(m));
      }else{
        card.disabled=true;
      }
      if(T.champion>=0 ? (r===rounds-1) : (T.matches.indexOf(m)===next)) card.id="bkNext";
      canvas.appendChild(card);

      if(r<rounds-1){
        var pspan=bodyH/(count/2);
        var py=HEAD+pspan*Math.floor(i/2)+pspan/2;
        var cy=y+MH/2;
        var x1=x+MW, x2=x1+COL, mid=x1+COL/2;
        var p=document.createElementNS(SVGNS,"path");
        p.setAttribute("d","M"+x1+" "+cy+" H"+mid+" V"+py+" H"+x2);
        svg.appendChild(p);
      }
    }
  }
  host.appendChild(canvas);

  var played=0;
  for(var k=0;k<T.matches.length;k++) if(T.matches[k].done && !T.matches[k].bye) played++;
  $("bkTitle").textContent = tf(played>1?"tour.head_p":"tour.head",{t:T.teams.length,m:played});

  renderBkBar(next);
}

function renderBkBar(next){
  var bar=$("bkBar");
  bar.innerHTML="";
  bar.classList.remove("bk-champ");

  if(T.champion>=0){
    bar.classList.add("bk-champ");
    bar.style.setProperty("--team",tHex(T.champion));
    var box=el("div","bk-next");
    box.appendChild(el("p","eyebrow",t("tour.winner")));
    box.appendChild(el("p","bk-vs",tName(T.champion)));
    bar.appendChild(box);
    var nb=el("button","bk-play",t("tour.new"));
    nb.type="button";
    nb.addEventListener("click",function(){ show("tsetup"); renderTSetup(); });
    bar.appendChild(nb);
    return;
  }

  if(next<0){
    bar.appendChild(el("p","note",t("tour.waiting")));
    return;
  }
  var m=T.matches[next];
  var box2=el("div","bk-next");
  box2.appendChild(el("p","eyebrow",tf("tour.next",{r:roundName(m.r)})));
  var vs=el("p","bk-vs");
  vs.appendChild(document.createTextNode(tName(m.a)));
  vs.appendChild(el("em",null,"vs"));
  vs.appendChild(document.createTextNode(tName(m.b)));
  box2.appendChild(vs);
  bar.appendChild(box2);

  var play=el("button","bk-play",t("tour.play"));
  play.type="button";
  play.addEventListener("click",function(){ playMatch(next); });
  bar.appendChild(play);
}

function openBracket(){
  renderBracket();
  show("bracket");
  var n=$("bkNext");
  if(n && n.scrollIntoView) n.scrollIntoView({block:"center",inline:"center"});
}

/* --- un match du tournoi ---------------------------------------- */
function playMatch(mid){
  var m=T.matches[mid];
  if(!m || m.done || m.a==null || m.b==null) return;

  var hexA=tHex(m.a), hexB=tHex(m.b);
  if(hexA===hexB){
    for(var c=0;c<COLORS.length;c++){
      if(COLORS[c].hex!==hexA){ hexB=COLORS[c].hex; break; }
    }
  }
  G={
    game:T.game||"cornhole", mode:T.mode, target:T.target, max:T.max||4,
    teams:[{label:tName(m.a),mates:"",hex:hexA},{label:tName(m.b),mates:"",hex:hexB}],
    rounds:[], entry:newEntry(T.game||"cornhole"),
    scores:[0,0], first:0, mpass:0, over:false, winner:-1,
    tour:{mid:mid, recorded:false}
  };
  show("game");
  renderGame(true);
  save();
  keepAwake();
}

function applyMatchResult(){
  if(!G || !G.tour || G.tour.recorded || !T) return;
  var m=T.matches[G.tour.mid];
  G.tour.recorded=true;
  if(!m || m.done) return;
  m.score=[G.scores[0],G.scores[1]];
  m.winner=G.winner;
  m.done=true;
  propagate(m);
  if(m.r===T.rounds-1) T.champion = G.winner===0 ? m.a : m.b;
}

