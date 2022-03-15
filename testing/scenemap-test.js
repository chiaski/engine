/* 


  scenemap-test.js
  
  Figuring out how to handle scene switching and saving.
  

*/


// make this easier for me

var SCENE_AREA = $("#engine #scene_selector");

const mapNavigation = {
  // references
  
};

// scene change

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
    $("#scene_selector ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");
    
    
    // creating a new scene at that indice
    scenes.s[i] = new Scene(parseInt(coord[0]), parseInt(coord[1]), true, 0, 0);
    
    // switching to the new scene
    active_scene = scenes.s[i];
    
    // update the new scene
    $("#scene_selector ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__unused").addClass("__active");
    
    // Updating active scene text
    $("._whatscene").text(coord);
    
    
    alert("Scene created!");
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



// TEMPORARY SHIT
// SELECITON BASED SCENE CHANGING

$("select[name='scene_no']").change(function () {
  
  objControls.saveObjects();
  sceneControls.clearScene();
  
  // set active scene
  
  sceneControls.loadColor();
  sceneControls.loadObjects();
  
  console.log(active_scene.objects);
  
  console.log("SWITCHING SCENES");

});