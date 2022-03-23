console.log("loaded engine.js, Engine's playmode")

const cartridge = $("#cartridge").text();

var scenes = null;

if (testJSON(cartridge)) {

  scenes = JSON.parse(cartridge);

  if (scenes) {
    console.log("Loaded: ", scenes);
  } else {
    $("#play h2").text("Corrupted or empty game");
    throw new Error();
  }

  $("#btn-play").on("click", function () {
    Tplayer.init();
    $(this).text("RELOAD");
  });

} else {
  $("#play h2").text("Corrupted or empty game");
  throw new Error();
}


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

const globals = {
  MAX_object_count: 15,
  MAP_width: 4,
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
const Tplayer = {

  active: scenes.s[0],

  init: function () {

    Tplayer.clearGame();
    Tplayer.loadCartridge();

    $("#e-cartridge").fadeIn(1000);

    setTimeout(function () {

      $("#e-cartridge").fadeOut("slow");
      $("#play h2").html("<span>Playing</span><span class='_playwhatscene'></span> ")
      $("._playwhatscene").text((Tplayer.active).x + "," + (Tplayer.active).y);

    }, 3000);

    $("#play").css("cursor", "not-allowed").css("pointer-events", "none").delay(4000).css("pointer-events", "auto").css("cursor", "auto");
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

  },

  loadPlay: function (x, y) {

    $("#play h2").html("<span>Starting Game...</span>").fadeIn("slow");


    Tplayer.active = scenes.s[c.getSceneIndex(x, y)];
    setTimeout(function () {

      $("#play h2").html("<span>Play</span><span class='_playwhatscene'></span> ")
      $("._playwhatscene").text((Tplayer.active).x + "," + (Tplayer.active).y);

    }, 3000);

    Tplayer.loadScene(x, y);


    $("#e-play").css("background", (Tplayer.active).color);
  },
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
  updateSceneNavigation() {
    $("#e-controls a").each(function (i, e) {
      $(this)
        .removeClass("-inaccessible")
        .attr("data-target", "null")
        .unbind("click", Tplayer.loadTarget);

      var direction = $(this).data("direction");

      var convert = Tplayer.convertCoord(direction, Tplayer.active.x, Tplayer.active.y);
      if (convert == null) {
        $(this).addClass("-inaccessible");
        return;
      } else {

        let target = (convert.toString()).split(',');
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
    if (new_x == null || new_y == null) {
      return null;
    }

    return [new_x + "," + new_y];

  },
  loadScene: function (x, y) {
    Tplayer.clearScene();
    Tplayer.active = c.getScene(x, y);
    $("#e-play textarea").hide().delay(2000).fadeIn("slow").val(c.textConvert(Tplayer.active.textoverlay));
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
    $("._playwhatscene").text((Tplayer.active).x + "," + (Tplayer.active).y);
    Tplayer.loadColor();
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
  clearScene: function () {
    $("#e-text textarea").val("");

    $("#e-play img.obj").each(function () {
      $(this).remove();
    });
  }

};
