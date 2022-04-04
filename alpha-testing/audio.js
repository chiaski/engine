console.log("audio.js loaded");

// sorry youtube fucking sucks too much


const audio_library = ["ambient-1.mp4", "ambient-2.m4a", "ambient-3.m4a", "aphx-1.mp3"];




const audioControls = {
  
  
  init: function(){
    
    audio_library.forEach(function(e, i){
      
      $("._audio-category").append("<option value='" + e + "'>" + e + "</option>");
      
    });
  },
  
  previewSong: function(what){ window.open("https://engine.lol/alpha/assets/audio/" + what, "", "width=200,height=100"); 
  },
  
  setSong: function(what){
  
    if(what == null || what == "none"){
      alert("You need to select a song! They're not that bad.");
      return;
    } 
    
    scenes.audio = what;
    alert("Successfully set song as " + what + "!");


  }
  
}

$("button#btn-controls-audio-previewsong").on("click", function(){

  let s = $("._audio-category").val();
  
  if(s == null || s == "none"){
    alert("You need to select a song! They're not that bad.");
    return;
  } 
  
  audioControls.previewSong(s);
})


audioControls.init();