console.log("map.js loaded");

/*


    MAP
    
    
*/



const mapControls = {
  
  MASTER: "sss",
  SIDE: "engine #scene_selector",
  SCENE_DISPLAY: "_whatscene",
  
  /* 
  
    initMap
    Initializes the map.
    
  */
  
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
      $('#' + mapControls.SIDE).on("click", "div._s", mapControls.mapSwitch );
    
//    
    
    
  },
  
  
  /* 
  
    switchScene
    Switches the active scene and updates the maps accordingly.
    
  */
  
  mapSwitch: function(t){
    
    sceneControls.saveScene(); // first, let's save the scene
    
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
      
      sceneControls.clearScene();
      
      // remove active scenes
      $("#" + mapControls.MASTER + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");
      $("#" + mapControls.SIDE + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");
      
      // creating a new scene at that indice
    scenes.s[i] = new Scene(parseInt(coord[0]), parseInt(coord[1]), true, "#000000", "", 0);
    
    // switching to the new scene
    active_scene = scenes.s[i];
    active_scene.color = $("body").css("background"); // retain scene color
      
    
   // new object count
      $("._howmany").text(active_scene.object_count);
    
      
   // scroll to engine
    document.getElementById("window-engine").scrollIntoView();
      
    // update the new scene
    $("#" + mapControls.MASTER + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__unused").addClass("__active");
    $("#" + mapControls.SIDE + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__unused").addClass("__active");
      
    
    $("." + mapControls.SCENE_DISPLAY).text(coord[0] + "," + coord[1]); // update scene
    
      
    $("#scene_selector div._s.__active").css("background", active_scene.color); //retain scene color 
      
    // Updating active scene text
    $('.' + mapControls.SCENE_AREA).text(coord);
    
    
    alert("Scene created!");
      return;
    }
    
    
    // –––––––––––––––––––
    // Scene exists
    // –––––––––––––––––––
    
    console.log("Switching scene");
    
    // remove the old scene
    $("#" + mapControls.MASTER + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");
    $("#" + mapControls.SIDE + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");
    
    // switch to scene i
    sceneControls.switchScene(i);
    
    
  // clear all the __active classes
  $("#" + mapControls.MASTER + " ._s").each(function(i, item){
    $(item).removeClass("__active")
  });
  $("#" + mapControls.SIDE + " ._s").each(function(i, item){
    $(item).removeClass("__active")
  });
    
    $("." + mapControls.SCENE_DISPLAY).text(coord[0] + "," + coord[1]); // update scene
    
    
  $("#" + mapControls.MASTER + " ._s[data-scene='" + coord + "']").removeClass("__unused").removeClass("__inactive").addClass("__active");
    
  $("#" + mapControls.SIDE + " ._s[data-scene='" + coord + "']").removeClass("__unused").removeClass("__inactive").addClass("__active");
    
  }
}


//
//// TODO: Will need to change coloring/rendering system once map is rendered based on scene data as opposed to inherently being on the DOM
//$("#engine #scene_selector ._s").click(function (){
//  
//  // Good time to save scene here
//  objControls.saveObjects();
//  
//  // this is the converted index, i think
//  let coord = $(this).attr("data-scene").split(',');
//  
//  let i = (parseInt(coord[0]) * globals.MAP_width) + parseInt(coord[1]); 
//  
//  // ROUTE 1
//  // Does this scene exist? If not, create it!
//  if( typeof scenes.s[i] == 'undefined' ){
//    
//    if( !confirm("Do you want to create a new scene at " + coord + "?") ){
//      return;
//    }
//    
//    objControls.saveObjects();
//    sceneControls.clearScene(); // remove the old scene
//    
//    return;
//    
//  }
//  
//  // ROUTE 2
//  // The scene exists, let's switch to it 
//  
//  console.log("Switching scene");
//  $("#scene_selector ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");
//  
//  sceneControls.switchScene(i);
//  
//  // apply color
//  
//  console.log(coord);
//  
//  // clear all the __active classes
//  $("#scene_selector ._s").each(function(i, item){
//    $(item).removeClass("__active")
//  });
//  
//  
//  $("#scene_selector ._s[data-scene='" + coord + "']").removeClass("__unused").removeClass("__inactive").addClass("__active");
//  
//  alert("Switched to " + coord);
//  
//});
//

mapControls.initMap();
