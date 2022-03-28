console.log("audio.js loaded");


/* 


  Handles songs associated to the game,
  for the Editor
  
  
*/

// https://gist.github.com/takien/4077195
function YouTubeGetID(url){
  var ID = '';
  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if(url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  }
  else {
    ID = url;
  }
    return ID;
}





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