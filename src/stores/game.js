import { defineStore } from 'pinia'
import { getRandomPair } from '../data/wordPairs.js'

const STORAGE_KEY = 'thieupel_game'

function normalizeString(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('LocalStorage save failed', e)
  }
}

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (e) {
    return null
  }
}

export const useGameStore = defineStore('game', {
  state: () => ({
    // Configuration
    playerNames: [],
    totalRounds: 5,
    numUndercover: 1,
    numMrWhite: 0,

    // État courant
    phase: 'home', // home | setup | roleConfig | roleReveal | clue | vote | voteResults | reveal | whiteGuess | roundResult | final
    round: 1,

    // Joueurs
    players: [], // { id, name, role, word, score, alive, stats }

    // Mots de la manche
    citizenWord: '',
    undercoverWord: '',

    // Distribution secrète
    revealIndex: 0, // index du joueur en train de voir son rôle
    revealOrder: [], // ordre aléatoire de joueurs pour la révélation

    // Phase indices
    clueOrder: [], // ordre aléatoire pour les indices
    clueIndex: 0,

    // Vote
    votes: {}, // { voterId: { targetId, guessedRole } }
    votingIndex: 0, // index du joueur en train de voter (dans voteOrder)
    voteOrder: [], // ordre des votants

    // Résultat du vote
    eliminatedPlayerId: null,
    tiePlayerIds: [], // joueurs en égalité
    isTieBreaker: false,

    // MrWhite guess
    whiteGuessPlayerId: null,
    whiteGuessSuccess: null,

    // Historique des manches pour les stats
    roundHistory: [],

    // Scores cumulés (clé = player id)
    scores: {},

    // Statistiques individuelles
    stats: {}, // { playerId: { correctVotes, correctRoleGuesses, surviveAsUndercover, surviveAsMrWhite } }
  }),

  getters: {
    alivePlayers: (state) => state.players.filter(p => p.alive),
    eliminatedPlayers: (state) => state.players.filter(p => !p.alive),
    aliveUndercovers: (state) => state.players.filter(p => p.alive && p.role === 'undercover'),
    aliveMrWhites: (state) => state.players.filter(p => p.alive && p.role === 'mrwhite'),
    aliveCitizens: (state) => state.players.filter(p => p.alive && p.role === 'citizen'),
    currentRevealPlayer: (state) => {
      if (state.revealIndex < state.revealOrder.length) {
        const id = state.revealOrder[state.revealIndex]
        return state.players.find(p => p.id === id) || null
      }
      return null
    },
    currentCluePlayer: (state) => {
      if (state.clueIndex < state.clueOrder.length) {
        const id = state.clueOrder[state.clueIndex]
        return state.players.find(p => p.id === id) || null
      }
      return null
    },
    currentVoter: (state) => {
      if (state.votingIndex < state.voteOrder.length) {
        const id = state.voteOrder[state.votingIndex]
        return state.players.find(p => p.id === id) || null
      }
      return null
    },
    sortedScores: (state) => {
      return [...state.players]
        .sort((a, b) => (state.scores[b.id] || 0) - (state.scores[a.id] || 0))
        .map(p => ({ ...p, totalScore: state.scores[p.id] || 0 }))
    },
    totalPlayers: (state) => state.playerNames.length,
    numCitizens: (state) => state.playerNames.length - state.numUndercover - state.numMrWhite,
  },

  actions: {
    // ─── SETUP ───────────────────────────────────────────────────────────────

    setPlayerNames(names) {
      this.playerNames = names
    },

    setConfig({ totalRounds, numUndercover, numMrWhite }) {
      this.totalRounds = totalRounds
      this.numUndercover = numUndercover
      this.numMrWhite = numMrWhite
    },

    // ─── INITIALISER UNE PARTIE ──────────────────────────────────────────────

    startGame() {
      // Créer les joueurs
      this.players = this.playerNames.map((name, i) => ({
        id: `p${i}`,
        name,
        role: 'citizen',
        word: '',
        alive: true,
      }))

      // Initialiser les scores et stats
      this.scores = {}
      this.stats = {}
      this.players.forEach(p => {
        this.scores[p.id] = 0
        this.stats[p.id] = {
          correctVotes: 0,
          correctRoleGuesses: 0,
          surviveAsUndercover: 0,
          surviveAsMrWhite: 0,
          roundsAsUndercover: 0,
          roundsAsMrWhite: 0,
          roundsAsCitizen: 0,
          bluffSuccess: 0,
          totalVotesReceived: 0,
        }
      })

      this.round = 1
      this.roundHistory = []
      this.startRound()
      this.save()
    },

    // ─── DÉMARRER UNE MANCHE ─────────────────────────────────────────────────

    startRound() {
      // Récupérer les joueurs encore en vie
      const alive = this.players.filter(p => p.alive)

      // Choisir les mots
      const pair = getRandomPair()
      this.citizenWord = pair.citizenWord
      this.undercoverWord = pair.undercoverWord

      // Calculer le nombre d'Undercover et MrWhite pour cette manche
      // (peut être réduit si trop peu de joueurs vivants)
      const maxSpecial = alive.length - 2
      const uc = Math.min(this.numUndercover, maxSpecial)
      const mw = Math.min(this.numMrWhite, maxSpecial - uc)

      // Assigner les rôles aléatoirement
      const shuffled = shuffle([...alive])
      shuffled.forEach((p, i) => {
        const player = this.players.find(pl => pl.id === p.id)
        if (i < uc) {
          player.role = 'undercover'
          player.word = this.undercoverWord
        } else if (i < uc + mw) {
          player.role = 'mrwhite'
          player.word = ''
        } else {
          player.role = 'citizen'
          player.word = this.citizenWord
        }
      })

      // Préparer l'ordre de révélation
      this.revealOrder = shuffle(alive.map(p => p.id))
      this.revealIndex = 0

      // Reset votes
      this.votes = {}
      this.votingIndex = 0
      this.voteOrder = []
      this.eliminatedPlayerId = null
      this.tiePlayerIds = []
      this.isTieBreaker = false
      this.whiteGuessPlayerId = null
      this.whiteGuessSuccess = null

      this.phase = 'roleReveal'
      this.save()
    },

    // ─── RÉVÉLATION DES RÔLES ────────────────────────────────────────────────

    nextReveal() {
      this.revealIndex++
      if (this.revealIndex >= this.revealOrder.length) {
        // Tous les joueurs ont vu leur rôle → phase indices
        this.startCluePhase()
      }
      this.save()
    },

    // ─── PHASE DES INDICES ───────────────────────────────────────────────────

    startCluePhase() {
      const alive = this.players.filter(p => p.alive)
      this.clueOrder = shuffle(alive.map(p => p.id))
      this.clueIndex = 0
      this.phase = 'clue'
      this.save()
    },

    nextClue() {
      this.clueIndex++
      if (this.clueIndex >= this.clueOrder.length) {
        this.startVotePhase()
      }
      this.save()
    },

    // ─── PHASE DE VOTE ───────────────────────────────────────────────────────

    startVotePhase() {
      const alive = this.players.filter(p => p.alive)
      this.voteOrder = shuffle(alive.map(p => p.id))
      this.votingIndex = 0
      this.votes = {}
      this.phase = 'vote'
      this.save()
    },

    submitVote({ voterId, targetId, guessedRole }) {
      this.votes[voterId] = { targetId, guessedRole }
      this.votingIndex++
      if (this.votingIndex >= this.voteOrder.length) {
        this.phase = 'voteResults'
      }
      this.save()
    },

    // ─── RÉSULTATS DU VOTE ───────────────────────────────────────────────────

    computeVoteResults() {
      // Compter les votes
      const voteCounts = {}
      this.players.filter(p => p.alive).forEach(p => { voteCounts[p.id] = 0 })
      Object.values(this.votes).forEach(v => {
        if (voteCounts[v.targetId] !== undefined) voteCounts[v.targetId]++
      })

      const maxVotes = Math.max(...Object.values(voteCounts))
      const topPlayers = Object.keys(voteCounts).filter(id => voteCounts[id] === maxVotes)

      return { voteCounts, maxVotes, topPlayers }
    },

    eliminatePlayer(playerId) {
      const player = this.players.find(p => p.id === playerId)
      if (player) {
        player.alive = false
        this.eliminatedPlayerId = playerId

        // Mettre à jour les stats
        this.players.filter(p => p.alive || p.id === playerId).forEach(p => {
          if (this.stats[p.id]) {
            this.stats[p.id].totalVotesReceived = (this.stats[p.id].totalVotesReceived || 0)
          }
        })
      }
      this.phase = 'reveal'
      this.save()
    },

    setTie(playerIds) {
      this.tiePlayerIds = playerIds
      this.save()
    },

    startTieBreaker() {
      this.isTieBreaker = true
      this.voteOrder = shuffle([...this.players.filter(p => p.alive).map(p => p.id)])
      this.votingIndex = 0
      this.votes = {}
      this.phase = 'vote'
      this.save()
    },

    noElimination() {
      this.eliminatedPlayerId = null
      this.phase = 'roundResult'
      this.save()
    },

    // ─── RÉVÉLATION ──────────────────────────────────────────────────────────

    startReveal(playerId) {
      this.eliminatedPlayerId = playerId
      const eliminated = this.players.find(p => p.id === playerId)

      if (eliminated && eliminated.role === 'mrwhite') {
        this.whiteGuessPlayerId = playerId
        // Phase reveal d'abord, puis whiteGuess
      }

      this.phase = 'reveal'
      this.save()
    },

    // ─── MR. WHITE GUESS ─────────────────────────────────────────────────────

    startWhiteGuess() {
      this.phase = 'whiteGuess'
      this.save()
    },

    submitWhiteGuess(guess) {
      const normalized = normalizeString(guess)
      const target = normalizeString(this.citizenWord)
      this.whiteGuessSuccess = normalized === target

      if (this.whiteGuessSuccess) {
        // Mr. White gagne +7 points
        if (this.whiteGuessPlayerId) {
          this.scores[this.whiteGuessPlayerId] = (this.scores[this.whiteGuessPlayerId] || 0) + 7
        }
      }
      this.save()
      return this.whiteGuessSuccess
    },

    // ─── CALCUL DES POINTS ───────────────────────────────────────────────────

    computeRoundPoints() {
      const eliminated = this.players.find(p => p.id === this.eliminatedPlayerId)
      const roundPoints = {}
      this.players.forEach(p => { roundPoints[p.id] = 0 })

      // Points pour chaque votant
      Object.entries(this.votes).forEach(([voterId, vote]) => {
        const voter = this.players.find(p => p.id === voterId)
        const target = this.players.find(p => p.id === vote.targetId)
        if (!voter || !target) return

        const targetIsSpecial = target.role === 'undercover' || target.role === 'mrwhite'

        if (voter.role === 'citizen') {
          if (targetIsSpecial) {
            // Bonne personne ciblée
            roundPoints[voterId] = (roundPoints[voterId] || 0) + 2
            if (this.stats[voterId]) this.stats[voterId].correctVotes++

            if (vote.guessedRole === target.role) {
              // Bon rôle aussi
              roundPoints[voterId] = (roundPoints[voterId] || 0) + 1
              if (this.stats[voterId]) this.stats[voterId].correctRoleGuesses++
            }
          }
        } else if (voter.role === 'undercover' || voter.role === 'mrwhite') {
          // Bonus si l'undercover a trompé en faisant voter pour un citoyen
          // Ce bonus est calculé séparément (bluff success)
        }
      })

      // Bonus bluff pour Undercover : +1 par joueur ayant voté contre un citoyen en prenant l'undercover pour citoyen
      this.players.filter(p => p.role === 'undercover').forEach(uc => {
        let bluffCount = 0
        Object.entries(this.votes).forEach(([voterId, vote]) => {
          const target = this.players.find(p => p.id === vote.targetId)
          // Le votant a voté pour un citoyen
          if (target && target.role === 'citizen') {
            bluffCount++
          }
        })
        // +1 point bonus si l'undercover survit et a réussi à tromper
        if (uc.alive) {
          roundPoints[uc.id] = (roundPoints[uc.id] || 0) + 4 + bluffCount
          if (this.stats[uc.id]) {
            this.stats[uc.id].surviveAsUndercover++
            this.stats[uc.id].bluffSuccess += bluffCount
          }
        }
      })

      // Survivre comme MrWhite → +5 pts (si pas éliminé et pas devined)
      this.players.filter(p => p.role === 'mrwhite' && p.alive).forEach(mw => {
        roundPoints[mw.id] = (roundPoints[mw.id] || 0) + 5
        if (this.stats[mw.id]) this.stats[mw.id].surviveAsMrWhite++
      })

      // Cumuler les points
      Object.entries(roundPoints).forEach(([id, pts]) => {
        this.scores[id] = (this.scores[id] || 0) + pts
      })

      // Stats par rôle pour cette manche
      this.players.forEach(p => {
        if (!this.stats[p.id]) return
        if (p.role === 'citizen') this.stats[p.id].roundsAsCitizen++
        if (p.role === 'undercover') this.stats[p.id].roundsAsUndercover++
        if (p.role === 'mrwhite') this.stats[p.id].roundsAsMrWhite++
      })

      this.roundHistory.push({
        round: this.round,
        citizenWord: this.citizenWord,
        undercoverWord: this.undercoverWord,
        eliminatedId: this.eliminatedPlayerId,
        points: { ...roundPoints },
      })

      this.phase = 'roundResult'
      this.save()
      return roundPoints
    },

    // ─── VÉRIFICATION DES CONDITIONS DE VICTOIRE ─────────────────────────────

    checkVictory() {
      const alive = this.players.filter(p => p.alive)
      const aliveUC = alive.filter(p => p.role === 'undercover')
      const aliveMW = alive.filter(p => p.role === 'mrwhite')
      const aliveCit = alive.filter(p => p.role === 'citizen')

      // Mr. White gagne par guess correct
      if (this.whiteGuessSuccess === true) {
        return { winner: 'mrwhite', reason: 'guess' }
      }

      // Tous les Undercover et MrWhite éliminés → citoyens gagnent
      if (aliveUC.length === 0 && aliveMW.length === 0) {
        return { winner: 'citizen', reason: 'eliminated_all' }
      }

      // Citoyens ≤ Undercover → Undercover gagne
      if (aliveCit.length <= aliveUC.length && aliveUC.length > 0) {
        return { winner: 'undercover', reason: 'dominated' }
      }

      return null // Partie continue
    },

    // ─── MANCHE SUIVANTE ─────────────────────────────────────────────────────

    nextRound() {
      if (this.totalRounds !== 0 && this.round >= this.totalRounds) {
        this.phase = 'final'
        this.save()
        return
      }
      this.round++
      // Ressusciter tous les joueurs pour la prochaine manche (optionnel selon règles)
      // On garde les joueurs éliminés éliminés → le jeu tourne avec les survivants
      // Si pas assez de joueurs vivants, on ressuscite tout le monde pour recommencer
      const alive = this.players.filter(p => p.alive)
      if (alive.length < 4) {
        // Ressusciter tout le monde pour une nouvelle manche
        this.players.forEach(p => { p.alive = true })
      }
      this.startRound()
    },

    goToFinal() {
      this.phase = 'final'
      this.save()
    },

    // ─── TITRES FINAUX ───────────────────────────────────────────────────────

    computeTitles() {
      let bestCitizen = null
      let bestUndercover = null
      let bestBluffer = null
      let bestDetective = null

      let maxCitizenPts = -1
      let maxUCPts = -1
      let maxBluff = -1
      let maxDetective = -1

      this.players.forEach(p => {
        const s = this.stats[p.id] || {}

        // Meilleur citoyen : plus de votes corrects
        if (s.roundsAsCitizen > 0 && (s.correctVotes || 0) > maxCitizenPts) {
          maxCitizenPts = s.correctVotes || 0
          bestCitizen = p.name
        }

        // Meilleur Undercover : plus de manches survécues en tant qu'UC
        if ((s.surviveAsUndercover || 0) > maxUCPts) {
          maxUCPts = s.surviveAsUndercover || 0
          bestUndercover = p.name
        }

        // Meilleur bluffeur : plus de succès de bluff
        if ((s.bluffSuccess || 0) > maxBluff) {
          maxBluff = s.bluffSuccess || 0
          bestBluffer = p.name
        }

        // Meilleur détective : correctVotes + correctRoleGuesses
        const detScore = (s.correctVotes || 0) + (s.correctRoleGuesses || 0)
        if (detScore > maxDetective) {
          maxDetective = detScore
          bestDetective = p.name
        }
      })

      return { bestCitizen, bestUndercover, bestBluffer, bestDetective }
    },

    // ─── PERSISTANCE ─────────────────────────────────────────────────────────

    save() {
      saveToStorage(this.$state)
    },

    load() {
      const data = loadFromStorage()
      if (data) {
        this.$patch(data)
        return true
      }
      return false
    },

    resetGame() {
      localStorage.removeItem(STORAGE_KEY)
      this.$reset()
    },

    goToPhase(phase) {
      this.phase = phase
      this.save()
    },
  },
})

// Utilitaire : mélanger un tableau
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
