// CORE
// Contains globals and such

const globals = {
  
  // maximum objects allowed per scene
  MAX_object_count: 10,
  
  // map width (columns)
  MAP_width: 4,
  
  // map height (rows)
  MAP_height: 4
  
}

const state = {
  
  // what scene am i currently on?
  active_scene: [0, 0]
  
}



/* SCENES */

// collection of all scenes

const scenes = {
  
  scene_count: 1,
  start_scene: {
    x: 0,
    y: 0
  },
  
  // ALL THE SCENESKMFAKSF
  s: new Array( globals.MAP_width * globals.MAP_height )
  
};

