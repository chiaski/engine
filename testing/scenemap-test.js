/* 


  scenemap-test.js
  
  Figuring out how to handle scene switching and saving.
  

*/



// scene change


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