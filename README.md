# Vida

Vida is a game for building and playing with emergent artificial life in JavaScript. It takes inspiration from the game [Go](http://en.wikipedia.org/wiki/Go_%28game%29) and [Conway's Game of Life](http://en.wikipedia.org/wiki/Conway's_Game_of_Life).

## Open questions

- How do you get started making an AI for Vida?
- What if cells could pass a signal to adjacent cells? Messages could spread similar to the way ants spread messages.
- Reproduction and genetic mutation could be an interesting thing to add. Perhaps design the game such that any "pre-designed" cell would fail - only cells that fair well in the set environment would reproduce, allowing only the best-fit cells to survive, making sure the species adapted to its environment.
- I think the game should allow for many different types of automata. Maybe this a good argument for the ability to build multicellular life (or the ability to evolve into it).
- Cells sending and receiving messages should be a neutral/blank API - "messages" can be anything.
- Do the cells need to consume other cells for "food" in order to survive? (Is there neutral food, like plankton, that anyone can eat?)
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
