

// load in windows

var UI = {
  
  init: function(){
    
    
    $(document).on("click", "[close]", function(){
      $(this).parent().parent().remove();
    })
    
    
    $(document).on("click", "[hide]", function(){
      $(this).parent().parent().hide();
    })
    
  },
  
  open: function(code){
    // open a draggable widnow
    
    $(code)
      .css("top", "25vh")
      .css("left", "50%")
      .css("transform", "translateX(-50%)")
      .css("position", "fixed")
      .hide()
      .fadeIn("slow")
      .appendTo("body")
      .draggable();
    
  },
  
  removeStart: function(){
    
  $(".screen-one").fadeOut("slow", function(){ $(this).remove() });
    
    
  }
  
}


$("#jump").on("click", "[action='toggleTools']", function(){
  $("#jump .-secondary.-tools").toggle();
  
  if( $("#jump .-secondary.-tools").is(":visible") ){
    $("[action='toggleTools']").html("hide").attr("toggle", "on");
  } else{
    $("[action='toggleTools']").html("tools").removeAttr("toggle");
  }
  
});


$("#jump").on("click", "[action='togglePublish']", function(){
  $("#jump .-secondary.-publish").toggle();
  
  if( $("#jump .-secondary.-tools").is(":visible") ){
    $("[action='togglePublish']").html("hide").attr("toggle", "on");
  } else{
    $("[action='togglePublish']").html("publish").removeAttr("toggle");
  }
  
});


$("#jump").on("click", "[action='openMap']", function(){
  
  $("#map").toggle();
  
});

$("#map").draggable();

// other UI shortcuts


UI.init();