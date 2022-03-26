console.log("playerpreview.js loaded");

$("#tempplay").click(function () {
  $('html, body').animate({
    scrollTop: $("#window-map").offset().top
  }, 200);
});


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
  loadTarget: function () {

    let target = $(this).attr("data-target");
    let x = target.split(',')[0];
    let y = target.split(',')[1];

    if (x == null || y == null) {
      return;
    }
    
    // success
    Tplayer.loadScene(x, y);
    
    Tplayer.animatePulse(); // little animation

  },
  
    animatePulse: function(){

    let $w = $("#play"); // set to play window
    $w.css("transform", "scale(1.03)");
      
    setTimeout(function(){
    $w.css("transform", "scale(0.99)");
  }, 500);


  },

  // iterates through navigation options on the active scene and updates it accordingly based on what's possible
  updateSceneNavigation() {
    // clear all visual styles
    $("#e-controls a").each(function (i, e) {
      $(this)
        .removeClass("-inaccessible")
        .attr("data-target", "null")
        .unbind("click", Tplayer.loadTarget);

      var direction = $(this).data("direction");

      var convert = Tplayer.convertCoord(direction, Tplayer.active.x, Tplayer.active.y);

      // first, check if you can navigate to that scene
      if (convert == null) {
        $(this).addClass("-inaccessible");
        return;
      } else {

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

    Tplayer.active = sceneControls.getScene(x, y);

    // add text
    $("#e-play textarea").hide().delay(2000).fadeIn("slow").val( (Tplayer.active.textoverlay).replace(/\\n/g, "\n").replace(/&nbsp;/g, " ") );

    // add objects
    ((Tplayer.active).objects).forEach(function (e) {
      let newSrc = "";
      newSrc = "<img class='obj' data-selected='0' src='" + e.img + "' style='";

      newSrc += "top:" + e.y + "px; left:" + e.x + "px;";

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
      
      let newObj = $(newSrc).hide().fadeIn(1400);
      $("#e-play").append(newObj);
    })

    // update text
    $("._playwhatscene").text((Tplayer.active).x + "," + (Tplayer.active).y);

    // update the scene color
    Tplayer.loadColor();

    // update the scene navigation
    Tplayer.updateSceneNavigation();

  },

  loadColor: function () {

    let c = (Tplayer.active).color;

    if (c == 0) {
      c = "#000000";
    }

    $("#e-play").css("background", c);
    $("body").css("background", c);

  },
  /* clearScene deletes all objects from the scene */
  clearScene: function () {

    // first, save objects on scene
    //    objControls.saveObjects();

    
    libraryText.clearText();
    
    $("#e-play img.obj").each(function () {
      $(this).remove();
    });
  }
};

function loadPlay(x, y) {
  
  $("#play h2").html("<span>Starting Game...</span>").fadeIn("slow");
   
  // does the game have a cartridge?
  if( scenes.cartridge !== null){
    $("#play").css("cursor", "not-allowed").css("pointer-events", "none").delay(2000).css("pointer-events", "auto").css("cursor", "auto");

    // load the cartridge, if this is a replay
    if( $("#e-cartridge").css("display") == "none" ){$("#e-cartridge").fadeIn(800).delay(2000).fadeOut(1000);

    }
    else {
      // first, fade out cartridge very slowly lol
      $("#e-cartridge").delay(1000).fadeOut(1000);
    }
  } else{
    $("#e-cartridge").fadeOut();
    $("#play").css("pointer-events", "auto").css("cursor", "auto");
  }
  

  Tplayer.active = scenes.s[sceneControls.getSceneIndex(x, y)];

  // change text
  setTimeout(function () {
    $("#play h2").html("<span>Play</span><span class='_playwhatscene'></span> ")
    $("._playwhatscene").text((Tplayer.active).x + "," + (Tplayer.active).y);

  }, 1800);

  Tplayer.loadScene(x, y);


  $("#e-play").css("background", (Tplayer.active).color);
}


$("#btn-play").on("click", function () {
  objControls.saveObjects();
  loadPlay(scenes.start_scene.x, scenes.start_scene.y);
});


$("#btn-clear").on("click", function () {
  $("#e-play").css("background", "#000000");
  Tplayer.clearGame();
});
