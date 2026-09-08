// Paires de mots : [mot citoyen, mot undercover]
export const wordPairs = [
  // Nature & géographie
  ["PLAGE", "PISCINE"],
  ["MER", "LAC"],
  ["FORÊT", "JUNGLE"],
  ["DÉSERT", "SAHARA"],
  ["MONTAGNE", "COLLINE"],
  ["RIVIÈRE", "RUISSEAU"],
  ["ÎLE", "PRESQU'ÎLE"],
  ["VOLCAN", "GEYSER"],

  // Animaux
  ["CHAT", "TIGRE"],
  ["CHIEN", "LOUP"],
  ["LION", "PANTHÈRE"],
  ["SERPENT", "LÉZARD"],
  ["AIGLE", "FAUCON"],
  ["DAUPHIN", "REQUIN"],
  ["CHEVAL", "ZÈBRE"],
  ["GORILLE", "CHIMPANZÉ"],
  ["ÉLÉPHANT", "RHINOCÉROS"],
  ["PERROQUET", "CORBEAU"],
  ["PIROGUE", "BATEAU"],

  // Nourriture & boissons
  ["THÉ", "CAFÉ"],
  ["RIZ", "COUSCOUS"],
  ["PAIN", "BRIOCHE"],
  ["GLACE", "SORBET"],
  ["PIZZA", "TARTE"],
  ["POULET", "DINDE"],
  ["CHOCOLAT", "CARAMEL"],
  ["JUS D'ORANGE", "LIMONADE"],

  // Références sénégalaises
  ["THIÉBOUDIENNE", "YASSA"],
  ["DAKAR", "THIÈS"],
  ["MBOUR", "SALY"],
  ["BISSAP", "BOUYE"],
  ["TAXI", "CAR RAPIDE"],
  ["MARCHÉ", "BOUTIQUE"],
  ["TERANGA", "HOSPITALITÉ"],
  ["WOLOF", "PULAAR"],
  ["BAOBAB", "FROMAGER"],
  ["TABASKI", "KORITÉ"],

  // Transport
  ["BUS", "TRAIN"],
  ["VOITURE", "CAMION"],
  ["MOTO", "VÉLO"],
  ["AVION", "HÉLICOPTÈRE"],
  ["BATEAU", "FERRY"],

  // Sport & loisirs
  ["FOOTBALL", "BASKETBALL"],
  ["TENNIS", "BADMINTON"],
  ["NATATION", "PLONGÉE"],
  ["BOXE", "KARATÉ"],
  ["COURSE", "MARCHE"],
  ["GUITARE", "VIOLON"],
  ["CINÉMA", "THÉÂTRE"],

  // Ville & lieu
  ["ÉCOLE", "UNIVERSITÉ"],
  ["HÔPITAL", "CLINIQUE"],
  ["RESTAURANT", "CUISINE"],
  ["HÔTEL", "AUBERGE"],
  ["ÉGLISE", "MOSQUÉE"],
  ["STADE", "GYMNASE"],
  ["BIBLIOTHÈQUE", "LIBRAIRIE"],
  ["AÉROPORT", "GARE"],
  ["PRISON", "COMMISSARIAT"],
  ["MUSÉE", "GALERIE"],

  // Technologie & quotidien
  ["TÉLÉPHONE", "TABLETTE"],
  ["ORDINATEUR", "TÉLÉVISION"],
  ["RADIO", "PODCAST"],
  ["JOURNAL", "MAGAZINE"],
  ["MONTRE", "RÉVEIL"],
  ["LUNETTES", "LENTILLES"],
  ["COUTEAU", "CISEAUX"],
  ["BROSSE", "PEIGNE"],

  // Émotions & concepts
  ["AMOUR", "AMITIÉ"],
  ["PEUR", "STRESS"],
  ["RIRE", "SOURIRE"],
  ["NUIT", "CRÉPUSCULE"],
  ["SOLEIL", "LUNE"],
  ["MUSIQUE", "DANSE"],
  ["GUERRE", "BATAILLE"],
  ["FÊTE", "CARNAVAL"],
  ["MARIAGE", "FIANÇAILLES"],
  ["VACANCES", "WEEK-END"],
]

// Retourne une paire aléatoire
export function getRandomPair() {
  const index = Math.floor(Math.random() * wordPairs.length)
  return {
    citizenWord: wordPairs[index][0],
    undercoverWord: wordPairs[index][1],
  }
}
