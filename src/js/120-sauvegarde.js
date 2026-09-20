/* ------------------------------------------------------------------
   Sauvegarde, restauration, partage

   Dans l'APK, la coquille Android expose un pont : elle sait écrire un
   fichier et ouvrir le partage natif. Sur le web, on retombe sur le
   téléchargement, l'API de partage ou le presse-papiers.
------------------------------------------------------------------ */
function bridge(){ return (typeof window.Cornscore!=="undefined") ? window.Cornscore : null; }

function toast(msg){
  var n=$("toast");
  n.textContent=msg;
  n.classList.add("on");
  clearTimeout(toast._t);
  toast._t=setTimeout(function(){ n.classList.remove("on"); },2200);
}

function exportName(){
  var d=new Date();
  function p(v){ return String(v).padStart(2,"0"); }
  return "cornscore-"+d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+".json";
}

function exportData(){
  TOUR[S.game]=T; DRAFT[S.game]=TS;
  var contenu={v:1, at:Date.now(), s:S, tg:TOUR, ds:DRAFT, g:G, h:H, j:J};
  pourChaqueJeu("sauver", contenu);
  var payload=JSON.stringify(contenu, null, 1);
  var name=exportName();
  var b=bridge();
  if(b && b.saveFile){
    b.saveFile(name, payload);
    return;                       /* la coquille affiche son propre retour */
  }
  try{
    var blob=new Blob([payload],{type:"application/json"});
    var url=URL.createObjectURL(blob);
    var a=document.createElement("a");
    a.href=url; a.download=name;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(function(){ URL.revokeObjectURL(url); },1000);
    toast(t("data.done"));
  }catch(e){ toast(t("data.bad")); }
}

function applyImport(text){
  var d;
  try{ d=JSON.parse(text); }catch(e){ toast(t("data.bad")); return; }
  if(!d || typeof d!=="object" || (!d.h && !d.s && !d.t && !d.tg)){ toast(t("data.bad")); return; }
  if(!window.confirm(t("data.confirm"))) return;

  if(d.s && d.s.teams && d.s.teams.length===2) S=d.s;
  normS(S);
  TOUR=carteVide(); DRAFT=carteVide();
  adoptTour(d);
  H = (d.h && d.h.length) ? d.h : [];
  J = normJ(d.j);
  pourChaqueJeu("importer", d);
  G = (d.g && d.g.teams) ? normG(d.g) : null;
  if(G) recompute();

  save();
  closeAbout();
  renderCards(); renderRules(); renderTSetup();
  refreshTourBtn(); refreshHallLink(); refreshJoueursLink();
  if(G && !G.over){ show("game"); renderGame(true); }
  else show("setup");
  toast(t("data.imported"));
}

function importData(){
  var inp=$("importFile");
  inp.value="";
  inp.click();
}

function shareText(text){
  var b=bridge();
  if(b && b.share){ b.share(text); return; }
  if(navigator.share){
    navigator.share({text:text}).catch(function(){});
    return;
  }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(function(){ toast(t("share.copied")); },function(){});
    return;
  }
  toast(text);
}

function shareGame(){
  if(!G) return;
  var w=G.winner>=0 ? G.winner : 0, l=1-w;
  shareText(tf(G.rounds.length>1 ? "share.game_p" : "share.game",{
    a:G.teams[w].label, sa:G.scores[w],
    b:G.teams[l].label, sb:G.scores[l],
    n:G.rounds.length
  }));
}

function shareBracket(){
  if(!T) return;
  var lines=[t("tour.title")+" · "+tf(T.teams.length>1?"tour.head_p":"tour.head",{t:T.teams.length,m:0}).split("·")[0].trim()];
  for(var r=0;r<T.rounds;r++){
    lines.push("");
    lines.push(roundName(r).toUpperCase());
    var count=T.size>>(r+1);
    for(var i=0;i<count;i++){
      var m=matchAt(r,i);
      if(!m) continue;
      if(m.bye){ lines.push("  "+tName(m.winner===0?m.a:m.b)+" — "+t("tour.bye")); continue; }
      var a=m.a==null ? t("tour.tbd") : tName(m.a);
      var b=m.b==null ? t("tour.tbd") : tName(m.b);
      lines.push("  "+a+(m.done?" "+m.score[0]:"")+" – "+(m.done?m.score[1]+" ":"")+b);
    }
  }
  if(T.champion>=0){ lines.push(""); lines.push(t("tour.winner")+" : "+tName(T.champion)); }
  shareText(lines.join("\n"));
}

function openAbout(){ fillAbout(); $("aboutWrap").classList.add("on"); }
function closeAbout(){ $("aboutWrap").classList.remove("on"); }
$("openAbout").addEventListener("click",openAbout);
$("importFile").addEventListener("change",function(){
  var f=this.files && this.files[0];
  if(!f) return;
  var r=new FileReader();
  r.onload=function(){ applyImport(String(r.result)); };
  r.onerror=function(){ toast(t("data.bad")); };
  r.readAsText(f);
});
$("aboutClose").addEventListener("click",closeAbout);
$("aboutScrim").addEventListener("click",closeAbout);

function openRules(){ fillRules("rulesBody"); $("rulesWrap").classList.add("on"); }
function closeRules(){ $("rulesWrap").classList.remove("on"); }
$("openRules").addEventListener("click",openRules);
$("openRulesT").addEventListener("click",openRules);
$("rulesClose").addEventListener("click",closeRules);
$("rulesScrim").addEventListener("click",closeRules);

var HALL_BACK="setup";
$("openHall").addEventListener("click",function(){ HALL_BACK="setup"; renderHall(); show("hall"); });
$("hallBack").addEventListener("click",function(){ show(HALL_BACK); });
$("hallClear").addEventListener("click",function(){
  var b=$("hallClear");
  if(b.dataset.armed!=="1"){
    b.dataset.armed="1";
    b.textContent=t("hall.clear.confirm");
    setTimeout(function(){
      if(b.dataset.armed==="1"){ b.dataset.armed="0"; b.textContent=t("hall.clear"); }
    },4000);
    return;
  }
  b.dataset.armed="0";
  b.textContent=t("hall.clear");
  H=H.filter(function(x){ return (x.g||jeuHistorique())!==S.game; }); save();
  renderHall(); refreshHallLink();
  show("setup");
});

