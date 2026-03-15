# Hearts - Score Counter

Score counter for the card game Hearts (Srdce). Tracks points across rounds for 4 players.

## Game Rules

- Start a new game by clicking the "New Game" button.
- Add 4 players. Use player names from previous game if available. Allow to simply change order of players with drag and drop.
- Each player has a name and a score.
- The player with the score 100 or higher lost game.
- Historical view of game rounds is kept.
- Game rules are simple:
  - Each player starts with 0 points.
  - Every heart card gives 1 point to the player who took it.
  - Jack in diamonds gives -8 points to the player who took it.
  - Queen in spades gives 13 points to the player who took it.
  - If queen in spades is taken in the last round, it gives 13 more points.
  - If queen in spades shown at the beginning of the round, it gives 13 more points to the player who took it.
  - Special case: When all hearts and queen are taken by the same player, it gives 26 points to all other players. In that case no other queen and hearts points are counted. Jack is not counted to ALL and can be taken by any player, including one with all hearts and queen.
  - Special case: When player takes no cards in a round, it gives -5 points to the player who took no cards.
  - When 100 points are reached, the game ends but winning player is not shown, only losing player and next game button is shown. The next game button will start a new game with same players.

## Round Entry UI

- Giving points in every round behaves as follows:
  - Each player shows icon buttons in this order: Hearts, Queen, Jack, None, ALL.
  - Clicking on Hearts button will show a popup with the number of hearts to give (1-13), all shown as clickable buttons.
  - Clicking on Queen button will show a popup whether to give 13, 26, or 39 points.
  - Clicking again on the same button will allow the change or reset.
  - When 13 hearts and queen of any kind is given to one player, it automatically changes to ALL instead.
  - When Jack or Queen is taken, it's disabled for other players to take.
- Allow entering points manually instead of using buttons by switching to manual mode, by clicking on manual button in top right corner. In that mode, all other buttons and remaining cards are disabled, and it accepts only expected counts of points, with total count with +13 or +26 or +39 queen variations and ALL special case. Input validates entries in the range [-8, 52]; invalid values show red glow and disable the confirm button.
- Player with highest score has bold red color name and his score too.
- Confirm round button is not enabled until all points are given.
- Clicking on back button will show modal to confirm if the user wants to cancel the round.
- Hearts input field are grayed out for values that can't be taken, because other players already took some hearts.
- Hearts button is grayed out when all hearts are taken by other players.
- ALL button is available only when no queen or heart is taken yet. When it's taken, it's disabled.
- Confirm button is at the bottom of the page.
- Just above confirm button, there is info about cards that are not taken yet, in the same order as buttons: hearts, queen, jack.

## History and Game Over

- History item shows date and time, with loser and their points in the first row, all in bold. And other player names and their scores sorted from highest to lowest and showed in smaller font below.
- Clicking on history item will show the round details with all players and their points. Not just summary scores, but all rounds and their scores.
- In default view with list of previous games, it will show only last 5 games, rest is deleted. And clicking on game will show read only details of that game.
