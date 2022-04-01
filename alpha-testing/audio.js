console.log("audio.js loaded");

// sorry youtube fucking sucks too much


const audio_library = {
  
  // from field recordings
  environment: [""],
  
  // i may not have the rights to these
  song: [""]
  
};



$("button#btn-controls-audio-loadsong").on("click", function(){

  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  var player;

  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '1',
      width: '1',
      videoId: 'x5CaUlKyJSk',
      playerVars: {
        'playsinline': 1,
        'modestbranding': true
      },
      events: {
        'onReady': onPlayerReady
      }
    });
  }


  function onPlayerReady(event) {
  //  event.target.playVideo();
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  var done = false;


  function stopVideo() {
    player.stopVideo();
  }

  let id = YouTubeGetID( $("input#_audiosource").val() );
  
  player.loadVideoById(id);
  
    setTimeout(function(){
    
      console.log( player.getVideoData() );
  }, 500);
  
  
})