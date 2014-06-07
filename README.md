# Vida

! Note: the purpose and design of Vida has changed a bit since this was written. See the gh-pages branch for more.

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

## Ideas

- What if cells could pass a signal to adjacent cells? Messages could spread similar to the way ants spread messages.
- Reproduction and genetic mutation could be an interesting thing to add. Perhaps design the game such that any "pre-designed" cell would fail - only cells that fair well in the set environment would reproduce, allowing only the best-fit cells to survive, making sure the species adapted to its environment.
- I think the game should allow for many different types of automata. Maybe this a good argument for the ability to build multicellular life (or the ability to evolve into it).

- Cells sending and receiving messages should be a neutral/blank API - "messages" can be anything.
- A message could be a JSON object
- Or a message could be to a wall, e.g. a "chip" off that wall
- Or it could be an attack
- The message could just be an extensible JSON object, e.g. 

{x: 0, y: 0, action: "chip"} // Chip away at a wall
{x: 0, y: 0, action: "attack"} // Attack an enemy
{x: 0, y: 0, data: {target: 647}} // Convey an enemy target to another friendly ship

===

- I'd like to suggest limiting cell moves to its Von Neumann neighborhood. This would greatly simplify gameplay and diagonal moves don't add a huge benefit to the game. 

===

- I don't think 'bases' should be a thing. Your cells should be nomadic and distributed.
- That still leaves the problem of where you spawn. Could you 'fork' off on an existing, possibly neutral cell? Possibly a neutral 2nd species that doesn't have anything to do with the game except excrete characters? (That doesn't solve the distribution problem)

===

- If walls are going to be at all necessary, they're going to have to be very hard to knock down
- What purpose do walls serve?
- Limit ability to easily interact other species 
- Create barriers for yourself
- However, programming with these barriers in mind sounds very difficult
- If there were no walls and it was a completely open environment, first, it would have to be huuuge to make sure people weren't stepping on each others' feet, and second, in order to "win" at the game, you'd have to develop more complex, possibly multicellular organisms to be more resilient in a crowded, hostile environment.

- Is the game about territory, or dominance? Or something else?

- Do the cells need to consume other cells for "food" in order to survive? (Is there neutral food, like plankton, that anyone can eat?)

- Might want to check out Spore from Maxis.

- Still a big question: where do you spawn? A randomly chosen point? 

- How do we manage the boundaries of the map? Do they roll over or are they fixed?

## Inspiration

- Prey - Michael Crichton
- The game of Go
- Conway's game of life
- Avida - Ofria, Bryson 
- [Tierra](http://www.cs.cmu.edu/afs/cs/project/ai-repository/ai/areas/alife/systems/tierra/0.html) - Tom Ray (1992)

## Resources

- [Von Neumann neighborhood](http://en.wikipedia.org/wiki/Von_Neumann_neighborhood)
- [Manhattan Distance](http://en.wiktionary.org/wiki/Manhattan_distance) 
- [Von Neumann cellular automation](http://en.wikipedia.org/wiki/Von_Neumann_cellular_automata)
