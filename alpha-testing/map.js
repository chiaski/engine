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

  initMap: function (x, y) {

    var map_html = "";

    console.log("init at: " + x + "," + y);

    for (let i = 0; i < globals.MAP_height; i++) {
      for (let j = 0; j < globals.MAP_width; j++) {
        if (x !== null && y !== null && i == x && j == y) {
          console.log("b");
          map_html += ("<div class='_s __active __start' data-active='active' data-scene='" + i + "," + j + "'>" + i + "," + j + "</div>");

        } else if (x == null && y == null && i == 0 && j == 0) {
          map_html += "<div class='_s __active __start' data-active='active' data-scene='" + i + "," + j + "'>" + i + "," + j + "</div>";
          continue;
        } else {

          map_html += "<div class='_s __unused' data-active='unused'  data-scene='" + i + "," + j + "'>" + i + "," + j + "</div>";
        }
      }
      map_html += "<hr>";
    }

    $('#' + mapControls.MASTER).append(map_html);
    $('#' + mapControls.SIDE).append(map_html);

    // add onclick events
    $('#' + mapControls.MASTER).on("click", "div._s", mapControls.mapSwitch);
    $('#' + mapControls.SIDE).on("click", "div._s", mapControls.mapSwitch);
  },

  clearMap: function () {

    $('#' + mapControls.MASTER).html("");
    $('#' + mapControls.SIDE).html("");

  },

  // loads in a map based on new scenes, similar to initMap
  // note that this doesn't replace the scene data
  loadMap: function (data) {

    // adjust to the amount of scenes

    $('#' + mapControls.MASTER).off("click", "div._s", mapControls.mapSwitch);
    $('#' + mapControls.SIDE).off("click", "div._s", mapControls.mapSwitch);

    var map_html = "";

    // update start scene
    scenes.start_scene.x = data.start_scene.x;
    scenes.start_scene.y = data.start_scene.y;

    let x = scenes.start_scene.x;
    let y = scenes.start_scene.y;

    for (let i = 0; i < globals.MAP_height; i++) {
      for (let j = 0; j < globals.MAP_width; j++) {

        // starting scene
        if (x !== null && y !== null && i == x && j == y) {
          map_html += ("<div class='_s __active __start' data-active='active' data-scene='" + i + "," + j + "'>" + i + "," + j + "</div>");

        } else if (x == null && y == null && i == 0 && j == 0) {

          // another starting scene
          map_html += "<div class='_s __active __start' data-active='active' data-scene='" + i + "," + j + "'>" + i + "," + j + "</div>";

        } else {
          // check if scene is used or not
          if (data.s[sceneControls.getSceneIndex(i, j)] == null) {
            // unused scene
            map_html += "<div class='_s __unused' data-active='unused'  data-scene='" + i + "," + j + "'>" + i + "," + j + "</div>";
          } else {
            let c = data.s[sceneControls.getSceneIndex(i, j)].color;

            if (c == 0) {
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
    $('#' + mapControls.MASTER).on("click", "div._s", mapControls.mapSwitch);
    $('#' + mapControls.SIDE).on("click", "div._s", mapControls.mapSwitch);

    console.log(`



  `);
    console.log(map_html);

  },

  /* 
  
    updateMap
    Refreshes the map based on scene data, especially useful when loading in cartridges.
  
  */

  updateMap: function () {

    // first, get the corresponding index based on the data-scene attribute of ._s



    $("#" + mapControls.MASTER + " ._s").each(function (i, item) {

      let coord = $(this).attr("data-scene").split(',');
      let indx = sceneControls.getSceneIndex(parseInt(coord[0]), parseInt(coord[1])); // indice in scenes.s[indx]

      $(this).removeClass("__active").removeClass("__inactive").removeClass("__unused").removeClass("__start")

      if (scenes.s[indx] == null) {

        $(this).css("background", "#000000");
        $(this).addClass("__unused");

      } else if (scenes.s[indx] !== null) {
        // check if it's the active scene
        if (sceneControls.checkActive(scenes.s[indx])) {
          $(this).addClass("__active");
        } else {
          // otherwise it's just inactive
          $(this).addClass("__inactive");
        }

        // check if it's the start scene
        if (scenes.start_scene.x == coord[0] && scenes.start_scene.y == coord[1]) {
          $(this).addClass("__start");
        }

      }
    });

    $("#" + mapControls.SIDE + " ._s").each(function (i, item) {

      let coord = $(this).attr("data-scene").split(',');
      let indx = sceneControls.getSceneIndex(parseInt(coord[0]), parseInt(coord[1])); // indice in scenes.s[indx]

      $(this).removeClass("__active").removeClass("__inactive").removeClass("__unused").removeClass("__start")


      if (scenes.s[indx] == null) {
        $(this).css("background", "#000000");
        $(this).addClass("__unused");
      } else if (scenes.s[indx] !== null) {
        // check if it's the active scene
        if (sceneControls.checkActive(scenes.s[indx])) {
          $(this).addClass("__active");
        } else {
          // otherwise it's just inactive
          $(this).addClass("__inactive");
        }

        // check if it's the start scene
        if (scenes.start_scene.x == coord[0] && scenes.start_scene.y == coord[1]) {
          $(this).addClass("__start");
        }

      }
    });



  },

  // remove all active scenes
  clearMapActive: function () {

    $("#" + mapControls.MASTER + " ._s").each(function (i, item) {
      $(item).removeClass("__active")
    });
    $("#" + mapControls.SIDE + " ._s").each(function (i, item) {
      $(item).removeClass("__active")
    });

  },

  // remove all active scenes
  clearMapStart: function () {

    $("#" + mapControls.MASTER + " ._s").each(function (i, item) {
      $(item).removeClass("__start")
    });
    $("#" + mapControls.SIDE + " ._s").each(function (i, item) {
      $(item).removeClass("__start")
    });

  },


  // update the map's active scene
  updateActive: function (x, y) {

    // add active class
    $("#" + mapControls.MASTER + " ._s[data-scene='" + x + "," + y + "']").removeClass("__unused").removeClass("__inactive").addClass("__active");

    $("#" + mapControls.SIDE + " ._s[data-scene='" + x + "," + y + "']").removeClass("__unused").removeClass("__inactive").addClass("__active");

  },

  /* 
  
    switchScene
    Switches the active scene and updates the maps accordingly.
    
  */

  mapSwitch: function (t) {

    sceneControls.saveScene(); // first, let's save the scene

    let coord = $(this).attr("data-scene").split(',');
    let i = sceneControls.getSceneIndex(parseInt(coord[0]), parseInt(coord[1])); // indice in scenes.s[i]

    console.log("coord: " + coord[0] + "," + coord[1]);

    // –––––––––––––––––––
    // Scene does not exist
    // –––––––––––––––––––

    if (typeof scenes.s[i] == 'undefined' || scenes.s[i] == null || $(this).hasClass("unused__")) {

      if (!confirm("Do you want to create a new scene at " + coord + "?")) {
        return;
      }

      // remove active scenes
      $("#" + mapControls.MASTER + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");
      $("#" + mapControls.SIDE + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");

      // creating a new scene at that indice
      scenes.s[i] = new Scene(parseInt(coord[0]), parseInt(coord[1]), true, "#000000", "", 0);

      // switching to the new scene
      sceneControls.switchScene(i);

      mapControls.updateActive(active_scene.x, active_scene.y); // add active class


      $("#scene_selector div._s.__active").css("background", active_scene.color); //retain scene color 


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

    sceneControls.switchScene(i);
    mapControls.clearMapActive();

    $("." + mapControls.SCENE_DISPLAY).text(coord[0] + "," + coord[1]); // update scene

    mapControls.updateActive(active_scene.x, active_scene.y); // add active class

  }
}

$("#btn-changestartingscene").on("click", function () {

  $(".blocker").fadeIn();
  $(".window#map").css("z-index", "10");
  $("#window-map")[0].scrollIntoView();

  $("#map-controls").css("pointer-events", "none").css("opacity", "0.5");
  $("body").css("overflow", "hidden");

  // add onclick events
  $('#' + mapControls.MASTER).off("click", "div._s", mapControls.mapSwitch);

  // any scene that doesn't have unused
  $('#' + mapControls.MASTER + ' ._s:not(".__unused")').on("click", function () {

    let coord = $(this).attr("data-scene").split(',');
    let i = (parseInt(coord[0]) * globals.MAP_width) + parseInt(coord[1]); // indice in scenes

    if (!confirm("Do you want to change the starting scene to " + coord + "? You'll also switch to it in the Editor.")) {
      return;
    }

    mapControls.clearMapStart();
    $("#" + mapControls.MASTER + " ._s[data-scene='" + coord[0] + "," + coord[1] + "']").addClass("__start");
    $("#" + mapControls.SIDE + " ._s[data-scene='" + coord[0] + "," + coord[1] + "']").addClass("__start");

    scenes.start_scene.x = coord[0];
    scenes.start_scene.y = coord[1];

    sceneControls.switchScene(i);

    $(".blocker").fadeOut();
    $(".window#map").css("z-index", "1");

    $("#map-controls").css("pointer-events", "auto").css("opacity", "1");
    $("body").css("overflow", "auto");

    $('#' + mapControls.MASTER + ' ._s:not(".__unused")').off("click");
    $('#' + mapControls.MASTER).on("click", "._s", mapControls.mapSwitch);
  });

})

mapControls.initMap();
