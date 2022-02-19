


// LIBRARY

const library = {
  
  MAX_object_count: 10,
  object_count: 0 // active objects this scene
  
};



/* 
  Adding objects from the library
  
  INSTR:
  Double-click to add an image from the library to the engine.
  
*/


$("#library .library-objects img.objtoadd").dblclick(function() {
  
  // Make sure there are no more than 10 objects
  console.log(library.object_count);
  
  if(library.object_count >= library.MAX_object_count){
    alert("Sorry, you can't add any more.")
    return;
  } else{
    library.object_count++;
  }
  
  let o = objControls.addObj( $(this).attr("src") );
  
  console.log( "hi " + o );
  
  objControls.moveObj( o );
  
});

// EDITING OBJECTS





$( "#e .obj" ).dblclick(function() {
  
  // only one object may be selected at a time


});


// object controls
const objControls = {
  // t = object
  
  // SIMPLE HANDLERS
  
  
  // SELECT/DESELECT via double-click
  selectObj: function(t){

//    console.log("double clicked");

    // I am double-clicking the image I currently selected
    if( $(this).attr("data-selected") == "1" ){

      console.log("deselecting image");
      objControls.clearSelected();
      return;

    } else{
      console.log("selecting image");

      objControls.clearSelected();
      objControls.moveObj( this );
      return;
      
    }

  },
  
  // moving object
  moveObj: function(t){
    
    
    // fade in controls
    $(".controls-selected").fadeIn("slow");
    
    $(t)
      .bind("dblclick", objControls.selectObj)
      .css("box-shadow", "0 0 20px #fff")
      .attr("data-selected", "1")
      .draggable({
      disabled: false,
      grid: [40,40],
      containment: "#e",
      stop: function(){
        objControls.updatePos(t);
      }
      });
    
    return;
    
  },
  
  // add object
  addObj: function(src, attrs){
    
    // first, deselect all objects
    
    objControls.clearSelected();
    
    console.log("adding" + " " + src);
    
    let newSrc = "<img class='obj' data-selected='0' src='" + src + "'>";
    
    let newObj = $(newSrc).fadeIn("slow").appendTo("#e");
    
    return newObj;
    
  },
  
  // remove object 
  delObj: function(t){
    
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
  
  effect: function(how){
    
    let t = $("#e img.obj[data-selected='1']");
    
    switch(how){
        
      case "invert":
        
        console.log( $(t).css("filter") );
        
        if( ($(t).css("filter") == 'invert(1)') ){
          $(t).css("filter", "invert(0)");
        }else{
          $(t).css("filter", "invert(1)");
        }
        
        break;
        
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

    
    $(".controls-selected").hide();

    // reset position
    
      $(".__x").text("");
      $(".__y").text("");
    
    $("#e .obj").each(function(){
    
      $(this)
      .css("box-shadow", "none")
      .attr("data-selected", "0")
      .draggable('disable');
      
    });
    
  }
  
};

// handle image selection


// click handlers here
$("button[data-action='delete']").on('click', objControls.delObj() );