/* Cornhole.
   Le premier jeu de l'application : les enregistrements d'avant l'arrivée
   des autres, qui ne portent aucun nom de jeu, sont les siens. */
declarerJeu({
  id:"cornhole",
  famille:"duel",
  historique:true,
  cibles:[11,15,21], cible:21,
  regles:fillCornholeRules
});
