"use strict";

const STORAGE_KEY = "hearts-counter";
const LANG_KEY = "hearts-counter-lang";
const THEME_KEY = "hearts-counter-theme";
const MAX_SCORE = 100;

// ── i18n ──────────────────────────────────────────────────────────

var translations = {
  en: {
    title: "Hearts - Counter",
    newGame: "New Game",
    playerSetup: "Player Setup",
    startGame: "Start Game",
    cancel: "Cancel",
    back: "Back",
    game: "Game",
    addRound: "+ Round",
    gameOver: "Game Over!",
    nextGame: "Next Game",
    round: "Round",
    confirmRound: "Confirm Round",
    cancelRound: "Cancel round?",
    cancelRoundMsg: "All entered points will be lost.",
    keepEditing: "Keep editing",
    discard: "Discard",
    quitGame: "Quit game?",
    quitGameMsg: "All game progress will be lost.",
    continueGame: "Continue",
    quitConfirm: "Quit",
    heartsCount: "Hearts count",
    queenOfSpades: "Queen of Spades",
    clear: "Clear",
    noPrevGames: "No previous games",
    gameDetail: "Game Detail",
    player: "Player",
    lost: "lost!",
    remaining: "Remaining:",
    hearts: "hearts",
    jack: "Jack",
    queen: "Queen",
    noCards: "None",
    allCardsDistributed: "All cards distributed",
    manual: "Manual:",
    manualMode: "Manual",
    typePoints: "type points",
    allGames: "All Games",
  },
  cs: {
    title: "Srdce - Po\u010D\xEDtadlo",
    newGame: "Nov\xE1 hra",
    playerSetup: "Nastaven\xED hr\xE1\u010D\u016F",
    startGame: "Za\u010D\xEDt hru",
    cancel: "Zru\u0161it",
    back: "Zp\u011Bt",
    game: "Hra",
    addRound: "+ Kolo",
    gameOver: "Konec hry!",
    nextGame: "Nová hra",
    round: "Kolo",
    confirmRound: "Potvrdit kolo",
    cancelRound: "Zru\u0161it kolo?",
    cancelRoundMsg: "V\u0161echny zadan\xE9 body budou ztraceny.",
    keepEditing: "Pokra\u010Dovat",
    discard: "Zahodit",
    quitGame: "Opustit hru?",
    quitGameMsg: "Celý průběh hry bude ztracen.",
    continueGame: "Pokračovat",
    quitConfirm: "Opustit",
    heartsCount: "Počet srdcí",
    queenOfSpades: "Piková dáma",
    clear: "Smazat",
    noPrevGames: "\u017D\xE1dn\xE9 p\u0159edchoz\xED hry",
    gameDetail: "Detail hry",
    player: "Hr\xE1\u010D",
    lost: "prohr\xE1l!",
    remaining: "Zb\xFDv\xE1:",
    hearts: "srdcí",
    jack: "Kluk",
    queen: "Dáma",
    noCards: "Nic",
    allCardsDistributed: "V\u0161echny karty rozd\xE1ny",
    manual: "Ručně:",
    manualMode: "Ručně",
    typePoints: "zadej body",
    allGames: "Všechny hry",
  },
};

var currentLang = "en";

function detectLang() {
  try {
    var saved = localStorage.getItem(LANG_KEY);
    if (saved && translations[saved]) return saved;
  } catch (_) {}
  if (typeof navigator !== "undefined") {
    var bl = (navigator.language || "").slice(0, 2).toLowerCase();
    if (translations[bl]) return bl;
  }
  return "en";
}

function setLang(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch (_) {}
  if (typeof document !== "undefined") applyStaticTranslations();
}

function t(key) {
  var dict = translations[currentLang] || translations.en;
  return dict[key] || translations.en[key] || key;
}

function applyStaticTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
  document.title = t("title");
}

currentLang = detectLang();

// ── Theme ─────────────────────────────────────────────────────────

var THEME_ICONS = { light: "\u2600\uFE0F", dark: "\uD83C\uDF19", system: "\uD83C\uDF17" };
var THEME_CYCLE = ["system", "light", "dark"];

var currentTheme = "system";

function loadTheme() {
  try {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved && THEME_CYCLE.indexOf(saved) >= 0) currentTheme = saved;
  } catch (_) {}
}

function applyTheme() {
  if (typeof document === "undefined") return;
  var html = document.documentElement;
  if (currentTheme === "dark") {
    html.classList.add("dark");
  } else if (currentTheme === "light") {
    html.classList.remove("dark");
  } else {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }
  var btns = document.querySelectorAll("#theme-toggle, #theme-toggle-setup");
  btns.forEach(function (btn) { if (btn) btn.textContent = THEME_ICONS[currentTheme]; });
}

function systemIsDark() {
  return typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function cycleTheme() {
  if (currentTheme === "system") {
    currentTheme = systemIsDark() ? "light" : "dark";
  } else if (currentTheme === "dark") {
    currentTheme = systemIsDark() ? "dark" : "system";
  } else {
    currentTheme = systemIsDark() ? "system" : "light";
  }
  try { localStorage.setItem(THEME_KEY, currentTheme); } catch (_) {}
  applyTheme();
}

loadTheme();
if (typeof document !== "undefined") {
  applyTheme();
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      if (currentTheme === "system") applyTheme();
    });
  }
}

// ── State ──────────────────────────────────────────────────────────

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return { currentGame: null, gameHistory: [] };
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ── Scoring Engine (exported for tests) ────────────────────────────

function calcRoundScores(entries) {
  var allComboIdx = -1;
  for (var idx = 0; idx < entries.length; idx++) {
    if (entries[idx].allCombo) { allComboIdx = idx; break; }
  }

  var scores = entries.map(function (e) {
    if (e.manual !== null && e.manual !== undefined) return e.manual;

    var jack = e.jack || false;
    var pts = 0;

    if (allComboIdx >= 0) {
      if (e.allCombo) {
        pts = 0;
      } else {
        pts = 26;
      }
    } else {
      pts = (e.hearts || 0) + (e.queen || 0);
    }

    if (jack) pts -= 8;
    if (e.noCards) pts -= 5;
    return pts;
  });
  return scores;
}

function totalScores(game) {
  var totals = game.players.map(function () { return 0; });
  game.rounds.forEach(function (round) {
    var scores = calcRoundScores(round.entries);
    scores.forEach(function (s, i) { totals[i] += s; });
  });
  return totals;
}

function isGameOver(game) {
  var totals = totalScores(game);
  return totals.some(function (t) { return t >= MAX_SCORE; });
}

function isValidManualScore(v) {
  return typeof v === "number" && !isNaN(v) && v >= -8 && v <= 52;
}

function isRoundComplete(entries) {
  var allManual = entries.every(function (e) {
    return e.manual !== null && e.manual !== undefined;
  });
  if (allManual) {
    return entries.every(function (e) { return isValidManualScore(e.manual); });
  }

  var hasManual = entries.some(function (e) {
    return e.manual !== null && e.manual !== undefined;
  });

  var totalHearts = entries.reduce(function (sum, e) { return sum + (e.hearts || 0); }, 0);
  var jackCount = entries.filter(function (e) { return e.jack; }).length;
  var queenCount = entries.filter(function (e) { return e.queen > 0 || e.allCombo; }).length;

  if (hasManual) {
    return jackCount === 1 && queenCount === 1;
  }

  return totalHearts === 13 && jackCount === 1 && queenCount === 1;
}

function maxHeartsForPlayer(entries, playerIdx) {
  var othersTotal = entries.reduce(function (sum, e, i) {
    return i === playerIdx ? sum : sum + (e.hearts || 0);
  }, 0);
  return Math.max(0, 13 - othersTotal);
}

function heartsButtonState(entries, playerIdx) {
  var e = entries[playerIdx];
  var maxH = maxHeartsForPlayer(entries, playerIdx);
  var heartsDisabled = maxH === 0 && e.hearts === 0;
  var active = e.hearts > 0 && !e.allCombo;
  var disabled = heartsDisabled || !!e.allCombo;
  return { active: active, disabled: disabled, count: e.hearts || 0 };
}

function checkAutoAll(entries, playerIdx) {
  var e = entries[playerIdx];
  if (e.hearts === 13 && e.queen > 0) {
    entries.forEach(function (entry) {
      entry.queen = 0;
      entry.allCombo = false;
    });
    e.allCombo = true;
    e.hearts = 13;
    e.queen = 0;
    return true;
  }
  return false;
}

function toggleAllState(entries, playerIdx) {
  var e = entries[playerIdx];
  if (e.allCombo) {
    e.allCombo = false;
    e.hearts = 0;
  } else {
    entries.forEach(function (entry) {
      entry.queen = 0;
      entry.allCombo = false;
    });
    e.allCombo = true;
    e.hearts = 13;
    e.queen = 0;
  }
  e.noCards = false;
  e.manual = null;
}

function toggleManualModeState(entries, currentMode) {
  if (currentMode) {
    entries.forEach(function (e) { e.manual = null; });
    return false;
  } else {
    entries.forEach(function (e) {
      e.hearts = 0;
      e.jack = false;
      e.queen = 0;
      e.allCombo = false;
      e.noCards = false;
      e.manual = null;
    });
    return true;
  }
}

// ── App Controller ─────────────────────────────────────────────────

var app = (function () {
  var state = loadState();
  var currentModal = null;
  var roundState = null; // { manualMode, editIndex, entries: [{hearts,jack,queen,allCombo,manual}] }

  function persist() { saveState(state); }

  // ── Screen Management ──

  function showScreen(name) {
    document.querySelectorAll(".screen").forEach(function (el) {
      el.classList.add("hidden");
    });
    document.getElementById("screen-" + name).classList.remove("hidden");

    if (name === "home") renderHome();
    if (name === "setup") applyTheme();
    if (name === "game") renderGame();
    if (name === "history") {}
  }

  // ── Language Selector ──

  var langFlags = { en: "\uD83C\uDDEC\uD83C\uDDE7", cs: "\uD83C\uDDE8\uD83C\uDDFF" };

  function renderLangSelector() {
    var container = document.getElementById("lang-selector");
    if (!container) return;
    container.innerHTML = Object.keys(translations).map(function (code) {
      var active = code === currentLang ? " ring-2 ring-red-400 rounded" : " opacity-50";
      return '<button onclick="app.switchLang(\'' + code + '\')" class="px-1 cursor-pointer' + active + '">' + langFlags[code] + '</button>';
    }).join("");
  }

  function switchLang(code) {
    setLang(code);
    renderLangSelector();
    renderHome();
  }

  // ── Home Screen ──

  function renderHome() {
    renderLangSelector();
    applyTheme();
    var container = document.getElementById("game-history");
    if (!state.gameHistory.length) {
      container.innerHTML = '<p class="text-gray-400 text-center text-sm">' + t("noPrevGames") + '</p>';
      return;
    }
    var recent = state.gameHistory.slice(-5).reverse();
    container.innerHTML = recent.map(function (g, ri) {
      var idx = state.gameHistory.length - 1 - ri;
      var date = new Date(g.date).toLocaleDateString();
      var maxFinalScore = Math.max.apply(null, g.finalScores);
      var playerNames = g.players.map(function (name, i) {
        var isLoser = g.finalScores[i] === maxFinalScore && maxFinalScore > 0;
        return isLoser
          ? '<span class="text-red-800 dark:text-red-400 font-bold">' + escHtml(name) + '</span>'
          : '<span class="text-gray-400 dark:text-gray-500">' + escHtml(name) + '</span>';
      }).join('<span class="text-gray-300 dark:text-gray-600">, </span>');
      var scores = g.finalScores.join(" / ");
      return '<div class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm cursor-pointer active:bg-gray-50 dark:active:bg-gray-700" onclick="app.viewHistory(' + idx + ')">' +
        '<div class="flex justify-between items-start">' +
        '<div><p class="font-semibold text-sm">' + playerNames + '</p>' +
        '<p class="text-xs text-gray-500">' + date + ' &mdash; ' + scores + '</p></div>' +
        '<button onclick="event.stopPropagation(); app.deleteHistory(' + idx + ')" class="text-red-400 text-xs ml-2">&times;</button>' +
        '</div></div>';
    }).join("");
  }

  function deleteHistory(idx) {
    state.gameHistory.splice(idx, 1);
    persist();
    renderHome();
  }

  function viewHistory(idx) {
    var g = state.gameHistory[idx];
    if (!g) return;
    var container = document.getElementById("history-detail");
    var totals = g.finalScores;
    var maxScore = Math.max.apply(null, totals);

    var header = '<tr class="border-b-2 border-gray-300 dark:border-gray-600">' +
      '<th class="py-2 px-1 text-xs text-gray-500">#</th>' +
      g.players.map(function (name, i) {
        var isMax = totals[i] === maxScore && maxScore > 0;
        var cls = isMax ? "text-red-600 font-bold" : "";
        return '<th class="py-3 px-1 text-lg ' + cls + '" style="max-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">' + escHtml(name) + '</th>';
      }).join("") + '</tr>';

    var rows = "";
    if (g.rounds && g.rounds.length) {
      rows = g.rounds.map(function (round, ri) {
        var scores = calcRoundScores(round.entries);
        return '<tr class="border-b border-gray-100 dark:border-gray-700">' +
          '<td class="py-1 px-1 text-xs text-gray-400">' + (ri + 1) + '</td>' +
          scores.map(function (s) {
            var color = s > 0 ? "text-red-600" : s < 0 ? "text-green-600" : "text-gray-400";
            return '<td class="py-1 px-2 ' + color + '">' + (s > 0 ? "+" + s : s) + '</td>';
          }).join("") + '</tr>';
      }).join("");
    }

    var totalsRow = '<tr class="border-t-2 border-gray-300 dark:border-gray-600 font-bold text-2xl">' +
      '<td class="py-2 text-base">&Sigma;</td>' +
      totals.map(function (t, i) {
        var isMax = t === maxScore && maxScore > 0;
        var cls = isMax ? "text-red-600 font-bold" : "";
        return '<td class="py-2 px-2 ' + cls + '">' + t + '</td>';
      }).join("") + '</tr>';

    var date = new Date(g.date).toLocaleDateString();
    document.getElementById("history-date").textContent = date;

    container.innerHTML =
      '<div class="overflow-x-auto overflow-y-auto max-h-[55vh]"><table class="w-full text-center text-base">' +
      '<thead class="sticky top-0 z-10 bg-gray-100 dark:bg-gray-900">' + header + '</thead>' +
      '<tbody>' + rows + '</tbody>' +
      '<tfoot class="sticky bottom-0 z-10 bg-gray-100 dark:bg-gray-900">' + totalsRow + '</tfoot>' +
      '</table></div>';

    showScreen("history");
  }

  // ── Player Setup ──

  function newGame() {
    var lastPlayers = ["", "", "", ""];
    if (state.gameHistory.length) {
      lastPlayers = state.gameHistory[state.gameHistory.length - 1].players.slice();
    } else if (state.currentGame) {
      lastPlayers = state.currentGame.players.slice();
    }
    renderSetup(lastPlayers);
    showScreen("setup");
  }

  function renderSetup(players) {
    var container = document.getElementById("player-list");
    container.innerHTML = players.map(function (name, i) {
      return '<div class="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm player-row" data-idx="' + i + '">' +
        '<span class="text-gray-400 dark:text-gray-500 cursor-grab select-none text-lg drag-handle px-1" style="touch-action:none;">&#9776;</span>' +
        '<input type="text" value="' + escHtml(name) + '" placeholder="' + t("player") + ' ' + (i + 1) + '" ' +
        'class="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-400" ' +
        'data-player-input="' + i + '">' +
        '</div>';
    }).join("");
    initDragAndDrop(container);
  }

  function initDragAndDrop(container) {
    if (container._dragInit) return;
    container._dragInit = true;
    var dragEl = null;
    var placeholder = null;
    var startY = 0;
    var startTop = 0;
    var rows = null;

    function getY(e) {
      return e.touches ? e.touches[0].clientY : e.clientY;
    }

    function onStart(e) {
      var handle = e.target.closest('.drag-handle');
      if (!handle) return;
      dragEl = handle.closest('.player-row');
      if (!dragEl) return;
      e.preventDefault();
      rows = Array.from(container.querySelectorAll('.player-row'));
      startY = getY(e);
      var rect = dragEl.getBoundingClientRect();
      startTop = rect.top;

      placeholder = document.createElement('div');
      placeholder.style.height = rect.height + 'px';
      placeholder.className = 'border-2 border-dashed border-red-300 rounded-xl my-1';
      dragEl.parentNode.insertBefore(placeholder, dragEl);

      dragEl.style.position = 'fixed';
      dragEl.style.left = rect.left + 'px';
      dragEl.style.top = rect.top + 'px';
      dragEl.style.width = rect.width + 'px';
      dragEl.style.zIndex = '100';
      dragEl.style.opacity = '0.9';
      dragEl.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
      dragEl.style.transition = 'none';
    }

    function onMove(e) {
      if (!dragEl) return;
      e.preventDefault();
      var y = getY(e);
      var dy = y - startY;
      dragEl.style.top = (startTop + dy) + 'px';

      var midY = startTop + dy + dragEl.offsetHeight / 2;
      var siblings = Array.from(container.querySelectorAll('.player-row'));
      for (var s = 0; s < siblings.length; s++) {
        if (siblings[s] === dragEl) continue;
        var r = siblings[s].getBoundingClientRect();
        var sibMid = r.top + r.height / 2;
        if (midY < sibMid) {
          container.insertBefore(placeholder, siblings[s]);
          return;
        }
      }
      container.appendChild(placeholder);
    }

    function onEnd() {
      if (!dragEl) return;
      dragEl.style.position = '';
      dragEl.style.left = '';
      dragEl.style.top = '';
      dragEl.style.width = '';
      dragEl.style.zIndex = '';
      dragEl.style.opacity = '';
      dragEl.style.boxShadow = '';
      dragEl.style.transition = '';
      container.insertBefore(dragEl, placeholder);
      placeholder.remove();

      var inputs = container.querySelectorAll('[data-player-input]');
      var names = Array.from(inputs).map(function (el) { return el.value; });
      dragEl = null;
      placeholder = null;
      renderSetup(names);
    }

    container.addEventListener('mousedown', onStart);
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseup', onEnd);
    container.addEventListener('touchstart', onStart, { passive: false });
    container.addEventListener('touchmove', onMove, { passive: false });
    container.addEventListener('touchend', onEnd);
  }

  function startGame() {
    var inputs = document.querySelectorAll("[data-player-input]");
    var names = Array.from(inputs).map(function (el) { return el.value.trim(); });
    for (var i = 0; i < names.length; i++) {
      if (!names[i]) names[i] = t("player") + " " + (i + 1);
    }
    state.currentGame = { players: names, rounds: [], status: "active" };
    persist();
    showScreen("game");
  }

  // ── Game Board ──

  function renderGame() {
    var game = state.currentGame;
    if (!game) { showScreen("home"); return; }

    var totals = totalScores(game);
    var maxScore = Math.max.apply(null, totals);
    var gameOver = isGameOver(game);

    // Header
    var header = document.getElementById("player-header");
    header.innerHTML = '<th class="py-2 px-1 text-xs text-gray-500">#</th>' +
      game.players.map(function (name, i) {
        var isMax = totals[i] === maxScore && maxScore > 0;
        var cls = isMax ? "text-red-600 font-bold" : "";
        return '<th class="py-3 px-1 text-lg ' + cls + '" style="max-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">' + escHtml(name) + '</th>';
      }).join("");

    // Rounds
    var body = document.getElementById("rounds-body");
    body.innerHTML = game.rounds.map(function (round, ri) {
      var scores = calcRoundScores(round.entries);
      return '<tr class="border-b border-gray-100 dark:border-gray-700 cursor-pointer active:bg-gray-50 dark:active:bg-gray-700" onclick="app.editRound(' + ri + ')">' +
        '<td class="py-1 px-1 text-xs text-gray-400">' + (ri + 1) + '</td>' +
        scores.map(function (s) {
          var color = s > 0 ? "text-red-500" : s < 0 ? "text-green-600" : "text-gray-400";
          return '<td class="py-1 px-2 ' + color + '">' + (s > 0 ? "+" + s : s) + '</td>';
        }).join("") +
        '</tr>';
    }).join("");

    // Totals
    var totalsRow = document.getElementById("totals-row");
    totalsRow.innerHTML = '<td class="py-2">&Sigma;</td>' +
      totals.map(function (t, i) {
        var isMax = t === maxScore && maxScore > 0;
        var cls = isMax ? "text-red-600 font-bold" : "";
        var lost = t >= MAX_SCORE ? " bg-red-50 dark:bg-red-900/30" : "";
        return '<td class="py-2 px-2 ' + cls + lost + '">' + t + '</td>';
      }).join("");

    // Game over
    var banner = document.getElementById("game-over-banner");
    var btn = document.getElementById("btn-new-round");
    if (gameOver) {
      banner.classList.remove("hidden");
      btn.classList.add("hidden");
      var loser = game.players[totals.indexOf(Math.max.apply(null, totals))];
      document.getElementById("game-over-text").textContent = loser + " " + t("lost");
    } else {
      banner.classList.add("hidden");
      btn.classList.remove("hidden");
    }
  }

  function finishGame() {
    var game = state.currentGame;
    var prevPlayers = game.players.slice();
    state.gameHistory.push({
      date: new Date().toISOString(),
      players: prevPlayers,
      finalScores: totalScores(game),
      rounds: game.rounds.slice(),
    });
    if (state.gameHistory.length > 5) state.gameHistory = state.gameHistory.slice(-5);
    state.currentGame = null;
    persist();
    renderSetup(prevPlayers);
    showScreen("setup");
  }

  // ── Round Entry ──

  function newRound() {
    var game = state.currentGame;
    roundState = {
      editIndex: -1,
      manualMode: false,
      entries: game.players.map(function () {
        return { hearts: 0, jack: false, queen: 0, allCombo: false, noCards: false, manual: null };
      }),
    };
    renderRound();
    showScreen("round");
  }

  function editRound(idx) {
    var game = state.currentGame;
    var round = game.rounds[idx];
    var entries = round.entries.map(function (e) {
      return { hearts: e.hearts, jack: e.jack, queen: e.queen, allCombo: e.allCombo, noCards: e.noCards || false, manual: e.manual };
    });
    roundState = {
      editIndex: idx,
      manualMode: entries.some(function (e) { return e.manual !== null && e.manual !== undefined; }),
      entries: entries,
    };
    renderRound();
    showScreen("round");
  }

  function renderRound() {
    var game = state.currentGame;
    var container = document.getElementById("round-players");
    var roundNum = roundState.editIndex >= 0
      ? roundState.editIndex + 1
      : game.rounds.length + 1;
    document.getElementById("round-title").textContent = t("round") + " " + roundNum;

    var jackTaken = -1;
    var queenTaken = -1;
    roundState.entries.forEach(function (e, i) {
      if (e.jack) jackTaken = i;
      if (e.queen > 0) queenTaken = i;
      if (e.allCombo) queenTaken = i;
    });

    var confirmBtn = document.getElementById("btn-confirm-round");
    confirmBtn.disabled = !isRoundComplete(roundState.entries);

    var manualBtn = document.getElementById("btn-manual-mode");
    if (manualBtn) {
      if (roundState.manualMode) {
        manualBtn.className = "text-sm py-1 px-2 rounded-lg font-semibold bg-blue-100 text-blue-700 ring-2 ring-blue-400";
      } else {
        manualBtn.className = "text-gray-500 text-sm py-1";
      }
    }

    var remainEl = document.getElementById("round-remaining");
    if (roundState.manualMode) {
      remainEl.innerHTML = "";
    } else {
      var totalHearts = roundState.entries.reduce(function (s, e) { return s + (e.hearts || 0); }, 0);
      var hasJack = roundState.entries.some(function (e) { return e.jack; });
      var hasQueen = roundState.entries.some(function (e) { return e.queen > 0 || e.allCombo; });
      var remainParts = [];
      var remainingH = 13 - totalHearts;
      if (remainingH > 0) remainParts.push("&#9829; " + remainingH + " " + t("hearts"));
      if (!hasQueen) remainParts.push("&#9824; " + t("queen"));
      if (!hasJack) remainParts.push("&#9830; " + t("jack"));
      if (remainParts.length > 0) {
        remainEl.innerHTML = t("remaining") + " " + remainParts.join(" &middot; ");
      } else {
        remainEl.innerHTML = '<span class="text-green-600 font-semibold">' + t("allCardsDistributed") + '</span>';
      }
    }

    var allScores = calcRoundScores(roundState.entries);
    container.innerHTML = game.players.map(function (name, i) {
      var e = roundState.entries[i];
      var isManual = e.manual !== null && e.manual !== undefined;
      var score = isManual ? e.manual : allScores[i];
      var scoreColor = score > 0 ? "text-red-600" : score < 0 ? "text-green-600" : "text-gray-500";

      if (roundState.manualMode) {
        var manualVal = isManual ? e.manual : "";
        var invalid = isManual && !isValidManualScore(e.manual);
        var inputRing = invalid
          ? "border-red-400 dark:border-red-500 ring-2 ring-red-400"
          : "border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-300";
        return '<div class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">' +
          '<div class="flex items-center justify-between">' +
          '<span class="font-semibold text-base min-w-0 truncate mr-2">' + escHtml(name) + '</span>' +
          '<div class="flex items-center gap-1">' +
          '<input type="number" inputmode="numeric" value="' + manualVal + '" ' +
          'onchange="app.setManual(' + i + ', this.value)" ' +
          'class="w-20 border ' + inputRing + ' dark:bg-gray-700 dark:text-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none" ' +
          'placeholder="' + t("typePoints") + '">' +
          (isManual ? '<button onclick="app.clearManual(' + i + ')" class="text-red-400 text-xs">&times;</button>' : '') +
          '</div>' +
          '</div>' +
          '</div>';
      }

      var hasNoCards = e.noCards;
      var jackDisabled = hasNoCards || (jackTaken >= 0 && jackTaken !== i);
      var queenDisabled = hasNoCards || e.allCombo || (queenTaken >= 0 && queenTaken !== i);

      var DISABLED_BTN = "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed";

      var hState = heartsButtonState(roundState.entries, i);
      var heartsLabel = hState.active
        ? '<span class="text-3xl leading-none">&#9829;</span><span class="text-xs mt-0.5">' + hState.count + '</span>'
        : '<span class="text-3xl leading-none">&#9829;</span>';
      var heartsCls = (hState.disabled || hasNoCards) ? DISABLED_BTN
        : hState.active ? "bg-red-500 text-white ring-2 ring-red-400"
        : "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300";

      var jackLabel = e.jack
        ? '<span class="text-3xl leading-none">&#9830;</span><span class="text-xs mt-0.5">-8</span>'
        : '<span class="text-3xl leading-none">&#9830;</span>';
      var jackCls = jackDisabled ? DISABLED_BTN
        : e.jack ? "bg-red-500 text-white ring-2 ring-red-400"
        : "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300";

      var queenLabel = e.queen > 0
        ? '<span class="text-3xl leading-none">&#9824;</span><span class="text-xs mt-0.5">+' + e.queen + '</span>'
        : '<span class="text-3xl leading-none">&#9824;</span>';
      var queenCls = ((queenDisabled && !e.queen) || e.allCombo) ? DISABLED_BTN
        : e.queen > 0 ? "bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 ring-2 ring-slate-500"
        : "bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-100";

      var noCardsHasOtherCards = e.hearts > 0 || e.jack || e.queen > 0 || e.allCombo;
      var noCardsCls = (!hasNoCards && noCardsHasOtherCards) ? DISABLED_BTN
        : hasNoCards ? "bg-green-500 text-white ring-2 ring-green-400"
        : "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300";

      var anyHeartsOrQueen = roundState.entries.some(function (entry) {
        return (entry.hearts > 0 && !entry.allCombo) || entry.queen > 0;
      });
      var allDisabled = hasNoCards || (!e.allCombo && (anyHeartsOrQueen || (queenTaken >= 0 && queenTaken !== i)));

      var allLabel = '<span class="text-2xl leading-none font-black">ALL</span>';
      var allCls = allDisabled ? DISABLED_BTN
        : e.allCombo ? "bg-red-900 text-white ring-2 ring-red-700"
        : "bg-red-900/20 dark:bg-red-950 text-red-900 dark:text-red-300";

      var roundComplete = isRoundComplete(roundState.entries);
      var scoreDisplay = '<span class="text-lg font-bold ' + scoreColor + '">' + (score > 0 ? "+" + score : score) + '</span>';

      return '<div class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">' +
        '<div class="flex items-center justify-between mb-2">' +
        '<span class="font-semibold text-2xl min-w-0 truncate mr-2">' + escHtml(name) + '</span>' +
        scoreDisplay +
        '</div>' +
        '<div class="flex gap-2">' +
        '<button onclick="app.openHearts(' + i + ')"' + ((hState.disabled || hasNoCards) ? ' disabled' : '') + ' class="flex-1 aspect-square rounded-lg flex flex-col items-center justify-center font-bold ' + heartsCls + '">' + heartsLabel + '</button>' +
        '<button onclick="app.openQueen(' + i + ')"' + (queenDisabled ? ' disabled' : '') + ' class="flex-1 aspect-square rounded-lg flex flex-col items-center justify-center font-bold ' + queenCls + '">' + queenLabel + '</button>' +
        '<button onclick="app.toggleJack(' + i + ')"' + (jackDisabled ? ' disabled' : '') + ' class="flex-1 aspect-square rounded-lg flex flex-col items-center justify-center font-bold ' + jackCls + '">' + jackLabel + '</button>' +
        '<button onclick="app.toggleNoCards(' + i + ')"' + ((!hasNoCards && noCardsHasOtherCards) ? ' disabled' : '') + ' class="flex-1 aspect-square rounded-lg flex flex-col items-center justify-center font-bold ' + noCardsCls + '"><span class="text-3xl leading-none">&#8709;</span></button>' +
        '<button onclick="app.toggleAll(' + i + ')"' + (allDisabled ? ' disabled' : '') + ' class="flex-1 aspect-square rounded-lg flex flex-col items-center justify-center font-bold ' + allCls + '">' + allLabel + '</button>' +
        '</div>' +
        '</div>';
    }).join("");
  }

  // Heart picker
  function openHearts(playerIdx) {
    currentModal = { type: "hearts", playerIdx: playerIdx };
    var maxH = maxHeartsForPlayer(roundState.entries, playerIdx);
    var grid = document.getElementById("hearts-picker-grid");
    grid.innerHTML = "";
    for (var n = 1; n <= 13; n++) {
      var selected = roundState.entries[playerIdx].hearts === n;
      var disabled = n > maxH;
      var cls = selected ? "bg-red-500 text-white"
        : disabled ? "bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-500 cursor-not-allowed"
        : "bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300";
      grid.innerHTML += '<button onclick="app.pickHearts(' + n + ')"' + (disabled ? ' disabled' : '') + ' class="py-3 rounded-lg text-base font-bold ' + cls + '">' + n + '</button>';
    }
    document.getElementById("modal-hearts").classList.remove("hidden");
  }

  function pickHearts(n) {
    var i = currentModal.playerIdx;
    roundState.entries[i].hearts = n;
    roundState.entries[i].manual = null;
    roundState.entries[i].allCombo = false;
    checkAutoAll(roundState.entries, i);
    closeAllModals();
    renderRound();
  }

  function clearHearts() {
    var i = currentModal.playerIdx;
    roundState.entries[i].hearts = 0;
    closeAllModals();
    renderRound();
  }

  // Queen picker
  function openQueen(playerIdx) {
    currentModal = { type: "queen", playerIdx: playerIdx };
    document.getElementById("modal-queen").classList.remove("hidden");
  }

  function pickQueen(val) {
    var i = currentModal.playerIdx;
    roundState.entries[i].queen = val;
    roundState.entries[i].manual = null;
    roundState.entries[i].allCombo = false;
    checkAutoAll(roundState.entries, i);
    closeAllModals();
    renderRound();
  }

  function clearQueen() {
    var i = currentModal.playerIdx;
    roundState.entries[i].queen = 0;
    closeAllModals();
    renderRound();
  }

  // Jack toggle
  function toggleJack(playerIdx) {
    var e = roundState.entries[playerIdx];
    e.jack = !e.jack;
    e.manual = null;
    renderRound();
  }

  // All combo toggle
  function toggleAll(playerIdx) {
    toggleAllState(roundState.entries, playerIdx);
    renderRound();
  }

  function toggleNoCards(playerIdx) {
    var e = roundState.entries[playerIdx];
    if (e.noCards) {
      e.noCards = false;
    } else {
      e.hearts = 0;
      e.jack = false;
      e.queen = 0;
      e.allCombo = false;
      e.noCards = true;
      e.manual = null;
    }
    renderRound();
  }

  // Manual entry
  function toggleManualMode() {
    roundState.manualMode = toggleManualModeState(roundState.entries, roundState.manualMode);
    renderRound();
  }

  function setManual(playerIdx, val) {
    var trimmed = (val + "").trim();
    if (trimmed === "") {
      roundState.entries[playerIdx].manual = null;
    } else {
      var n = parseInt(trimmed, 10);
      roundState.entries[playerIdx].manual = isNaN(n) ? trimmed : n;
    }
    renderRound();
  }

  function clearManual(playerIdx) {
    roundState.entries[playerIdx].manual = null;
    renderRound();
  }

  // Confirm round
  function confirmRound() {
    var game = state.currentGame;
    var roundData = {
      entries: roundState.entries.map(function (e) {
        return {
          hearts: e.hearts,
          jack: e.jack,
          queen: e.queen,
          allCombo: e.allCombo,
          noCards: e.noCards || false,
          manual: (e.manual !== null && e.manual !== undefined) ? e.manual : null,
        };
      }),
    };
    if (roundState.editIndex >= 0) {
      game.rounds[roundState.editIndex] = roundData;
    } else {
      game.rounds.push(roundData);
    }
    persist();
    showScreen("game");
  }

  function cancelRound() {
    document.getElementById("modal-cancel").classList.remove("hidden");
  }

  function confirmCancel() {
    document.getElementById("modal-cancel").classList.add("hidden");
    roundState = null;
    showScreen("game");
  }

  function closeCancelModal() {
    document.getElementById("modal-cancel").classList.add("hidden");
  }

  function quitGame() {
    document.getElementById("modal-quit").classList.remove("hidden");
  }

  function confirmQuit() {
    document.getElementById("modal-quit").classList.add("hidden");
    var game = state.currentGame;
    if (game && isGameOver(game)) {
      state.gameHistory.push({
        date: new Date().toISOString(),
        players: game.players.slice(),
        finalScores: totalScores(game),
        rounds: game.rounds.slice(),
      });
      if (state.gameHistory.length > 5) state.gameHistory = state.gameHistory.slice(-5);
    }
    state.currentGame = null;
    persist();
    showScreen("home");
  }

  function closeQuitModal() {
    document.getElementById("modal-quit").classList.add("hidden");
  }

  // Modals
  function closeModal(event) {
    closeAllModals();
  }

  function closeAllModals() {
    document.getElementById("modal-hearts").classList.add("hidden");
    document.getElementById("modal-queen").classList.add("hidden");
    currentModal = null;
  }

  // ── Utility ──

  function escHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  // ── Init ──

  function init() {
    applyStaticTranslations();
    if (state.currentGame && state.currentGame.status === "active") {
      showScreen("game");
    } else {
      showScreen("home");
    }
  }

  if (typeof document !== "undefined") init();

  return {
    showScreen: showScreen,
    newGame: newGame,
    startGame: startGame,
    newRound: newRound,
    editRound: editRound,
    confirmRound: confirmRound,
    cancelRound: cancelRound,
    confirmCancel: confirmCancel,
    closeCancelModal: closeCancelModal,
    quitGame: quitGame,
    confirmQuit: confirmQuit,
    closeQuitModal: closeQuitModal,
    finishGame: finishGame,
    openHearts: openHearts,
    pickHearts: pickHearts,
    clearHearts: clearHearts,
    openQueen: openQueen,
    pickQueen: pickQueen,
    clearQueen: clearQueen,
    toggleJack: toggleJack,
    toggleAll: toggleAll,
    toggleNoCards: toggleNoCards,
    toggleManualMode: toggleManualMode,
    setManual: setManual,
    clearManual: clearManual,
    closeModal: closeModal,
    deleteHistory: deleteHistory,
    viewHistory: viewHistory,
    switchLang: switchLang,
    cycleTheme: cycleTheme,
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { calcRoundScores: calcRoundScores, totalScores: totalScores, isGameOver: isGameOver, isRoundComplete: isRoundComplete, isValidManualScore: isValidManualScore, maxHeartsForPlayer: maxHeartsForPlayer, heartsButtonState: heartsButtonState, checkAutoAll: checkAutoAll, toggleAllState: toggleAllState, toggleManualModeState: toggleManualModeState };
}
