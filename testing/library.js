
console.log("library.js loaded");


/*


  LIBRARY
  

*/


// pathing: environment / ...

const library = {
  
  environment: ["stone-1", "flower-1", "stone-2", "moon-1", "moon-2", "moon-3", "leaf", "leaf-2", "twig", "leaf-3", "rock", "bush", "bush-2"],
  faces: ["8D", "blank", "fear", "joy", "hmm", "kiss", "nerd", "ninja", "rage", "sad", "tear", "vomit", "worry"],
  digital: ["bomb", "case", "clock", "computer-2", "computer", "cursor", "dude", "exclamation", "package", "paint", "paper", "pointer", "save", "stack", "trash"],
  clouds: ["1"]
  
};

function thingy(x, y, img, filter, size, interaction) {
  this.x = x;
  this.y = y;
  this.img = img;
  this.filter = filter;
  this.size = size;
  this.interaction = interaction;
}


const libraryControls = {
  
  $LIBRARY_OBJECTS: "library-objects",
  
  init: function(){
    
    console.log(library);

    
  },
  
  clicktoadd: function(){
    
    console.log( $(this) );
    
    // Make sure there are no more than 10 objects
    if (active_scene.object_count >= globals.MAX_object_count) {
    alert("Sorry, you can't add any more.")
    return;
  } 
    let o = objControls.addObj( $(this).attr("src") );

    objControls.moveObj(o);

  },
  
  load: function(what){
    
        
    library[what].forEach(function(e, i){
      
      console.log(e);
      
      $("#" + libraryControls.$LIBRARY_OBJECTS).prepend("<img class='_toadd' src='assets/image/" + what + "/" + e + ".gif'>" );
      
    });  
    
$("#library .library-selector").fadeIn("slow");
    
    // add onclick events
      $("#library .library-selector").on("dblclick", "img._toadd", libraryControls.clicktoadd );
  },
  
  clear: function(){
    
    
  }
  
  
}




    $("#library select[name='library-category']").change(function () {
      
      let n =  $("#library select[name='library-category']").val();
      
      console.log( n );
      
      libraryControls.load(n);
      
//      
//      let c = $(" input[type='color']").val();
//
//      $("#e").css("background", c);
//      $("body").css("background", c);
//
//      active_scene.color = c;
//
//      // change color of tile in map
//      $("#scene_selector div._s.__active").css("background", c);
//      
//      console.log(active_scene.color);

    });



/* 




      OBJECT CONTROLS
      
      
      


*/



const objControls = {
  // t = object

  // SET LISTENERS FOR CONTROLS


  // SIMPLE HANDLERS


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
      .css("box-shadow", "0 0 20px #fff")
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
  addObj: function (src, x, y, filter, size, interaction) {

    // first, deselect all objects

    objControls.clearSelected();

    console.log("adding" + " " + src + x, y, size);
    
    // makey thingy

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

    if (interaction) {
      // TO-DO!
    }

    newSrc += "'>";

    active_scene.object_count++; // increment object_count of active scene
    
    let newObj = $(newSrc).fadeIn("slow").appendTo("#e");

    return newObj;

  },

  // remove object 
  delObj: function (t) {

    if (t) {
      t.remove();
    } else {
      console.log("Object removed");
      $("#e .obj[data-selected='1']").remove();
    }

    // add error handling here, catch if no objec twas removed

    $(".controls-selected").fadeOut("slow");

  },

  size: function (how) {

    let t = $("#e img.obj[data-selected='1']");
    console.log(t);

    if (how == "up") {

      console.log("grow");

      console.log(t.css("width"));

      t.css("width", t.width() * 1.25 + "px");
      t.css("height", t.height() * 1.25 + "px");

    } else {

      console.log("shrink");

      t.css("width", t.width() * 0.75 + "px");
      t.css("height", t.height() * 0.75 + "px");
    }

  },

  effect: function (how) {

    let t = $("#e img.obj[data-selected='1']");

    switch (how) {

      case "invert":

        console.log($(t).css("filter"));

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

//    console.log(active_scene);
    
    // first clear objects in the existing scene
    active_scene.objects = [];

    $("#e .obj").each(function () {
      // width and height are always equa, so we only need to fetch one of these values for size
      // doesn't add interaction for now

      (active_scene.objects).push(new thingy($(this).position().left, $(this).position().top, $(this).attr('src'), $(this).css('filter'), $(this).css('width') ));

      console.log("object created");

      // x

    });
  },

  // render all information from the scene
  getSceneInfo: function () {

    console.log(active_scene);

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
//      .draggable()
//            .draggable('disable');
    });

  }

};


/*



    INITIALIZE AND REFERENCE HERE
    
    

*/

libraryControls.init();

