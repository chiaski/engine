


// EDITING OBJECTS





$( ".obj" ).dblclick(function() {
  
  $(this)
    .css("box-shadow", "0 0 20px #fff")
    .data("selected", "1")
    .draggable({
    grid: [40,40],
    containment: "#e",
    stop: function(){
      
      updatePos(this);
    }
    });
  
  
  function updatePos(t){
    
    let pos = $(t).position();
    console.log(pos);
    
    $(".__x").text(pos.left);
    $(".__y").text(pos.top);
  }
  
  
});


// handle image selection
