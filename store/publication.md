# Publication sur le Play Store — carnet de bord

Ce fichier rassemble la procédure et l'état d'avancement. Il n'a pas sa place dans le README :
c'est un carnet d'exploitation, pas une présentation de l'application.

## État

**Fait**

- Compte développeur créé, identité vérifiée.
- Clé d'envoi générée, ses quatre secrets déposés dans le dépôt. La CI produit le bundle.
- Application créée sous `com.scoretosslabs.cornscore`, gratuite, catégorie Sport, anglais par défaut.
- Test fermé mené à son terme : douze testeurs, quatorze jours continus.
- Niveau d'API cible relevé à 36, avant l'échéance Play du 31 août 2026.
- Renommage en ScoreToss, nouvelle icône, nouveau visuel de fiche.
- Page de soutien Ko-fi reliée à l'écran *À propos*.
- **Production ouverte** en août 2026 avec le build 31, dernier d'avant le palet, sur 177 pays.
- Politique de confidentialité repointée après le renommage du dépôt en `ScoreToss` : GitHub
  redirige les URL de dépôt mais **pas** GitHub Pages, l'ancienne répondait 404. Corrigée dans les
  deux formulaires de la console, *Politique de confidentialité* et *Sécurité des données*.
- **V2 en production** depuis le 25 août 2026 : le palet breton, le cloisonnement des tournois et
  du palmarès par jeu, le réglage du thème.

**Reste à faire**

1. **Publier la V3** : le mölkky, en individuel comme en équipes, attend sur `main` depuis le
   25 août. Grouper dans le même envoi la release, ses notes — voir
   [`notes-de-version.md`](notes-de-version.md) — et les descriptions réécrites pour trois jeux,
   dans [`fiche-play.md`](fiche-play.md). Les textes publiés ne mentionnent encore que deux jeux.
2. **Les captures d'écran** de la fiche, jamais faites, dont une montrant l'accueil à trois jeux.
3. **Aligner le nom de version.** La CI le fabrique en dur — `-Pvn=1.0.${{ github.run_number }}`
   dans [`../.github/workflows/apk.yml`](../.github/workflows/apk.yml) — alors que l'écran
   *À propos* suit la vraie version. Purement cosmétique : ce nom ne paraît ni dans le magasin ni
   dans l'application. Au même endroit, la Release GitHub s'intitule encore
   « Cornscore — APK ».

## Les identifiants, et ce qui ne change plus

L'identifiant de l'application est `com.scoretosslabs.cornscore`. Il doit correspondre au nom du
package saisi dans la console, et **ne peut plus changer** une fois l'application créée — même après
le renommage en ScoreToss, qui ne touche qu'à ce qui s'affiche.

L'APK d'installation directe porte le suffixe `.direct`. Signé par une autre clé que la version du
magasin, il ne pourrait pas s'installer par-dessus : les deux coexistent, sous les noms
« ScoreToss » et « ScoreToss direct », avec des données séparées.

La politique de confidentialité, exigée par la console, est en ligne :
<https://lilkuririn.github.io/ScoreToss/privacy.html>

## Les pistes de test, et leur priorité

Un appareil inscrit à plusieurs pistes reçoit toujours celle de plus haute priorité :
**interne > fermé > ouvert > production**. Une piste interne restée sur une vieille version masque
donc ce qui est publié en test fermé. Promouvoir le même bundle sur les deux canaux évite cette
confusion.

Le client Play met en cache la liste des versions disponibles. Une release de moins d'une heure ne
remonte pas toujours seule : *Paramètres → Applications → Google Play Store → Stockage → Vider le
cache* règle le cas.

## La clé d'envoi, pour mémoire

`keytool` vient avec un JDK :

```powershell
winget install Microsoft.OpenJDK.21
```

Dans un **nouveau** terminal, hors du dépôt pour ne rien risquer de committer :

```powershell
keytool -genkeypair -v -keystore upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

L'outil demande un mot de passe puis quelques identités — n'importe quelle réponse convient, elles
n'apparaissent nulle part. À la question du mot de passe de la clé, entrée vide = le même que celui
du magasin. Puis, pour obtenir la valeur du secret directement dans le presse-papiers :

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("upload.jks")) | Set-Clipboard
```

Les quatre secrets, dans *Settings → Secrets and variables → Actions* :

| Nom | Valeur |
| --- | --- |
| `RELEASE_KEYSTORE_B64` | le contenu du presse-papiers |
| `RELEASE_STORE_PASSWORD` | le mot de passe choisi |
| `RELEASE_KEY_ALIAS` | `upload` |
| `RELEASE_KEY_PASSWORD` | le même mot de passe |

**Sauvegarde `upload.jks` et son mot de passe ailleurs que sur ta machine.** La CI ne peut pas
générer cette clé à ta place : le dépôt étant public, tout ce qui transite par les journaux ou les
artefacts d'Actions est lisible par n'importe qui.

## Le lien de soutien

Il vit dans `SUPPORT_URL`, en tête du script de [`../index.html`](../index.html). Le vider fait
disparaître la ligne plutôt que d'afficher un lien mort.

**Ne rien offrir en échange d'un don** — une contrepartie numérique en ferait un achat, que Google
impose de passer par sa propre facturation.

## L'échéance annuelle

Le niveau d'API cible exigé monte chaque année, vers le mois d'août. Une application qui ne suit pas
finit par ne plus pouvoir être mise à jour. Compter une petite intervention technique par an.

Au passage à l'API 36, deux comportements ont changé : le retour prédictif, qui n'appelle plus
`onBackPressed()`, et le bord à bord, dont l'exemption cesse d'être honorée. Le prochain palier
demandera la même vigilance.
