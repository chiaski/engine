console.log("play-test.js loaded");

$("#tempplay").click(function () {
  $('html, body').animate({
    scrollTop: $("#window-map").offset().top
  }, 200);
});


$("#e-play");


// LOAD CARTRIDGE

const Tplayer = {

  active: scenes.s[0],

  
  /* 
    clearGame
    deletes and clears the game
  */
  
  clearGame: function(){
    
    // clear all visual styles
    $("#e-controls a").each(function (i, e) {
      $(this)
        .removeClass("-inaccessible")
        .addClass("-inaccessible")
        .attr("data-target", "null")
        .unbind("click", Tplayer.loadTarget);
    });
    
    Tplayer.clearScene();
  },

  loadGame: function () {

    console.log(scenes);
    (scenes.s).forEach(function (item) {

    });


  },

  loadTarget: function () {


    let target = $(this).attr("data-target");
    let x = target.split(',')[0];
    let y = target.split(',')[1];


    if (x == null || y == null) {
      return;
    } else {
      Tplayer.loadScene(x, y);
    }

  },

  // iterates through navigation options on the active scene and updates it accordingly based on what's possible
  updateSceneNavigation() {

    //      console.log("updateSceneNavigation");

    // clear all visual styles
    $("#e-controls a").each(function (i, e) {
      $(this)
        .removeClass("-inaccessible")
        .attr("data-target", "null")
        .unbind("click", Tplayer.loadTarget);

      var direction = $(this).data("direction");

      var convert = Tplayer.convertCoord(direction, Tplayer.active.x, Tplayer.active.y);
      //        console.log("convert: " + convert);

      // first, check if you can navigate to that scene
      if (convert == null) {
        $(this).addClass("-inaccessible");
        return;
      } else {

        //                console.log( (convert.toString()).split(','));
        //                let target = [0, 0];
        let target = (convert.toString()).split(',');

        // next, check if a scene exists there
        if (sceneControls.getScene(target[0], target[1]) == null) {
          $(this).addClass("-inaccessible");
          return;
        }

        $(this)
          .attr("data-target", target[0] + "," + target[1])
          .bind("click", Tplayer.loadTarget);
      }

    });

    //      console.log("updateSceneNavigation done");


  },

  // give direction and origin x,y
  // returns coordinates of new x, y in direction

  convertCoord: function (direction, x, y) {

    let new_x, new_y;

    switch (direction) {

      case "n":
        if (x > 0) {
          new_x = x - 1;
        } else {
          new_x = null;
        }
        new_y = y;
        break;

      case "e":

        if (y < globals.MAP_width - 1) {
          new_y = y + 1;
        } else {
          new_y = null;
        }

        new_x = x;
        break;

      case "w":
        if (y > 0) {
          new_y = y - 1;
        } else {
          new_y = null;
        }
        new_x = x;
        break;

      case "s":

        if (x < globals.MAP_height - 1) {
          new_x = x + 1;
        } else {
          new_x = null;
        }

        new_y = y;
        break;
    }

    //          console.log("convertCoord:" + x + ',' + y + "  |  " + new_x + "," + new_y);

    // returns null if unconvertable
    if (new_x == null || new_y == null) {
      return null;
    }

    return [new_x + "," + new_y];

  },

  // loads scene (x,y)
  loadScene: function (x, y) {

    // first, clear scene
    Tplayer.clearScene();

    console.log(x, ",", y);
    Tplayer.active = sceneControls.getScene(x, y);

    console.log(Tplayer.active);


    // add objects
    ((Tplayer.active).objects).forEach(function (e) {
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
      $("#e-play").append(newObj);
    })


    // update text
    $("._playwhatscene").text((Tplayer.active).x + "," + (Tplayer.active).y);

    // update the scene color
    Tplayer.loadColor();

    // update the scene navigation
    Tplayer.updateSceneNavigation();

    console.log("loaded scene:" + x + "," + y);

  },

  loadColor: function () {

    let c = (Tplayer.active).color;

    if (c == 0) {
      // defaults to black if color isn't set
      c = "#000000";
    }

    $("#e-play").css("background", c);
    $("body").css("background", c);

  },
  /* clearScene deletes all objects from the scene */
  clearScene: function () {

    // first, save objects on scene
    //    objControls.saveObjects();

    $("#e-play *").each(function () {
      $(this).remove();
    });

  },

  // what scenes are accessible from this
  check: function (coord) {


    // returns what scenes are next to it

  }

};

function loadPlay(x, y) {
  
  $("#play h2").html("<span>Starting Game...</span>").fadeIn("slow");
  
  setTimeout(function(){

$("#play h2").html("<span>Play</span><span class='_playwhatscene'></span> ")

},8000);
  
  $("#play").css("cursor", "not-allowed").css("pointer-events", "none").delay(5000).css("pointer-events", "auto").css("cursor", "auto");
  
  // load the cartridge, if this is a replay
  if( $("#e-cartridge").css("display") == "none" ){
  $("#e-cartridge").fadeIn(1500).delay(5000).fadeOut(3000);

  } else{
     // first, fade out cartridge very slowly lol
  $("#e-cartridge").delay(3000).fadeOut(3000);
  }
  
  
 
  Tplayer.active = scenes.s[sceneControls.getSceneIndex(x, y)];

  Tplayer.loadScene(x, y);

  $("._playwhatscene").text((Tplayer.active).x + "," + (Tplayer.active).y);

  $("#e-play").css("background", (Tplayer.active).color);


}



$("#btn-play").on("click", function () {

  objControls.saveObjects();
  loadPlay(scenes.start_scene.x, scenes.start_scene.y);

});

$("#btn-clear").on("click", function () {

  $("#e-play").html("");
  $("#e-play").css("background", "#000000");
  
  Tplayer.clearGame();

});
