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
  // any textoverlay
  this.textoverlay = "";
  
  
  this.object_count = 0;
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

    // first, save scene
    sceneControls.saveScene();
    
      // reset text controls
//      libraryText.deloadBtns();
//      libraryText.disableText();
//      libraryText.loadEditBtn();
    
    sceneControls.clearScene();
    
    // set to new active scene
    active_scene = scenes.s[i];
    
    sceneControls.loadColor();
    sceneControls.loadText();
    sceneControls.loadObjects();
    
    console.log("Switched scene to " + active_scene.x + "," + active_scene.y);
    
    
    $("#e .obj").each(function () {
     $( this )
      .bind("dblclick", objControls.selectObj);
    });
    
    
   // scroll to engine
    document.getElementById("window-engine").scrollIntoView();

    $("._howmany").text(active_scene.object_count);
    
     
    // Updating active scene text
    $("._whatscenetype").text("Scene");
    $("._whatscene").text( active_scene.x + "," + active_scene.y );

  },

  
  /* saveScene writes all objects and settings to the active scene */
  saveScene: function () {
    libraryText.saveText();
    objControls.saveObjects();
  },
  /* clearScene deletes all objects from the scene */
  clearScene: function () {

    // first, save objects on scene
//    objControls.saveObjects();

    libraryText.clearText();
    $("#e img.obj").each( function(){
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
  
  loadText: function(){
    
    console.log(active_scene.textoverlay);
    $("textarea").hide().delay(100).fadeIn("slow").val(active_scene.textoverlay);
    
  },

  /*
    loadObjects brings back all the objects from the scene into the frame, lodaing it from the array of objects
  */

  loadObjects: function () {
    
    // iterate over each object
    (active_scene.objects).forEach(function (e) {
//      console.log(e);
      objControls.addObj(e.img, e.x, e.y, e.filter, e.size, e.interaction, e.interaction_target);
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
      
    });



  },
  
  editCartridge: function(){
    
    $("#btn-savecartridge").fadeIn("slow");
    $("#btn-finishediting").fadeOut("slow");
    $(".sidebar-right").fadeOut("slow");
    
    objControls.saveObjects();    
    sceneControls.clearScene();
    let c = scenes.cartridge;
 
    // MAP:remove the old scene
    $("#" + mapControls.MASTER + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");
    $("#" + mapControls.SIDE + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");
    
    // MAP: clear all the __active classes
    $("#" + mapControls.MASTER + " ._s").each(function(i, item){
      $(item).removeClass("__active")
    });
    $("#" + mapControls.SIDE + " ._s").each(function(i, item){
      $(item).removeClass("__active")
    });
    
       // make cartridge for the first time
    if(c == null){
      scenes.cartridge = new Scene(-1, -1, true, "#000000", "", 0);      
      active_scene = scenes.cartridge;
      
      // reset colors
      $("#e").css("background", "#000000");
      $("body").css("background", "#000000");
      $("input[type='color']").val("#000000");
      
    } else{
      // load the cartridge into the editor
      console.log("cartridge exists", scenes.cartridge);
      active_scene = scenes.cartridge;
      sceneControls.loadObjects();
    }
    
    
    $("._whatscenetype").text("Cartridge");
    $(".whatscene").text("");
    
  },
  
  saveCartridge: function(){
    
    console.log("saving cartridge", active_scene);
    $("#e-cartridge").html("");
    objControls.saveObjects();    
    scenes.cartridge = active_scene;
    
     (active_scene.objects).forEach(function (e) {
      let newSrc = "";
      newSrc = "<img class='obj' data-selected='0' src='" + e.img + "' style='";

      if (e.x && e.y) {
        newSrc += "top:" + e.y + "px; left:" + e.x + "px;";
      }

      if (e.filter) {
        newSrc += "filter:" + e.filter + ";";
      }

      if (e.size) {
        newSrc += "width:" + e.size + "; height:" + e.size + ";";
      }

      newSrc += "'>";
      
      let newObj = $(newSrc).hide().fadeIn(2000);
      $("#e-cartridge").append(newObj);
    });
    
    // update the colo
    $("#e-cartridge").css("background", (scenes.cartridge).color);
    $("#btn-savecartridge").fadeOut("slow");
    
    $(".sidebar-right").fadeIn("slow");
    
  }

};

sceneControls.initColorpicker();



$("#btn-cartridge").on("click", function () {

  sceneControls.editCartridge();
  alert("now editing the game cartridge. saves automatically!");

});


$("#btn-savecartridge").on("click", function () {

  sceneControls.saveCartridge();
  alert("game cartridge saved!");

});
