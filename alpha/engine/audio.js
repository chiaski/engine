console.log("audio.js loaded");





const Audio = {
  
  library: ["ambient-1.mp4", "ambient-2.m4a", "ambient-3.m4a", "ambient-4.m4a", "ambient-5.m4a", "ambient-6.mp3", "aphx-1.mp3", "environment-1.mp3", "lovelolveolvoe.mp3", "dgasgsdg.mp3", "birdsong.mp3", "cutcutcut.mp3", "ennichi.mp3", "birdbird.m4a", "goodbye-frog.wav", "sleepingboy.mp3", "morningloop.mp3"],

  init: function () {
    

    // fill library
    (Audio.library).forEach(function (e, i) {
      $("select[game-audio]").append("<option value='" + e + "'>" + e + "</option>");
    });
    
    $("select[game-audio]").change(function(){
      Audio.load( $("select[game-audio]").val() );
    });
    
    $(document).on("click", "[audio='play']", function(){
      Audio.play();
    });
    
    $(document).on("click", "[audio='stop']", function(){
      Audio.stop();
    });
    
     $('#audio').on('ended', function() {
       
      $("#audio-src")[0].currentTime = 0;
      $("#audio-src")[0].pause();
      $("#audio-src")[0].play();
       // loop
       
    });
    
    $(document).on("click", "[action='toggleSound']", function(){
      Audio.toggleSound();
    });
    
    
    
  },
  
  reset: function(){
    
    Audio.stop();
    Audio.play();
    
  },
  
  toggleSound: function(what){
    
    if( !$("#audio").is(':visible') ){
      $("#audio").slideDown();
      $("[action='toggleSound']").text("hide game audio");
    } else{
      $("#audio").slideUp(); 
      $("[action='toggleSound']").text("open game audio");
    }  
    if( what == "show" || $("#audio button[audio='play']").is("[playing]") ){
      // pause
      $("#audio select, #audio button[audio='play']").removeAttr("playing");
      $("#audio button[audio='play']").html("⏵");
    } else{
      // play
      $("#audio select, #audio button[audio='play']").attr("playing", "");
      $("#audio button[audio='play']").html("⏸");
    }
    
    
    if(what == "show" ){
      $("#audio").slideDown();
      $("[action='toggleSound']").text("hide game audio");
    } else if(what == "hide"){
      $("#audio").slideUp(); 
      $("[action='toggleSound']").text("open game audio");
    }
    

  },

  preview: function (what) {
    window.open("https://engine.lol/alpha/assets/audio/" + what, "", "width=200,height=100");
  },

  load: function (audio) {
    
    if(!audio) audio = scenes.audio;
    
    // if none, set to that
    if(audio == "none"){
      scenes.audio = null;
      $("#audio .-controls").hide();
      return;
    }
   
    $("#audio select[game-audio]").val(audio);
    $("#audio .-controls").show();
    
    
    $("#audio-src source").attr("src", "./assets/audio/" + audio);

    Audio.stop();
    $("#audio-src")[0].load();
    
    
  },
  
  play: function(){
    
//    if(!audio) audio = scenes.audio;
    
    if($("#audio-src source").attr("src") == "" || $("#audio-src source").attr("src") == undefined) return;
    
    if( $("#audio button[audio='play']").is("[playing]") ){
      // pause
      $("#audio select, #audio button[audio='play']").removeAttr("playing");
      $("#audio-src")[0].pause();
      $("#audio button[audio='play']").html("⏵");
      
    } else{
      // play
      $("#audio-src")[0].play();
      $("#audio select, #audio button[audio='play']").attr("playing", "");
      $("#audio button[audio='play']").html("⏸");
    }
    
    
  },
  
  stop: function(){
    
    $("#audio-src")[0].currentTime = 0;
    $("#audio-src")[0].pause();
    
    $("#audio select, #audio button[audio='play']").removeAttr("playing");
    $("#audio button[audio='play']").html("⏵");
    
    // turn pause into play
  }

}



Audio.init();
