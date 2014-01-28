# Vida

Vida is a game for building and playing with emergent Artificial Intelligence in JavaScript. It takes inspiration from the game [Go](http://en.wikipedia.org/wiki/Go_%28game%29) and [Conway's Game of Life](http://en.wikipedia.org/wiki/Conway's_Game_of_Life).

![Vida game in progress](http://jeffcarp.github.io/vida/images/sample-3.png)

## Gameplay

Each player (red and black) starts with 25 cells, distributed randomly on their half of the board. Each cell is loaded with the same copy of an AI that the respective players have prepared beforehand. The AI must conform to this interface:

```javascript
// (simplified)

var ai = {};
/* The only function your cell AI is required to have
 * is cell.tick(). It takes the turn (int), and an array
 * containing every cell on the board. Based on this information,
 * your cell needs to deterimine where it wants to move next.
 */
ai.tick = function(turn, cells) {

  // Must return a vector indicating where it intends to move, e.g.
  return [0, 0];  // Stay put
  return [0, 1];  // Move right 1
  return [-1, 0]; // Move up 1

  // Cells can move at max 1 space (left, right, up, down, or diagonal)
  
  // If you return a direction to a space to which it is impossible for the
  //   cell to move, your cell will stay put.
};
```

The object of the game is to capture all your opponents pieces. Just like in Go, to capture a piece you must surround it on all 4 sides (up, down, left, right). The surrounding pieces don't need to be all enemy pieces (so it's possible to have "friendly fire").

## Open questions

- How do we keep tick order deterministic and fair?
- How do you get started making an AI for Vida?
