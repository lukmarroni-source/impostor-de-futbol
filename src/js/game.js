class Game {
  constructor() {
    this.players = [];
    this.numImpostors = 1;
    this.mode = 'classic';
    this.roles = [];
    this.selectedFootballer = null;
    this.votes = {};
    this.currentPlayerIndex = 0;
    this.discussionTime = 120;
  }

  setup(playerNames, numImpostors, mode) {
    this.players = playerNames;
    this.mode = mode;
    this.votes = {};
    this.currentPlayerIndex = 0;

    // Select random footballer
    const randomIndex = Math.floor(Math.random() * PLAYERS_DB.length);
    this.selectedFootballer = PLAYERS_DB[randomIndex];

    // Assign roles
    this.roles = new Array(this.players.length).fill('normal');

    if (mode === 'chaos') {
      // Chaos mode: random number of impostors (1 to all)
      const maxImpostors = this.players.length;
      const minImpostors = 1;
      this.numImpostors = Math.floor(Math.random() * maxImpostors) + minImpostors;
      // Cap at player count
      if (this.numImpostors > this.players.length) {
        this.numImpostors = this.players.length;
      }
    } else {
      this.numImpostors = numImpostors;
    }

    // Randomly pick impostor indices
    const indices = [...Array(this.players.length).keys()];
    this.shuffle(indices);
    for (let i = 0; i < this.numImpostors; i++) {
      this.roles[indices[i]] = 'impostor';
    }
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  getRole(playerIndex) {
    return this.roles[playerIndex];
  }

  isImpostor(playerIndex) {
    return this.roles[playerIndex] === 'impostor';
  }

  getImpostorNames() {
    return this.players.filter((_, i) => this.roles[i] === 'impostor');
  }

  getNormalNames() {
    return this.players.filter((_, i) => this.roles[i] === 'normal');
  }

  isEveryoneImpostor() {
    return this.numImpostors >= this.players.length;
  }

  registerVote(voterIndex, votedPlayerName) {
    this.votes[this.players[voterIndex]] = votedPlayerName;
  }

  getResults() {
    // Count votes
    const voteCounts = {};
    this.players.forEach(name => { voteCounts[name] = 0; });

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

    // Check for tie (more than 1 with same votes)
    const isTie = eliminated.length > 1;

    // Check if impostor was caught
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
}

const game = new Game();
