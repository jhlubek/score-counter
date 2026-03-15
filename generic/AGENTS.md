# Generic Score Counter

A configurable score counter for any game. No game-specific rules — just tracks points per player per round.

## Setup

- Configurable number of players (2-8).
- Player names editable, reorderable with drag and drop.
- End condition (chosen at game start):
  - **Max score**: game ends when any player reaches the threshold (e.g. 100, 500, 1000). Configurable.
  - **Max rounds**: game ends after a fixed number of rounds. Configurable.
  - **No limit**: game runs until manually ended.
- Option to choose whether highest or lowest score wins.

## Round Entry

- Each round: enter a point value for each player.
- Free numeric input per player (no buttons or card-specific UI).
- Confirm round adds it to history.
- Running totals shown at bottom of score table.

## Game Over and History

- When end condition is met, show the winner/loser and a "Next Game" button.
- Game history: last 5 games, clickable for read-only round details.
