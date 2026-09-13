/* ------------------------------------------------------------------
   Écran de fin
------------------------------------------------------------------ */

/* la couleur d'équipe mélangée au fond, comme partout ailleurs : le même
   trait reste lisible sur le panneau en thème clair comme en sombre */
function teamInk(hex){ return "color-mix(in oklab,"+hex+" 62%, var(--tone))"; }

/* Une seule lecture de l'historique sert au graphe et au face-à-face :
   le cumul manche par manche, et les totaux de chaque équipe. */
function overFacts(){
  var f={ run:[[0],[0]], holes:[0,0], boards:[0,0], best:[0,0], won:[0,0], voids:0 };
  var s=[0,0];
  G.rounds.forEach(function(rd){
    if(!rd.gain[0] && !rd.gain[1]) f.voids++;
    for(var i=0;i<2;i++){
      s[i]+=rd.gain[i];
      f.run[i].push(s[i]);
      f.holes[i]+=(rd.h && rd.h[i]) || 0;
      f.boards[i]+=(rd.b && rd.b[i]) || 0;
      if(rd.gain[i]>f.best[i]) f.best[i]=rd.gain[i];
      if(rd.gain[i]>0) f.won[i]++;
    }
  });
  return f;
}

/* Courbe des points cumulés. L'axe des ordonnées monte jusqu'au score à
   atteindre — la ligne pointillée — ou au-delà quand la dernière manche
   dépasse la cible : la marge de la victoire se voit sans la lire. */
function overChart(f,w,l){
  var N=G.rounds.length;
  var W=320, H=118, PL=17, PR=4, PT=9, PB=15;
  var ymax=Math.max(G.target, f.run[0][N], f.run[1][N], 1);
  function px(i){ return PL + (i/N)*(W-PL-PR); }
  function py(v){ return PT + (1-v/ymax)*(H-PT-PB); }

  var svg=document.createElementNS(SVGNS,"svg");
  svg.setAttribute("class","prog");
  svg.setAttribute("viewBox","0 0 "+W+" "+H);
  svg.setAttribute("role","img");
  svg.setAttribute("aria-label",tf("over.chart.aria",{
    a:G.teams[w].label, sa:G.scores[w],
    b:G.teams[l].label, sb:G.scores[l], n:N
  }));

  function rule(yv,cls){
    var ln=document.createElementNS(SVGNS,"line");
    ln.setAttribute("x1",PL); ln.setAttribute("x2",W);
    ln.setAttribute("y1",yv); ln.setAttribute("y2",yv);
    ln.setAttribute("class",cls);
    svg.appendChild(ln);
  }
  function ylab(v,yv){
    var tx=document.createElementNS(SVGNS,"text");
    tx.setAttribute("class","prog-y");
    tx.setAttribute("x",PL-5);
    tx.setAttribute("y",yv.toFixed(1));
    /* le décalage plutôt que dominant-baseline, que les vieilles
       WebView d'Android alignent encore de travers */
    tx.setAttribute("dy","0.32em");
    tx.setAttribute("text-anchor","end");
    tx.textContent=v;
    svg.appendChild(tx);
  }

  /* Échelle des points : un pas rond qui donne trois ou quatre repères,
     quel que soit le score atteint. Le score visé garde le sien — c'est
     la ligne qui compte — et fait taire le repère qu'il touche. */
  var gy=py(G.target), stp=100, cand=[1,2,5,10,20,25,50];
  for(var c=0;c<cand.length;c++){ if(cand[c]>=ymax/4){ stp=cand[c]; break; } }
  for(var v=stp;v<=ymax;v+=stp){
    if(Math.abs(py(v)-gy)<7) continue;
    rule(py(v),"prog-tick");
    ylab(v,py(v));
  }
  rule(py(0),"prog-grid");
  ylab(0,py(0));
  rule(gy,"prog-goal");
  ylab(G.target,gy);

  /* numéros de manche : assez pour se repérer, jamais au point de se
     chevaucher — la dernière est toujours nommée */
  var step=Math.max(1,Math.ceil(N/5)), marks=[];
  for(var n=step;n<N;n+=step) marks.push(n);
  marks.push(N);
  marks.forEach(function(n){
    if(n!==N && px(N)-px(n)<20) return;
    var tx=document.createElementNS(SVGNS,"text");
    tx.setAttribute("class","prog-x");
    tx.setAttribute("x",px(n).toFixed(1));
    tx.setAttribute("y",H-4);
    tx.setAttribute("text-anchor",n===N?"end":"middle");
    tx.textContent=n;
    svg.appendChild(tx);
  });

  /* le vainqueur passe par-dessus quand les deux courbes se croisent */
  [l,w].forEach(function(i){
    var d="";
    for(var n=0;n<=N;n++) d+=(n?"L":"M")+px(n).toFixed(1)+" "+py(f.run[i][n]).toFixed(1)+" ";
    var path=document.createElementNS(SVGNS,"path");
    path.setAttribute("class","prog-line");
    path.setAttribute("pathLength","1");
    path.setAttribute("d",d.trim());
    path.style.stroke=teamInk(G.teams[i].hex);
    svg.appendChild(path);
  });

  var dots=document.createElementNS(SVGNS,"g");
  dots.setAttribute("class","prog-dots");
  [l,w].forEach(function(i){
    for(var n=1;n<=N;n++){
      var last=(n===N);
      if(!last && N>20) continue;
      var c=document.createElementNS(SVGNS,"circle");
      c.setAttribute("cx",px(n).toFixed(1));
      c.setAttribute("cy",py(f.run[i][n]).toFixed(1));
      c.setAttribute("r",last?3.2:1.9);
      c.style.fill=teamInk(G.teams[i].hex);
      if(last){
        /* un liseré de la couleur de la carte : deux fins de partie
           serrées restent deux points, et non une tache */
        c.style.stroke="var(--panel)";
        c.setAttribute("stroke-width","1.6");
      }
      dots.appendChild(c);
    }
  });
  svg.appendChild(dots);
  return svg;
}

/* Face-à-face : chaque équipe garde sa colonne, du nom jusqu'à la
   dernière ligne. La meilleure valeur de chaque ligne prend la couleur
   de son équipe, l'autre s'efface — le vainqueur d'une statistique se
   lit sans comparer les chiffres. */
function taleWho(i,right){
  var box=el("div","tale-who"+(right?" r":""));
  var dot=el("span","dot");
  dot.style.background=G.teams[i].hex;
  box.appendChild(dot);
  box.appendChild(el("span",null,G.teams[i].label));
  return box;
}

function taleRow(label,w,l,va,vb,fmt){
  var row=el("div","tale-row");
  var a=el("b","tale-v a",fmt(va));
  var b=el("b","tale-v b",fmt(vb));
  if(va>vb){ a.style.color=teamInk(G.teams[w].hex); b.classList.add("off"); }
  else if(vb>va){ b.style.color=teamInk(G.teams[l].hex); a.classList.add("off"); }
  row.appendChild(a);
  row.appendChild(el("span","tale-lab",label));
  row.appendChild(b);
  return row;
}

function overTale(w,l){
  var f=overFacts();
  var card=el("div","tale reveal");

  /* une seule manche ne dessine pas une progression */
  var chart = G.rounds.length>=2 ? overChart(f,w,l) : null;

  var top=el("div","tale-top");
  top.appendChild(el("p","eyebrow",t(chart ? "over.prog" : "over.stats")));
  top.appendChild(el("p","eyebrow",tf("over.goal",{n:G.target})));
  if(G.game==="palet" && f.voids) top.appendChild(el("p","eyebrow",t("over.void")+" · "+f.voids));
  card.appendChild(top);
  if(chart) card.appendChild(chart);

  var head=el("div","tale-row head");
  head.appendChild(taleWho(w,false));
  head.appendChild(el("span","tale-lab",""));
  head.appendChild(taleWho(l,true));
  card.appendChild(head);

  var plain=function(v){ return String(v); };
  var gain =function(v){ return v>0 ? "+"+v : "—"; };
  /* la moyenne s'ecrit avec la virgule partout sauf en anglais */
  var dec=(LANG==="en") ? "." : ",";
  var moy=function(i){ return f.won[i] ? (G.scores[i]/f.won[i]).toFixed(1).replace(".",dec) : "—"; };

  var lignes = (G.game==="palet")
    ? [
        [t("over.points"), G.scores[w], G.scores[l], plain],
        [t("over.won"),   f.won[w],    f.won[l],    plain],
        [t("over.best"),  f.best[w],   f.best[l],   gain],
        [t("over.avg"),    moy(w),      moy(l),      plain]
      ]
    : [
        [t("over.points"), G.scores[w],  G.scores[l],  plain],
        [t("over.won"),   f.won[w],     f.won[l],     plain],
        [t("over.holes"),  f.holes[w],   f.holes[l],   plain],
        [t("over.board"),  f.boards[w],  f.boards[l],  plain],
        [t("over.best"),   f.best[w],    f.best[l],    gain]
      ];
  lignes.forEach(function(r){
    card.appendChild(taleRow(r[0],w,l,r[1],r[2],r[3]));
  });
  return card;
}

function renderOver(){
  var w=G.winner, l=1-w;
  var box=$("over");
  box.innerHTML="";
  box.style.setProperty("--team",G.teams[w].hex);

  var tour = G.tour && T ? T.matches[G.tour.mid] : null;

  var head=el("div","over-head reveal");
  head.appendChild(el("p","eyebrow", tour
    ? roundName(tour.r)+" · "+G.rounds.length+" "+t("over.frames").toLocaleLowerCase(LANG)
    : tf("over.done",{n:G.rounds.length})));
  head.appendChild(el("h2",null,tf("over.wins",{name:G.teams[w].label})));
  var fin=el("div","final");
  fin.appendChild(el("span","a",String(G.scores[w])));
  fin.appendChild(el("span","s","–"));
  fin.appendChild(el("span","b",String(G.scores[l])));
  head.appendChild(fin);
  box.appendChild(head);

  var tale=overTale(w,l);
  tale.style.animationDelay="80ms";
  box.appendChild(tale);

  var acts=el("div","over-acts reveal");
  acts.style.animationDelay="160ms";

  var share=el("button","share-btn",t("share.result"));
  share.type="button";
  share.addEventListener("click",shareGame);
  acts.appendChild(share);

  if(tour){
    var nx=nextMatch();
    if(T.champion>=0){
      var crown=el("button","cta",t("over.champion"));
      crown.type="button";
      crown.addEventListener("click",function(){ G=null; save(); openBracket(); });
      acts.appendChild(crown);
    }else if(nx>=0){
      var nm=T.matches[nx];
      var go=el("button","cta",t("over.next"));
      go.type="button";
      head.appendChild(el("p","note",tf("over.nextline",{a:tName(nm.a),b:tName(nm.b)})));
      go.addEventListener("click",function(){ playMatch(nx); });
      acts.appendChild(go);
    }
    var toBk=el("button","cta ghost",t("over.bracket"));
    toBk.type="button";
    toBk.addEventListener("click",function(){ G=null; save(); openBracket(); });
    acts.appendChild(toBk);
  }else{
    var again=el("button","cta",t("over.rematch"));
    again.type="button";
    again.addEventListener("click",function(){ newGame(); });
    var back=el("button","cta ghost",t("over.newsetup"));
    back.type="button";
    back.addEventListener("click",function(){ G=null; save(); show("setup"); });
    acts.appendChild(again); acts.appendChild(back);
  }
  box.appendChild(acts);

  show("over");
  buzz([14,60,26]);
}

