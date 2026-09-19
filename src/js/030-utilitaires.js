/* ------------------------------------------------------------------
   Utilitaires
------------------------------------------------------------------ */
function $(id){ return document.getElementById(id); }
function el(tag,cls,txt){
  var n=document.createElement(tag);
  if(cls) n.className=cls;
  if(txt!=null) n.textContent=txt;
  return n;
}
function buzz(ms){ try{ if(navigator.vibrate) navigator.vibrate(ms); }catch(e){} }

/* « X marque 5 points » avec le nom en gras, quel que soit l'ordre des
   mots dans la langue : on découpe la phrase autour du marqueur. */
function outcomeInto(host, name, n){
  host.innerHTML="";
  var parts=tn("game.scores",n).replace(/\{name\}/g,"\u0000").split("\u0000");
  host.appendChild(document.createTextNode(parts[0]||""));
  host.appendChild(el("b",null,name));
  host.appendChild(document.createTextNode(parts[1]||""));
}

function themePicker(){
  var box=el("div","block");
  box.style.paddingTop="18px";
  box.appendChild(el("p","eyebrow",t("about.theme")));
  var seg=el("div","seg seg3");
  [[null,t("about.theme.auto")],["light",t("about.theme.light")],["dark",t("about.theme.dark")]]
    .forEach(function(o){
      var b=el("button",null,o[1]);
      b.type="button";
      if(THEME===o[0]) b.classList.add("on");
      b.addEventListener("click",function(){ setTheme(o[0]); });
      seg.appendChild(b);
    });
  box.appendChild(seg);
  return box;
}

function langPicker(){
  var box=el("div","block");
  box.style.paddingTop="18px";
  box.appendChild(el("p","eyebrow",t("about.lang")));
  /* Quatre choix, dont le retour au suivi du téléphone : sans lui, une
     langue choisie une fois ne se déchoisissait plus. */
  var choisi=null;
  try{ choisi=localStorage.getItem(LANG_KEY); }catch(e){}
  if(choisi!=="fr" && choisi!=="en" && choisi!=="es") choisi=null;

  var seg=el("div","seg seg4");
  [[null,t("about.lang.auto")],["fr","Français"],["en","English"],["es","Español"]].forEach(function(l){
    var b=el("button",null,l[1]);
    b.type="button";
    if(choisi===l[0]) b.classList.add("on");
    b.addEventListener("click",function(){ setLang(l[0]); });
    seg.appendChild(b);
  });
  box.appendChild(seg);
  return box;
}

function defaultName(i){
  return coequipiers(S.mode) ? t(i===0?"team.a":"team.b") : t(i===0?"player.a":"player.b");
}
function teamLabel(i){
  var team=S.teams[i];
  var n=(team.name||"").trim();
  if(n) return n;
  var m=nomsCoequipiers(i);
  if(m.length>1) return m.slice(0,-1).join(", ")+" & "+m[m.length-1];
  if(m.length) return m[0];
  return defaultName(i);
}
function nomsCoequipiers(i){
  var m=S.teams[i].mates||[], out=[];
  for(var k=0;k<coequipiers(S.mode);k++){ var v=(m[k]||"").trim(); if(v) out.push(v); }
  return out;
}
function matesLabel(i){
  var m=nomsCoequipiers(i);
  return m.length>1 ? m.join(" · ") : (m[0]||"");
}

