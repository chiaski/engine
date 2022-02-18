


// EDITING OBJECTS





$( ".obj" ).dblclick(function() {
  
  // only one object may be selected at a time
  
  if( $(this).data("selected") == "1" ){
    
    objControls.clearSelected();
    
  } else{
    
    $(".controls-selected").fadeIn("slow");
    
    $(this)
      .css("box-shadow", "0 0 20px #fff")
      .data("selected", "1")
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
  
  // remove object
  delete: function(t){
    t.remove();
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
  
}

// handle image selection
