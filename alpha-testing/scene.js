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


    LOAD CARTRIDGE
    
    
*/

function testJSON(text) {
  if (typeof text !== "string") {
    return false;
  }
  try {
    var json = JSON.parse(text);
    return (typeof json === 'object');
  } catch (error) {
    return false;
  }
}


$("#btn-remixcartridge").on("click", function(){
  
  if( !confirm("Do you want to paste in a cartridge code and start editing an existing game? (Note that this wipes all of your current progress!)") ){
    return;
  }
  
  $(this).hide();
  $("#map textarea#_remix").fadeIn();
  $("#map #sss").hide();
  $("#btn-changestartingscene").hide();
  $("#btn-cartridge").hide();
  
  $("#map .controls-remixcartridge").fadeIn();
  
})


  // handle controls
  
  $("#btn-remixcartridge-back").on("click", function(){
    
    $("#map .controls-remixcartridge").hide();
    
    $("#map textarea#_remix").val("").hide();
    $("#map #sss").fadeIn();
    $("#btn-cartridge").fadeIn();
    $("#btn-remixcartridge").fadeIn();
    $("#btn-changestartingscene").fadeIn();
    
  })
  
  // load a cartridge
  $("#btn-remixcartridge-load").on("click", function(){
    
    let new_cartridge = $("#map textarea#_remix").val();
    new_cartridge = new_cartridge.replace(/^\s+|\s+$/g, "")
                .replace(/\\n/g, "\\n")  
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
    
    new_cartridge = new_cartridge.replace(/[\u0000-\u0019]+/g,""); 
    
    console.log("Attempting to load: ", new_cartridge);
    
    let new_scenes = "";
    
    if (testJSON(new_cartridge)) {
      new_scenes = JSON.parse(new_cartridge);
      // just checking if this is valid or not
      if (new_scenes.start_scene == null || new_scenes.s == null) {
        alert("Corrupted or empty cartridge!!!!");
        return;
      }
      
    } else{
        alert("Corrupted or empty cartridge!");
        return;
    }
    
      console.log("Loaded: ", new_scenes);
    
      mapControls.clearMap();
      sceneControls.reassignScenes(new_scenes);
      mapControls.loadMap(scenes);
    
      let i = sceneControls.getSceneIndex(scenes.start_scene.x, scenes.start_scene.y);
    
      sceneControls.switchScene(i);

      $("#map .controls-remixcartridge").hide();

      $("#map textarea#_remix").val("").hide();
      $("#map #sss").fadeIn();
      $("#btn-cartridge").fadeIn();
      $("#btn-remixcartridge").fadeIn();
      $("#btn-changestartingscene").fadeIn();
    
      alert("Successfully loaded cartridge");
    
  });



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
    reassignScenes
    give a new scene object
    and update the scenes
    
  */
  
  reassignScenes: function(new_scene){
    
    if(!new_scene){
      return;
    }
    
      scenes.scene_count = new_scene.scene_count;
      scenes.start_scene = new_scene.start_scene;
      scenes.cartridge = new_scene.cartridge;
      scenes.s = new_scene.s;

  },

  /*
  
    switchScene
    i: index of new scene (NOT coordinate value)
    o: index of old scene
  
  */
  switchScene: function (i, o) {

    // first, save scene
    sceneControls.saveScene();
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
    $("body").css("background", active_scene.color);
  },
  
  loadText: function(){
    // loads text into editor
    let t = active_scene.textoverlay;
    t = t.replace(/&nbsp;/g, " ");
    
    $("#e #e-text textarea").hide().delay(100).fadeIn("slow").val( t );
    
  },

  /*
    loadObjects brings back all the objects from the scene into the frame, lodaing it from the array of objects
  */

  loadObjects: function () {
    
    // iterate over each object
    (active_scene.objects).forEach(function (e) {
      objControls.addObj(e.img, e.x, e.y, e.filter, e.flip, e.size, e.interaction, e.interaction_target);
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
    
    libraryText.saveText();    
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
      active_scene = scenes.cartridge;
      sceneControls.loadObjects();
    }
    
    $("._whatscenetype").text("Cartridge");
    $(".whatscene").text("");
    
  },
  
  saveCartridge: function(){
    
    objControls.clearSelected();
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

      if (e.flip) {
        newSrc += "transform:" + e.flip + ";"
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
  
  // disable text
    if(  $("button#btn-toggletext").hasClass("__toggled") ){
      $("#e #e-text").css("pointer-events", "none");
      $("button#btn-toggletext").removeClass("__toggled");
    }
  
  objControls.clearSelected();
  $("#tool-textoverlay").fadeOut();
  sceneControls.editCartridge();
  alert("Now editing the game cartridge—your game's cover. Saves automatically!");
});


$("#btn-savecartridge").on("click", function () {
  $("#tool-textoverlay").fadeIn();
  objControls.clearSelected();
  sceneControls.saveCartridge();
  alert("Cartridge saved!");
});

