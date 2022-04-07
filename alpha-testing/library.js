console.log("library.js loaded");

/*


  TEXT TEST
  

*/





/* 

  libraryText 
  handles all text editing functions...
  
  
*/

const libraryText = {

  $EDITbtn: "#btn-edittextoverlay",
  $SAVEbtn: "#btn-savetextoverlay",
  $TEXT_EDITOR: "e textarea",
  $TEXT: "e #e-text",

  init: function () {
    // click, edit text
    $("button#btn-toggletext").on("click", function () {
      libraryText.toggleText();
    });

    $("#" + libraryText.$TEXT_EDITOR).keyup(function () {
      libraryText.saveText();
    });

  },

  toggleText: function () {

    if ($("button#btn-toggletext").hasClass("__toggled")) {
      $("button#btn-toggletext").removeClass("__toggled");
    } else {
      $("button#btn-toggletext").addClass("__toggled");
    }

    if ($("#e #e-text").css("pointer-events") == "none") {
      $("#" + libraryText.$TEXT).css("pointer-events", "all");
    } else {
      $("#" + libraryText.$TEXT).css("pointer-events", "none");
    }

    libraryText.saveText();
    console.log("text toggled");

  },
  // loadText: laod text into active scene
  loadText: function () {
    $("#" + libraryText.$TEXT_EDITOR).hide().fadeIn(100).val(active_scene.textoverlay);
  },

  clearText: function () {
    $("#" + libraryText.$TEXT_EDITOR).val("");
  },

  // saveText: save text into active scene
  saveText: function () {

    let t = $("#" + libraryText.$TEXT_EDITOR).val();
    console.log(t);
    // preserve whitespace

    if (t !== null) {
      //      t = t.replace( / /g, "&nbsp;" );
    }

    active_scene.textoverlay = t;
  },

  disableText: function () {
    // first, save
    libraryText.saveText();
    // disable text editing
    $("#" + libraryText.$TEXT_EDITOR).css("pointer-events", "none");
    $("#" + libraryText.$TEXT).css("pointer-events", "none");
  }
}

libraryText.init();

/*


  LIBRARY
  

*/


// LOADS LIBRARY SHIT

// pathing: environment / ...

const library = {

  environment: ["stone-1", "flower-1", "stone-2", "moon-1", "moon-2", "moon-3", "leaf", "leaf-2", "twig", "leaf-3", "rock", "bush", "bush-2"],
  faces: ["8D", "blank", "fear", "joy", "hmm", "kiss", "nerd", "ninja", "rage", "sad", "tear", "vomit", "worry"],
  digital: ["bomb", "case", "clock", "computer-2", "computer", "cursor", "dude", "exclamation", "package", "paint", "paper", "pointer", "save", "stack", "trash", "printer"],
  monsters: ["chad", "child", "dude", "dude-2", "dude-3", "dude-4", "eye", "flyingfuck", "ghost", "head", "rawr", "skull"],
  items: ["person", "hair", "heart", "heart-half", "cash", "cashbag", "clock", "coin", "coin-number", "frame", "gem", "gem-2", "gold", "magnify", "pouch", "sandglass", "wine", "beer", "coffee", "drink", "note", "megaphone", "shroom", "sword", "pizza", "cake"],
  chat: ["chat-dot", "chat-exclaim", "chat-line", "chat-no", "chat-yes", "chat-ok", "chat", "gameover", "off", "on"],
  clouds: ["1", "2", "3", "4", "5", "6", "7"]

};

// object constructor

function thingy(x, y, img, filter, flip, size, interaction, interaction_target) {
  this.x = x;
  this.y = y;
  this.img = img;
  this.filter = filter;
  this.flip = flip;
  this.size = size;
  this.interaction = interaction;
  this.interaction_target = interaction_target;
}


/* 

  libraryControls
  Handles the library objects that appear
  
  
*/

const libraryControls = {

  $LIBRARY_OBJECTS: "library-objects",

  init: function () {},

  clicktoadd: function () {

    // Make sure there are no more than 10 objects
    if (active_scene.object_count >= globals.MAX_object_count) {
      alert("Sorry, you can't add any more.")
      return;
    } else {
      active_scene.object_count++;
      $("._howmany").text(active_scene.object_count);

    }

    let o = objControls.addObj($(this).attr("src"));

    objControls.moveObj(o);
  },

  load: function (what) {

    $("#" + libraryControls.$LIBRARY_OBJECTS).html("");

    library[what].forEach(function (e, i) {

      $("#" + libraryControls.$LIBRARY_OBJECTS).prepend("<img class='_toadd' src='https://engine.lol/alpha/assets/image/" + what + "/" + e + ".gif'>");

    });

    $("#library .library-selector").fadeIn("slow");


    // clear bindings first
    $("#library .library-selector").unbind("dblclick");

    // add onclick events
    $("#library .library-selector").on("dblclick", "img._toadd", libraryControls.clicktoadd);
  },

  clear: function () {


  }
}




$("#library select[name='library-category']").change(function () {


  let n = $("#library select[name='library-category']").val();

  console.log(n);

  libraryControls.load(n);
});


$("#objectinteractions select[name='objinteraction-select']").change(function () {

  let how = $("#objectinteractions select[name='objinteraction-select']").val();

  $("#e img.obj[data-selected='1']").attr("data-interaction", how);


});




/* 




      OBJECT CONTROLS
      
      
      


*/



const objControls = {
  // t = object

  // SELECT/DESELECT via double-click
  selectObj: function (t) {

    // I am double-clicking the image I currently selected
    if ($(this).attr("data-selected") == "1") {
      objControls.clearSelected();
      return;
    } else {
      objControls.clearSelected();
      objControls.moveObj(this);
      return;

    }

  },

  // moving object
  moveObj: function (t) {

    // fade in controls
    $(".controls-selected").show();

    $(t)
      .bind("dblclick", objControls.selectObj)
      .css("box-shadow", "0 0 20px #ffffff")
      .attr("data-selected", "1")
      .draggable({
        disabled: false,
        grid: [40, 40],
        containment: "#e",
        stop: function () {
          objControls.updatePos(t);
        }
      });

    return;

  },

  // add object
  addObj: function (src, x, y, filter, flip, size, interaction, interaction_target) {
    // first, deselect all objects
    objControls.clearSelected();

    $(".__x").text("0");
    $(".__y").text("0");

    let newSrc;
    newSrc = "<img class='obj' data-selected='0' src='" + src + "' style='";

    newSrc += "top:" + y + "px; left:" + x + "px;";

    if (filter) {
      newSrc += "filter:" + filter + ";";
    }

    if (flip) {
      newSrc += "transform:" + flip + ";"
    }

    if (size) {
      newSrc += "width:" + size + "; height:" + size + ";";
    }

    newSrc += "'";

    if (interaction) {

      newSrc += " data-interaction='" + interaction + "'";

      newSrc += "data-interaction-target='" + interaction_target + "'";
    }

    newSrc += ">";

    let newObj = $(newSrc).hide().fadeIn(1000);
    $("#e").append(newObj);

    return newObj;
  },

  // remove object 
  delObj: function (t) {

    if (t) {
      t.remove();
    } else {
      $("#e .obj[data-selected='1']").remove();
    }

    active_scene.object_count--;
    $("._howmany").text(active_scene.object_count);


    // add error handling here, catch if no objec twas removed

    $(".controls-selected").hide();

  },

  size: function (how) {

    let t = $("#e img.obj[data-selected='1']");

    if (how == "up") {
      t.css("width", t.width() * 1.25 + "px");
      t.css("height", t.height() * 1.25 + "px");
    } else {
      t.css("width", t.width() * 0.75 + "px");
      t.css("height", t.height() * 0.75 + "px");
    }

  },

  effect: function (how) {

    let t = $("#e img.obj[data-selected='1']");

    switch (how) {

      case "invert":
        if (($(t).css("filter") == 'invert(1)')) {
          $(t).css("filter", "invert(0)");
        } else {
          $(t).css("filter", "invert(1)");
        }

        break;

      case "flip":

        console.log("please");

        console.log($(t).css("transform"));

        if ($(t).css("transform") == "scale(-1, 1)" || $(t).css("transform") == "matrix(-1, 0, 0, 1, 0, 0)") {
          $(t).css("transform", "scale(1,1)");
        } else {
          $(t).css("transform", "scale(-1,1)");
        }

        break;
    }

  },

  // write all positions of objects in engine dom to array of objects, and get it in scene
  saveObjects: function () {

    // first clear objects in the existing scene
    active_scene.objects = [];

    $("#e .obj").each(function () {
      let e = $(this);

      (active_scene.objects).push(new thingy(e.position().left, e.position().top, e.attr('src'), e.css('filter'), e.css('transform'), e.css('width'), e.attr('data-interaction'), e.attr('data-target')));

    });

  },

  // render all information from the scene
  getSceneInfo: function () {


  },

  // OTHER HANDLERS

  updatePos: function (t) {
    let pos = $(t).position();

    console.log(pos);

    $(".__x").text(pos.left);
    $(".__y").text(pos.top);
  },

  // resets all objects on dom
  clearSelected: function () {

    $(".controls-selected").hide();

    // reset position

    $(".__x").text("");
    $(".__y").text("");

    $("#e .obj").each(function () {
      $(this)
        .css("box-shadow", "none")
        .attr("data-selected", "0");
    });

  },

  /*
  
    OBJECT INTERACTIONS
    
    
  */
  addInteraction() {

  }
};


/*



    INITIALIZE AND REFERENCE HERE
    
    

*/

libraryControls.load("faces");
