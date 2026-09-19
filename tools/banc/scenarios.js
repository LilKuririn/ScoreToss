/* Scénarios du banc de comparaison.

   Chaque scénario part d'un stockage vide, en français, et joue un parcours
   réel ; `a.point(nom)` photographie l'écran à cet instant. Un jeu ajouté
   doit ajouter son parcours ici : il devient alors impossible de casser
   les autres sans que le banc le voie. */
"use strict";
var SCENARIOS = [];
function scenario(nom, fn, taille){ SCENARIOS.push({nom:nom, fn:fn, taille:taille || [390,844]}); }

/* --- saisie ------------------------------------------------------ */
/* colonne 1 : trou, colonne 2 : planche */
function corn(a, equipe, colonne, n){
  return a.clic("#rows .crow:nth-child("+equipe+") .step:nth-child("+(colonne+1)+") button:last-child", n);
}
function palet(a, equipe, n){
  return a.clic("#rows .crow:nth-child("+equipe+") .step button:last-child", n);
}
async function valider(a){ await a.clic("#validate"); await a.attendre(80); }
async function finDePartie(a){ await a.attendre(900); }
async function touche(a, v){
  if(v===0) return a.clic("#mkMissBtn");
  var k=[].slice.call(a.d.querySelectorAll("#s-mgame .mk-key"))
    .find(function(x){ return !x.closest("#mkSheetWrap") && x.textContent===String(v); });
  if(!k) throw new Error("touche "+v+" introuvable");
  k.click();
  await a.attendre(40);
}
async function lancers(a, liste){ for(var i=0;i<liste.length;i++) await touche(a, liste[i]); }
async function cleEditeur(a, v){
  var k=[].slice.call(a.d.querySelectorAll("#mkSheetBody .mk-key")).find(function(x){ return x.textContent===v; });
  if(!k) throw new Error("touche d'éditeur "+v+" introuvable");
  k.click();
  await a.attendre(40);
}

/* Vise un segment de la cible des fléchettes, aux anneaux élargis de
   l'application : pose, glisse et lève le doigt au centre du segment. */
var FL_BANC_ANNEAUX = {db:.085, bull:.17, tIn:.44, tOut:.60, dIn:.80};
var FL_BANC_ORDRE = [20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];
async function flechette(a, lib, hote){
  if(lib==="R"){ await a.clic(hote==="#flEdCible" ? "#flEdMiss" : "#flMiss"); return; }
  var q=a.q(hote || "#flCible"), svg=q.querySelector("svg"), w=a.d.defaultView;
  var A=FL_BANC_ANNEAUX, r, deg=0;
  if(lib==="50") r=0;
  else if(lib==="25") r=(A.db+A.bull)/2*100;
  else {
    var m = lib[0]==="T" ? 3 : lib[0]==="D" ? 2 : 1;
    var n = +(m===1 ? lib : lib.slice(1));
    deg = FL_BANC_ORDRE.indexOf(n)*18;
    r = (m===3 ? (A.tIn+A.tOut)/2 : m===2 ? (A.dIn+1)/2 : (A.tOut+A.dIn)/2)*100;
  }
  var p=new w.DOMPoint(r*Math.sin(deg*Math.PI/180), -r*Math.cos(deg*Math.PI/180)).matrixTransform(svg.getScreenCTM());
  ["pointerdown","pointermove","pointerup"].forEach(function(type){
    q.dispatchEvent(new w.PointerEvent(type, {bubbles:true, clientX:p.x, clientY:p.y, pointerId:1, isPrimary:true}));
  });
  await a.attendre(40);
}
async function volee(a, libs){ for(var i=0;i<libs.length;i++) await flechette(a, libs[i]); }

/* --- parcours ---------------------------------------------------- */
scenario("accueil-et-preparation", async function(a){
  a.point("accueil");
  await a.clic("#playCornhole");                               a.point("cornhole simple");
  await a.clic('#mode button[data-mode="double"]');            a.point("cornhole double");
  await a.clic('#target .chip[data-target="11"]');             a.point("cible 11");
  await a.clic("#cards .card:nth-child(2) .swatches .sw");     a.point("couleurs échangées");
  await a.clic("#openRules");                                  a.point("règles du cornhole");
  await a.clic("#rulesClose");
  await a.clic("#backToGames");
  await a.clic("#playPalet");                                  a.point("palet");
  await a.clic('#palets .chip[data-palets="3"]');              a.point("3 palets par joueur");
  await a.clic('#mode button[data-mode="simple"]');            a.point("palet en simple");
  await a.clic('#target .chip[data-target="15"]');             a.point("la belle");
  await a.clic("#openRules");                                  a.point("règles du palet");
  await a.clic("#rulesClose");
  await a.clic("#backToGames");
  await a.clic("#playCornhole");                               a.point("retour au cornhole, cible gardée");
});

scenario("cornhole-partie", async function(a){
  await a.clic("#playCornhole");
  await a.clic('#target .chip[data-target="11"]');
  await a.clic("#start");                                      a.point("partie neuve");
  await a.clic("#s-game .toss"); await a.attendre(100);        a.point("tirage");
  await a.clic("#tossWrap");                                   a.point("tirage refermé");
  await corn(a,1,1,3);                                         a.point("saisie : 3 trous");
  await valider(a);                                            a.point("manche 1");
  await corn(a,1,1,1); await corn(a,2,1,1);                    a.point("saisie : annulation");
  await valider(a);                                            a.point("manche nulle");
  await corn(a,1,1,4); await corn(a,1,2,1);                    a.point("plafond de 4 sacs");
  await a.clic("#rows .crow:nth-child(1) .step:nth-child(2) button:first-child", 4);
  await corn(a,1,1,2); await corn(a,2,1,1); await corn(a,2,2,1);
  await valider(a);                                            a.point("manche 3 : 6 contre 4");
  await a.clic("#openSheet");                                  a.point("feuille de match");
  await a.clicN("#sheetBody tbody tr", 0);                     a.point("éditeur");
  await a.clicN("#sheetBody .step", 0, "button:first-child");  a.point("éditeur modifié");
  await a.clic("#edSave"); await a.attendre(80);               a.point("correction enregistrée");
  await a.clicN("#sheetBody tbody tr", 1);
  await a.clic("#edDel"); await a.attendre(80);                a.point("manche supprimée");
  await a.clic("#undo"); await a.attendre(80);                 a.point("dernière manche annulée");
  await a.clic("#quit");                                       a.point("quitter armé");
  await a.clic("#closeSheet");
  for(var k=0;k<5 && !(a.etat().g||{}).over;k++){ await corn(a,1,1,4); await valider(a); }
  await finDePartie(a);                                        a.point("fin de partie");
  await a.clic("#over .cta:not(.ghost)"); await a.attendre(80); a.point("revanche");
});

scenario("palet-partie", async function(a){
  await a.clic("#playPalet");                                  a.point("préparation");
  await a.clic("#start");                                      a.point("partie neuve");
  await a.clic("#s-game .toss"); await a.attendre(100);        a.point("tirage");
  await a.clic("#tossWrap"); await a.attendre(50);             a.point("maître après tirage");
  await a.clic("#mtrMiss");                                    a.point("maître manqué");
  await palet(a,1,3);                                          a.point("saisie : 3 palets");
  await palet(a,2,1);                                          a.point("l'adversaire remet à zéro");
  await valider(a);                                            a.point("manche 1");
  await valider(a);                                            a.point("manche nulle");
  await palet(a,1,5);                                          a.point("plafond");
  await valider(a);
  await a.clic("#openSheet");                                  a.point("feuille");
  await a.clicN("#sheetBody tbody tr", 0);                     a.point("éditeur");
  await a.clicN("#sheetBody .step", 0, "button:last-child");   a.point("éditeur : l'autre équipe");
  await a.clic("#edSave"); await a.attendre(80);               a.point("correction");
  await a.clic("#closeSheet");
  for(var k=0;k<6 && !(a.etat().g||{}).over;k++){ await palet(a,1,4); await valider(a); }
  await finDePartie(a);                                        a.point("fin de partie");
});

scenario("molkky-individuel", async function(a){
  await a.clic("#playMolkky");                                 a.point("préparation");
  await a.clic("#mkMinus");                                    a.point("3 joueurs");
  await a.clicN("#s-msetup .pick", 0);                         a.point("joueur 1 ouvert");
  await a.clic("#mkOpenLayout");                               a.point("placement des quilles");
  await a.clic("#mkLayoutClose");
  await a.clic("#mkStart");                                    a.point("partie neuve");
  await lancers(a,[12,0,5, 12,0,5, 12,0,5]);                   a.point("joueur 2 éliminé");
  await lancers(a,[12,5]);                                     a.point("48, reste 2");
  await lancers(a,[5]);                                        a.point("dépassement : retour à 25");
  await lancers(a,[5]);
  await a.clic("#mkSheetBtn");                                 a.point("feuille");
  await a.clicN("#mkSheetBody tbody tr", 0);                   a.point("éditeur");
  await cleEditeur(a,"2");
  await a.clic("#mkEdSave"); await a.attendre(80);             a.point("correction rejouée");
  if(!a.d.getElementById("mkSheetWrap").classList.contains("on")) await a.clic("#mkSheetBtn");
  await a.clicN("#mkSheetBody tbody tr", 0);
  await cleEditeur(a,"12");
  await a.clic("#mkEdSave"); await a.attendre(80);
  await a.clic("#mkSheetClose");
  await lancers(a,[12,0,12,0]);                                a.point("49, reste 1");
  await lancers(a,[1]); await finDePartie(a);                  a.point("victoire à 50");
});

scenario("molkky-equipes", async function(a){
  await a.clic("#playMolkky");
  await a.clic('#mkMode button[data-mode="team"]');            a.point("équipes");
  await a.clic("#mkPerPlus");                                  a.point("3 joueurs par équipe");
  await a.clic("#mkMinus", 2);                                 a.point("2 équipes");
  await a.clic("#mkStart");                                    a.point("partie neuve");
  await lancers(a,[3,4,6,2]);                                  a.point("rotation des membres");
  await a.clic("#mkLayoutBtn");                                a.point("placement en partie");
  await a.clic("#mkLayoutClose");
  await a.clic("#mkSheetBtn");                                 a.point("feuille en équipes");
});

scenario("tournoi-cornhole", async function(a){
  await a.clic("#playCornhole");
  await a.clic("#openTour");                                   a.point("préparation");
  await a.clic("#tcMinus");                                    a.point("3 équipes");
  await a.clic('#ttarget .chip[data-target="11"]');
  await a.clic("#tstart");                                     a.point("tableau");
  await a.clic("#bkMenu");                                     a.point("options du tournoi");
  await a.clic("#bkSheetClose");
  await a.clic("#bkHome");                                     a.point("préparation, pastille allumée");
  await a.clic("#backToGames"); await a.clic("#playPalet");    a.point("palet, pastille éteinte");
  await a.clic("#backToGames"); await a.clic("#playCornhole");
  await a.clic("#openTour");                                   a.point("retour au tableau");
  for(var m=1;m<=3 && !a.d.querySelector("#s-bracket .bk-champ");m++){
    await a.clic("#s-bracket .bk-play");                       a.point("match "+m);
    await corn(a,1,1,4); await valider(a); await finDePartie(a); a.point("fin du match "+m);
    await a.clic(a.d.querySelector("#over .cta.ghost") ? "#over .cta.ghost" : "#over .cta");
    await a.attendre(80);
  }
  a.point("champion");
  await a.clic("#bkHome");                                     a.point("préparation, tournoi fini");
  await a.clic("#openHall");                                   a.point("palmarès");
});

scenario("tournoi-palet", async function(a){
  await a.clic("#playPalet");
  await a.clic('#palets .chip[data-palets="2"]');
  await a.clic("#openTour");
  await a.clic("#tcMinus", 2);                                 a.point("préparation");
  await a.clic("#tstart");                                     a.point("tableau");
  await a.clic("#s-bracket .bk-play");                         a.point("finale");
  await palet(a,1,3);                                          a.point("plafond hérité du réglage");
});

scenario("reglages-et-langues", async function(a){
  await a.clic("#playCornhole");
  await a.clic("#openAbout");                                  a.point("à propos");
  await a.clicTexte("#aboutWrap button","Sombre");             a.point("thème sombre");
  await a.clicTexte("#aboutWrap button","Clair");              a.point("thème clair");
  await a.clicTexte("#aboutWrap button","English");            a.point("anglais");
  await a.clic("#aboutClose");                                 a.point("préparation en anglais");
  await a.clic("#start");                                      a.point("partie en anglais");
  await a.clic("#quit", 2);                                    a.point("partie quittée");
  await a.clic("#backToGames");                                a.point("accueil en anglais");
  await a.clic("#playPalet"); await a.clic("#openRules");      a.point("règles du palet en anglais");
  await a.clic("#rulesClose");
  await a.clic("#backToGames"); await a.clic("#playMolkky");   a.point("mölkky en anglais");
  await a.clic("#mkOpenRules");                                a.point("règles du mölkky en anglais");
  await a.clic("#rulesClose");
  await a.clic("#mkOpenAbout");
  await a.clicTexte("#aboutWrap button","Español");            a.point("espagnol");
  await a.clic("#aboutClose");
  await a.clic("#mkToGames");                                  a.point("accueil en espagnol");
});

scenario("reprise-et-import", async function(a){
  await a.clic("#playCornhole"); await a.clic("#start");
  await corn(a,1,1,2); await valider(a); await corn(a,2,2,1);
  await a.recharger();                                         a.point("cornhole repris");
  await a.clic("#quit", 2);
  await a.clic("#backToGames"); await a.clic("#playMolkky"); await a.clic("#mkStart");
  await lancers(a,[7,0,3]);
  await a.recharger();                                         a.point("mölkky repris");
  await a.importer({v:1, at:0, g:null,
    s:{game:"cornhole", mode:"simple", target:21,
       teams:[{name:"A",mates:["",""],color:"rouge"},{name:"B",mates:["",""],color:"bleu"}]}});
                                                               a.point("sauvegarde ancienne restaurée");
  await a.clic("#backToGames"); await a.clic("#playMolkky");
  await a.clic('#mkMode button[data-mode="team"]');            a.point("mölkky en équipes après import");
});

scenario("palmares-trois-jeux", async function(a){
  await a.clic("#playCornhole"); await a.clic('#target .chip[data-target="11"]'); await a.clic("#start");
  await corn(a,1,1,4); await valider(a); await finDePartie(a);  a.point("fin cornhole en une manche");
  await a.clic("#over .cta.ghost");
  await a.clic("#openHall");                                   a.point("palmarès cornhole");
  await a.clic("#hallBack"); await a.clic("#backToGames"); await a.clic("#playPalet");
  await a.clic("#start");
  for(var k=0;k<4 && !(a.etat().g||{}).over;k++){ await palet(a,2,4); await valider(a); }
  await finDePartie(a);                                        a.point("fin palet");
  await a.clic("#over .cta.ghost");
  await a.clic("#openHall");                                   a.point("palmarès palet");
  await a.clic("#hallBack"); await a.clic("#backToGames"); await a.clic("#playMolkky");
  await a.clic("#mkMinus", 2); await a.clic("#mkStart");
  await lancers(a,[12,0,12,0,12,0]); await finDePartie(a);    a.point("fin mölkky par élimination");
  await a.clic("#over .cta.ghost");
  await a.clic("#mkHall");                                     a.point("palmarès mölkky");
});

scenario("petit-ecran", async function(a){
  a.point("accueil");
  await a.clic("#playCornhole");
  await a.clic('#mode button[data-mode="double"]');            a.point("préparation en double");
  await a.clic("#start");                                      a.point("partie en double");
  await a.clic("#quit", 2);
  await a.clic("#backToGames"); await a.clic("#playMolkky");
  await a.clic("#mkPlus", 4);                                  a.point("mölkky à 8");
  await a.clic("#mkStart");                                    a.point("partie à 8");
}, [360,640]);

scenario("categories", async function(a){
  a.point("accueil");
  await a.clic('#categories [data-categorie="societe"]');      a.point("liste de la société");
  await a.clic("#catBack");
  await a.clic('#categories [data-categorie="exterieur"]');    a.point("liste de l'extérieur");
  await a.clic("#playPalet");
  await a.clic("#backToGames");                                a.point("changer de jeu depuis le palet");
  await a.clic("#playMolkky");
  await a.clic("#mkToGames");                                  a.point("changer de jeu depuis le mölkky");
  await a.clic("#catBack");                                    a.point("retour aux catégories");
});

/* Le nom de la dernière fléchette reste affiché 900 ms : chaque point est
   pris soit juste après un lancer, soit une fois ce délai écoulé. */
scenario("flechettes-partie", async function(a){
  await a.clic('#categories [data-categorie="interieur"]');    a.point("liste de l'intérieur");
  await a.clic("#playFlechettes");                             a.point("préparation");
  await a.clic('#flDepart button[data-depart="301"]');          a.point("301");
  await a.clic("#flOpenRules");                                a.point("règles");
  await a.clic("#rulesClose");
  await a.clic("#flStart");                                    a.point("partie neuve");
  await flechette(a,"T20");                                    a.point("une T20");
  await volee(a,["T20","T20"]);                                a.point("180, main au joueur 2");
  await volee(a,["20","5","R"]);
  await volee(a,["T20","T20"]);                                a.point("bust : reste à 1");
  await volee(a,["R","R","R"]);
  await flechette(a,"T19");
  await a.clic("#flCancel");                                   a.point("fléchette annulée");
  await a.clic("#flSheetBtn");                                 a.point("feuille de match");
  await a.clicN("#flSheetBody .fl-dart", 0);                   a.point("éditeur");
  await flechette(a,"D20","#flEdCible");                       a.point("éditeur : D20 visé");
  await a.clic("#flEdSave"); await a.attendre(80);             a.point("correction rejouée");
  await a.clic("#flSheetClose");
  await a.attendre(1000);                                      a.point("partie après correction");
  await volee(a,["R","1","D10"]); await finDePartie(a);        a.point("victoire sur D10");
  await a.clic("#over .cta.ghost");
  await a.clic("#flHall");                                     a.point("palmarès des fléchettes");
});

scenario("flechettes-equipes", async function(a){
  await a.clic('#categories [data-categorie="interieur"]');
  await a.clic("#playFlechettes");
  await a.clic('#flMode button[data-mode="team"]');            a.point("équipes");
  await a.clic("#flStart");                                    a.point("partie en équipes");
  await volee(a,["T20","T20","T20"]);
  await volee(a,["T19","T19","T19"]);
  await volee(a,["25","50","R"]);                              a.point("rotation des membres");
}, [360,640]);

scenario("flechettes-huit", async function(a){
  await a.clic('#categories [data-categorie="interieur"]');
  await a.clic("#playFlechettes");
  await a.clic("#flPlus", 6);                                  a.point("8 joueurs");
  await a.clic("#flStart");                                    a.point("partie à 8 sur petit écran");
}, [360,640]);

/* Au doigt, la visée est décalée en haut à gauche du contact et une
   fléchette relie les deux. Le doigt se pose donc en bas à droite du
   segment voulu, ici la T20. */
scenario("flechettes-doigt", async function(a){
  await a.clic('#categories [data-categorie="interieur"]');
  await a.clic("#playFlechettes");
  await a.clic("#flStart");
  var q=a.q("#flCible"), svg=q.querySelector("svg"), w=a.d.defaultView, A=FL_BANC_ANNEAUX;
  var r=(A.tIn+A.tOut)/2*100, vise=new w.DOMPoint(0,-r).matrixTransform(svg.getScreenCTM());
  var o={bubbles:true, clientX:vise.x+37, clientY:vise.y+52, pointerId:2, isPrimary:true, pointerType:"touch"};
  q.dispatchEvent(new w.PointerEvent("pointerdown", o));
  q.dispatchEvent(new w.PointerEvent("pointermove", o));
  await a.attendre(40);                                        a.point("visée au doigt, fléchette affichée");
  q.dispatchEvent(new w.PointerEvent("pointerup", o));
  await a.attendre(40);                                        a.point("T20 comptée, fléchette plantée");
}, [360,640]);

/* --- yams : on saisit les cinq dés du lancer, puis on choisit la case --- */
async function yamsDes(a, des){
  for(var i=0;i<des.length;i++){ a.q("#yaPave").children[des[i]-1].click(); await a.attendre(15); }
}
async function yamsCase(a, nom){
  var b=[].slice.call(a.d.querySelectorAll("#yaFiche .ya-case")).find(function(x){ return x.querySelector(".lab").textContent===nom; });
  if(!b) throw new Error("case "+nom+" introuvable");
  b.click();
  await a.attendre(15);
}
async function yamsTour(a, des, nom){ await yamsDes(a, des); await yamsCase(a, nom); await a.clic("#yaValider"); }
/* treize tours qui remplissent le haut à 63 pile : bonus, et 326 points */
var YAMS_FICHE = [
  [[1,1,1,2,3],"As"], [[2,2,2,1,3],"Deux"], [[3,3,3,1,2],"Trois"], [[4,4,4,1,2],"Quatre"],
  [[5,5,5,1,2],"Cinq"], [[6,6,6,1,2],"Six"], [[6,6,6,5,5],"Brelan"], [[6,6,6,6,5],"Carré"],
  [[2,2,3,3,3],"Full"], [[1,2,3,4,6],"Petite suite"], [[2,3,4,5,6],"Grande suite"],
  [[4,4,4,4,4],"Yams"], [[6,6,5,5,4],"Chance"]
];

scenario("yams-partie", async function(a){
  await a.clic('#categories [data-categorie="societe"]');      a.point("liste de la société");
  await a.clic("#playYams");                                   a.point("préparation");
  await a.clic("#yaOpenRules");                                a.point("règles du yams");
  await a.clic("#rulesClose");
  await a.clic("#yaStart");                                    a.point("partie neuve");
  await yamsDes(a,[3,5,3]);                                    a.point("trois dés saisis");
  await yamsDes(a,[5,3]);                                      a.point("points possibles");
  await yamsCase(a,"Full");                                    a.point("full choisi");
  await a.clic("#yaValider");                                  a.point("au joueur 2");
  await yamsDes(a,[2,6,2,6,4]); await yamsCase(a,"Yams");      a.point("case barrée proposée");
  await a.clic("#yaValider");
  await a.clic("#yaSheetBtn");                                 a.point("feuille de match");
  await a.clic("#yaUndo");                                     a.point("dernier tour annulé, dés rendus");
  await yamsCase(a,"Chance"); await a.clic("#yaValider");
  await a.clic("#yaSheetBtn");
  await a.clicN("#yaSheetBody .ya-cell", 0);                   a.point("éditeur");
  await a.clicN("#yaSheetBody .ya-des .ya-slot.plein", 4);
  await a.clicN("#yaSheetBody .ya-pave .ya-touche", 2);
  var carre=[].slice.call(a.d.querySelectorAll("#yaSheetBody .ya-chip")).find(function(x){ return x.textContent.indexOf("Carré")===0; });
  carre.click(); await a.attendre(20);                         a.point("correction préparée");
  await a.clic("#yaEdSave"); await a.attendre(80);             a.point("correction rejouée");
  await a.clic("#yaQuit", 2);                                  a.point("partie arrêtée");
  await a.clic("#yaStart");
  for(var k=0;k<13;k++){
    await yamsTour(a, YAMS_FICHE[k][0], YAMS_FICHE[k][1]);
    await yamsTour(a, YAMS_FICHE[k][0], YAMS_FICHE[k][1]);
    if(k===5) a.point("bonus atteint");
  }
  await finDePartie(a);                                        a.point("égalité à 326");
  await a.clic("#over .cta.ghost");
  await a.clic("#yaHall");                                     a.point("palmarès : égalité et meilleurs scores");
});

scenario("yams-seul", async function(a){
  await a.clic('#categories [data-categorie="societe"]');
  await a.clic("#playYams");
  await a.clic("#yaMinus");                                    a.point("un seul joueur");
  await a.clic("#yaStart");                                    a.point("partie seule sur petit écran");
  for(var k=0;k<6;k++) await yamsTour(a, YAMS_FICHE[k][0], YAMS_FICHE[k][1]);
  await yamsDes(a,[6,6,6]);
  await a.recharger();                                         a.point("reprise en plein tour");
  await yamsDes(a,[5,5]); await yamsCase(a,"Brelan"); await a.clic("#yaValider");
  for(k=7;k<13;k++) await yamsTour(a, YAMS_FICHE[k][0], YAMS_FICHE[k][1]);
  await finDePartie(a);                                        a.point("fin de partie seule");
  await a.clic("#over .cta.ghost");
  await a.clic("#yaHall");                                     a.point("palmarès d'un joueur seul");
}, [360,640]);

scenario("yams-tirage", async function(a){
  await a.clic('#categories [data-categorie="societe"]');
  await a.clic("#playYams");
  await a.clic("#yaPlus", 6);
  await a.clic("#yaStart");                                    a.point("tirage proposé");
  await a.clic("#yaTirer"); await a.attendre(60);              a.point("ordre tiré");
  await a.clic("#ordreOk");                                 a.point("partie dans l'ordre tiré");
}, [360,640]);

scenario("flechettes-tirage", async function(a){
  await a.clic('#categories [data-categorie="interieur"]');
  await a.clic("#playFlechettes");
  await a.clic('#flMode button[data-mode="team"]');
  await a.clic("#flPlus", 2);
  await a.clic("#flStart");                                    a.point("tirage proposé en équipes");
  await a.clic("#flTirer"); await a.attendre(60);              a.point("ordre des équipes tiré");
  await a.clic("#ordreOk");                                    a.point("partie dans l'ordre tiré");
}, [360,640]);

scenario("molkky-tirage", async function(a){
  await a.clic("#playMolkky");
  await a.clic("#mkStart");                                    a.point("tirage proposé");
  await a.clic("#mkTirer"); await a.attendre(60);              a.point("ordre tiré");
  await a.clic("#ordreOk");                                    a.point("partie dans l'ordre tiré");
  await lancers(a,[6]);                                        a.point("le premier tiré a lancé");
}, [360,640]);

/* --- bibock : points des proches et du Maître, puis Bocks récupérés --- */
function bibockPoint(a, equipe, colonne, n){
  return a.clic("#biPoints .crow:nth-child("+equipe+") .step:nth-child("+(colonne+1)+") button:last-child", n);
}
function bibockBocks(a, equipe, plus, n){
  return a.clic("#biRec .bi-rec-col:nth-child("+equipe+") .step button:"+(plus ? "last-child" : "first-child"), n);
}

scenario("bibock-partie", async function(a){
  await a.clic('#categories [data-categorie="exterieur"]');
  await a.clic("#playBibock");                                 a.point("préparation");
  await a.clic("#biPerPlus");                                  a.point("2 contre 2");
  await a.clic('#biCible .chip[data-cible="9"]');              a.point("express en 9");
  await a.clic("#biOpenRules");                                a.point("règles du bibock");
  await a.clic("#rulesClose");
  await a.clic("#biStart");                                    a.point("partie neuve, tirage proposé");
  await a.clic("#biTirer"); await a.attendre(60);              a.point("qui commence, tiré au sort");
  await a.clic("#ordreOk");
  await bibockPoint(a,1,1,2); await bibockPoint(a,1,2,1);      a.point("7 points pour A");
  await bibockPoint(a,2,1,1);                                  a.point("B marque, A remis à zéro");
  await bibockBocks(a,2,false,1); await bibockBocks(a,1,true,1); a.point("Bocks récupérés 5–3");
  await a.clic("#biValider"); await a.attendre(80);            a.point("manche 1");
  await a.clic("#biSheetBtn");                                 a.point("feuille de match");
  await a.clicN("#biSheetBody tbody tr", 0);                   a.point("éditeur");
  await a.clic("#biSheetBody .bi-rows .crow:nth-child(2) .step:nth-child(2) button:last-child", 2);
  a.point("éditeur modifié");
  await a.clic("#biEdSave"); await a.attendre(80);             a.point("correction rejouée");
  await a.clic("#biUndo"); await a.attendre(80);               a.point("dernière manche annulée");
  await a.clic("#biValider"); await a.attendre(80);
  await bibockPoint(a,1,2,2); await a.clic("#biValider");
  await finDePartie(a);                                        a.point("victoire en express");
  await a.clic("#over .cta.ghost");
  await a.clic("#biHall");                                     a.point("palmarès du bibock");
});

scenario("bibock-elimination", async function(a){
  await a.clic('#categories [data-categorie="exterieur"]');
  await a.clic("#playBibock");
  await a.clic("#biStart");                                    a.point("partie en 1 contre 1");
  await bibockBocks(a,2,false,4); await bibockBocks(a,1,true,4); a.point("B n'a plus de Bock");
  await a.clic("#biValider"); await finDePartie(a);            a.point("victoire par élimination");
}, [360,640]);
