console.log("audio.js loaded");

// sorry youtube fucking sucks too much


const audio_library = ["ambient-1.mp4", "ambient-2.m4a", "ambient-3.m4a", "aphx-1.mp3"];




const audioControls = {


  init: function () {

    audio_library.forEach(function (e, i) {

      $("._audio-category").append("<option value='" + e + "'>" + e + "</option>");

    });
  },

  previewSong: function (what) {
    window.open("https://engine.lol/alpha/assets/audio/" + what, "", "width=200,height=100");
  },

  setSong: function (what) {

    if (what == null || what == "none") {
      alert("You need to select a song! They're not that bad.");
      return;
    }

    scenes.audio = what;
    alert("Successfully set song as " + what + "!");

    let s = "./assets/audio/" + what;
    var aud = $("#_audio");

    $("._audiotitle").text(what);
    $("#_audio source").attr("src", s);

    aud[0].pause();
    aud[0].load();
    aud[0].play();
  }

}

// Audio Controls


$("button#btn-audio-stop").on("click", function () {

  $("#_audio")[0].currentTime = 0;
  $("#_audio")[0].pause();

  $("._audiotitle").text("Audio stopped!");

});


$("button#btn-audio-play").on("click", function () {

  if (scenes.audio == null) {
    alert("No audio selected!");
    return;
  }

  $("._audiotitle").text(scenes.audio);
  $("#_audio")[0].play();

});


// Set Audio


$("button#btn-controls-audio-previewsong").on("click", function () {

  let s = $("._audio-category").val();

  if (s == null || s == "none") {
    alert("You need to select a song! They're not that bad.");
    return;
  }

  audioControls.previewSong(s);
})


$("button#btn-controls-audio-loadsong").on("click", function () {

  let s = $("._audio-category").val();

  if (s == null || s == "none") {
    alert("You need to select a song! They're not that bad.");
    return;
  }

  $("#audio-player-controller").fadeIn();
  audioControls.setSong(s);

})


audioControls.init();
