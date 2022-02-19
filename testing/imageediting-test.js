


// LIBRARY

const library = {
  
  object_count: 0 // active objects this scene
  
};



/* 
  Adding objects from the library
  
  INSTR:
  Double-click to add an image from the library to the engine.
  
*/

$("#library .library-objects img.objtoadd").dblclick(function() {
  
  let copy = $(this);
  
  console.log( );
  
});

// EDITING OBJECTS





$( ".obj" ).dblclick(function() {
  
  // only one object may be selected at a time
  
  
  // deselect image
  if( $(this).attr("data-selected") == "1" ){
    
    objControls.clearSelected();
    
  } else{
    
    
    $(this)
      .css("box-shadow", "0 0 20px #fff")
      .attr("data-selected", "1")
      .draggable({
      disabled: false,
      grid: [40,40],
      containment: "#e",
      stop: function(){
        objControls.updatePos(this);
      }
      });


  }

  
});


// object controls
const objControls = {
  // t = object
  
  // simple handlers
  
  // add object
  addObj: function(src, attrs){
    
    // fade in controls
    $(".controls-selected").fadeIn("slow");
    
    
    
    
  },
  
  // remove object 
  del: function(t){
    
    if(t){
      t.remove();
    } else{
    console.log("Object removed");
      $("#e .obj[data-selected='1']").remove();
    }
    
    // add error handling here, catch if no objec twas removed
    
    $(".controls-selected").fadeOut("slow");
    
  },
  
  size: function(how){
    
    let t = $("#e img.obj[data-selected='1']");
    
    if(how == "up"){
      
      console.log("grow");
      
      console.log(t.css("width"));
      
      t.css("width", t.width() * 1.25 + "px" );
      t.css("height", t.height() * 1.25 + "px" );
      
    } else{
      
      console.log("shrink");
      
      t.css("width", t.width() * 0.75 + "px" );
      t.css("height", t.height() * 0.75 + "px" );
    }
    
  },
  
  // OTHER HANDLERS
  
  updatePos: function(t){
      let pos = $(t).position();
      console.log(pos);

      $(".__x").text(pos.left);
      $(".__y").text(pos.top);
  },
  
  // resets all objects on dom
  clearSelected: function(){
    
    
    $(".controls-selected").fadeOut("slow");
    
    // reset position
    
      $(".__x").text("");
      $(".__y").text("");
    
    $("#e .obj").each(function(){
    
      $(this)
      .css("box-shadow", "none")
      .data("selected", "0")
      .draggable('disable');
      
    });
    
  }
  
};

// handle image selection


// click handlers here
$("button[data-action='delete']").on('click', objControls.del() );