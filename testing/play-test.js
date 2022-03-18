console.log("play-test.js loaded");

$("#tempplay").click(function() {
    $('html, body').animate({
        scrollTop: $("#window-map").offset().top
    }, 200);
});


$("#e-play");


// LOAD CARTRIDGE


function loadGame(){

  console.log(scenes);
  
};

function loadPlay(){
  
  
  console.log(active_scene.objects);
   (active_scene.objects).forEach(function (e) {
//      console.log(e);
//     
        var newSrc = "";
//
    newSrc = "<img class='obj' data-selected='0' src='" + e.img + "' style='";

    if (e.x && e.y) {
      newSrc += "top:" + e.y + "px; left:" + e.x + "px;";
    }

    if (e.filter) {
      newSrc += "filter:" + e.filter + ";";
    }

    if (e.size) {
      newSrc += "width:" + e.size + "; height:" + e.size + ";";
    }


    newSrc += "'>";

      
      var newObj = $(newSrc).hide().fadeIn(2000);

      $("#e-play").append(newObj);

      // HELL YAAA
      
    })

  
    $("._playwhatscene").text( active_scene.x + "," + active_scene.y );
  
      $("#e-play").css("background", active_scene.color);
  
  
}



 $("#load-play").on("click", function(){
   
    objControls.saveObjects();
   
   loadPlay();
   
 });

$("#load-clear").on("click", function(){
  
  $("#e-play").html("");
  $("#e-play").css("background", "#000000");
  
});
$("#load-game").on("click", function(){
  
  objControls.saveObjects();
  loadGame();
  
  
});