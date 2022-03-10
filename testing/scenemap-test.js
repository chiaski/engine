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


$("#engine #scene_selector ._s").click(function (){
  console.log(this);
  
  // do simple index mapping
  
  console.log( $(this).attr("data-scene") );
  
  
  
  // this is the converted index, i think
  let coord = $(this).attr("data-scene").split(',');
  
  let i = (parseInt(coord[0]) * globals.MAP_width) + parseInt(coord[1]); 
  

  // Does this scene exist? If not, create it!
  if( typeof scenes.s[i] == 'undefined' ){
    
  }
  
      
  // Actively on scene 
  
});



// TEMPORARY SHIT
// SELECITON BASED SCENE CHANGING

$("select[name='scene_no']").change(function () {
  
  objControls.saveObjects();
  sceneControls.clearScene();
  
  // set active scene
  active_scene = scenes.s[ $("select[name='scene_no']").val() ];
  
  sceneControls.loadColor();
  sceneControls.loadObjects();
  
  console.log(active_scene.objects);
  
  console.log("SWITCHING SCENES");

});