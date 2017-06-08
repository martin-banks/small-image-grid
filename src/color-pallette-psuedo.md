# Create colour palette values
Notes on how to dynamically create rgb values for a colour pallette


## Different colour stages
255, 0, 0
255,255, 0
0, 255, 0
0, 255, 255
0, 0, 255
255, 0, 255
255, 0, 0

## varibles
sets = 7
loops per set = total / sets
increment = 255 * (index / loops per set)

(255 / 7) * setIndex


total / 70 = loops
loops / 7 = setindex


## functions
loop up 	=> 0 + (index * increment)
loop down	=> 255 - (index * increment)



## iterations
255, 0, 0
=> (255, [loop up], 0,)

255,255, 0
=> ([loop down], 255, 0)

0, 255, 0
=> (0, 255, [loop up])

0, 255, 255
=> (0, [loop down], 255)

0, 0, 255
=> ([loop up], 0, 255)

255, 0, 255
=> (255, 0, [loop down])

