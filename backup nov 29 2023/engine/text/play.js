

const PLAY = {
  
  active: {x: null, y: null},
  
  start: function(){
    TXT.scenes = BOARD.scenes;
    console.log(TXT);
    
    PLAY.reset();
    
    $("*[playing]").show();
    PLAY.loadScene(PLAY.active.x, PLAY.active.y);
    
    $("div[playing]").off();
    $(document).off("keyup");
    
    $("div[playing]").on("click", "a[side]", function(){
      let toDir = $(this).attr("side");
      console.log(toDir);
      PLAY.loadScene( PLAY.getDir( toDir ).x, PLAY.getDir( toDir ).y );
    });
    
    // init key

    $(document).keyup(function(event) {
      let dir = null;

      if (event.which == 38) { dir = "up"; }
      if (event.which == 37) { dir = "left"; }
      if (event.which == 40) { dir = "down"; }
      if (event.which == 39) { dir = "right"; }

      if(dir == null) return;

      let test_scene = PLAY.getActiveScene();

      if( test_scene.actions[dir] == null ) return;

      PLAY.loadScene( test_scene.actions[dir].x,  test_scene.actions[dir].y );
    });
    
  },
  updateCoord: function(){
    $("[coord]").html(PLAY.active.x + `,  ` + PLAY.active.y)
  },
  getDir: function(dir){
    
    let newX = PLAY.active.x;
    let newY = PLAY.active.y;
    
    if(dir == "left"){ newX--; }
    if(dir == "right"){ newX++; }
    if(dir == "up"){ newY--; }
    if(dir == "down"){ newY++; }
        
    return {x: newX, y: newY};
  },
  getActiveScene: function(){    
    return (TXT.scenes).find(obj => obj.x === PLAY.active.x && obj.y === PLAY.active.y);    
  },
  loadScene: function(x, y){
    
    PLAY.active.x = x;
    PLAY.active.y = y;
    
    let a = PLAY.getActiveScene();
    PLAY.updateCoord();
    
    $("#engine textarea").val( a.text );
        
    
    // effects
    if(a.effects.font){
      $("#engine textarea").css("font-family", a.effects.font );
    }
    
    if(a.effects.fontsize){
      $("#engine textarea").css("font-size", a.effects.fontsize);
    }
    
    if(a.effects.lineheight){
      $("#engine").css("line-height", a.effects.lineheight);
      $("#engine textarea").css("line-height", a.effects.lineheight);
    }
    
    if(a.effects.textalign){
      $("#engine textarea").css("text-align", a.effects.textalign);
    }
    
    if(a.effects.color){
      $("#engine").css("color", getRGB(a.effects.color));
      $("#engine textarea").css("color", getRGB(a.effects.color));
    }
    
    if(a.effects.background){
      $("#engine").css("background-color", getRGB(a.effects.background));
      $("#engine textarea").css("background-color", getRGB(a.effects.background));
    }
    
    resizeTextarea( $("#engine textarea")[0] );
    
    
    $("div[playing] .--directions a").removeAttr("active").attr("inactive", "");
    
    for (var _a in a.actions) {
        if ((a.actions).hasOwnProperty(_a)) {
//         console.log((a.actions)[_a]);
          
          if((a.actions)[_a] == null) continue;
          
          $("div[playing] a[side='" + (a.actions)[_a].dir +"']")
            .removeAttr("inactive").attr("active", "");

          $("div[playing] a[side='" + (a.actions)[_a].dir +"']  span[text]").html((a.actions)[_a].text);
          
        }
    }
    
    
  },
  reset: function(){
    
    $("div[playing]").off();
    $(document).off("keyup");
    $("#engine textarea").val("");
    $("*[playing]").hide();
    
  }
  
}

function start(type){

  if(type == "play"){
    $(".--game").html(`<button id="play">Restart</button>`);
    PLAY.active = {x: 2, y: 2};
  }
  
  if(type == "preview"){
    $(".--game").html(`<button id="preview">Restart</button> <button id="play">Restart from beginning</button>`);
    PLAY.active = {x: BOARD.active.x, y: BOARD.active.y};
  }
  
  PLAY.start();
}


$(".--game").on("click", "button#play", function(){
  start("play");
});

$(".--game").on("click", "button#preview", function(){
  start("preview");
});


// if ~ in url
$('document').ready(function(){

let url = window.location.href;
  if(url.includes('?')){
    let _url = url.split("?")[1];
    if(_url){
        Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vSSi1F36rQyzdfLbJBgyJYj0sobIEtsr884MqaJWz_7fdfoSrewnMgtGILZx26jkSGh-4JNwxcZ6mO6/pub?gid=1337837484&single=true&output=csv", {
          download: true,
          header: true,
          complete: function(results) {
            console.log(results.data);
            // find match
            let _scene = null;
            (results.data).forEach(function(d, i){
              if(d.url && d.url == _url){
                _scene = d;
              }
            });
            
            if(!confirm("Found " + _scene.title + ". Load and play?")) return;
            
            console.log(_scene.game);
            document.title = _scene.title;
            TXT.title = _scene.title;
            TXT.author = _scene.author;
            $("#title").html(TXT.title);
            
            BOARD.scenes = JSON.parse(_scene.game);
            TXT.scenes = JSON.parse(_scene.game);
            BOARD.loadScenes( BOARD.scenes );
            swap("player");
            
            
          }
        })
    }
  }
});