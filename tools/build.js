#!/usr/bin/env node
/* Assemble index.html à partir de src/.

   L'application est livrée en un seul fichier : c'est ce que servent
   GitHub Pages, le cache hors ligne des iPhone et la coquille Android, sans
   liste de fichiers à tenir à jour nulle part. Mais on ne l'écrit plus d'un
   bloc — src/ la découpe en morceaux, que ce script remet bout à bout.

   src/page.html   le squelette, avec trois repères chacun sur sa ligne :
                   @@css@@, @@html@@ et @@js@@
   src/css/        les feuilles de style
   src/html/       les écrans et les fiches
   src/js/         le script, exécuté dans une seule fonction englobante

   Dans chaque dossier, les fichiers sont pris dans l'ordre de leur préfixe
   (010-, 020-…). L'ordre compte : en CSS la règle la plus tardive l'emporte,
   en JS les écouteurs sont posés dans l'ordre de lecture. Les dizaines
   laissent la place d'insérer un fichier sans rien renommer.

     node tools/build.js           écrit index.html
     node tools/build.js --check   échoue si index.html ne correspond pas à src/

   Aucune dépendance : Node suffit. */
"use strict";
const fs = require("fs");
const path = require("path");

const RACINE = path.resolve(__dirname, "..");
const SRC = path.join(RACINE, "src");
const SORTIE = path.join(RACINE, "index.html");
const PARTIES = { css: ".css", html: ".html", js: ".js" };
const NOM = /^\d{3}-[a-z0-9-]+\.[a-z]+$/;

/* Les fins de ligne Windows ne doivent pas faire diverger la sortie. */
function lire(fichier) {
  return fs.readFileSync(fichier, "utf8").replace(/\r\n/g, "\n");
}

function morceaux(dossier, extension) {
  const chemin = path.join(SRC, dossier);
  const textes = [];
  for (const nom of fs.readdirSync(chemin).sort()) {
    if (nom.startsWith(".")) continue;
    /* Un fichier mal nommé serait rangé n'importe où, ou ignoré :
       mieux vaut refuser d'assembler. */
    if (!NOM.test(nom) || path.extname(nom) !== extension) {
      throw new Error(`src/${dossier}/${nom} : nom inattendu, il faut NNN-nom${extension}`);
    }
    const texte = lire(path.join(chemin, nom));
    if (!texte.endsWith("\n")) {
      throw new Error(`src/${dossier}/${nom} : doit se terminer par un saut de ligne`);
    }
    textes.push(texte);
  }
  if (!textes.length) throw new Error(`src/${dossier}/ est vide`);
  return textes.join("");
}

function assembler() {
  let page = lire(path.join(SRC, "page.html"));
  for (const [dossier, extension] of Object.entries(PARTIES)) {
    const repere = `@@${dossier}@@\n`;
    const n = page.split(repere).length - 1;
    if (n !== 1) {
      throw new Error(`src/page.html : le repère @@${dossier}@@ doit figurer une fois, seul sur sa ligne (trouvé ${n})`);
    }
    const contenu = morceaux(dossier, extension);
    /* Une fonction plutôt qu'une chaîne : sinon un `$&` ou un `$1` présent
       dans le code serait interprété comme motif de remplacement. */
    page = page.replace(repere, () => contenu);
  }
  return page;
}

let page;
try {
  page = assembler();
} catch (e) {
  console.error("Assemblage impossible — " + e.message);
  process.exit(1);
}

if (process.argv.includes("--check")) {
  const actuel = fs.existsSync(SORTIE) ? lire(SORTIE) : "";
  if (actuel !== page) {
    console.error("index.html ne correspond pas à src/ : lancer `node tools/build.js`, puis committer les deux.");
    process.exit(1);
  }
  console.log("index.html correspond à src/.");
} else {
  fs.writeFileSync(SORTIE, page);
  console.log(`index.html assemblé : ${page.split("\n").length - 1} lignes, ${Buffer.byteLength(page)} octets.`);
}
