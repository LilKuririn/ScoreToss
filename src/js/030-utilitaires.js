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

/* Le clavier se pose par-dessus la page au lieu de la redimensionner : on
   suit le viewport visible pour que la coquille s'arrête juste au-dessus,
   et que le champ en cours de saisie reste à l'écran. */
(function suivreLeClavier(){
  var vv=window.visualViewport;
  if(!vv) return;
  function poser(){
    var h=Math.round(vv.height);
    /* le zoom du navigateur rétrécit aussi le viewport visible : on ne
       touche à rien tant qu'il ne s'agit pas d'une vraie amputation */
    if(h>0 && h < window.innerHeight - 40) document.documentElement.style.setProperty("--vh", h+"px");
    else document.documentElement.style.removeProperty("--vh");
  }
  vv.addEventListener("resize", poser);
  poser();
})();

/* « X marque 5 points » avec le nom en gras, quel que soit l'ordre des
   mots dans la langue : on découpe la phrase autour du marqueur. */
function outcomeInto(host, name, n){
  phraseAvecNom(host, tn("game.scores",n).replace(/\{name\}/g,"\u0000"), name);
}
/* Le nom tombe où la langue le place : la phrase porte un marqueur \u0000
   à sa place, et le nom s'y écrit en gras — à la couleur de son équipe si
   on la donne. */
function phraseAvecNom(host, phrase, nom, hex){
  host.innerHTML="";
  var parts=phrase.split("\u0000");
  host.appendChild(document.createTextNode(parts[0]||""));
  var b=el("b",null,nom);
  if(hex) b.style.color=teamInk(hex);
  host.appendChild(b);
  host.appendChild(document.createTextNode(parts[1]||""));
}

/* un réglage en boutons segmentés : [valeur, libellé]… */
function blocChoix(titre, options, courant, choisir){
  var box=el("div","block"), seg=el("div","seg seg"+options.length);
  box.style.paddingTop="18px";
  box.appendChild(el("p","eyebrow",titre));
  options.forEach(function(o){
    var b=el("button",courant===o[0] ? "on" : null,o[1]);
    b.type="button";
    b.addEventListener("click",function(){ choisir(o[0]); });
    seg.appendChild(b);
  });
  box.appendChild(seg);
  return box;
}
function themePicker(){
  return blocChoix(t("about.theme"),
    [[null,t("about.theme.auto")],["light",t("about.theme.light")],["dark",t("about.theme.dark")]], THEME, setTheme);
}
function langPicker(){
  /* Quatre choix, dont le retour au suivi du téléphone : sans lui, une
     langue choisie une fois ne se déchoisissait plus. */
  var choisi=null;
  try{ choisi=localStorage.getItem(LANG_KEY); }catch(e){}
  if(choisi!=="fr" && choisi!=="en" && choisi!=="es") choisi=null;
  return blocChoix(t("about.lang"),
    [[null,t("about.lang.auto")],["fr","Français"],["en","English"],["es","Español"]], choisi, setLang);
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

