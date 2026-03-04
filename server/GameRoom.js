const PLAYERS_DB = require('./players-db');

class GameRoom {
  constructor(code, hostId, hostName, settings) {
    this.code = code;
    this.hostId = hostId;
    this.players = [{ id: hostId, name: hostName }];
    this.settings = {
      maxPlayers: settings.maxPlayers || 10,
      mode: settings.mode || 'classic',
      numImpostors: settings.numImpostors || 1
    };
    this.isPublic = settings.isPublic || false;
    this.phase = 'lobby'; // lobby | roles | discussion | voting | results
    this.roles = [];
    this.selectedFootballer = null;
    this.votes = {};
    this.discussionTime = 120;
    this.turnDuration = 30;
    this.currentSpeaker = 0;
    this.numImpostors = this.settings.numImpostors;
  }

  addPlayer(id, name) {
    if (this.players.length >= this.settings.maxPlayers) {
      return { error: 'room_full' };
    }
    if (this.phase !== 'lobby') {
      return { error: 'game_in_progress' };
    }
    if (this.players.find(p => p.name === name)) {
      return { error: 'name_taken' };
    }
    this.players.push({ id, name });
    return { success: true };
  }

  removePlayer(id) {
    const player = this.getPlayerById(id);
    if (player) {
      delete this.votes[player.name];
    }
    this.players = this.players.filter(p => p.id !== id);
  }

  getPlayerById(id) {
    return this.players.find(p => p.id === id);
  }

  getPlayerNames() {
    return this.players.map(p => p.name);
  }

  getHostName() {
    const host = this.players.find(p => p.id === this.hostId);
    return host ? host.name : '';
  }

  getSummary() {
    return {
      code: this.code,
      hostName: this.getHostName(),
      playerCount: this.players.length,
      maxPlayers: this.settings.maxPlayers,
      mode: this.settings.mode,
      isPublic: this.isPublic
    };
  }

  startGame() {
    if (this.players.length < 3) {
      return { error: 'not_enough_players' };
    }

    this.phase = 'roles';
    this.votes = {};

    // Select random footballer
    const randomIndex = Math.floor(Math.random() * PLAYERS_DB.length);
    this.selectedFootballer = PLAYERS_DB[randomIndex];

    // Assign roles
    const playerCount = this.players.length;
    this.roles = new Array(playerCount).fill('normal');

    if (this.settings.mode === 'chaos') {
      const maxImpostors = playerCount;
      this.numImpostors = Math.floor(Math.random() * maxImpostors) + 1;
      if (this.numImpostors > playerCount) {
        this.numImpostors = playerCount;
      }
    } else {
      this.numImpostors = this.settings.numImpostors;
    }

    // Randomly pick impostor indices
    const indices = [...Array(playerCount).keys()];
    this.shuffle(indices);
    for (let i = 0; i < this.numImpostors; i++) {
      this.roles[indices[i]] = 'impostor';
    }

    return { success: true };
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  isEveryoneImpostor() {
    return this.numImpostors >= this.players.length;
  }

  getHintsForPlayer(playerId) {
    const playerIndex = this.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return null;

    const role = this.roles[playerIndex];
    if (role === 'impostor') {
      return { role: 'impostor' };
    }

    const footballer = this.selectedFootballer;
    const shuffledHints = [...footballer.pistas].sort(() => Math.random() - 0.5).slice(0, 2);

    return {
      role: 'normal',
      footballer: footballer.nombre,
      hints: shuffledHints
    };
  }

  registerVote(playerId, votedName) {
    const player = this.getPlayerById(playerId);
    if (!player) return;
    this.votes[player.name] = votedName;
  }

  allVotesIn() {
    return Object.keys(this.votes).length >= this.players.length;
  }

  getResults() {
    const playerNames = this.getPlayerNames();
    const voteCounts = {};
    playerNames.forEach(name => { voteCounts[name] = 0; });

    Object.values(this.votes).forEach(votedName => {
      if (votedName && voteCounts[votedName] !== undefined) {
        voteCounts[votedName]++;
      }
    });

    // Find most voted
    let maxVotes = 0;
    let eliminated = [];
    Object.entries(voteCounts).forEach(([name, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        eliminated = [name];
      } else if (count === maxVotes && count > 0) {
        eliminated.push(name);
      }
    });

    const isTie = eliminated.length > 1;
    const impostorNames = this.getImpostorNames();
    let impostorCaught = false;
    if (!isTie && eliminated.length === 1) {
      impostorCaught = impostorNames.includes(eliminated[0]);
    }

    return {
      voteCounts,
      eliminated: isTie ? [] : eliminated,
      isTie,
      impostorCaught,
      impostorNames,
      normalWin: impostorCaught,
      footballer: this.selectedFootballer,
      isEveryoneImpostor: this.isEveryoneImpostor()
    };
  }

  getImpostorNames() {
    return this.players
      .filter((_, i) => this.roles[i] === 'impostor')
      .map(p => p.name);
  }

  getCurrentSpeakerData() {
    if (this.currentSpeaker >= this.players.length) return null;
    return {
      currentPlayer: this.players[this.currentSpeaker].name,
      currentPlayerId: this.players[this.currentSpeaker].id,
      index: this.currentSpeaker,
      total: this.players.length
    };
  }

  nextSpeaker() {
    this.currentSpeaker++;
    if (this.currentSpeaker >= this.players.length) {
      return { done: true };
    }
    return { done: false, ...this.getCurrentSpeakerData() };
  }

  resetForNewGame() {
    this.phase = 'lobby';
    this.roles = [];
    this.selectedFootballer = null;
    this.votes = {};
    this.currentSpeaker = 0;
  }
}

module.exports = GameRoom;
