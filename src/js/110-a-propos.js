/* ------------------------------------------------------------------
   À propos
------------------------------------------------------------------ */
var APP_VERSION = "7.1";

/* Page de soutien. La vider fait disparaître la ligne dans À propos —
   mieux vaut rien qu'un lien mort.
   Ne rien offrir en échange d'un don : une contrepartie transformerait
   le don en achat, que Google impose de passer par sa facturation. */
var SUPPORT_URL = "https://ko-fi.com/scoretosslabs";

var SOURCE_URL  = "https://github.com/LilKuririn/ScoreToss";
var PRIVACY_URL = "https://lilkuririn.github.io/ScoreToss/privacy.html";

function aboutRow(eyebrow, label, href){
  var a=document.createElement("a");
  a.className="hall-link";
  a.href=href;
  a.target="_blank";
  a.rel="noopener noreferrer";
  var box=document.createElement("span");
  box.appendChild(el("span","eyebrow",eyebrow));
  box.appendChild(el("b",null,label));
  a.appendChild(box);

  var svg=document.createElementNS(SVGNS,"svg");
  svg.setAttribute("width","16"); svg.setAttribute("height","16");
  svg.setAttribute("viewBox","0 0 16 16"); svg.setAttribute("fill","none");
  svg.setAttribute("aria-hidden","true");
  var p=document.createElementNS(SVGNS,"path");
  p.setAttribute("d","M4 12L12 4M6 4h6v6");
  p.setAttribute("stroke","currentColor");
  p.setAttribute("stroke-width","1.6");
  p.setAttribute("stroke-linecap","round");
  p.setAttribute("stroke-linejoin","round");
  svg.appendChild(p);
  a.appendChild(svg);
  return a;
}

function fillAbout(){
  var body=$("aboutBody");
  body.innerHTML="";

  var id=el("div","about-id");
  var nom=el("h4",null,"ScoreToss");
  nom.appendChild(el("span","about-tag",t("app.tagline")));
  id.appendChild(nom);
  id.appendChild(el("p",null,t("about.what")));
  id.appendChild(el("p",null,t("about.what2")));
  id.appendChild(el("p","about-ver",tf("about.version",{v:APP_VERSION})));
  body.appendChild(id);

  var links=el("div","about-links");
  if(SUPPORT_URL){
    links.appendChild(aboutRow(t("about.support"),t("about.support.label"),SUPPORT_URL));
  }
  links.appendChild(aboutRow(t("about.privacy"),t("about.privacy.label"),PRIVACY_URL));
  links.appendChild(aboutRow(t("about.source"),t("about.source.label"),SOURCE_URL));
  body.appendChild(links);

  var data=el("div","block");
  data.style.paddingTop="18px";
  data.appendChild(el("p","eyebrow",t("data.title")));
  var ex=el("button","act",t("data.export"));
  ex.type="button";
  ex.addEventListener("click",exportData);
  var im=el("button","act",t("data.import"));
  im.type="button";
  im.addEventListener("click",importData);
  data.appendChild(ex);
  data.appendChild(im);
  data.appendChild(el("p","hint",t("data.hint")));
  body.appendChild(data);

  /* Le palmarès de chaque jeu s'efface depuis le jeu ; d'ici, on efface
     les huit d'un coup. Le carnet de joueurs, lui, reste. */
  var net=el("div","block");
  net.style.paddingTop="18px";
  net.appendChild(el("p","eyebrow",t("data.wipe.title")));
  var tout=el("button","act danger",t("data.wipe"));
  tout.type="button";
  tout.addEventListener("click",function(){
    if(tout.dataset.armed!=="1"){
      tout.dataset.armed="1";
      tout.textContent=t("data.wipe.confirm");
      setTimeout(function(){
        if(tout.dataset.armed!=="1") return;
        tout.dataset.armed="0";
        tout.textContent=t("data.wipe");
      },4000);
      return;
    }
    tout.dataset.armed="0";
    tout.textContent=t("data.wipe");
    H=[];
    save();
    refreshHallLink();
    toast(t("data.wipe.done"));
  });
  net.appendChild(tout);
  net.appendChild(el("p","hint",t("data.wipe.hint")));
  body.appendChild(net);

  body.appendChild(themePicker());
  body.appendChild(langPicker());
  body.appendChild(el("p","about-foot",t("about.foot")));
}

