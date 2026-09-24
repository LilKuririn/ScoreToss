/* ------------------------------------------------------------------
   Feuille de match
------------------------------------------------------------------ */
function renderSheet(){
  var body=$("sheetBody");
  body.innerHTML="";

  $("undo").textContent = t("sheet.undo");
  $("edSave").hidden = !EDIT;
  $("edDel").hidden  = !EDIT;
  $("undo").hidden   = !!EDIT;
  $("quit").hidden   = !!EDIT;
  if(EDIT){ renderEditor(body); return; }

  if(!G.rounds.length){
    body.appendChild(el("p","empty",t("sheet.empty")));
    $("undo").disabled=true;
    return;
  }
  var table=el("table","log");
  var thead=el("thead");
  var tr=el("tr");
  tr.appendChild(el("th",null,t("sheet.frame")));
  tr.appendChild(el("th",null,G.teams[0].label));
  tr.appendChild(el("th",null,G.teams[1].label));
  thead.appendChild(tr);
  table.appendChild(thead);

  var tbody=el("tbody");
  var run=[0,0];
  G.rounds.forEach(function(rd,idx){
    run[0]+=rd.gain[0];
    run[1]+=rd.gain[1];
    var row=el("tr");
    row.appendChild(el("td",null,String(idx+1).padStart(2,"0")));
    for(var j=0;j<2;j++){
      var td=el("td");
      var pt=el("span", rd.gain[j] ? "pt":"pt zero", rd.gain[j] ? "+"+rd.gain[j] : "—");
      if(rd.gain[j]) pt.style.color="color-mix(in oklab,"+G.teams[j].hex+" 62%, var(--tone))";
      td.appendChild(pt);
      td.appendChild(el("span","run",String(run[j])));
      row.appendChild(td);
    }
    row.setAttribute("role","button");
    row.tabIndex=0;
    row.setAttribute("aria-label",tf("sheet.fix.aria",{n:idx+1}));
    row.addEventListener("click",function(){ openEditor(idx); });
    row.addEventListener("keydown",function(ev){
      if(ev.key==="Enter"||ev.key===" "){ ev.preventDefault(); openEditor(idx); }
    });
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  body.appendChild(table);
  body.appendChild(el("p","hint",t("sheet.hint")));
  $("undo").disabled=false;
}

/* --- correction d'une manche déjà validée ----------------------- */
var EDIT=null;

function openEditor(idx){
  var rd=G.rounds[idx];
  if(!rd) return;
  EDIT={idx:idx, e: jeuDuel(G.game).entreeDeManche(rd)};
  renderSheet();
}
function closeEditor(){ EDIT=null; renderSheet(); }

function editBump(i,kind,d){
  if(EDIT.e[i][kind]+d<0) return;
  if(!jeuDuel(G.game).ajuster(EDIT.e, i, kind, d, G.max)) return;
  buzz(6);
  renderSheet();
}

function renderEditor(body){
  var head=el("div","ed-head");
  head.appendChild(el("p","eyebrow",tf("edit.title",{n:String(EDIT.idx+1).padStart(2,"0")})));
  var back=el("button","ed-back",t("edit.cancel"));
  back.type="button";
  back.addEventListener("click",closeEditor);
  head.appendChild(back);
  body.appendChild(head);

  var jd=jeuDuel(G.game), s=jd.saisie, solo=(s.types.length===1);
  var cols=el("div","ed-cols"+(solo?" solo":""));
  cols.appendChild(el("p","eyebrow",""));
  s.entetes.forEach(function(k){ cols.appendChild(el("p","eyebrow",t(k))); });
  body.appendChild(cols);

  G.teams.forEach(function(team,i){
    var row=el("div","crow"+(solo?" solo":""));
    var who=el("div","who");
    var dot=el("span","dot");
    dot.style.background=team.hex;
    who.appendChild(dot);
    who.appendChild(el("span",null,team.label));
    row.appendChild(who);

    s.types.forEach(function(kind){
      var e=EDIT.e[i];
      var st=el("div","step");
      st.style.setProperty("--team",team.hex);
      var minus=el("button",null,"−");
      minus.type="button";
      minus.disabled = e[kind]===0;
      minus.setAttribute("aria-label",t(s.retirer[kind])+" — "+team.label);
      var val=el("div","v",String(e[kind]));
      if(e[kind]>0) val.classList.add("hot");
      var plus=el("button",null,"+");
      plus.type="button";
      plus.disabled = jd.plein(EDIT.e, i, kind, G.max);
      plus.setAttribute("aria-label",t(s.ajouter[kind])+" — "+team.label);
      minus.addEventListener("click",function(){ editBump(i,kind,-1); });
      plus.addEventListener("click",function(){ editBump(i,kind,1); });
      st.appendChild(minus); st.appendChild(val); st.appendChild(plus);
      row.appendChild(st);
    });
    body.appendChild(row);
  });

  var out=el("p","outcome ed-out");
  var q=jd.gain(EDIT.e);
  if(!q[0] && !q[1]) out.textContent = jd.annonceNulle(EDIT.e);
  else outcomeInto(out, G.teams[q[0]?0:1].label, q[0]||q[1]);
  body.appendChild(out);
}

/* Une correction peut finir la partie : elle est alors archivée — et son
   résultat reporté au tableau du tournoi — AVANT d'être sauvegardée, sans
   quoi fermer l'application sur l'écran de fin la faisait perdre. */
function afterHistoryChange(){
  recompute();
  G.mpass=0;
  buzz(10);
  if(G.over){
    closeSheet();
    archiveGame();
    applyMatchResult();
    save();
    renderGame();
    setTimeout(renderOver, 380);
  }else{
    save();
    renderGame();
    renderSheet();
  }
}

$("edSave").addEventListener("click",function(){
  if(!EDIT) return;
  var jd=jeuDuel(G.game);
  G.rounds[EDIT.idx]=jd.manche(EDIT.e, jd.gain(EDIT.e));
  EDIT=null;
  afterHistoryChange();
});
$("edDel").addEventListener("click",function(){
  if(!EDIT) return;
  G.rounds.splice(EDIT.idx,1);
  EDIT=null;
  afterHistoryChange();
});

function openSheet(){
  EDIT=null;
  renderSheet();
  armQuit(false);
  $("sheetWrap").classList.add("on");
}
function closeSheet(){
  $("sheetWrap").classList.remove("on");
  var bk=$("bkSheetWrap");
  if(bk) bk.classList.remove("on");
  var ru=$("rulesWrap");
  if(ru) ru.classList.remove("on");
  var ab=$("aboutWrap");
  if(ab) ab.classList.remove("on");
}
$("openSheet").addEventListener("click",openSheet);
$("closeSheet").addEventListener("click",closeSheet);
$("scrim").addEventListener("click",closeSheet);
$("undo").addEventListener("click",function(){ undoRound(); });
/* Le geste le plus destructeur de l'application — il efface la partie et
   son historique — demande donc confirmation, comme l'abandon d'un
   tournoi ou l'effacement du palmarès. */
function armQuit(on){
  var b=$("quit");
  b.dataset.armed = on ? "1" : "0";
  b.textContent = on ? t("sheet.quit.confirm")
                     : t((G && G.tour) ? "sheet.quit.tour" : "sheet.quit");
}
$("quit").addEventListener("click",function(){
  var b=$("quit");
  if(b.dataset.armed!=="1"){
    armQuit(true);
    setTimeout(function(){ if(b.dataset.armed==="1") armQuit(false); },4000);
    return;
  }
  armQuit(false);
  closeSheet();
  var wasTour = !!(G && G.tour);
  G=null; save();
  buzz(12);
  if(wasTour && T) openBracket(); else show("setup");
});
$("validate").addEventListener("click",validateRound);

