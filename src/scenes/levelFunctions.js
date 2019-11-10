/*
This is the file that will eventually contain the level functions and can be
imported into our levels to remove repeated code throughout our game.
There are 2 way that this can be done:

1. LEVEL TEMPLATE:
  - create a class that is identical to all our existing level.js files,
  only instead of having level1 or level2, it has a paramter that we pass
  into it (the level number) that tells it which level maps to load. This should
  be eachieved easily since all our levels do have the same functionality (it
  is just more restricted on earlier levels).

2. FUNCTION FILE:
  - create a file very similar in style to changeScene.js, which is not a class
  but instead stores a function that we import into our levels. Thus, we could
  store all the repeated helped functions here and import them into our levels.

I'm going to try #1 ASAP so our code can be more manageable.
*/
