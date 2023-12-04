console.log("player-test.js loaded");
console.log("Plug and play for Engine");

var cartridge = null; 
var scenes = null;

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

$("#btn-loadcartridge").on("click", function(){
  
  cartridge = $("#e-loadcartridge textarea").val();
  cartridge = cartridge.replace(/^\s+|\s+$/g, "")
                .replace(/\\n/g, "\\n")  
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
  
  cartridge = cartridge.replace(/[\u0000-\u0019]+/g,""); 

  console.log("Attempting to load: ", cartridge);
  
  if (testJSON(cartridge)) {

    scenes = JSON.parse(cartridge);

    if (scenes) {
      console.log("Loaded: ", scenes);
      
    } else {
      $("#play h2").text("Corrupted or empty cartridge");
      throw new Error();
    }

    $("#play h2").text("Loaded cartridge. Press play!");
    $("#e-loadcartridge").fadeOut();
    
    $("#btn-play").css("display", "inline-block").fadeIn("slow").on("click", function () {
      Tplayer.init();
      $(this).text("RELOAD");
    });
    
  } else {
    $("#play h2").text("Corrupted or empty cartridge");
    throw new Error();
  }

});


const globals = {

  // maximum objects allowed per scene
  MAX_object_count: 15,

  // map width (columns)
  MAP_width: 4,

  // map height (rows)
  MAP_height: 4

}

const c = {
  getSceneIndex: function (x, y) {
    let i = (parseInt(x) * globals.MAP_width) + parseInt(y);

    return i;
  },
  getScene: function (x, y) {

    let i = (parseInt(x) * globals.MAP_width) + parseInt(y);
    return scenes.s[i];
  },
  textConvert: function (text) {
    return text.replace(/\\n/g, "\n");
  }
}

/* PLAYER */

const Tplayer = {

  active: null,

  init: function () {
    
    Tplayer.clearGame();

    // load the cartridge
    Tplayer.loadCartridge();

    $("#e-cartridge").fadeIn(1000);

    setTimeout(function () {

      $("#e-cartridge").fadeOut("slow");
      $("#play h2").html("<span>Playing</span><span class='_playwhatscene'></span> ")
      $("._playwhatscene").text((Tplayer.active).x + "," + (Tplayer.active).y);

    }, 3000);

    $("#play").css("cursor", "not-allowed").css("pointer-events", "none").delay(4000).css("pointer-events", "auto").css("cursor", "auto");

    // load in starting scene
    Tplayer.loadPlay(scenes.start_scene.x, scenes.start_scene.y);

  },

  loadCartridge: function () {

    $("#play h2").text("Starting game...");

    (scenes.cartridge.objects).forEach(function (e) {
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

      let newObj = $(newSrc).hide().fadeIn(500);
      $("#e-cartridge").append(newObj);
    })

    $("#e-cartridge").css("background", scenes.cartridge.color);
    $("body").css("background", scenes.cartridge.color);

  },

  loadPlay: function (x, y) {

    $("#play h2").html("<span>Starting Game...</span>").fadeIn("slow");


    Tplayer.active = scenes.s[c.getSceneIndex(x, y)];

    // change text
    setTimeout(function () {

      $("#play h2").html("<span>Play</span><span class='_playwhatscene'></span> ")
      $("._playwhatscene").text((Tplayer.active).x + "," + (Tplayer.active).y);
      Tplayer.loadScene(x, y);

    }, 3000);

  },

  /* 
    clearGame
    deletes and clears the game
  */

  clearGame: function () {

    $("#e-cartridge").html(""); // clear cartridge

    $("#e-controls a").each(function (i, e) { // clear controls
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

  animatePulse: function () {

    let $w = $("#play"); // set to play window

    $w.css("transform", "scale(1.03)");

    setTimeout(function () {
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
        if (c.getScene(target[0], target[1]) == null) {
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

    // swap active scene
    Tplayer.active = c.getScene(x, y);

    // add text
    $("#e-play textarea").hide().delay(2000).fadeIn("slow").val(c.textConvert(Tplayer.active.textoverlay));

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

  },

  loadColor: function () {

    let c = (Tplayer.active).color;

    if (c == 0) {
      // defaults to black if color isn't set
      c = "#000000";
    }
    
    console.log(c);

    $("#e-play").css("background", c);
    $("body").css("background", c);

  },
  /* clearScene deletes all objects from the scene */
  clearScene: function () {
    $("#e-text textarea").val("");

    $("#e-play img.obj").each(function () {
      $(this).remove();
    });
  }

};
