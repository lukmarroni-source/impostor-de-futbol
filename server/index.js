const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const GameRoom = require('./GameRoom');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Store active rooms
const rooms = new Map();

// Generate random 4-letter room code
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code;
  do {
    code = '';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
  } while (rooms.has(code));
  return code;
}

// Track turn timers per room
const turnTimers = new Map();

function startTurnTimer(roomCode) {
  // Clear existing timer for this room
  if (turnTimers.has(roomCode)) {
    clearTimeout(turnTimers.get(roomCode));
  }

  const room = rooms.get(roomCode);
  if (!room) return;

  const timer = setTimeout(() => {
    turnTimers.delete(roomCode);
    const r = rooms.get(roomCode);
    if (!r || r.phase !== 'discussion') return;
    console.log(`[turn-timer] Auto-advancing turn in room ${roomCode}`);
    advanceTurn(roomCode);
  }, (room.turnDuration + 1) * 1000); // +1s grace period

  turnTimers.set(roomCode, timer);
}

function advanceTurn(roomCode) {
  // Clear any existing timer
  if (turnTimers.has(roomCode)) {
    clearTimeout(turnTimers.get(roomCode));
    turnTimers.delete(roomCode);
  }

  const room = rooms.get(roomCode);
  if (!room) return;

  const result = room.nextSpeaker();
  if (result.done) {
    room.phase = 'voting';
    console.log(`[turns-done] All players spoke in room ${roomCode}, going to voting`);
    io.to(roomCode).emit('turns-done');
  } else {
    console.log(`[turn-update] Next speaker in room ${roomCode}: ${result.currentPlayer}`);
    io.to(roomCode).emit('turn-update', result);
    startTurnTimer(roomCode);
  }
}

// Clean up empty rooms periodically
setInterval(() => {
  for (const [code, room] of rooms) {
    if (room.players.length === 0) {
      console.log(`[cleanup] Removing empty room ${code}`);
      if (turnTimers.has(code)) {
        clearTimeout(turnTimers.get(code));
        turnTimers.delete(code);
      }
      rooms.delete(code);
    }
  }
}, 60000);

io.on('connection', (socket) => {
  console.log(`[connect] ${socket.id}`);
  let currentRoom = null;

  socket.on('create-room', ({ name, settings, isPublic }) => {
    const code = generateCode();
    console.log(`[create-room] ${name} created room ${code} (public: ${!!isPublic})`, settings);
    settings.isPublic = !!isPublic;
    const room = new GameRoom(code, socket.id, name, settings);
    rooms.set(code, room);
    currentRoom = code;

    socket.join(code);
    socket.emit('room-created', { code });
    io.to(code).emit('player-joined', {
      players: room.getPlayerNames(),
      hostName: room.getHostName()
    });
  });

  socket.on('list-public-rooms', (callback) => {
    if (typeof callback !== 'function') return;
    const publicRooms = [];
    for (const [code, room] of rooms) {
      if (room.isPublic && room.phase === 'lobby' && room.players.length < room.settings.maxPlayers) {
        publicRooms.push(room.getSummary());
      }
    }
    console.log(`[list-public-rooms] Found ${publicRooms.length} public rooms`);
    callback(publicRooms);
  });

  socket.on('join-room', ({ code, name }) => {
    const upperCode = code.toUpperCase();
    console.log(`[join-room] ${name} trying to join ${upperCode}`);
    const room = rooms.get(upperCode);

    if (!room) {
      console.log(`[join-room] Room ${upperCode} not found`);
      socket.emit('error', { message: 'invalid_code' });
      return;
    }

    const result = room.addPlayer(socket.id, name);
    if (result.error) {
      console.log(`[join-room] Error: ${result.error}`);
      socket.emit('error', { message: result.error });
      return;
    }

    currentRoom = upperCode;
    socket.join(upperCode);
    console.log(`[join-room] ${name} joined room ${upperCode}. Players: ${room.getPlayerNames()}`);

    // Send room code to the joiner
    socket.emit('room-joined', { code: upperCode });

    io.to(upperCode).emit('player-joined', {
      players: room.getPlayerNames(),
      hostName: room.getHostName()
    });
  });

  socket.on('start-game', () => {
    console.log(`[start-game] from ${socket.id}, room: ${currentRoom}`);
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;

    // Only host can start
    if (socket.id !== room.hostId) {
      console.log(`[start-game] Not host, ignoring`);
      return;
    }

    const result = room.startGame();
    if (result.error) {
      console.log(`[start-game] Error: ${result.error}`);
      socket.emit('error', { message: result.error });
      return;
    }

    console.log(`[start-game] Game started in room ${currentRoom}. Players: ${room.getPlayerNames()}, Impostors: ${room.getImpostorNames()}`);

    // Check if everyone is impostor (chaos mode)
    if (room.isEveryoneImpostor()) {
      console.log(`[start-game] Everyone is impostor!`);
      io.to(currentRoom).emit('all-impostors', {
        footballer: room.selectedFootballer
      });
      return;
    }

    // Send each player their role privately
    room.players.forEach(player => {
      const hints = room.getHintsForPlayer(player.id);
      console.log(`[start-game] Sending role to ${player.name}: ${hints.role}`);
      io.to(player.id).emit('game-started', hints);
    });

    // Start discussion turns after a delay for players to read their role
    setTimeout(() => {
      if (!rooms.has(currentRoom)) return;
      room.phase = 'discussion';
      room.currentSpeaker = 0;
      const speakerData = room.getCurrentSpeakerData();
      console.log(`[discussion] Starting turns in room ${currentRoom}. First speaker: ${speakerData.currentPlayer}`);
      io.to(currentRoom).emit('turn-update', speakerData);

      // Auto-advance timer
      startTurnTimer(currentRoom);
    }, 10000);
  });

  socket.on('vote', ({ votedName }) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;

    const player = room.getPlayerById(socket.id);
    console.log(`[vote] ${player ? player.name : socket.id} voted for ${votedName}`);
    room.registerVote(socket.id, votedName);

    // Notify how many votes are in
    io.to(currentRoom).emit('vote-update', {
      votesCount: Object.keys(room.votes).length,
      totalPlayers: room.players.length
    });

    // If all votes are in, send results
    if (room.allVotesIn()) {
      room.phase = 'results';
      const results = room.getResults();
      console.log(`[results] All votes in for room ${currentRoom}`);
      io.to(currentRoom).emit('game-results', results);
    }
  });

  socket.on('skip-vote', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;

    const player = room.getPlayerById(socket.id);
    console.log(`[vote] ${player ? player.name : socket.id} skipped vote`);
    room.registerVote(socket.id, null);

    io.to(currentRoom).emit('vote-update', {
      votesCount: Object.keys(room.votes).length,
      totalPlayers: room.players.length
    });

    if (room.allVotesIn()) {
      room.phase = 'results';
      const results = room.getResults();
      console.log(`[results] All votes in for room ${currentRoom}`);
      io.to(currentRoom).emit('game-results', results);
    }
  });

  socket.on('next-turn', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || room.phase !== 'discussion') return;

    // Only the current speaker can advance
    const speakerData = room.getCurrentSpeakerData();
    if (!speakerData || speakerData.currentPlayerId !== socket.id) return;

    const player = room.getPlayerById(socket.id);
    console.log(`[next-turn] ${player ? player.name : socket.id} finished their turn`);

    advanceTurn(currentRoom);
  });

  socket.on('chat-message', ({ text }) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;
    const player = room.getPlayerById(socket.id);
    if (!player) return;

    const safeText = text.slice(0, 200);
    console.log(`[chat] ${player.name}: ${safeText}`);
    io.to(currentRoom).emit('chat-message', {
      name: player.name,
      text: safeText
    });
  });

  socket.on('play-again', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;
    if (socket.id !== room.hostId) return;

    console.log(`[play-again] Room ${currentRoom}`);
    room.resetForNewGame();
    io.to(currentRoom).emit('back-to-lobby', {
      players: room.getPlayerNames(),
      hostName: room.getHostName()
    });
  });

  socket.on('disconnect', () => {
    console.log(`[disconnect] ${socket.id}, room: ${currentRoom}`);
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;

    const wasHost = socket.id === room.hostId;
    const player = room.getPlayerById(socket.id);
    const playerName = player ? player.name : '';

    room.removePlayer(socket.id);

    if (room.players.length === 0) {
      console.log(`[disconnect] Room ${currentRoom} is now empty, deleting`);
      if (turnTimers.has(currentRoom)) {
        clearTimeout(turnTimers.get(currentRoom));
        turnTimers.delete(currentRoom);
      }
      rooms.delete(currentRoom);
      return;
    }

    // If host left, assign new host
    if (wasHost && room.players.length > 0) {
      room.hostId = room.players[0].id;
      console.log(`[disconnect] New host: ${room.players[0].name}`);
    }

    io.to(currentRoom).emit('player-left', {
      players: room.getPlayerNames(),
      hostName: room.getHostName(),
      name: playerName
    });

    // If in voting phase and all remaining votes are in, send results
    if (room.phase === 'voting' && room.allVotesIn()) {
      room.phase = 'results';
      const results = room.getResults();
      io.to(currentRoom).emit('game-results', results);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Impostor server running on port ${PORT}`);
});
