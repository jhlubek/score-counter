// Game logic unit tests for hearts-counter scoring engine.
// Run with: node tests/game_logic_test.js

const { calcRoundScores, totalScores, isGameOver, isRoundComplete, isValidManualScore, maxHeartsForPlayer, heartsButtonState, checkAutoAll, toggleAllState, toggleManualModeState } = require("../app.js");

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (!condition) {
    console.error("FAIL:", msg);
    failed++;
  } else {
    passed++;
  }
}

function assertEq(actual, expected, msg) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    console.error("FAIL:", msg, "- got", JSON.stringify(actual), "expected", JSON.stringify(expected));
    failed++;
  } else {
    passed++;
  }
}

// ── Basic Scoring ──

(function testHeartsOnly() {
  var entries = [
    { hearts: 5, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 3, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 4, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 1, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assertEq(calcRoundScores(entries), [5, 3, 4, 1], "hearts only scoring");
})();

(function testJackOnly() {
  var entries = [
    { hearts: 0, jack: true, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assertEq(calcRoundScores(entries), [-8, 0, 0, 0], "jack gives -8");
})();

(function testQueenBasic() {
  var entries = [
    { hearts: 0, jack: false, queen: 13, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assertEq(calcRoundScores(entries), [13, 0, 0, 0], "queen 13 pts");
})();

(function testQueen26() {
  var entries = [
    { hearts: 0, jack: false, queen: 26, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assertEq(calcRoundScores(entries), [26, 0, 0, 0], "queen 26 pts (last round or shown)");
})();

(function testQueen39() {
  var entries = [
    { hearts: 0, jack: false, queen: 39, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assertEq(calcRoundScores(entries), [39, 0, 0, 0], "queen 39 pts (both modifiers)");
})();

(function testMixedScoring() {
  var entries = [
    { hearts: 5, jack: false, queen: 13, allCombo: false, manual: null },
    { hearts: 3, jack: true, queen: 0, allCombo: false, manual: null },
    { hearts: 4, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 1, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assertEq(calcRoundScores(entries), [18, -5, 4, 1], "mixed hearts + queen + jack");
})();

// ── All Combo ──

(function testAllCombo() {
  var entries = [
    { hearts: 13, jack: false, queen: 0, allCombo: true, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assertEq(calcRoundScores(entries), [0, 26, 26, 26], "all combo gives +26 to others");
})();

(function testAllComboWithJackSamePlayer() {
  var entries = [
    { hearts: 13, jack: true, queen: 0, allCombo: true, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assertEq(calcRoundScores(entries), [-8, 26, 26, 26], "all combo + jack on same player: -8 for jack, +26 to others");
})();

(function testAllComboWithJackOtherPlayer() {
  var entries = [
    { hearts: 13, jack: false, queen: 0, allCombo: true, manual: null },
    { hearts: 0, jack: true, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assertEq(calcRoundScores(entries), [0, 18, 26, 26], "all combo player 0, jack player gets +26-8=18");
})();

// ── Manual Entry ──

(function testManualOverride() {
  var entries = [
    { hearts: 5, jack: true, queen: 13, allCombo: false, manual: 7 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: -3 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assertEq(calcRoundScores(entries), [7, 0, -3, 0], "manual entry overrides buttons");
})();

(function testManualZero() {
  var entries = [
    { hearts: 5, jack: false, queen: 0, allCombo: false, manual: 0 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assertEq(calcRoundScores(entries), [0, 0, 0, 0], "manual 0 overrides hearts");
})();

// ── Total Scores ──

(function testTotalScores() {
  var game = {
    players: ["A", "B", "C", "D"],
    rounds: [
      { entries: [
        { hearts: 5, jack: false, queen: 0, allCombo: false, manual: null },
        { hearts: 3, jack: false, queen: 0, allCombo: false, manual: null },
        { hearts: 4, jack: false, queen: 0, allCombo: false, manual: null },
        { hearts: 1, jack: false, queen: 0, allCombo: false, manual: null },
      ]},
      { entries: [
        { hearts: 0, jack: true, queen: 0, allCombo: false, manual: null },
        { hearts: 0, jack: false, queen: 13, allCombo: false, manual: null },
        { hearts: 7, jack: false, queen: 0, allCombo: false, manual: null },
        { hearts: 6, jack: false, queen: 0, allCombo: false, manual: null },
      ]},
    ],
  };
  assertEq(totalScores(game), [-3, 16, 11, 7], "total scores across rounds");
})();

// ── Game Over ──

(function testGameOverReached() {
  var game = {
    players: ["A", "B", "C", "D"],
    rounds: [
      { entries: [
        { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 99 },
        { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 0 },
        { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 0 },
        { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 0 },
      ]},
      { entries: [
        { hearts: 1, jack: false, queen: 0, allCombo: false, manual: null },
        { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
        { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
        { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
      ]},
    ],
  };
  assert(isGameOver(game), "game should be over at 100");
})();

(function testGameNotOver() {
  var game = {
    players: ["A", "B", "C", "D"],
    rounds: [
      { entries: [
        { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 99 },
        { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 0 },
        { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 0 },
        { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 0 },
      ]},
    ],
  };
  assert(!isGameOver(game), "game should not be over at 99");
})();

(function testGameOverExactly100() {
  var game = {
    players: ["A", "B", "C", "D"],
    rounds: [
      { entries: [
        { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 100 },
        { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 0 },
        { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 0 },
        { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 0 },
      ]},
    ],
  };
  assert(isGameOver(game), "game over at exactly 100");
})();

// ── Round Complete Validation ──

(function testEmptyRoundNotComplete() {
  var entries = [
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assert(!isRoundComplete(entries), "empty round is not complete");
})();

(function testCompleteButtonRound() {
  var entries = [
    { hearts: 5, jack: false, queen: 13, allCombo: false, manual: null },
    { hearts: 3, jack: true, queen: 0, allCombo: false, manual: null },
    { hearts: 4, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 1, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assert(isRoundComplete(entries), "valid button round (13 hearts + jack + queen) is complete");
})();

(function testIncompleteHearts() {
  var entries = [
    { hearts: 5, jack: true, queen: 13, allCombo: false, manual: null },
    { hearts: 3, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assert(!isRoundComplete(entries), "only 8 hearts distributed - not complete");
})();

(function testMissingJack() {
  var entries = [
    { hearts: 5, jack: false, queen: 13, allCombo: false, manual: null },
    { hearts: 3, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 4, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 1, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assert(!isRoundComplete(entries), "missing jack - not complete");
})();

(function testMissingQueen() {
  var entries = [
    { hearts: 5, jack: true, queen: 0, allCombo: false, manual: null },
    { hearts: 3, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 4, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 1, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assert(!isRoundComplete(entries), "missing queen - not complete");
})();

(function testAllComboRoundComplete() {
  var entries = [
    { hearts: 13, jack: false, queen: 0, allCombo: true, manual: null },
    { hearts: 0, jack: true, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assert(isRoundComplete(entries), "allCombo + jack is complete");
})();

(function testAllComboWithoutJack() {
  var entries = [
    { hearts: 13, jack: false, queen: 0, allCombo: true, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assert(!isRoundComplete(entries), "allCombo without jack - not complete");
})();

(function testAllManualComplete() {
  var entries = [
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 10 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 5 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: -3 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 0 },
  ];
  assert(isRoundComplete(entries), "all manual entries is complete");
})();

(function testPartialManualNotComplete() {
  var entries = [
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 10 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assert(!isRoundComplete(entries), "partial manual with empty button players - not complete");
})();

(function testManualPlusButtonsComplete() {
  var entries = [
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 13 },
    { hearts: 0, jack: true, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 13, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assert(isRoundComplete(entries), "manual 13 covers hearts, jack+queen assigned to others = complete");
})();

(function testManualPlusButtonsMissingJack() {
  var entries = [
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 13 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 13, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assert(!isRoundComplete(entries), "manual covers hearts but jack missing = not complete");
})();

(function testTwoManualsOneButtonComplete() {
  var entries = [
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 5 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 3 },
    { hearts: 0, jack: true, queen: 13, allCombo: false, manual: null },
    { hearts: 13, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assert(isRoundComplete(entries), "two manual + button players with all cards = complete");
})();

// ── Max Hearts For Player ──

(function testMaxHeartsNoOthersTaken() {
  var entries = [
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assertEq(maxHeartsForPlayer(entries, 0), 13, "all 13 available when no one else took any");
})();

(function testMaxHeartsOthersTookSome() {
  var entries = [
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 5, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 3, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assertEq(maxHeartsForPlayer(entries, 0), 5, "13 - 5 - 3 = 5 remaining for player 0");
})();

(function testMaxHeartsOwnNotSubtracted() {
  var entries = [
    { hearts: 4, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 5, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 3, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assertEq(maxHeartsForPlayer(entries, 0), 5, "own hearts excluded from others sum: 13 - 5 - 3 = 5");
})();

(function testMaxHeartsAllTakenByOthers() {
  var entries = [
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 7, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 4, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 2, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  assertEq(maxHeartsForPlayer(entries, 0), 0, "no hearts remaining");
})();

// ── Hearts Button State ──

(function testHeartsActiveNormally() {
  var entries = [
    { hearts: 5, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 3, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 5, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  var state = heartsButtonState(entries, 0);
  assert(state.active === true, "hearts button active when player has hearts");
  assert(state.disabled === false, "hearts button not disabled when player has hearts");
  assert(state.count === 5, "hearts count is 5");
})();

(function testHeartsNotActiveWithAllCombo() {
  var entries = [
    { hearts: 13, jack: false, queen: 0, allCombo: true, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  var state = heartsButtonState(entries, 0);
  assert(state.active === false, "hearts button NOT active when allCombo is true");
  assert(state.disabled === true, "hearts button disabled when allCombo is true");
})();

(function testHeartsDisabledWhenAllTakenByOthers() {
  var entries = [
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 7, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 4, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 2, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  var state = heartsButtonState(entries, 0);
  assert(state.active === false, "hearts button not active with 0 hearts");
  assert(state.disabled === true, "hearts button disabled when all 13 taken by others");
})();

(function testHeartsNotDisabledForOtherPlayersWhenAllCombo() {
  var entries = [
    { hearts: 13, jack: false, queen: 0, allCombo: true, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  var state = heartsButtonState(entries, 1);
  assert(state.active === false, "other player hearts not active (0 hearts)");
  assert(state.disabled === true, "other player hearts disabled (all 13 taken by allCombo)");
})();

// ── Auto ALL Conversion ──

(function testAutoAllWhen13HeartsAndQueen() {
  var entries = [
    { hearts: 13, jack: false, queen: 13, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  var result = checkAutoAll(entries, 0);
  assert(result === true, "checkAutoAll returns true when 13 hearts + queen");
  assert(entries[0].allCombo === true, "player converted to allCombo");
  assert(entries[0].queen === 0, "queen cleared after auto ALL");
  assert(entries[0].hearts === 13, "hearts stays 13 after auto ALL");
})();

(function testAutoAllWhen13HeartsAndQueen26() {
  var entries = [
    { hearts: 13, jack: false, queen: 26, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  var result = checkAutoAll(entries, 0);
  assert(result === true, "checkAutoAll triggers with queen=26");
  assert(entries[0].allCombo === true, "allCombo set with queen 26");
})();

(function testNoAutoAllWithout13Hearts() {
  var entries = [
    { hearts: 12, jack: false, queen: 13, allCombo: false, manual: null },
    { hearts: 1, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  var result = checkAutoAll(entries, 0);
  assert(result === false, "no auto ALL without 13 hearts");
  assert(entries[0].allCombo === false, "allCombo stays false");
  assert(entries[0].queen === 13, "queen unchanged");
})();

(function testNoAutoAllWithoutQueen() {
  var entries = [
    { hearts: 13, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  var result = checkAutoAll(entries, 0);
  assert(result === false, "no auto ALL without queen");
  assert(entries[0].allCombo === false, "allCombo stays false without queen");
})();

(function testAutoAllClearsOtherPlayersQueen() {
  var entries = [
    { hearts: 13, jack: false, queen: 13, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 26, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  checkAutoAll(entries, 0);
  assert(entries[1].queen === 0, "other player queen cleared by auto ALL");
  assert(entries[1].allCombo === false, "other player allCombo stays false");
})();

// ── Toggle ALL State ──

(function testToggleAllOn() {
  var entries = [
    { hearts: 5, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 3, jack: false, queen: 13, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  toggleAllState(entries, 0);
  assert(entries[0].allCombo === true, "toggleAll ON sets allCombo");
  assert(entries[0].hearts === 13, "toggleAll ON sets hearts to 13");
  assert(entries[1].queen === 0, "toggleAll ON clears other queen");
})();

(function testToggleAllOff() {
  var entries = [
    { hearts: 13, jack: true, queen: 0, allCombo: true, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  toggleAllState(entries, 0);
  assert(entries[0].allCombo === false, "toggleAll OFF clears allCombo");
  assert(entries[0].hearts === 0, "toggleAll OFF clears hearts back to 0");
  assert(entries[0].jack === true, "toggleAll OFF keeps jack");
})();

// ── No Cards Rule ──

(function testNoCardsGivesMinus5() {
  var entries = [
    { hearts: 8, jack: false, queen: 13, allCombo: false, noCards: false, manual: null },
    { hearts: 5, jack: true, queen: 0, allCombo: false, noCards: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, noCards: true, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, noCards: false, manual: null },
  ];
  var scores = calcRoundScores(entries);
  assert(scores[2] === -5, "noCards player gets -5, got " + scores[2]);
  assert(scores[3] === 0, "player with no cards and no noCards flag gets 0");
})();

(function testNoCardsWithAllCombo() {
  var entries = [
    { hearts: 0, jack: false, queen: 0, allCombo: true, noCards: false, manual: null },
    { hearts: 0, jack: true, queen: 0, allCombo: false, noCards: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, noCards: true, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, noCards: false, manual: null },
  ];
  var scores = calcRoundScores(entries);
  assert(scores[0] === 0, "ALL player gets 0");
  assert(scores[1] === 26 - 8, "jack player gets 26-8=18");
  assert(scores[2] === 21, "noCards player gets 26-5=21 with ALL combo");
  assert(scores[3] === 26, "other player gets +26");
})();

(function testNoCardsRoundComplete() {
  var entries = [
    { hearts: 13, jack: false, queen: 13, allCombo: false, noCards: false, manual: null },
    { hearts: 0, jack: true, queen: 0, allCombo: false, noCards: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, noCards: true, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, noCards: false, manual: null },
  ];
  assert(isRoundComplete(entries) === true, "round complete with noCards player");
})();

// ── Manual Score Validation ──

(function testValidManualScores() {
  assert(isValidManualScore(0) === true, "0 is valid");
  assert(isValidManualScore(-8) === true, "-8 is valid");
  assert(isValidManualScore(52) === true, "52 is valid");
  assert(isValidManualScore(13) === true, "13 is valid");
  assert(isValidManualScore(26) === true, "26 is valid");
})();

(function testInvalidManualScores() {
  assert(isValidManualScore(-9) === false, "-9 is invalid");
  assert(isValidManualScore(53) === false, "53 is invalid");
  assert(isValidManualScore("abc") === false, "string is invalid");
  assert(isValidManualScore(NaN) === false, "NaN is invalid");
  assert(isValidManualScore(null) === false, "null is invalid");
})();

(function testAllManualRoundIncompleteWithInvalid() {
  var entries = [
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 99 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 5 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 3 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: -8 },
  ];
  assert(isRoundComplete(entries) === false, "round incomplete when manual value out of range");
})();

(function testAllManualRoundCompleteWithValid() {
  var entries = [
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 26 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 5 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 3 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: -8 },
  ];
  assert(isRoundComplete(entries) === true, "round complete with all valid manual values");
})();

// ── Toggle Manual Mode State ──

(function testToggleManualModeOn() {
  var entries = [
    { hearts: 5, jack: true, queen: 13, allCombo: false, manual: null },
    { hearts: 3, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: null },
  ];
  var newMode = toggleManualModeState(entries, false);
  assert(newMode === true, "returns true when switching to manual mode");
  assert(entries[0].hearts === 0, "clears hearts when switching to manual");
  assert(entries[0].jack === false, "clears jack when switching to manual");
  assert(entries[0].queen === 0, "clears queen when switching to manual");
  assert(entries[0].allCombo === false, "clears allCombo when switching to manual");
  assert(entries[1].hearts === 0, "clears other player hearts too");
})();

(function testToggleManualModeOff() {
  var entries = [
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 15 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 8 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: 3 },
    { hearts: 0, jack: false, queen: 0, allCombo: false, manual: -8 },
  ];
  var newMode = toggleManualModeState(entries, true);
  assert(newMode === false, "returns false when switching to button mode");
  assert(entries[0].manual === null, "clears manual for player 0");
  assert(entries[1].manual === null, "clears manual for player 1");
  assert(entries[2].manual === null, "clears manual for player 2");
  assert(entries[3].manual === null, "clears manual for player 3");
})();

// ── Results ──

console.log("\nResults: " + passed + " passed, " + failed + " failed");
if (failed > 0) process.exit(1);
