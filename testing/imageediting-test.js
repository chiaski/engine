


/* 
  Adding objects from the library
  
  INSTR:
  Double-click to add an image from the library to the engine.
  
*/


$("#library .library-objects .objtoadd").dblclick(function() {
  
  // Make sure there are no more than 10 objects
  console.log(scene.object_count);
  
  if(scene.object_count >= globals.MAX_object_count){
    alert("Sorry, you can't add any more.")
    return;
  } else{
    scene.object_count++;
  }
  
  let o = objControls.addObj( $(this).attr("src") );
  
  console.log( "hi " + o );
  
  objControls.moveObj( o );
});


var test_scene = {
  
  // Is the scene accessible or not?
  active: true,
  
  // Position on maps
  coordinates: {
    x: 0,
    y: 0
  },
  
  // Color palette
  colors: {
    primary: "#fff",
    secondary: "#000"
  },
  
  // Positions of objects contained in the scene
  objects: []
}


// temporary scene constructor

// temporary object constructor
function thingy(x, y, img, filter, size, interaction){
  this.x = x;
  this.y = y;
  this.img = img;
  this.filter = filter;
  this.size = size;
  this.interaction = interaction;
}


  $("input[type='color']").change(function(){
    $("#e").css("background", $("input[type='color']").val() );
  });

// object controls
const objControls = {
  // t = object
  
  // SET LISTENERS FOR CONTROLS
  
  
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
  addObj: function(src, x, y, filter, size, interaction){
    
    
//  this.x = x;
//  this.y = y;
//  this.img = img;
//  this.filter = filter;
//  this.size = size;
//  this.interaction = interaction;
//    
    // first, deselect all objects
    
    objControls.clearSelected();
    
    console.log("adding" + " " + src + x,y,size);
    
    // makey thingy
    
    let newSrc;
    
    
    
    newSrc = "<img class='obj' data-selected='0' src='" + src + "' style='";
    
    if(x && y){
      newSrc += "top:" + y + "px; left:" + x + "px;";
    }
    
    if(filter){
      newSrc += "filter:" + filter + ";";
    }
    
    if(size){
      newSrc += "width:" + size + "; height:" + size + ";";
    }
    
    if(interaction){
      // TO-DO!
    }
    
    newSrc += "'>";
    
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
    console.log(t);
    
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
  
  // write all positions of objects in engine dom to array of objects, and get it in scene
  saveObjects: function(){
    
    $("#e .obj").each(function(){
    
      
      // width and height are always equa, so we only need to fetch one of these values for size
      // doesn't add interaction for now
      
      test_scene.objects.push( new thingy($(this).position().left, $(this).position().top, $(this).attr('src'), $(this).css('filter'), $(this).css('width') ) );
      
      console.log("object created");
      
       // x
      
    });
    
    console.log(test_scene);
    
    
  },
  
  // render all information from the scene
  getSceneInfo: function(){
    
    console.log(test_scene);
    
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
//      .draggable('disable');
    });
    
  }
  
};

const sceneControls = {
  
  /* clearScene SAVES all objects and empties the scene */
  clearScene: function(){
    
    // first, save objects on scene
    objControls.saveObjects();
    
    $("#e .obj").each(function(){
      $(this).remove();
    });
    
  },
  
  /*
    loadObjects brings back all the objects from the scene into the frame, lodaing it from the array of objects
  */
                      
  loadObjects: function(){
    
    // arrange color
    
    console.log(test_scene.objects);
    
    // iterate over each object
    (test_scene.objects).forEach(function(e){
      console.log(e);
      
      objControls.addObj( e.img, e.x, e.y, e.filter, e.size );
       // HELL YAAA
      
    })

    
  }
  
};

// handle image selection

// click handlers here
$("button[data-action='delete']").on('click', objControls.delObj() );