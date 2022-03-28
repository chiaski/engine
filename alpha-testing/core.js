// CORE
// Contains globals and such

const globals = {
  
  // maximum objects allowed per scene
  MAX_object_count: 15,
  
  // map width (columns)
  MAP_width: 4,
  
  // map height (rows)
  MAP_height: 4
  
}



/* SCENES */
// collection of all scenes

const scenes = {
  
  scene_count: 1,
  start_scene: {
    x: 0,
    y: 0
  },
  cartridge: null, // will be the starting screen to the game
  audio: null,
  
  // ALL THE SCENESKMFAKSF
  s: new Array( globals.MAP_width * globals.MAP_height )
};

