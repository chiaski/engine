// CORE
// Contains globals and such

const globals = {
  
  // maximum objects allowed per scene
  MAX_object_count: 10
  
}

const state = {
  
  // what scene am i currently on?
  active_scene: [0, 0]
  
}



/* SCENES */

// collection of all scenes

const scenes = {
  
  
};



/*

  SCENE CONSTRUCTOR
  x, y: variable
  active
  
  
*/

function Scene(x, y, active, color, object_count, objects){
  
  this.x = x;
  this.y = y;
  this.active = active; // Has this scene been edited?
  this.color = color;
  this.object_count = object_count;
  this.objects = objects;
}