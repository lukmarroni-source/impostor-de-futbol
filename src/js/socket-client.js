// ========== SOCKET.IO CLIENT ==========
let socket = null;
let onlineRoomCode = null;
let onlinePlayerName = null;
let isHost = false;
let onlinePlayerList = []; // Store player list for voting

function connectSocket() {
  // Reuse existing socket if connected or still connecting
  if (socket && (socket.connected || socket.connecting)) return;

  // Clean up old disconnected socket
  if (socket) {
    socket.removeAllListeners();
    socket = null;
  }

  // Connect to same host (nginx proxies /socket.io/ to server)
  socket = io({ transports: ['polling', 'websocket'] });

  socket.on('connect', () => {
    console.log('[socket] Connected:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error('[socket] Connection error:', err.message);
    handleOnlineError('connection_error');
  });

  // ===== SERVER EVENTS =====

  socket.on('room-created', ({ code }) => {
    console.log('[socket] Room created:', code);
    onlineRoomCode = code;
    isHost = true;
    showLobby();
  });

  socket.on('room-joined', ({ code }) => {
    console.log('[socket] Joined room:', code);
    onlineRoomCode = code;
    isHost = false;
    showLobby();
  });

  socket.on('player-joined', ({ players, hostName, maxPlayers }) => {
    console.log('[socket] Player joined. Players:', players);
    onlinePlayerList = players;
    updateLobbyPlayers(players, hostName, maxPlayers);
  });

  socket.on('player-left', ({ players, hostName, name, maxPlayers }) => {
    console.log('[socket] Player left:', name);
    onlinePlayerList = players;
    updateLobbyPlayers(players, hostName, maxPlayers);
  });

  socket.on('game-started', (data) => {
    console.log('[socket] Game started, role:', data.role);
    showOnlineRole(data);
  });

  socket.on('all-impostors', ({ footballer }) => {
    console.log('[socket] All impostors!');
    showOnlineEveryoneImpostor(footballer);
  });

  socket.on('discussion-start', ({ time }) => {
    console.log('[socket] Discussion start (legacy), time:', time);
    showOnlineDiscussion(time);
  });

  socket.on('turn-update', (data) => {
    console.log('[socket] Turn update:', data.currentPlayer, `(${data.index + 1}/${data.total})`);
    showOnlineDiscussionTurn(data);
  });

  socket.on('turns-done', () => {
    console.log('[socket] All turns done, going to vote');
    showOnlineVoteScreen();
  });

  socket.on('vote-update', ({ votesCount, totalPlayers }) => {
    console.log('[socket] Vote update:', votesCount, '/', totalPlayers);
    updateOnlineVoteStatus(votesCount, totalPlayers);
  });

  socket.on('game-results', (results) => {
    console.log('[socket] Game results received');
    showOnlineResults(results);
  });

  socket.on('back-to-lobby', ({ players, hostName, maxPlayers }) => {
    console.log('[socket] Back to lobby');
    onlinePlayerList = players;
    updateLobbyPlayers(players, hostName, maxPlayers);
    showScreen('screen-lobby');
    updateTexts();
  });

  socket.on('chat-message', ({ name, text }) => {
    appendChatMessage(name, text);
  });

  socket.on('error', ({ message }) => {
    console.error('[socket] Server error:', message);
    handleOnlineError(message);
  });

  socket.on('disconnect', () => {
    console.log('[socket] Disconnected');
    if (typeof onlineTurnTimer !== 'undefined' && onlineTurnTimer) {
      clearInterval(onlineTurnTimer);
      onlineTurnTimer = null;
    }
  });
}

function socketCreateRoom(name, settings, isPublic) {
  connectSocket();
  onlinePlayerName = name;
  socket.emit('create-room', { name, settings, isPublic });
}

function socketListPublicRooms(callback) {
  connectSocket();
  // Use event-based pattern (more reliable than ack callback with polling transport)
  const handler = (rooms) => {
    socket.off('public-rooms-list', handler);
    callback(rooms);
  };
  socket.on('public-rooms-list', handler);
  socket.emit('list-public-rooms');
}

function socketJoinRoom(code, name) {
  connectSocket();
  onlinePlayerName = name;
  socket.emit('join-room', { code, name });
}

function socketStartGame() {
  if (socket) socket.emit('start-game');
}

function socketVote(votedName) {
  if (socket) socket.emit('vote', { votedName });
}

function socketSkipVote() {
  if (socket) socket.emit('skip-vote');
}

function socketNextTurn() {
  if (socket) socket.emit('next-turn');
}

function socketPlayAgain() {
  if (socket) socket.emit('play-again');
}

function socketDisconnect() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  onlineRoomCode = null;
  onlinePlayerName = null;
  isHost = false;
  onlinePlayerList = [];
  if (typeof onlineTurnTimer !== 'undefined' && onlineTurnTimer) {
    clearInterval(onlineTurnTimer);
    onlineTurnTimer = null;
  }
}
