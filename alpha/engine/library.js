console.log("library.js loaded");






/* 

  libraryEffects 
  handles all effects functions...
  
  
*/

const libraryEffects = {

  change: function (what) {

    libraryEffects.clear();

    if (!libraryEffects.exists(what)) {
      $("#e #e-effects").data("active", "none");
      $("select[name='effects-category']").val("none");
      return;
    }

    $("#e #e-effects").data("active", what);
    $("select[name='effects-category']").val(what);

    switch (what) {
      case "flowerpetals":
        libraryEffects.changeBG("flowerpetals.gif");
        $("#e #e-effects").css("background-size", "cover");
        break;

      case "scanlines":
        libraryEffects.changeBG("scanlines.gif");
        $("#e #e-effects").css("background-size", "cover").css("background-repeat", "repeat").css("mix-blend-mode", "multiply").css("opacity", 0.8);
        break;

      case "softblur":
        $("#e #e-effects").css("backdrop-filter", "blur(1px)");
        break;

      case "mediumblur":
        $("#e #e-effects").css("backdrop-filter", "blur(3px)");
        break;

      case "hardblur":
        $("#e #e-effects").css("backdrop-filter", "blur(12px)");
        break;

      case "lightshadow":
        $("#e #e-effects").css("box-shadow", "inset 0 0 50px #fff");
        break;

      case "mediumshadow":
        $("#e #e-effects").css("box-shadow", "inset 0 0 100px #fff");
        break;

      case "hardshadow":
        $("#e #e-effects").css("box-shadow", "inset 0 0 100px #fff, inset 0 0 200px #fff");
        break;

      case "redshadow":
        $("#e #e-effects").css("box-shadow", "inset 0 0 100px red");
        break;

      case "hardredshadow":
        $("#e #e-effects").css("box-shadow", "inset 0 0 200px red, inset 0 0 400px red");
        break;
    }

    libraryEffects.saveEffect();
  },

  exists: function (what) {
    return $("select[name='effects-category']  option[value='" + what + "']").length > 0;
  },


  // saveEffect: save effect into active scene
  saveEffect: function () {
    active_scene.effect = $("#e-effects").data("active");
    active_scene.effects = $("#e-effects").attr("style");
  },

  changeBG: function (what) {

    $("#e #e-effects").css("background-image", "url('https://engine.lol/alpha/assets/effects/" + what + "'");
  },

  clear: function () {
    $("#e #e-effects")
      .css("mix-blend-mode", "none")
      .css("backdrop-filter", "none")
      .css("filter", "none")
      .css("box-shadow", "none")
      .css("color", "none")
      .css("background", "none")
      .css("background-size", "cover")
      .css("background-image", "none");
  }

}


/* 

  libraryText 
  handles all text editing functions...
  
  
*/

const libraryText = {

  $EDITbtn: "#btn-edittextoverlay",
  $SAVEbtn: "#btn-savetextoverlay",
  $TEXT_EDITOR: "e textarea",
  $TEXT: "e #e-text",
  fonts: ["Times Now", "Comic Sans MS", "Arial", "FA Sysfont C", "Helvetica", "Courier New", "Georgia", "Garamond", "Tahoma", "Arial Black", "Brush Script MT", "Verdana", "Trebuchet MS", "monospace", "cursive"],

  init: function () {
    // click, edit text
    $("button#btn-toggletext").on("click", function () {

      if (chance(.03)) {

        let text_tips = ["Text can be used for speech, but it can also be used for backgrounds... or you can make a text-only game.", "Are you ready for what you have to say to be shown to the world?", "Words are a magical part of our lives...", "Texts can connect us all...", "An asterisk can be a list, a star, a flower...", "I love words.", "Ahh! Sometimes spaces and line breaks don't consistently export. Sorry about that. I'm working on myself.", "You don't always have to say something new...", "What is a word, really?", "What kind of language can you shape here?", "I'm listening... I know they'll listen, too."]

        tip("Tip on Text", pick(text_tips), "tip");
      }

      libraryText.toggleText();
    });

    $("button#btn-changefonttext").on("click", function () {
      libraryText.changeFont();
    });

    $("#" + libraryText.$TEXT_EDITOR).keyup(function () {
      libraryText.saveText();
    });


    $("#" + libraryText.$TEXT_EDITOR).keyup(function () {
      libraryText.saveText();
    });

  },

  isTextOn: function () {
    
    if( $("#btn-toggletext").is("[editing]") ) return true;
    return false;
//    if ($("button#btn-toggletext").hasClass("__toggled")) return true;
//    
//
//    return false;
  },

  toggleText: function () {

    if (libraryText.isTextOn()) {
      $("#btn-toggletext").text("Write  text");
      window.removeEventListener("keydown", arrow_keys_handler, false);
      window.addEventListener("keydown", arrow_keys_handler, false);
      
      $("#btn-toggletext").removeAttr("editing");
      $("#e #e-text textarea").removeClass("__toggled");
    } else {

      objControls.clearSelected();
      objControls.saveObjects();
      $("#btn-toggletext").text("Finish writing");
      $("#e #e-text textarea").focus();
      window.removeEventListener("keydown", arrow_keys_handler, false);
      $("#e #e-text textarea").addClass("__toggled");
      $("#btn-toggletext").attr("editing", "");
    }

    if ($("#e #e-text").css("pointer-events") == "none") {
      $("#" + libraryText.$TEXT).css("pointer-events", "all");
    } else {
      $("#" + libraryText.$TEXT).css("pointer-events", "none");
    }

    libraryText.saveText();
  },

  changeFont: function () {

    let font_random = pick(libraryText.fonts);

    scenes.font = font_random;

    $("#e textarea").css("font-family", font_random);
    $("#e-play textarea").css("font-family", font_random);
    $("#tool-textoverlay *").css("font-family", font_random);
    
    
  },

  // loadText: laod text into active scene
  loadText: function () {

    var t = active_scene.textoverlay;

    if (t == null || t == undefined) {
      t = "";
    }

    t = t.replace(/\\n/g, "\n").replace(/&nbsp;/g, " ");

    $("#" + libraryText.$TEXT_EDITOR).hide().fadeIn(100).val(t);
  },

  clearText: function () {
    $("#" + libraryText.$TEXT_EDITOR).val("");
  },

  // saveText: save text into active scene
  saveText: function () {

    let t = $("#" + libraryText.$TEXT_EDITOR).val();
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

  everything: ["apple","bottle","brush","candle","chair","chiar","coin","cow","firefly","flower","key","lamp","lantern","mug","pawn","rabbit","spoon"],
  jamiecross: ["arrow-down","arrow-left","arrow-up","box","brick1","brick2","brick3","button","chain1","chain2","chest","climb","climb1","climb2","dirt","door","fall","fire","ghost","grass","heart","idle","jewel","key","keyblock","ladder","lava","leap","magic","run","run1","run2","run3","soar","spider"],
  environment: ["stone-1", "flower-1", "stone-2", "moon-1", "moon-2", "moon-3", "leaf", "leaf-2", "twig", "leaf-3", "rock", "bush", "bush-2"],
  faces: ["8D", "blank", "fear", "joy", "hmm", "kiss", "nerd", "ninja", "rage", "sad", "tear", "vomit", "worry"],
  digital: ["bomb", "case", "clock", "computer-2", "computer", "cursor", "dude", "exclamation", "package", "paint", "paper", "pointer", "save", "stack", "trash", "printer"],
  monsters: ["chad", "child", "dude", "dude-2", "dude-3", "dude-4", "eye", "flyingfuck", "ghost", "head", "rawr", "skull"],
  items: ["person", "hair", "heart", "heart-half", "cash", "cashbag", "clock", "coin", "coin-number", "frame", "gem", "gem-2", "gold", "magnify", "pouch", "sandglass", "wine", "beer", "coffee", "drink", "note", "megaphone", "shroom", "sword", "pizza", "cake"],
  chat: ["chat-dot", "chat-exclaim", "chat-line", "chat-no", "chat-yes", "chat-ok", "chat", "gameover", "off", "on"],
  clouds: ["1", "2", "3", "4", "5", "6", "7"],
  softbank: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67"]
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

  init: function() {
    
  
    libraryControls.load("faces");
//    
//    $('#library ._toadd').draggable({
//        helper: 'clone',
//        appendTo: 'body',
//        revert: false,
//        zIndex: 100,
//        start: function(event, ui) {
//            $(ui.helper).addClass('draggable-helper').addClass('-obj-temp'); 
//        }
//    });
//    
    
    $('#e').droppable({
        accept: '._toadd',
        drop: function(event, ui) {
          
          objControls.wasAccepted = true;
          
          console.log($(ui.helper));
          var draggedPos = ui.helper.offset();
          var containerOffset = $(this).offset(); // #e

          var relativeLeft = draggedPos.left - containerOffset.left;
          var relativeTop = draggedPos.top - containerOffset.top;
            
//          console.log(draggedPos, containerOffset, draggedPos.top,  containerOffset.top)
          
          
          // append and select new object
          let newObj = objControls.addObj( ui.helper.attr('src'), relativeLeft, relativeTop);
          objControls.moveObj(newObj);
          

          $(ui.helper).off().remove();
          
          return;
          
        }
    });
    
  },
  beforeAdd: function(){
    
    // Make sure there are no more than 10 objects
    if (active_scene.object_count >= globals.MAX_object_count) {
      alert("Sorry, you can't add any more objects.")
      return;
    } else {
      active_scene.object_count++;      $("._howmany").text(active_scene.object_count);
    }

    if (libraryText.isTextOn()) {
      libraryText.toggleText();
    }
    
  },
  clicktoadd: function () {

    libraryControls.beforeAdd();
    
    if($(this)){
      let o = objControls.addObj($(this).attr("src"));
      objControls.moveObj(o);
    }

  },

  load: function (what) {
    $("#" + libraryControls.$LIBRARY_OBJECTS).html("");

    library[what].forEach(function (e, i) {

      $("#" + libraryControls.$LIBRARY_OBJECTS).prepend("<img class='_toadd' src='https://engine.lol/alpha/assets/image/" + what + "/" + e + ".gif'>");

    });

    $("#library .library-selector").fadeIn("slow");


    // clear bindings first
    $("#library .library-selector").unbind("click");

    // add onclick events
    $("#library .library-selector").on("click", "._toadd", libraryControls.clicktoadd);
    
    // make sure they're draggable
    
    $('#library ._toadd').draggable({
        helper: 'clone',
        appendTo: 'body',
        zIndex: 100,
        start: function(event, ui) {
          $(ui.helper).addClass('draggable-helper').addClass('-obj-temp'); 
          objControls.wasAccepted = false;
            
        },
        revert: function(valid){
        
          if(!objControls.wasAccepted){
            return true;
          }
          
          return false;
          
        }
    });
    
    
  },

  clear: function () {

  }
}


// LISTENERS

// library
$("#library select[name='library-category']").change(function () {

  let n = $("#library select[name='library-category']").val();

  let t = $("#library select[name='library-category']").find(":selected").attr("title");

  $("._assetlibrarytext").text(t);
  libraryControls.load(n);
});


// scene 
$("select[name='effects-category']").change(function () {
  let n = $("select[name='effects-category']").val();
  let t = $("select[name='effects-category']").find(":selected").attr("title");

  libraryEffects.change(n);
});


// caption 
$("input[name='caption']").keyup(function () {
  let t = $(this).val();
  $("#e").attr("title", t);
  active_scene.caption = t;
});


// title 
$("input[name='title']").keyup(function () {
  let t = $(this).val();
  $("._scenetitle").text(t);
  active_scene.title = t;
});



$("#objectinteractions select[name='objinteraction-select']").change(function () {

  let how = $("#objectinteractions select[name='objinteraction-select']").val();

  $("#e .obj[data-selected='1']").attr("data-interaction", how);
});



/* 




      OBJECT CONTROLS
      
      
      


*/



const objControls = {

  wasAccepted: null,
  isObjectSelected: false,

  // SELECT/DESELECT via double-click
  selectObj: function (t) {

    if(!t) t == this;
    console.log( $(t), this );
    
    // I am double-clicking the image I currently selected
    if ($(this).attr("data-selected") == "1") {
      objControls.clearSelected();      
      return;
    } else {

      objControls.clearSelected();
      objControls.moveObj( t );
      objControls.isObjectSelected = true;
      return;
    }

  },
  

  // moving object
  moveObj: function (t) {

    // fade in controls
    $(".controls-text").hide();
    $(".controls-selected").show();

    $(t)
      .attr("data-selected", "1")
      .draggable({
        disabled: false,
        grid: [40, 40],
        containment: "#e",
        stop: function () {
          objControls.updatePos(t);
        }
      });
      objControls.saveObjects();

    return;
  },

  // add object
  addObj: function (src, x, y, filter, flip, size, interaction, interaction_target) {
    // first, deselect all objects
    objControls.clearSelected();

    $(".__x").text("0");
    $(".__y").text("0");

    let newSrc = $(`<div class='obj'><img src='${src}'></div>`);
    
    $(newSrc)
      .css("left", `${x}px`)
      .css("top", `${y}px`);
    
    if(filter){  $(newSrc).css("filter", filter); }
    if(flip){  $(newSrc).css("transform", flip); }
    if(size){  $(newSrc).css("width", size).css("height", size); }
    if(interaction){ 
      $(newSrc).attr("data-interaction", interaction);
      $(newSrc).attr("data-interaction-target", interaction_target);
    }
    

    let newObj = $(newSrc).hide().fadeIn(300).appendTo("#e");

    objControls.saveObjects();
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
    if(!sceneControls.editingCartridge) $(".controls-text").show();

  },

  size: function (how) {

    let t = $("#e .obj[data-selected='1']");

    if (how == "up") {
      t.css("width", t.width() * 1.25 + "px");
      t.css("height", t.height() * 1.25 + "px");
    } else {
      t.css("width", t.width() * 0.75 + "px");
      t.css("height", t.height() * 0.75 + "px");
    }

  },

  effect: function (how) {

    let t = $("#e .obj[data-selected='1']");

    switch (how) {

      case "invert":
        if (($(t).css("filter") == 'invert(1)')) {
          $(t).css("filter", "invert(0)");
        } else {
          $(t).css("filter", "invert(1)");
        }

        break;

      case "flip":
        //        console.log($(t).css("transform"));

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

      (active_scene.objects).push(new thingy(e.position().left, e.position().top, e.find("img").attr('src'), e.css('filter'), e.css('transform'), e.css('width'), e.attr('data-interaction'), e.attr('data-target')));

    });

  },

  // render all information from the scene
  getSceneInfo: function () {


  },

  // OTHER HANDLERS

  updatePos: function (t) {
    let pos = $(t).position();

    //    console.log(pos);
    $(".__x").text(pos.left);
    $(".__y").text(pos.top);
    
    
//    
//    $("#controls-top")
//      .css("left", pos.left)
//      .css("top", pos.top);
  },

  // resets all objects on dom
  clearSelected: function () {
    
    objControls.isObjectSelected = false;

    $(".controls-selected").hide();
    if(!sceneControls.editingCartridge) $(".controls-text").show();

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


libraryControls.init();

    
$("#e").on("click", function(e){

//  console.log( $(event.target) );
  
  if ($(event.target).hasClass("obj")) {
    console.log("?");
   
//    if( objControls.isObjectSelected )
    
    if( $(event.target).attr("data-selected") == "1" ){
  objControls.clearSelected();
      return;
    }
    
    
//    console.log(event.target);
    
    objControls.selectObj( $(event.target) );
    
    return;
  }

  objControls.clearSelected();

//  console.log("clicking canvas");
});
