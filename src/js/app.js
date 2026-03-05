// ========== SAFE AUDIO STUBS (fallback if audio.js fails to load) ==========
(function() {
  var fns = ['initAudio','toggleMute','playBgMusic','stopBgMusic',
    'sfxSplashIntro','sfxClick','sfxReveal','sfxImpostor','sfxNormal',
    'sfxNextTurn','sfxTick','sfxVote','sfxWin','sfxLose','sfxChat',
    'setMasterVolume','setMusicVolume','setSfxVolume','updateSettingsSliders'];
  fns.forEach(function(name) {
    if (typeof window[name] !== 'function') window[name] = function(){};
  });
})();

// ========== SCREEN NAVIGATION ==========
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// ========== UPDATE ALL TRANSLATABLE TEXT ==========
function updateTexts() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
}

// ========== GAME MODE ==========
let gameMode = 'local'; // 'local' or 'online'

// ========== HOME SCREEN ==========
function initHome() {
  gameMode = 'local';
  showScreen('screen-home');
  updateTexts();
}

// ========== SETTINGS SCREEN ==========
function openSettings() {
  sfxClick();
  showScreen('screen-settings');
  // Highlight current language
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.lang === getLang());
  });
  // Sync audio sliders with current values
  updateSettingsSliders();
  updateMuteButton();
}

function selectLanguage(lang) {
  setLanguage(lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.lang === lang);
  });
  updateTexts();
}

// ========== SETUP SCREEN ==========
let setupNumPlayers = 4;
let setupNumImpostors = 1;
let setupMode = 'classic';

function openSetup() {
  setupNumPlayers = 4;
  setupNumImpostors = 1;
  setupMode = 'classic';
  showScreen('screen-setup');
  updateTexts();
  renderSetup();
}

function renderSetup() {
  document.getElementById('setup-num-players').textContent = setupNumPlayers;
  document.getElementById('setup-num-impostors').textContent = setupNumImpostors;

  document.querySelectorAll('#screen-setup .mode-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.mode === setupMode);
  });

  // Disable impostor controls in chaos mode
  const impostorControls = document.getElementById('impostor-controls');
  if (setupMode === 'chaos') {
    impostorControls.classList.add('disabled');
  } else {
    impostorControls.classList.remove('disabled');
  }
}

function changeNumPlayers(delta) {
  setupNumPlayers = Math.max(3, Math.min(10, setupNumPlayers + delta));
  // Adjust impostors if needed
  if (setupNumImpostors >= setupNumPlayers) {
    setupNumImpostors = setupNumPlayers - 1;
  }
  renderSetup();
}

function changeNumImpostors(delta) {
  if (setupMode === 'chaos') return;
  setupNumImpostors = Math.max(1, Math.min(setupNumPlayers - 1, setupNumImpostors + delta));
  renderSetup();
}

function selectMode(mode) {
  setupMode = mode;
  renderSetup();
}

function goToNames() {
  sfxClick();
  showScreen('screen-names');
  updateTexts();
  renderNameInputs();
}

// ========== NAMES SCREEN ==========
function renderNameInputs() {
  const container = document.getElementById('names-container');
  container.innerHTML = '';
  for (let i = 0; i < setupNumPlayers; i++) {
    const div = document.createElement('div');
    div.className = 'name-input-group';
    div.innerHTML = `
      <label>${t('playerName')} ${i + 1}</label>
      <input type="text" class="player-name-input" placeholder="${t('playerName')} ${i + 1}" maxlength="20" value="${t('playerName')} ${i + 1}">
    `;
    container.appendChild(div);
  }
}

function startGame() {
  sfxClick();
  const inputs = document.querySelectorAll('.player-name-input');
  const names = [];
  inputs.forEach(input => {
    names.push(input.value.trim() || input.placeholder);
  });

  // Check for duplicate names
  const uniqueNames = new Set(names);
  if (uniqueNames.size !== names.length) {
    // Add numbers to duplicates
    const seen = {};
    for (let i = 0; i < names.length; i++) {
      if (seen[names[i]] !== undefined) {
        seen[names[i]]++;
        names[i] = names[i] + ' ' + seen[names[i]];
      } else {
        seen[names[i]] = 1;
      }
    }
  }

  game.setup(names, setupNumImpostors, setupMode);
  game.currentPlayerIndex = 0;
  showRolePass();
}

// ========== ROLE REVEAL ==========
function showRolePass() {
  if (game.currentPlayerIndex >= game.players.length) {
    startDiscussion();
    return;
  }

  showScreen('screen-role-pass');
  updateTexts();

  const name = game.players[game.currentPlayerIndex];
  document.getElementById('role-pass-name').textContent = name;
  document.getElementById('role-reveal-content').classList.add('hidden');
  document.getElementById('btn-reveal-role').classList.remove('hidden');
}

function revealRole() {
  sfxReveal();
  document.getElementById('btn-reveal-role').classList.add('hidden');
  const content = document.getElementById('role-reveal-content');
  content.classList.remove('hidden');

  const idx = game.currentPlayerIndex;
  const isImp = game.isImpostor(idx);

  const roleTitle = document.getElementById('role-title');
  const roleInfo = document.getElementById('role-info');

  if (isImp) {
    setTimeout(sfxImpostor, 550);
    roleTitle.textContent = t('youAreImpostor');
    roleTitle.className = 'role-title impostor';
    roleInfo.innerHTML = `<p class="impostor-desc">${t('impostorDesc')}</p>`;
  } else {
    setTimeout(sfxNormal, 550);
    roleTitle.textContent = t('youAreNormal');
    roleTitle.className = 'role-title normal';

    const footballer = game.selectedFootballer;
    // Pick 2 random hints
    const shuffledHints = [...footballer.pistas].sort(() => Math.random() - 0.5).slice(0, 2);
    let hintsHtml = `<ul class="pistas-list">`;
    shuffledHints.forEach(p => { hintsHtml += `<li>${p}</li>`; });
    hintsHtml += `</ul>`;

    roleInfo.innerHTML = `
      <p class="footballer-name">${t('yourPlayer')} <strong>${footballer.nombre}</strong></p>
      <button class="btn btn-secondary btn-hint" onclick="this.nextElementSibling.classList.remove('hidden'); this.remove();">${t('dontKnowHim')}</button>
      <div class="hint-box hidden">${hintsHtml}</div>
    `;
  }
}

function roleUnderstood() {
  sfxClick();
  game.currentPlayerIndex++;
  showRolePass();
}

// ========== DISCUSSION TURNS (Local) ==========
let turnTimer = null;
let turnTimeLeft = 0;
const TURN_DURATION = 30;

function startDiscussion() {
  // Check if everyone is impostor (chaos mode)
  if (game.isEveryoneImpostor()) {
    showEveryoneImpostor();
    return;
  }

  game.currentPlayerIndex = 0;
  showDiscussionTurn();
}

function showDiscussionTurn() {
  if (game.currentPlayerIndex >= game.players.length) {
    goToVoting();
    return;
  }

  if (turnTimer) clearInterval(turnTimer);

  const name = game.players[game.currentPlayerIndex];
  const current = game.currentPlayerIndex + 1;
  const total = game.players.length;

  showScreen('screen-discussion-turn');
  updateTexts();

  // Update counter badge
  document.getElementById('turn-counter-badge').textContent =
    t('turn_counter').replace('{current}', current).replace('{total}', total);

  // Show pass-device phase
  document.getElementById('turn-player-name').textContent = name;
  document.getElementById('turn-pass-device').classList.remove('hidden');
  document.getElementById('turn-active-content').classList.add('hidden');
}

function revealTurn() {
  sfxReveal();
  document.getElementById('turn-pass-device').classList.add('hidden');
  const content = document.getElementById('turn-active-content');
  content.classList.remove('hidden');

  const idx = game.currentPlayerIndex;
  const name = game.players[idx];
  const isImp = game.isImpostor(idx);

  // Title
  document.getElementById('turn-active-title').textContent =
    t('your_turn') + ' ' + name;

  // Role reminder
  const reminder = document.getElementById('turn-role-reminder');
  if (isImp) {
    reminder.innerHTML = `<p class="impostor-desc">${t('youAreImpostor')}</p>`;
  } else {
    const footballer = game.selectedFootballer;
    reminder.innerHTML = `<p class="footballer-name">${t('yourPlayer')} <strong>${footballer.nombre}</strong></p>`;
  }

  // Start turn timer
  turnTimeLeft = TURN_DURATION;
  updateTurnTimerDisplay();

  if (turnTimer) clearInterval(turnTimer);
  turnTimer = setInterval(() => {
    turnTimeLeft--;
    updateTurnTimerDisplay();
    if (turnTimeLeft > 0 && turnTimeLeft <= 5) sfxTick();
    if (turnTimeLeft <= 0) {
      clearInterval(turnTimer);
      turnTimer = null;
      nextDiscussionTurn();
    }
  }, 1000);
}

function updateTurnTimerDisplay() {
  const minutes = Math.floor(turnTimeLeft / 60);
  const seconds = turnTimeLeft % 60;
  document.getElementById('turn-timer-display').textContent =
    `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function nextDiscussionTurn() {
  sfxNextTurn();
  if (turnTimer) clearInterval(turnTimer);
  turnTimer = null;
  game.currentPlayerIndex++;
  showDiscussionTurn();
}

function goToVoting() {
  if (turnTimer) clearInterval(turnTimer);
  turnTimer = null;

  // Check if everyone is impostor (chaos mode)
  if (game.isEveryoneImpostor()) {
    showEveryoneImpostor();
    return;
  }

  game.currentPlayerIndex = 0;
  showVotePass();
}

// ========== EVERYONE IMPOSTOR (chaos) ==========
function showEveryoneImpostor() {
  showScreen('screen-results');
  updateTexts();

  const container = document.getElementById('results-content');
  container.innerHTML = `
    <div class="everyone-impostor">
      <h2>😱 ${t('everyoneImpostor')}</h2>
      <div class="footballer-reveal">
        <p>${t('thePlayerWas')}:</p>
        <h3>${game.selectedFootballer.nombre}</h3>
      </div>
    </div>
  `;
}

// ========== VOTING ==========
function showVotePass() {
  if (game.currentPlayerIndex >= game.players.length) {
    showResults();
    return;
  }

  showScreen('screen-vote-pass');
  updateTexts();

  const name = game.players[game.currentPlayerIndex];
  document.getElementById('vote-pass-name').textContent = name;
  document.getElementById('vote-content').classList.add('hidden');
  document.getElementById('btn-show-vote').classList.remove('hidden');
}

function showVoteOptions() {
  document.getElementById('btn-show-vote').classList.add('hidden');
  document.getElementById('vote-content').classList.remove('hidden');

  const container = document.getElementById('vote-options');
  container.innerHTML = '';

  const currentName = game.players[game.currentPlayerIndex];

  game.players.forEach((name) => {
    if (name === currentName) return; // Can't vote for yourself
    const btn = document.createElement('button');
    btn.className = 'vote-btn';
    btn.textContent = name;
    btn.onclick = () => castVote(name);
    container.appendChild(btn);
  });
}

function castVote(votedName) {
  sfxVote();
  game.registerVote(game.currentPlayerIndex, votedName);
  game.currentPlayerIndex++;
  showVotePass();
}

function skipVote() {
  game.registerVote(game.currentPlayerIndex, null);
  game.currentPlayerIndex++;
  showVotePass();
}

// ========== RESULTS ==========
function showResults() {
  showScreen('screen-results');
  updateTexts();

  const results = game.getResults();
  const container = document.getElementById('results-content');

  let html = '';

  // Vote summary
  html += '<div class="vote-summary">';
  html += `<h3>${t('votes')}</h3>`;
  html += '<div class="vote-bars">';

  // Sort by votes
  const sorted = Object.entries(results.voteCounts).sort((a, b) => b[1] - a[1]);
  const maxVoteCount = sorted.length > 0 ? sorted[0][1] : 1;

  sorted.forEach(([name, count]) => {
    const isImp = results.impostorNames.includes(name);
    const pct = maxVoteCount > 0 ? (count / maxVoteCount) * 100 : 0;
    html += `<div class="vote-bar-row">
      <span class="vote-name ${isImp ? 'is-impostor' : ''}">${name}</span>
      <div class="vote-bar-bg"><div class="vote-bar-fill" style="width:${pct}%"></div></div>
      <span class="vote-count">${count}</span>
    </div>`;
  });
  html += '</div></div>';

  // Elimination result
  if (results.isTie) {
    html += `<div class="result-box tie"><p>${t('tie')}</p></div>`;
  } else if (results.eliminated.length > 0) {
    const eliminatedName = results.eliminated[0];
    const wasImpostor = results.impostorNames.includes(eliminatedName);
    html += `<div class="result-box ${wasImpostor ? 'correct' : 'wrong'}">
      <p><strong>${eliminatedName}</strong> - ${t('eliminated')}</p>
    </div>`;
  }

  // Who won
  if (results.normalWin) {
    sfxWin();
    html += `<div class="winner-box normal-win"><h2>${t('normalWin')}</h2></div>`;
  } else {
    sfxLose();
    const winText = results.impostorNames.length > 1 ? t('impostorsWin') : t('impostorWin');
    html += `<div class="winner-box impostor-win"><h2>${winText}</h2></div>`;
  }

  // Reveal impostors
  const impLabel = results.impostorNames.length > 1 ? t('theImpostorsWere') : t('theImpostorWas');
  html += `<div class="reveal-box">`;
  html += `<p>${impLabel}:</p>`;
  html += `<h3>${results.impostorNames.join(', ')}</h3>`;
  html += `</div>`;

  // Reveal footballer
  html += `<div class="reveal-box footballer-reveal">`;
  html += `<p>${t('thePlayerWas')}:</p>`;
  html += `<h3>${results.footballer.nombre}</h3>`;
  html += `<div class="footballer-info">`;
  html += `<span class="badge">${results.footballer.posicion}</span>`;
  html += `<span class="badge">${results.footballer.equipo}</span>`;
  html += `<span class="badge">${results.footballer.nacionalidad}</span>`;
  html += `</div>`;
  html += `</div>`;

  container.innerHTML = html;
}

function playAgain() {
  game.currentPlayerIndex = 0;
  goToNames();
}

// ========== MODE SELECT ==========
function showModeSelect() {
  sfxClick();
  showScreen('screen-mode-select');
  updateTexts();
}

function selectGameMode(mode) {
  sfxClick();
  gameMode = mode;
  if (mode === 'local') {
    openSetup();
  } else {
    showOnlineMenu();
  }
}

// ========== ONLINE MENU ==========
function showOnlineMenu() {
  showScreen('screen-online-menu');
  updateTexts();
}

// ========== CREATE ROOM ==========
let onlineMaxPlayers = 6;
let onlineNumImpostors = 1;
let onlineMode = 'classic';
let onlineIsPublic = false;

function showCreateRoom() {
  onlineMaxPlayers = 6;
  onlineNumImpostors = 1;
  onlineMode = 'classic';
  onlineIsPublic = false;
  showScreen('screen-create-room');
  updateTexts();
  renderOnlineSetup();
  renderVisibilityToggle();
}

function renderOnlineSetup() {
  document.getElementById('online-max-players').textContent = onlineMaxPlayers;
  document.getElementById('online-num-impostors').textContent = onlineNumImpostors;

  document.querySelectorAll('#screen-create-room .mode-btn[data-mode]').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.mode === onlineMode);
  });

  const impostorControls = document.getElementById('online-impostor-controls');
  if (onlineMode === 'chaos') {
    impostorControls.classList.add('disabled');
  } else {
    impostorControls.classList.remove('disabled');
  }
}

function changeOnlineMaxPlayers(delta) {
  onlineMaxPlayers = Math.max(3, Math.min(10, onlineMaxPlayers + delta));
  if (onlineNumImpostors >= onlineMaxPlayers) {
    onlineNumImpostors = onlineMaxPlayers - 1;
  }
  renderOnlineSetup();
}

function changeOnlineNumImpostors(delta) {
  if (onlineMode === 'chaos') return;
  onlineNumImpostors = Math.max(1, Math.min(onlineMaxPlayers - 1, onlineNumImpostors + delta));
  renderOnlineSetup();
}

function selectOnlineMode(mode) {
  onlineMode = mode;
  renderOnlineSetup();
}

function selectRoomVisibility(type) {
  onlineIsPublic = (type === 'public');
  renderVisibilityToggle();
}

function renderVisibilityToggle() {
  document.getElementById('btn-private').classList.toggle('selected', !onlineIsPublic);
  document.getElementById('btn-public').classList.toggle('selected', onlineIsPublic);
}

function createRoom() {
  sfxClick();
  const nameInput = document.getElementById('host-name-input');
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    return;
  }
  socketCreateRoom(name, {
    maxPlayers: onlineMaxPlayers,
    numImpostors: onlineNumImpostors,
    mode: onlineMode
  }, onlineIsPublic);
}

// ========== BROWSE PUBLIC ROOMS ==========
let browseRefreshInterval = null;

function showBrowseRooms() {
  sfxClick();
  showScreen('screen-browse-rooms');
  updateTexts();
  refreshPublicRooms();

  // Auto-refresh every 10 seconds
  if (browseRefreshInterval) clearInterval(browseRefreshInterval);
  browseRefreshInterval = setInterval(() => {
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen && currentScreen.id === 'screen-browse-rooms') {
      refreshPublicRooms();
    } else {
      clearInterval(browseRefreshInterval);
      browseRefreshInterval = null;
    }
  }, 10000);
}

function leaveBrowseRooms() {
  if (browseRefreshInterval) {
    clearInterval(browseRefreshInterval);
    browseRefreshInterval = null;
  }
  socketDisconnect();
  showOnlineMenu();
}

function refreshPublicRooms() {
  const container = document.getElementById('public-room-list');
  container.innerHTML = `<p class="no-rooms-msg loading-msg">...</p>`;

  let responded = false;
  const timeout = setTimeout(() => {
    if (!responded) {
      responded = true;
      container.innerHTML = `<p class="no-rooms-msg">${t('error_connection')}</p>`;
    }
  }, 5000);

  socketListPublicRooms((rooms) => {
    if (responded) return;
    responded = true;
    clearTimeout(timeout);
    renderPublicRoomList(rooms);
  });
}

function renderPublicRoomList(rooms) {
  const container = document.getElementById('public-room-list');
  if (!rooms || rooms.length === 0) {
    container.innerHTML = `<p class="no-rooms-msg">${t('no_public_rooms')}</p>`;
    return;
  }

  let html = '';
  rooms.forEach(room => {
    const modeLabel = t(room.mode);
    html += `<div class="room-card">
      <div class="room-card-info">
        <span class="room-card-host">${escapeHtml(room.hostName)}</span>
        <span class="room-card-details">${room.playerCount}/${room.maxPlayers} ${t('players_count')} · ${modeLabel}</span>
      </div>
      <button class="btn btn-primary btn-join" onclick="joinPublicRoom('${room.code}')">${t('join')}</button>
    </div>`;
  });
  container.innerHTML = html;
}

function joinPublicRoom(code) {
  sfxClick();
  const nameInput = document.getElementById('browse-name-input');
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    return;
  }
  if (browseRefreshInterval) {
    clearInterval(browseRefreshInterval);
    browseRefreshInterval = null;
  }
  socketJoinRoom(code, name);
}

// ========== JOIN ROOM ==========
function showJoinRoom() {
  showScreen('screen-join-room');
  updateTexts();
  document.getElementById('join-error').classList.add('hidden');
}

function joinRoom() {
  sfxClick();
  const codeInput = document.getElementById('join-code-input');
  const nameInput = document.getElementById('join-name-input');
  const code = codeInput.value.trim().toUpperCase();
  const name = nameInput.value.trim();

  if (!code || code.length !== 4) {
    codeInput.focus();
    return;
  }
  if (!name) {
    nameInput.focus();
    return;
  }

  document.getElementById('join-error').classList.add('hidden');
  socketJoinRoom(code, name);
}

// ========== LOBBY ==========
function showLobby() {
  showScreen('screen-lobby');
  updateTexts();
  document.getElementById('lobby-room-code').textContent = onlineRoomCode;
}

let lobbyMaxPlayers = 0;

function updateLobbyPlayers(players, hostName, maxPlayers) {
  // Track maxPlayers if provided
  if (maxPlayers) lobbyMaxPlayers = maxPlayers;

  // If we're on join screen or browse screen, move to lobby
  const currentScreen = document.querySelector('.screen.active');
  if (currentScreen && (currentScreen.id === 'screen-join-room' || currentScreen.id === 'screen-browse-rooms')) {
    // Clear browse refresh interval if coming from browse
    if (browseRefreshInterval) {
      clearInterval(browseRefreshInterval);
      browseRefreshInterval = null;
    }
    showLobby();
  }

  const list = document.getElementById('lobby-player-list');
  list.innerHTML = '';
  players.forEach(name => {
    const div = document.createElement('div');
    div.className = 'lobby-player-badge';
    if (name === hostName) {
      div.classList.add('is-host');
    }
    div.textContent = name;
    if (name === hostName) {
      const crown = document.createElement('span');
      crown.className = 'host-crown';
      crown.textContent = ' HOST';
      div.appendChild(crown);
    }
    list.appendChild(div);
  });

  // Show start button only for host
  const startBtn = document.getElementById('btn-start-online');
  if (isHost) {
    if (players.length >= 3) {
      startBtn.classList.remove('hidden');
    } else {
      startBtn.classList.add('hidden');
    }
  } else {
    startBtn.classList.add('hidden');
  }

  // Update lobby status with player count info
  const status = document.getElementById('lobby-status');
  const remaining = lobbyMaxPlayers - players.length;
  if (remaining > 0) {
    const countText = `${players.length}/${lobbyMaxPlayers} - ${t('players_remaining').replace('{n}', remaining)}`;
    status.textContent = countText;
  } else if (!isHost) {
    status.textContent = t('waiting_host');
  } else {
    status.textContent = '';
  }
}

function startOnlineGame() {
  sfxClick();
  socketStartGame();
}

function leaveLobby() {
  socketDisconnect();
  showOnlineMenu();
}

// ========== ONLINE ROLE ==========
function showOnlineRole(data) {
  clearChat();
  showScreen('screen-online-role');
  updateTexts();

  const roleTitle = document.getElementById('online-role-title');
  const roleInfo = document.getElementById('online-role-info');

  if (data.role === 'impostor') {
    sfxImpostor();
    roleTitle.textContent = t('youAreImpostor');
    roleTitle.className = 'role-title impostor';
    roleInfo.innerHTML = `<p class="impostor-desc">${t('impostorDesc')}</p>`;
  } else {
    sfxNormal();
    roleTitle.textContent = t('youAreNormal');
    roleTitle.className = 'role-title normal';

    let hintsHtml = `<ul class="pistas-list">`;
    data.hints.forEach(h => { hintsHtml += `<li>${h}</li>`; });
    hintsHtml += `</ul>`;

    roleInfo.innerHTML = `
      <p class="footballer-name">${t('yourPlayer')} <strong>${data.footballer}</strong></p>
      <button class="btn btn-secondary btn-hint" onclick="this.nextElementSibling.classList.remove('hidden'); this.remove();">${t('dontKnowHim')}</button>
      <div class="hint-box hidden">${hintsHtml}</div>
    `;
  }
}

function showOnlineEveryoneImpostor(footballer) {
  showScreen('screen-online-results');
  updateTexts();
  const container = document.getElementById('online-results-content');
  container.innerHTML = `
    <div class="everyone-impostor">
      <h2>${t('everyoneImpostor')}</h2>
      <div class="footballer-reveal">
        <p>${t('thePlayerWas')}:</p>
        <h3>${footballer.nombre}</h3>
      </div>
    </div>
  `;
  // Show play again for host
  const btn = document.getElementById('btn-play-again-online');
  if (isHost) btn.classList.remove('hidden');
  else btn.classList.add('hidden');
}

// ========== ONLINE DISCUSSION (Turn-based) ==========
let onlineTurnTimeLeft = 0;
let onlineTurnTimer = null;

function showOnlineDiscussionTurn(data) {
  sfxNextTurn();
  showScreen('screen-online-discussion');
  updateTexts();

  const { currentPlayer, index, total } = data;
  const isMyTurn = currentPlayer === onlinePlayerName;

  // Update counter badge
  document.getElementById('online-turn-counter-badge').textContent =
    t('turn_counter').replace('{current}', index + 1).replace('{total}', total);

  // Update turn indicator
  const title = document.getElementById('online-turn-title');
  const hint = document.getElementById('online-turn-hint');

  if (isMyTurn) {
    title.textContent = t('your_turn');
    title.className = 'turn-active-title my-turn';
    hint.textContent = t('describe_hint');
  } else {
    title.textContent = t('turn_of') + ' ' + currentPlayer;
    title.className = 'turn-active-title other-turn';
    hint.textContent = t('waiting_turn');
  }

  // Show/hide ready button
  const readyBtn = document.getElementById('btn-turn-ready');
  if (isMyTurn) {
    readyBtn.classList.remove('hidden');
  } else {
    readyBtn.classList.add('hidden');
  }

  // Start local countdown timer
  onlineTurnTimeLeft = TURN_DURATION;
  updateOnlineTimerDisplay(onlineTurnTimeLeft);

  if (onlineTurnTimer) clearInterval(onlineTurnTimer);
  onlineTurnTimer = setInterval(() => {
    onlineTurnTimeLeft--;
    updateOnlineTimerDisplay(onlineTurnTimeLeft);
    if (onlineTurnTimeLeft > 0 && onlineTurnTimeLeft <= 5) sfxTick();
    if (onlineTurnTimeLeft <= 0) {
      clearInterval(onlineTurnTimer);
      onlineTurnTimer = null;
    }
  }, 1000);
}

function updateOnlineTimerDisplay(timeLeft) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('online-timer-display').textContent =
    `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function onlineTurnReady() {
  const readyBtn = document.getElementById('btn-turn-ready');
  readyBtn.classList.add('hidden');
  socketNextTurn();
}

function showOnlineDiscussion(time) {
  // Legacy fallback - should not be called anymore, but kept for safety
  showScreen('screen-online-discussion');
  updateTexts();
}

// ========== ONLINE VOTE ==========
let hasVotedOnline = false;

function showOnlineVoteScreen() {
  hasVotedOnline = false;
  showScreen('screen-online-vote');
  updateTexts();

  const container = document.getElementById('online-vote-options');
  container.innerHTML = '';

  onlinePlayerList.forEach(name => {
    if (name === onlinePlayerName) return;
    const btn = document.createElement('button');
    btn.className = 'vote-btn';
    btn.textContent = name;
    btn.onclick = () => onlineCastVote(name);
    container.appendChild(btn);
  });

  document.getElementById('online-vote-status').classList.add('hidden');
}

function onlineCastVote(votedName) {
  if (hasVotedOnline) return;
  sfxVote();
  hasVotedOnline = true;
  socketVote(votedName);

  // Disable all vote buttons
  document.querySelectorAll('#online-vote-options .vote-btn').forEach(btn => {
    btn.disabled = true;
    btn.classList.add('disabled');
    if (btn.textContent === votedName) {
      btn.classList.add('selected-vote');
    }
  });

  document.getElementById('online-vote-status').classList.remove('hidden');
}

function onlineSkipVote() {
  if (hasVotedOnline) return;
  hasVotedOnline = true;
  socketSkipVote();

  document.querySelectorAll('#online-vote-options .vote-btn').forEach(btn => {
    btn.disabled = true;
    btn.classList.add('disabled');
  });

  document.getElementById('online-vote-status').classList.remove('hidden');
}

function updateOnlineVoteStatus(votesCount, totalPlayers) {
  const statusEl = document.getElementById('online-vote-status');
  statusEl.classList.remove('hidden');
  document.getElementById('online-vote-count').textContent =
    `${t('waiting_votes')} (${votesCount}/${totalPlayers})`;
}

// ========== ONLINE RESULTS ==========
function showOnlineResults(results) {
  if (onlineTurnTimer) {
    clearInterval(onlineTurnTimer);
    onlineTurnTimer = null;
  }

  showScreen('screen-online-results');
  updateTexts();

  const container = document.getElementById('online-results-content');
  let html = '';

  // Vote summary
  html += '<div class="vote-summary">';
  html += `<h3>${t('votes')}</h3>`;
  html += '<div class="vote-bars">';

  const sorted = Object.entries(results.voteCounts).sort((a, b) => b[1] - a[1]);
  const maxVoteCount = sorted.length > 0 ? sorted[0][1] : 1;

  sorted.forEach(([name, count]) => {
    const isImp = results.impostorNames.includes(name);
    const pct = maxVoteCount > 0 ? (count / maxVoteCount) * 100 : 0;
    html += `<div class="vote-bar-row">
      <span class="vote-name ${isImp ? 'is-impostor' : ''}">${name}</span>
      <div class="vote-bar-bg"><div class="vote-bar-fill" style="width:${pct}%"></div></div>
      <span class="vote-count">${count}</span>
    </div>`;
  });
  html += '</div></div>';

  // Elimination result
  if (results.isTie) {
    html += `<div class="result-box tie"><p>${t('tie')}</p></div>`;
  } else if (results.eliminated.length > 0) {
    const eliminatedName = results.eliminated[0];
    const wasImpostor = results.impostorNames.includes(eliminatedName);
    html += `<div class="result-box ${wasImpostor ? 'correct' : 'wrong'}">
      <p><strong>${eliminatedName}</strong> - ${t('eliminated')}</p>
    </div>`;
  }

  // Who won
  if (results.normalWin) {
    sfxWin();
    html += `<div class="winner-box normal-win"><h2>${t('normalWin')}</h2></div>`;
  } else {
    sfxLose();
    const winText = results.impostorNames.length > 1 ? t('impostorsWin') : t('impostorWin');
    html += `<div class="winner-box impostor-win"><h2>${winText}</h2></div>`;
  }

  // Reveal impostors
  const impLabel = results.impostorNames.length > 1 ? t('theImpostorsWere') : t('theImpostorWas');
  html += `<div class="reveal-box">`;
  html += `<p>${impLabel}:</p>`;
  html += `<h3>${results.impostorNames.join(', ')}</h3>`;
  html += `</div>`;

  // Reveal footballer
  html += `<div class="reveal-box footballer-reveal">`;
  html += `<p>${t('thePlayerWas')}:</p>`;
  html += `<h3>${results.footballer.nombre}</h3>`;
  html += `<div class="footballer-info">`;
  html += `<span class="badge">${results.footballer.posicion}</span>`;
  html += `<span class="badge">${results.footballer.equipo}</span>`;
  html += `<span class="badge">${results.footballer.nacionalidad}</span>`;
  html += `</div>`;
  html += `</div>`;

  container.innerHTML = html;

  // Show play again for host only
  const btn = document.getElementById('btn-play-again-online');
  if (isHost) btn.classList.remove('hidden');
  else btn.classList.add('hidden');
}

function onlinePlayAgain() {
  socketPlayAgain();
}

function leaveGame() {
  socketDisconnect();
  initHome();
}

// ========== ONLINE CHAT ==========
function sendChatFrom(screen) {
  const input = document.getElementById('chat-input-' + screen);
  const text = input.value.trim();
  if (!text) return;
  if (socket) socket.emit('chat-message', { text });
  input.value = '';
}

function appendChatMessage(name, text) {
  const isMe = name === onlinePlayerName;
  if (!isMe) sfxChat();
  const msgHtml = `<div class="chat-msg ${isMe ? 'chat-msg-me' : ''}"><span class="chat-msg-name">${name}</span><span class="chat-msg-text">${escapeHtml(text)}</span></div>`;

  // Append to all visible chat containers
  ['chat-messages-discussion', 'chat-messages-vote'].forEach(id => {
    const container = document.getElementById(id);
    if (container) {
      container.insertAdjacentHTML('beforeend', msgHtml);
      container.scrollTop = container.scrollHeight;
    }
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function clearChat() {
  ['chat-messages-discussion', 'chat-messages-vote'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });
}

// ========== ONLINE ERROR HANDLING ==========
function handleOnlineError(message) {
  const errorMessages = {
    invalid_code: t('error_invalid_code'),
    room_full: t('error_room_full'),
    name_taken: t('error_name_taken'),
    game_in_progress: t('error_game_in_progress'),
    not_enough_players: t('error_not_enough'),
    connection_error: t('error_connection')
  };

  const errorText = errorMessages[message] || message;

  // Show error on join screen if visible
  const joinError = document.getElementById('join-error');
  if (joinError) {
    joinError.textContent = errorText;
    joinError.classList.remove('hidden');
  }

  // Show error on lobby screen if visible
  const lobbyStatus = document.getElementById('lobby-status');
  if (lobbyStatus) {
    lobbyStatus.textContent = errorText;
    lobbyStatus.style.color = '#e74c3c';
  }
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  // Init audio on first user interaction (autoplay policy)
  // Clicking/tapping the splash triggers intro sound + music
  const startAudio = () => {
    initAudio();
    document.removeEventListener('click', startAudio);
    document.removeEventListener('touchstart', startAudio);
  };
  document.addEventListener('click', startAudio);
  document.addEventListener('touchstart', startAudio);

  // Splash: tap anywhere to skip, or auto-advance after 3s
  let splashDone = false;
  function endSplash() {
    if (splashDone) return;
    splashDone = true;
    document.getElementById('splash-logo').classList.add('fade-out');
    setTimeout(() => {
      initHome();
    }, 600);
  }
  document.getElementById('screen-splash').addEventListener('click', function() {
    startAudio();
    endSplash();
  });
  setTimeout(endSplash, 3000);
});
