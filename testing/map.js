
/*


    MAP
    
    
*/





const mapControls = {
  
  MASTER: "sss",
  SIDE: "engine #scene_selector",
  
  /* 
  
    initMap
    Initializes the map.
    
  */
  
  // x & y == coordinate of start, if any
  initMap: function(x, y){

    
    var map_html = "";
    
    console.log("init at: " + x + "," + y);
    
    for(let i = 0; i < globals.MAP_height; i++){
      for(let j = 0; j < globals.MAP_width; j++){
        
        if(x !== null && y !== null && i == x && j == y){
        
          console.log("b");
          map_html += ("<div class='_s __active __start' data-active='active' data-scene='" + i + "," + j + "'>" + i + "," + j + "</div>");
          
        } else if(x == null && y == null && i == 0 && j == 0){
          map_html += "<div class='_s __active __start' data-active='active' data-scene='" + i + "," + j + "'>" + i + "," + j + "</div>";
          continue;
        } else{
          
        map_html += "<div class='_s __unused' data-active='unused'  data-scene='" + i + "," + j + "'>" + i + "," + j + "</div>";
          
        }
        
        
      }
      
      map_html += "<hr>";
      
      
    }
    
      $('#' + mapControls.MASTER).append(map_html);
      $('#' + mapControls.SIDE).append(map_html); 
    
    // add onclick events
      $('#' + mapControls.MASTER).on("click", "div._s", mapControls.mapSwitch );
//    
    
    
  },
  
  
  /* 
  
    switchScene
    Switches the active scene and updates the maps accordingly.
    
  */
  
  mapSwitch: function(t){
    
    objControls.saveObjects(); // first, save objects in curr scene
    
    let coord = $(this).attr("data-scene").split(',');
    let i = (parseInt(coord[0]) * globals.MAP_width) + parseInt(coord[1]); // indice in scenes
    
    console.log("coord: " + coord[0] + "," + coord[1]);
    
    // –––––––––––––––––––
    // Scene does not exist
    // –––––––––––––––––––
    
    if( typeof scenes.s[i] == 'undefined'){
      

      if( !confirm("Do you want to create a new scene at " + coord + "?") ){
        return;
      }

      objControls.saveObjects();
      sceneControls.clearScene();
      
      // remove the old scene
      $("#" + mapControls.MASTER + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");
      $("#" + mapControls.SIDE + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");
      
      // creating a new scene at that indice
    scenes.s[i] = new Scene(parseInt(coord[0]), parseInt(coord[1]), true, 0, 0);
    
    // switching to the new scene
    active_scene = scenes.s[i];
    
      
    // update the new scene
    $("#" + mapControls.MASTER + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__unused").addClass("__active");
    $("#" + mapControls.SIDE + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__unused").addClass("__active");
    
    // Updating active scene text
    $("._whatscene").text(coord);
    
    
    alert("Scene created!");
      
      return;

    }
    
    
    // –––––––––––––––––––
    // Scene exists
    // –––––––––––––––––––
    
    
    
    
    
  }
  
}


// TODO: Will need to change coloring/rendering system once map is rendered based on scene data as opposed to inherently being on the DOM
$("#engine #scene_selector ._s").click(function (){
  
  // Good time to save scene here
  objControls.saveObjects();
  
  // this is the converted index, i think
  let coord = $(this).attr("data-scene").split(',');
  
  let i = (parseInt(coord[0]) * globals.MAP_width) + parseInt(coord[1]); 
  
  // ROUTE 1
  // Does this scene exist? If not, create it!
  if( typeof scenes.s[i] == 'undefined' ){
    
    if( !confirm("Do you want to create a new scene at " + coord + "?") ){
      return;
    }
    
    objControls.saveObjects();
    sceneControls.clearScene();
    
    
    
    // remove the old scene
    
    
    return;
    
  }
  
  // ROUTE 2
  // The scene exists, let's switch to it 
  
  console.log("Switching scene");
  $("#scene_selector ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");
  
  sceneControls.switchScene(i);
  
  // apply color
  
  console.log(coord);
  
  // clear all the __active classes
  $("#scene_selector ._s").each(function(i, item){
    $(item).removeClass("__active")
  });
  
  $("#scene_selector ._s[data-scene='" + coord + "']").removeClass("__unused").removeClass("__inactive").addClass("__active");
  
  alert("Switched to " + coord);
  
});


mapControls.initMap();