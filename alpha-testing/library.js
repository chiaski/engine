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
  $TEXT_EDITOR: "#e #e-text textarea",

  init: function () {
    // click, edit text
    $("button#btn-toggletext").on("click", function () {
      libraryText.toggleText();
    });
  },
  
  toggleText: function(){
    
    if(  $("button#btn-toggletext").hasClass("__toggled") ){
      $("button#btn-toggletext").removeClass("__toggled");
    } else{
       $("button#btn-toggletext").addClass("__toggled");
    }
    
    if( $("#e #e-text").css("pointer-events") == "none" ){
      $("#e #e-text").css("pointer-events", "all");
    } else{
      $("#e #e-text").css("pointer-events", "none");
    }
    
    libraryText.saveText();
    console.log("text toggled");
    
  },
  // loadText: laod text into active scene
  loadText: function () {
    $("#e-text textarea").hide().fadeIn(100).val(active_scene.textoverlay);
  },

  clearText: function () {
    $("#e-text textarea").val("");
  },

  // saveText: save text into active scene
  saveText: function () {
    active_scene.textoverlay = $("#e #e-text textarea").val();

    console.log("text saved", active_scene.textoverlay);
  },
  disableText: function(){
    // first, save
    libraryText.saveText();

    // disable text editing
    $("#e #e-text textarea").css("pointer-events", "none");
    $("#e #e-text").css("pointer-events", "none");
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
  items: ["cash", "cashbag", "clock", "coin", "coin-number", "frame", "gem", "gem-2", "gold", "magnify", "pouch", "sandglass"],
  clouds: ["1", "2", "3", "4", "5", "6", "7"]

};

// object constructor

function thingy(x, y, img, filter, size, interaction, interaction_target) {
  this.x = x;
  this.y = y;
  this.img = img;
  this.filter = filter;
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

  init: function () {
  },

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

    //    console.log("double clicked");

    // I am double-clicking the image I currently selected
    if ($(this).attr("data-selected") == "1") {

      console.log("deselecting image");
      objControls.clearSelected();
      return;

    } else {
      console.log("selecting image");

      objControls.clearSelected();
      objControls.moveObj(this);
      return;

    }

  },

  // moving object
  moveObj: function (t) {


    // fade in controls
    $(".controls-selected").fadeIn("slow");

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
  addObj: function (src, x, y, filter, size, interaction, interaction_target) {
    // first, deselect all objects
    objControls.clearSelected();
    let newSrc;
    newSrc = "<img class='obj' data-selected='0' src='" + src + "' style='";

    if (x && y) {
      newSrc += "top:" + y + "px; left:" + x + "px;";
    }

    if (filter) {
      newSrc += "filter:" + filter + ";";
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

    let newObj = $(newSrc).hide().fadeIn(2000);
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

    $(".controls-selected").fadeOut("slow");

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

    }

  },

  // write all positions of objects in engine dom to array of objects, and get it in scene
  saveObjects: function () {

    // first clear objects in the existing scene
    active_scene.objects = [];

    $("#e .obj").each(function () {
      // NOTE: width and height are always equal, so we only need to fetch one of these values for size
      // TODO: interactions, once that's implemented

      let e = $(this);

      (active_scene.objects).push(new thingy(e.position().left, e.position().top, e.attr('src'), e.css('filter'), e.css('width'), e.attr('data-interaction'), e.attr('data-target')));

    });

  },

  // render all information from the scene
  getSceneInfo: function () {


  },

  // OTHER HANDLERS

  updatePos: function (t) {
    let pos = $(t).position();

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
      //      .draggable()
      //            .draggable('disable');
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
