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

// ========== HOME SCREEN ==========
function initHome() {
  showScreen('screen-home');
  updateTexts();
}

// ========== SETTINGS SCREEN ==========
function openSettings() {
  showScreen('screen-settings');
  // Highlight current language
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.lang === getLang());
  });
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

  document.querySelectorAll('.mode-btn').forEach(btn => {
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
  document.getElementById('btn-reveal-role').classList.add('hidden');
  const content = document.getElementById('role-reveal-content');
  content.classList.remove('hidden');

  const idx = game.currentPlayerIndex;
  const isImp = game.isImpostor(idx);

  const roleTitle = document.getElementById('role-title');
  const roleInfo = document.getElementById('role-info');

  if (isImp) {
    roleTitle.textContent = t('youAreImpostor');
    roleTitle.className = 'role-title impostor';
    roleInfo.innerHTML = `<p class="impostor-desc">${t('impostorDesc')}</p>`;
  } else {
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
  game.currentPlayerIndex++;
  showRolePass();
}

// ========== DISCUSSION ==========
let discussionTimer = null;
let timeLeft = 0;

function startDiscussion() {
  showScreen('screen-discussion');
  updateTexts();

  timeLeft = game.discussionTime;
  updateTimerDisplay();

  if (discussionTimer) clearInterval(discussionTimer);
  discussionTimer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(discussionTimer);
      goToVoting();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timer-display').textContent =
    `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function goToVoting() {
  if (discussionTimer) clearInterval(discussionTimer);

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
    html += `<div class="winner-box normal-win"><h2>${t('normalWin')}</h2></div>`;
  } else {
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

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  // Show splash for 2.5 seconds, then fade out and go to home
  setTimeout(() => {
    document.getElementById('splash-logo').classList.add('fade-out');
    setTimeout(() => {
      initHome();
    }, 600);
  }, 2500);
});
