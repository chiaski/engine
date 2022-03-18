console.log("scene.js loaded");


/*

  SCENE CONSTRUCTOR
  x, y: variable
  active
  
  
*/

function Scene(x, y, active, color, object_count){
  
  // scene coordinates
  this.x = x;
  this.y = y;
  
  // has this scene been edited?
  this.active = active; 
  
  // background color of the scene
  this.color = color;
  this.object_count = object_count;
  this.objects = [];
  
}



/* 




      SCENE CONTROLS
      
      
      


*/


const sceneControls = {
  
  /* 
    getScene
    give x, y
    returns the index based on simple formula
    
  */
  
  getSceneIndex: function(x,y){
    let i = (parseInt(x) * globals.MAP_width) + parseInt(y); 
    
    return i;
    
  },
  
  /* 
    getScene
    give x, y
    returns scene object
  */
  
  
  getScene:function(x,y){
    
    let i = (parseInt(x) * globals.MAP_width) + parseInt(y); 
    
    return scenes.s[i];
  },

  /*
  
    switchScene
    i: index of new scene (NOT coordinate value)
    o: index of old scene
  
  */
  switchScene: function (i, o) {

    objControls.saveObjects();
    sceneControls.clearScene();
    
    // set to new active scene
    active_scene = scenes.s[i];
    
    sceneControls.loadColor();
    sceneControls.loadObjects();
    
    console.log("Switched scene to " + active_scene.x + "," + active_scene.y);
    
    
   // scroll to engine
    document.getElementById("e").scrollIntoView();
    
     
    // Updating active scene text
    $("._whatscene").text( active_scene.x + "," + active_scene.y );

  },

  
  /* saveScene writes all objects and settings to the active scene */
  saveScene: function () {

  objControls.saveObjects();

  },
  /* clearScene deletes all objects from the scene */
  clearScene: function () {

    // first, save objects on scene
//    objControls.saveObjects();

    $("#e *").each( function(){
      $(this).remove();
    });

  },

  loadColor: function () {

    if(active_scene.color == 0){
      // defaults to black if color isn't set
      active_scene.color = "#000000"; 
    }
    
    $("#e").css("background", active_scene.color);

  },

  /*
    loadObjects brings back all the objects from the scene into the frame, lodaing it from the array of objects
  */

  loadObjects: function () {

    
    // iterate over each object
    (active_scene.objects).forEach(function (e) {
//      console.log(e);

      objControls.addObj(e.img, e.x, e.y, e.filter, e.size);
      // HELL YAAA
    })


  },
  
  initColorpicker: function() {

    $("input[type='color']").change(function () {
      
      let c = $(" input[type='color']").val();

      $("#e").css("background", c);
      $("body").css("background", c);

      active_scene.color = c;

      // change color of tile in map
      $("#scene_selector div._s.__active").css("background", c);
      
      console.log(active_scene.color);

    });



  }

};

sceneControls.initColorpicker();
