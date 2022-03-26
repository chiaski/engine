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
    Initializes the map where
    x, y is the starting scene
    
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
  },
  
  clearMap: function(){
    
    $('#' + mapControls.MASTER).html("");
    $('#' + mapControls.SIDE).html("");
    
  },
  
  // loads in a map based on new scenes, similar to initMap
  // note that this doesn't replace the scene data
  loadMap: function(data){
    
    var map_html = "";
    
    // update start scene
    scenes.start_scene.x = data.start_scene.x;
    scenes.start_scene.y = data.start_scene.y;
    
    let x = scenes.start_scene.x;
    let y = scenes.start_scene.y;
    
    for(let i = 0; i < globals.MAP_height; i++){
      for(let j = 0; j < globals.MAP_width; j++){
        
          // starting scene
        if(x !== null && y !== null && i == x && j == y){
          map_html += ("<div class='_s __active __start' data-active='active' data-scene='" + i + "," + j + "'>" + i + "," + j + "</div>");
          
        } else if(x == null && y == null && i == 0 && j == 0){
          map_html += "<div class='_s __active __start' data-active='active' data-scene='" + i + "," + j + "'>" + i + "," + j + "</div>";
        } else{
          
          // check if scene is used or not
          if( data.s[ sceneControls.getSceneIndex(i, j) ] == null ){
            // unused scene
          map_html += "<div class='_s __unused' data-active='unused'  data-scene='" + i + "," + j + "'>" + i + "," + j + "</div>";  
          } else{
            
            let c = data.s[ sceneControls.getSceneIndex(i, j) ].color;
            
            if( c == 0 ){
              c = "#000000"; // default
            }
            
            map_html += "<div class='_s __inactive' data-active='inactive' data-scene='" + i + "," + j + "' style='background:" + c + ";'>" + i + "," + j + "</div>"; 
          } 
        }
      }
      map_html += "<hr>";
    }
    
    $('#' + mapControls.MASTER).append(map_html);
    $('#' + mapControls.SIDE).append(map_html); 
    
    // add onclick events
      $('#' + mapControls.MASTER).on("click", "div._s", mapControls.mapSwitch );
      $('#' + mapControls.SIDE).on("click", "div._s", mapControls.mapSwitch );
    
  },
  
  /* 
  
    updateMap
    Refreshes the map based on scene data, especially useful when loading in cartridges.
  
  */
  
  updateMap: function(){
    
  },
  
  // remove all active scenes
  clearMapActive: function(){

    $("#" + mapControls.MASTER + " ._s").each(function(i, item){
      $(item).removeClass("__active")
    });
    $("#" + mapControls.SIDE + " ._s").each(function(i, item){
      $(item).removeClass("__active")
    });
    
  },
  
  // update the map's active scene
  updateActive: function(x, y){
    
    // add active class
    $("#" + mapControls.MASTER + " ._s[data-scene='" + x + "," + y + "']").removeClass("__unused").removeClass("__inactive").addClass("__active");
    
    $("#" + mapControls.SIDE + " ._s[data-scene='" + x + "," + y + "']").removeClass("__unused").removeClass("__inactive").addClass("__active");
    
    
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
    $("#e").css("background", active_scene.color);
    
   // new object count
      $("._howmany").text(active_scene.object_count);
    
      
   // scroll to engine
    document.getElementById("window-engine").scrollIntoView();
      
    mapControls.updateActive(active_scene.x, active_scene.y); // add active class
    
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
    mapControls.clearMapActive();
    
    $("." + mapControls.SCENE_DISPLAY).text(coord[0] + "," + coord[1]); // update scene
    
    mapControls.updateActive(active_scene.x, active_scene.y); // add active class
    
  }
}


mapControls.initMap();
