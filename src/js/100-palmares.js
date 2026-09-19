/* ==================================================================
   PALMARÈS — parties archivées et confrontations
================================================================== */
var H=[];

function archiveGame(){
  if(!G || G.archived || G.winner<0) return;
  var holes=[0,0];
  G.rounds.forEach(function(r){ if(r.h){ holes[0]+=r.h[0]; holes[1]+=r.h[1]; } });
  H.unshift({
    d:Date.now(), g:G.game, mode:G.mode,
    n:[G.teams[0].label,G.teams[1].label],
    c:[G.teams[0].hex,G.teams[1].hex],
    s:[G.scores[0],G.scores[1]],
    w:G.winner, r:G.rounds.length, ho:holes,
    t:!!G.tour
  });
  if(H.length>200) H.length=200;
  G.archived=true;
}

/* Une victoire au cornhole et une au palet ne se comparent pas : le
   palmares ne montre que les parties du jeu choisi. */
function HG(){
  return H.filter(function(x){ return (x.g||jeuHistorique())===S.game; });
}

function nameKey(s){ return (s||"").trim().toLocaleLowerCase("fr"); }

/* Un nom peut désigner un joueur seul ou une équipe : on relève le format
   dans lequel il a joué pour pouvoir les distinguer d'un coup d'œil. Un nom
   apparu dans plusieurs ne reçoit aucune marque, elle mentirait. */
var TAG_MODE={simple:"hall.tag.solo", double:"hall.tag.duo", triple:"hall.tag.trio"};
function noterMode(m, mode){
  if(!mode) return;
  m.modes[mode]=true;
}
function tagDeModes(m){
  var k=Object.keys(m.modes);
  return k.length===1 ? t(TAG_MODE[k[0]]||TAG_MODE.simple) : null;
}
function modeTags(){
  var m={};
  HG().forEach(function(g){
    if(!g.mode) return;          /* le mölkky n'est ni simple ni double */
    for(var i=0;i<g.n.length;i++){
      var k=nameKey(g.n[i]);
      if(!k) continue;
      if(!m[k]) m[k]={modes:{}};
      noterMode(m[k], g.mode==="double"||g.mode==="triple" ? g.mode : "simple");
    }
  });
  return m;
}
function tagFor(tags,name){
  var i=tags[nameKey(name)];
  return i ? tagDeModes(i) : null;
}
function tagEl(tags,name){
  var s=tagFor(tags,name);
  return s ? el("span","mtag",s) : null;
}

function standings(){
  var map={}, order=[];
  HG().forEach(function(g){
    if(g.n.length<2) return;      /* seul, on ne gagne contre personne */
    for(var i=0;i<g.n.length;i++){
      var k=nameKey(g.n[i]);
      if(!k) continue;
      if(!map[k]){ map[k]={label:g.n[i], hex:g.c[i], v:0, d:0}; order.push(k); }
      var m=map[k];
      m.label=g.n[i]; m.hex=g.c[i];
      if(g.w===i) m.v++; else if(g.w>=0) m.d++;   /* une égalité ne compte ni pour ni contre */
    }
  });
  var list=order.map(function(k){ return map[k]; });
  list.sort(function(a,b){
    return (b.v-a.v) || ((b.v+b.d)-(a.v+a.d)) || a.label.localeCompare(b.label,LANG);
  });
  return list;
}

function duels(){
  var map={}, order=[];
  HG().forEach(function(g){
    if(g.n.length!==2) return;   /* une confrontation se joue à deux */
    if(g.w<0) return;            /* une égalité ne départage personne */
    var ka=nameKey(g.n[0]), kb=nameKey(g.n[1]);
    if(!ka || !kb || ka===kb) return;
    var flip = kb<ka;
    var id = flip ? kb+"|"+ka : ka+"|"+kb;
    var f = flip ? 1 : 0;
    if(!map[id]){ map[id]={n:["",""], c:["",""], w:[0,0], modes:{}}; order.push(id); }
    var m=map[id];
    m.n=[g.n[f],g.n[1-f]];
    m.c=[g.c[f],g.c[1-f]];
    /* le mölkky et les fléchettes ne se jouent ni en simple ni en double :
       leurs confrontations ne reçoivent aucune marque */
    if(g.mode) noterMode(m, g.mode==="double"||g.mode==="triple" ? g.mode : "simple");
    if(g.w===f) m.w[0]++; else m.w[1]++;
  });
  var list=order.map(function(k){ return map[k]; });
  list.sort(function(x,y){ return (y.w[0]+y.w[1])-(x.w[0]+x.w[1]); });
  return list;
}

function blockOf(titre){
  var b=el("div","block");
  b.appendChild(el("p","eyebrow",titre));
  return b;
}

function renderHall(){
  var body=$("hallBody");
  body.innerHTML="";

  $("hallCount").textContent = tn("hall.count",HG().length);

  if(!HG().length){
    body.appendChild(el("p","empty",t("hall.empty")));
    return;
  }

  var tags=modeTags();

  /* confrontations */
  var d=duels();
  if(d.length){
    var bd=blockOf(t("hall.duels"));
    d.slice(0,10).forEach(function(x){
      var card=el("div","duel");
      var top=el("div","duel-top");

      var left=el("div","duel-n");
      var dl=el("span","dot"); dl.style.background=x.c[0];
      left.appendChild(dl);
      left.appendChild(el("span",null,x.n[0]));
      top.appendChild(left);

      /* le format sous le score : la colonne du milieu a de la place,
         les noms n'en avaient pas à céder */
      var mid=el("div","duel-mid");
      mid.appendChild(el("p","duel-s",x.w[0]+" – "+x.w[1]));
      var tag=tagDeModes(x);
      if(tag) mid.appendChild(el("span","mtag",tag));
      top.appendChild(mid);

      var right=el("div","duel-n r");
      right.appendChild(el("span",null,x.n[1]));
      var dr=el("span","dot"); dr.style.background=x.c[1];
      right.appendChild(dr);
      top.appendChild(right);
      card.appendChild(top);

      var tot=x.w[0]+x.w[1];
      var bar=el("div","duel-bar");
      var ia=el("i"); ia.style.background=x.c[0]; ia.style.width=(x.w[0]/tot*100)+"%";
      var ib=el("i"); ib.style.background=x.c[1]; ib.style.width=(x.w[1]/tot*100)+"%";
      bar.appendChild(ia); bar.appendChild(ib);
      card.appendChild(bar);

      bd.appendChild(card);
    });
    body.appendChild(bd);
  }

  /* meilleurs scores : un jeu qui se joue aussi seul les déclare */
  var titreRecords=jeu(S.game).records;
  if(titreRecords){
    var scores=[];
    HG().forEach(function(g){
      g.n.forEach(function(nom,i){ scores.push({n:nom, s:g.s[i], d:g.d}); });
    });
    scores.sort(function(a,b){ return (b.s-a.s) || (a.d-b.d); });
    var bs=blockOf(t(titreRecords));
    scores.slice(0,5).forEach(function(x){
      var row=el("div","rec");
      row.appendChild(el("p","d", new Date(x.d).toLocaleDateString(DATE_LOCALE[LANG]||"en-GB",{day:"numeric",month:"short"})));
      var mr=el("p","m");
      mr.appendChild(el("b",null,x.n));
      row.appendChild(mr);
      row.appendChild(el("p","sc",String(x.s)));
      bs.appendChild(row);
    });
    body.appendChild(bs);
  }

  /* classement */
  var st=standings();
  var br=blockOf(t("hall.standings"));
  var table=el("table","rank");
  var thead=el("thead"), htr=el("tr");
  htr.appendChild(el("th",null,t("hall.team")));
  htr.appendChild(el("th",null,t("hall.w")));
  htr.appendChild(el("th",null,t("hall.l")));
  htr.appendChild(el("th",null,t("hall.rate")));
  thead.appendChild(htr);
  table.appendChild(thead);
  var tb=el("tbody");
  st.forEach(function(m){
    var tr=el("tr");
    var td=el("td");
    var who=el("div","who");
    var dot=el("span","dot"); dot.style.background=m.hex;
    who.appendChild(dot);
    who.appendChild(el("span",null,m.label));
    var mt=tagEl(tags,m.label);
    if(mt) who.appendChild(mt);
    td.appendChild(who);
    tr.appendChild(td);
    tr.appendChild(el("td",null,String(m.v)));
    tr.appendChild(el("td",null,String(m.d)));
    tr.appendChild(el("td","pct", (m.v+m.d) ? Math.round(m.v/(m.v+m.d)*100)+" %" : "—"));
    tb.appendChild(tr);
  });
  table.appendChild(tb);
  br.appendChild(table);
  if(st.length) body.appendChild(br);

  /* dernières parties */
  var bl=blockOf(t("hall.recent"));
  HG().slice(0,8).forEach(function(g){
    var row=el("div","rec");
    var dt=new Date(g.d);
    row.appendChild(el("p","d", dt.toLocaleDateString(DATE_LOCALE[LANG]||"en-GB",{day:"numeric",month:"short"})));
    var m=el("p","m");
    if(g.w<0){
      /* une égalité : personne n'est nommé vainqueur */
      m.appendChild(el("b",null,t("hall.tie")));
      row.appendChild(m);
      row.appendChild(el("p","sc", String(Math.max.apply(null,g.s))));
    }else if(g.n.length===2){
      var mp=tf("hall.beat",{w:"\u0000",l:"\u0001"}).split(/[\u0000\u0001]/);
      m.appendChild(document.createTextNode(mp[0]||""));
      m.appendChild(el("b",null,g.n[g.w]));
      m.appendChild(document.createTextNode(mp[1]||""));
      m.appendChild(document.createTextNode(g.n[1-g.w]));
      m.appendChild(document.createTextNode(mp[2]||""));
      row.appendChild(m);
      row.appendChild(el("p","sc", g.s[g.w]+"–"+g.s[1-g.w]));
    }else{
      /* à plus de deux, on ne nomme que le vainqueur */
      m.appendChild(el("b",null,g.n[g.w]));
      row.appendChild(m);
      row.appendChild(el("p","sc", String(g.s[g.w])));
    }
    bl.appendChild(row);
  });
  body.appendChild(bl);
}

function refreshHallLink(){
  var n=HG().length, titre=t("hall.aria")+" · "+tn("hall.count",n);
  ["openHall"].concat(liensPalmares()).forEach(function(id){
    var btn=$(id);
    if(!btn) return;
    btn.hidden = !n;
    btn.title = titre;
    btn.setAttribute("aria-label", titre);
  });
}

