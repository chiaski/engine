console.log("scene.js loaded");

// scnee constructor
function Scene(x, y, active, color, object_count) {

  // scene coordinates
  this.x = x;
  this.y = y;

  // has this scene been edited?
  this.active = active;

  // background color of the scene
  this.color = color;
  // any text
  this.textoverlay = "";
  // any effects
  this.effect = "";
  this.effects = "";

  // scene title
  this.title = "";

  // scene caption
  this.caption = "";


  this.object_count = 0;
  this.objects = [];
}


/*


    REMIXING A CARTRIDGE
    / LOADING A CARTRIDGE
    
    
*/

// LOAD OR REMIX CARTRIDGE

$("[action='remix']").click(function(){
  
  let d = $(`
    <div id="load" class="window" window-moveable>
      <h2>
        Load or Remix Cartridge

        <span close>X</span>
      </h2>
      <div class="-content">
              <p>hint: try to find <a href="gallery.html" target="_blank">games in the gallery</a> to remix</p>

        <textarea id="_remix" placeholder="paste a cartridge code here to start editing it. note this deletes your existing game!"></textarea>

        <button id="btn-remixcartridge" class="--large" title="Paste in a code and build something">remix this cartridge</button>
    </div>`);
  
  if(!$("#load").length){
    UI.open(d);
  }


  $("#btn-remixcartridge").on("click", function () {

    if (!confirm("Do you want to load this cartridge?")) {
      return;
    }
    
    
  let new_cartridge = $("#load textarea").val();
  new_cartridge = new_cartridge.replace(/^\s+|\s+$/g, "")
    .replace(/\\n/g, "\\n")
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, "\\&")
    .replace(/\\r/g, "\\r")
    .replace(/\\t/g, "\\t")
    .replace(/\\b/g, "\\b")
    .replace(/\\f/g, "\\f");

    new_cartridge = new_cartridge.replace(/[\u0000-\u0019]+/g, "");
    loadCartridge(new_cartridge);
   

  })
  
  
  
});



function loadCartridge(new_cartridge){
    
  console.log("Attempting to load: ", new_cartridge);

  let new_scenes = "";
  

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


  if (testJSON(new_cartridge)) {
    new_scenes = JSON.parse(new_cartridge);
    if (new_scenes.start_scene == null || new_scenes.s == null) {
      alert("Corrupted or empty cartridge!!!!");
      return false;
    }

  } else {
    alert("Corrupted or empty cartridge!");
    return false;
  }

  console.log("Loaded: ", new_scenes);
  $("#load").remove();

  if ((new_scenes.s).length !== (globals.MAP_height * globals.MAP_width)) {
    alert("This cartridge is sized differently. Adjusting the player...");

    let new_size = (100 / Math.sqrt((new_scenes.s).length)) - 3;

    //    $("#scene_s ._s").css("flex-basis", new_size + "% !important");
    $("#scene_s #scene_selector ._s").css("flex-basis", "23%");
    $("#scene_s #scene_selector ._s").css("padding", ".2em .5em");

    let c = Math.sqrt((new_scenes.s).length);

    globals.MAP_width = c;
    globals.MAP_height = c;

  }

  // copy
  if(new_scenes.title) scenes.title = new_scenes.title;

  if(scenes.title !== null){
    $("[text='cartridge-title']").html(scenes.title);
  }

  scenes.audio = new_scenes.audio;
  scenes.font = new_scenes.font;

  if (scenes.font !== "default") {
    $("#e-play textarea").css("font-family", scenes.font);
    $("#e textarea").css("font-family", scenes.font);
  }
  

  mapControls.clearMap();
  sceneControls.reassignScenes(new_scenes);
  mapControls.loadMap(scenes);

  let i = sceneControls.getSceneIndex(scenes.start_scene.x, scenes.start_scene.y);

  Tplayer.loadCover();
  
  sceneControls.switchScene(i);

  document.getElementById("window-engine").scrollIntoView();

//  $("#map .controls-remixcartridge").hide();
//
//  $("#map textarea#_remix").val("").hide();
//  $("#map #sss").fadeIn();
//  $("#btn-cartridge").fadeIn();
//  $("#btn-remixcartridge").fadeIn();
//  $("#btn-changestartingscene").fadeIn();
//  
  if(scenes.cartridge){
    $("#btn-editCartridge").css("background", scenes.cartridge.color);
  }
  
  if(scenes.audio){
    Audio.load();
    Audio.toggleSound("show");
  }

//  if(scenes.title !== null){
//    alert("Loaded " + scenes.title);    
//  } else{
//    alert("Loaded cartridge");    
//  }
//  
  return true;
}


/* 




      SCENE CONTROLS
      
      
      


*/


const sceneControls = {
  // reset engine game
  reset: function(){
    localStorage.clear();
    window.location.reload();
  },

  /* 
    getScene
    give x, y
    returns the index based on simple formula
    
  */

  getSceneIndex: function (x, y) {
    
    if(x == undefined & y == undefined){
      x = active_scene.x;
      y = active_scene.y;
    }
    
    let i = (parseInt(x) * globals.MAP_width) + parseInt(y);

    return i;
  },

  /* 
    getScene
    give x, y
    returns scene object
  */

  getScene: function (x, y) {

    let i = (parseInt(x) * globals.MAP_width) + parseInt(y);
    return scenes.s[i];
  },

  /* 
    reassignScenes
    give a new scene object
    and update the scenes
  */

  reassignScenes: function (new_scene) {

    if (!new_scene) {
      return;
    }

    scenes.scene_count = new_scene.scene_count;
    scenes.start_scene = new_scene.start_scene;
    scenes.cartridge = new_scene.cartridge;
    scenes.s = new_scene.s;

  },

  copyScene: function (target, source) {

    target.x = source.x;
    target.y = source.y;
    target.color = source.color;
    target.object_count = source.object_count;
    target.objects = source.objects;
    target.textoverlay = source.textoverlay;
    target.effect = source.effect;
    target.effects = source.effects;
    target.title = source.title;
    target.caption = source.caption;

  },
  /* 
    checkActive
    see if given scene is the active scene
    
  */

  checkActive: function (s) {

    if (!s) {
      // you must provide a scene object
      return false;
    }

    if (active_scene.x == s.x && active_scene.y == s.y && active_scene.textoverlay == s.textoverlay && active_scene.effect == s.effect && active_scene.effects == s.effects && active_scene.color == s.color && active_scene.title == s.title && active_scene.caption == s.caption) {
      return true;
    }
    return false;

  },

  /*
  
    switchScene
    i: index of new scene (NOT coordinate value)
    o: index of old scene
  
  */
  switchScene: function (i, o) {

    // give a lil tutorial

    if (chance(.1)) {

      let text_tips = ["We're going to another place!", "What's your favorite map?", "Do you think that the browser can be a world?", "Do you feel the space between us on the internet?", "How weird that one click can bring us nearly everywhere else... there's no need to walk, run, or plan for transport. All you need is a URL and a dream.", "Deeper into the dungeon...", "When does a website begin feeling distant?", "When does a website begin feeling familiar?"];

      tip("Moving around the map", pick(text_tips), "tip");
    }

//    sceneControls.saveScene();
    sceneControls.clearScene();
    $("input[name='caption']").val("");
    $("input[name='title']").val("");

    // set to new active scene
    active_scene = scenes.s[i];

    sceneControls.loadColor();
    sceneControls.loadText();
    sceneControls.loadTitle();
    sceneControls.loadEffect();
    sceneControls.loadObjects();

//    console.log("Switched scene to " + active_scene.x + "," + active_scene.y);

    
    $("[text='scene']").text(`${active_scene.x},${active_scene.y}`);
    

    if (active_scene.x == scenes.start_scene.x && active_scene.y == scenes.start_scene.y) {
      // this is starting scene
      $("[action='sceneDelete']").attr("disabled", "");
      $("[action='sceneSetStarting']").prop("checked", true).attr("checked", "");
      $(".control-setstarting").prop("checked", true).attr("checked", "");
    } else{
      $("[action='sceneDelete']").removeAttr("disabled");
      $("[action='sceneSetStarting']").prop("checked", false).removeAttr("checked");
      $(".control-setstarting").prop("checked", false).removeAttr("checked");
    }


  },


  /* saveScene writes all objects and settings to the active scene */
  saveScene: function () {
    libraryText.saveText();

    if (libraryText.isTextOn()) { libraryText.toggleText(); }

    libraryEffects.saveEffect();

    active_scene.caption = $("#e").attr("title");
    active_scene.title = $("._scenetitle").text();

    objControls.saveObjects();
  },
  /* clearScene deletes all objects from the scene */
  clearScene: function () {

    libraryEffects.clear();
    libraryText.clearText();
    $("#e").attr("title", ""); // caption
    $("._scenetitle").text("Scene"); // title
    $("input[name='caption']").val("");
    $("input[name='title']").val("");

    $("#e .obj").each(function () {
      $(this).remove();
    });

  },

  loadColor: function () {

    if (active_scene.color == 0) {
      // defaults to black if color isn't set
      active_scene.color = "#000000";
    }

    $("input[type='color']").val(active_scene.color);
    $("#e").css("background", active_scene.color);
    $("body").css("background", active_scene.color);
  },

  loadText: function () {
    // loads text into editor
    let t = active_scene.textoverlay;
    t = t.replace(/&nbsp;/g, " ");

    $("#e #e-text textarea").hide().delay(100).fadeIn("slow").val(t);
  },

  loadEffect: function () {
    if (!active_scene.effect) return;

    // loads effect into the editor
    libraryEffects.clear();
    libraryEffects.change(active_scene.effect);
  },

  loadCaption: function () {
    if (!active_scene.caption) return;
    $("input[name='caption']").val(active_scene.caption);
    $("#e").attr("title", active_scene.caption);
  },

  loadTitle: function () {

    if (!active_scene.title) return;

    $(".library-scene-controls input[name='title']").val(active_scene.title);
    if (active_scene.title.length == 0 || active_scene.title == "Scene") {
      $("._scenetitle").text("Scene");
      $("input[name='title']").val("");
    } else {
      $("._scenetitle").text(active_scene.title);
      $("input[name='title']").val(active_scene.title);
    }
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

  initColorpicker: function () {

    $("input[type='color']").on('input', function () {

      let c = $(" input[type='color']").val();

      $("#e").css("background", c);
      $("body").css("background", c);
      
      if(sceneControls.editingCartridge){
        $("#e-cartridge").css("background", c);
      }

      active_scene.color = c;

      // change color of tile in map
      $("#scene_selector div._s.__active").css("background", c);
    });

  },
  
  // last scene before cartridge
  cartridgePrevScene: null,
  editingCartridge: false,

  // begin editing cartridge
  editCartridge: function () {
    

    $("#btn-savecartridge").fadeIn("slow");
    $("#btn-finishediting").fadeOut("slow"); 
    
    $(".sidebar-right").hide();
    $(".controls-text").hide();
    $("#effects").hide();
    
    // save current 
    sceneControls.cartridgePrevScene = sceneControls.getSceneIndex();

    
    sceneControls.saveScene();    
    sceneControls.clearScene();
    let c = scenes.cartridge;

    // MAP:remove the old scene
    $("#" + mapControls.MASTER + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");
    $("#" + mapControls.SIDE + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");

    // MAP: clear all the __active classes
    $("#" + mapControls.MASTER + " ._s").each(function (i, item) {
      $(item).removeClass("__active")
    });
    $("#" + mapControls.SIDE + " ._s").each(function (i, item) {
      $(item).removeClass("__active")
    });

    // make cartridge for the first time
    if (c == null) {

      scenes.cartridge = new Scene(-1, -1, true, "#000000", "", "", "", "", "", 0);
      active_scene = scenes.cartridge;

      // reset colors
      $("#e").css("background", "#000000");
      $("body").css("background", "#000000");
      $("input[type='color']").val("#000000");

    } else {
      active_scene = scenes.cartridge;
      sceneControls.loadColor();
      sceneControls.loadObjects();
    }
    
    $("#btn-editCartridge").css("background", scenes.cartridge.color);

    $("#engine-window [text='scene-title']").text("Cartridge");
    
    

  },
  loadCartridge: function() {
    
    $("#e-cartridge").html("");
    
    
    (scenes.cartridge.objects).forEach(function (e) {      
     let newObj = $(`<div class='obj'><img src='${e.img}'></div>`);

    $(newObj)
    .css("left", `${e.x}px`)
    .css("top", `${e.y}px`);

    if(e.filter){  $(newObj).css("filter", e.filter); }
    if(e.flip){  $(newObj).css("transform", e.flip); }
    if(e.size){  $(newObj).css("width", e.size).css("height", e.size); }
      
      $(newObj).hide().fadeIn(1500).appendTo("#e-cartridge");
    });
    
    
    
  },

  // save cartridge
  saveCartridge: function () {

    objControls.clearSelected();
    console.log("saving cartridge", active_scene);
    objControls.saveObjects();
    scenes.cartridge = active_scene;
    sceneControls.loadCartridge();

    // restore everything
    $("#e-cartridge").css("background", (scenes.cartridge).color);
    $(".sidebar-right").fadeIn("slow");
    $("#btn-savecartridge").fadeOut("slow");
    $("#effects").show();
    
    // restore old cartridge
    sceneControls.switchScene(sceneControls.cartridgePrevScene);
    sceneControls.cartridgePrevScene = null;

    if(scenes.title !== null){
      $("[text='cartridge-title']").html(scenes.title);
    }

    

  }

};

/*

    SCENE CONTROLS
    
    
*/

$("[action='sceneDelete']").on("click", function () {

  if (active_scene.x == scenes.start_scene.x && active_scene.y == scenes.start_scene.y) {
    alert("You can't delete your starting scene.");
    return;
  }

  if (!confirm("Do you want to delete your active scene, " + active_scene.x + "," + active_scene.y + "?")) {
    return;
  }

  let old_x = active_scene.x;
  let old_y = active_scene.y;

  // switch to starting scene
  sceneControls.clearScene();

  sceneControls.switchScene(sceneControls.getSceneIndex(scenes.start_scene.x, scenes.start_scene.y));
  scenes.s[sceneControls.getSceneIndex(old_x, old_y)] = null;

  mapControls.updateMap();

  alert("Scene " + old_x + "," + old_y + " deleted");

})

var copy_scene = null;

$("[action='sceneCopy']").on("click", function () {

  copy_scene = null;

  copy_scene = JSON.parse(JSON.stringify(active_scene));

  alert("Copied scene " + active_scene.x + "," + active_scene.y + "!");

  $("[action='scenePaste']").removeAttr("disabled");

})


$("[action='scenePaste']").on("click", function () {

  if (copy_scene == null) {
    alert("You haven't selected a scene to copy!")
    return;
  }


  if (!confirm("Do you want to replace this scene with contents from " + copy_scene.x + "," + copy_scene.y + "? This overwrites the current scene!")) {
    return;
  }

  sceneControls.clearScene();

  // loadObjects
  (copy_scene.objects).forEach(function (e) {
    objControls.addObj(e.img, e.x, e.y, e.filter, e.flip, e.size, e.interaction, e.interaction_target);
  })


  // loadColor

  if (copy_scene.color == 0) { copy_scene.color = "#000000"; }

  $("input[type='color']").val(copy_scene.color);
  $("#e").css("background", copy_scene.color);
  $("body").css("background", copy_scene.color);

  active_scene.color = copy_scene.color;

  $("#scene_selector div._s.__active").css("background", copy_scene.color);

  // loadText
  let t = copy_scene.textoverlay;
  t = t.replace(/&nbsp;/g, " ");
  $("#e #e-text textarea").hide().delay(100).fadeIn("slow").val(t);

  // loadEffects
  libraryEffects.clear();
  libraryEffects.change(copy_scene.effect);

  // loadTitle
  $(".library-scene-controls input[name='title']").val(copy_scene.title);
  if (copy_scene.title.length == 0 || copy_scene.title == "Scene") {
    $("._scenetitle").text("Scene");
    $("input[name='title']").val("");
  } else {
    $("._scenetitle").text(copy_scene.title);
    $("input[name='title']").val(copy_scene.title);
  }


  alert("Successfully copied scene " + copy_scene.x + "," + copy_scene.y + "!");

})



/* ON CLICK LISTENERS */

sceneControls.initColorpicker();


// EDIT CARTRIDGE

$(document).on("click", "[action='editCartridge']", function(){
   
  // if already editing
  if(sceneControls.editingCartridge) return;
  sceneControls.editingCartridge = true;
  
  

  $("h2[engine-window-text]").html("Editing cartridge");
  
  let titleInput = $(`<input type="text" id="cartridge-title" placeholder="untitled game">`).prependTo("#e");
  
  if(scenes.title !== null) $("#cartridge-title").attr("value", scenes.title);

  $("#cartridge-title").keyup(function () {
    scenes.title = $("#cartridge-title").val().trim();
  });
  
  // disable text
  if ($("button#btn-toggletext").hasClass("__toggled")) {
    $("#e #e-text").css("pointer-events", "none");
    $("button#btn-toggletext").removeClass("__toggled");
  }

  objControls.clearSelected();
  $("#tool-textoverlay").fadeOut();
  sceneControls.editCartridge();
  
  $("#btn-editCartridge")
    .html("save cartridge")
    .attr("action", "saveCartridge");
  
  
});

$(document).on("click", "[action='saveCartridge']", function(){


  $("#btn-editCartridge")
    .html("edit cartridge")
    .attr("action", "editCartridge");
  
  sceneControls.editingCartridge = false;
  $("#cartridge-title").remove();
  
  // reflect cartridge in player
  
  $("#tool-textoverlay").fadeIn();
  objControls.clearSelected();
  sceneControls.saveCartridge();
  alert(`${scenes.title === null ? "Cartridge" : scenes.title + " cartridge"} saved!`);
  $("h2[engine-window-text]").html(`
    <span text="cartridge-title" default="editing">Editing</span> 
          
          <span text="scene-title" class="_scenetitle" title="Your scene's title">Scene</span>
          
          <span text="scene" title="The coordinates of the scene you're currently editing!">${active_scene.x},${active_scene.y}</span>`);
  
  
});


// save

function saveEngine(){
  console.log("engine saved");
  localStorage.setItem("cartridge", JSON.stringify(scenes));
}

setInterval(function(){
saveEngine();
}, 15000)