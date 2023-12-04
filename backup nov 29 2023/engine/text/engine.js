const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

function getRGB(c){
  if(c.substring(0,1) == "#") return c;
  return rgb2hex(c);
};

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function resizeTextarea(e) {
  $(e).css({'height':'28','overflow-y':'hidden'}).height(e.scrollHeight);
}

$('#engine textarea').each(function () {
  resizeTextarea(this);
}).on('input', function () {
  resizeTextarea(this);
});

// SETTINGS


const BOARD = {
  scenes: [], // put scenes here
  active: {x: null, y: null},
  SIZE: 5, // cols
  ROWS: 5, // rows
  STARTING_X: 0, // leftmost X
  
  FONTS: ["Courier New", "Arial", "Tahoma", "Georgia", "Garamond", "Tahoma", "Brush Script MT", "Verdana", "Trebuchet MS"],
  
  init: function(){
    
    
  // draw board
    for(let i = 0; i < BOARD.ROWS; i++ ){
      $("<div class='row' row='" + i +"'></div>").appendTo(".map");
      for(let j = 0; j < BOARD.SIZE; j++ ){
        $(`<span class='s' state='unused'>`)
          .attr("x", j)
          .attr("y", i)
          .appendTo(".map .row[row='" + i +"']");
      }
      $(`<hr>`).appendTo(".map");
    }
    
    BOARD.initSettings();
  
  },
  initSettings: function(){
    
    $("#engine-actions button[delete-scene]").click(function(){
      if(BOARD.active.x == 2 && BOARD.active.y == 2){
        alert("Can't delete your starting scene.")
        return;
      }
      
      if( !confirm("Are you sure you want to delete this scene?") ) return;
      
      // update adjacent blocks
      
    let _toLeft = BOARD.getScenebyDir("left", BOARD.active);
    let _toRight = BOARD.getScenebyDir("right", BOARD.active);
    let _toUp = BOARD.getScenebyDir("up", BOARD.active);
    let _toDown = BOARD.getScenebyDir("down", BOARD.active);
    
      if( _toUp ){
        console.log(_toUp);
        if( _toUp.actions.down !== null){
          delete _toUp.actions.down;
        }
      }  

      if( _toDown ){
        console.log(_toDown);
        if( _toDown.actions.up !== null){
          delete _toDown.actions.up;
        }
      }  

      if( _toLeft ){
        if( _toLeft.actions.right !== null){
          delete _toLeft.actions.right;
        }
      }
      
      if( _toRight ){
        if( _toRight.actions.left !== null){
          delete _toRight.actions.left;
        }
      }
      
      // update map
       $(".map span.s[x='" + BOARD.active.x + "'][y='" + BOARD.active.y +"']")
      .attr("state", "unused");

      BOARD.scenes = $.grep(BOARD.scenes, function(data) {
        console.log(data);
        console.log(BOARD.active.x, BOARD.active.y, data.x, data.y);
         return BOARD.active.x !== data.x || BOARD.active.y !== data.y;
      });
      
      let lastOne = (BOARD.scenes).slice(-1)[0];
      console.log(lastOne);
      
      BOARD.setActive(lastOne.x, lastOne.y);
      BOARD.loadScene(lastOne);
      save();
      
    });
    
    // read textarea
    $("#engine textarea").keyup(function(){

      (BOARD.getActiveScene()).text = $("#engine textarea").val();
      
    });
    
    // fix settings
    
    $(".--settings-save button[save]").click(function(){
      BOARD.saveScene();
      save();
      $(".--settings-save button[save]").html("Saved! (also autosaves every 60s)");
      setTimeout(function(){
        $(".--settings-save button[save]").html("Save");
      }, 3000);
    });
    
    $(".--settings-clear button[restart]").click(function(){
      if(!confirm("Start fresh? You will lose the game you're editing.")) return;
      localStorage.clear();
      location.reload();
    });
    
    $(".--settings-publish button[publish]").click(function(){
      if(!confirm("Publish? You'll be brought to a form.")) return;
      publish();
    });
    
    $.each( BOARD.FONTS, function( i, font ){
    $(".--settings-font select").append(`<option>` + font + `</option>`);
    });
    
    // font
    $(".--settings-font select").change(function () {      
      (BOARD.getActiveScene()).effects.font = $(this).val();
      $("#engine textarea").css("font-family", $(this).val());
      BOARD.saveScene();
    });
    
    // color
    $(".--settings-color input[type='color'][text]").change(function () {
      (BOARD.getActiveScene()).effects.color = getRGB($(this).val());
      $("#engine").css("color", getRGB($(this).val()));
      $("#engine textarea").css("color", getRGB($(this).val()));
      BOARD.saveScene();
    });
    
    // background
    $(".--settings-color input[type='color'][background]").change(function () {      
      (BOARD.getActiveScene()).effects.background = $(this).val();
      $("#engine").css("background-color", $(this).val());
      $("#engine textarea").css("background-color", $(this).val());
      BOARD.saveScene();
    });
    
    // font size
    $(".--settings-fontsize input[name='fontsize']").change(function () {
      (BOARD.getActiveScene()).effects.fontsize = parseInt( $(this).val() );
      $("#engine textarea").css("font-size", $(this).val() + "px");
      BOARD.saveScene();
    });
    
    // line-height size
   $(".--settings-lineheight input[name='lineheight']").change(function () {
      (BOARD.getActiveScene()).effects.lineheight = parseInt( $(this).val() );
      $("#engine textarea").css("line-height", $(this).val() + "px");
      BOARD.saveScene();
    resizeTextarea( $("#engine textarea")[0] );
     
    });
    
    // alignment
    $(".--settings-textalign select").change(function () {
      
      (BOARD.getActiveScene()).effects.textalign = $(this).val();
      $("#engine textarea").css("text-align", $(this).val());
      BOARD.saveScene();
    });
    
  },
  loadScenes: function(scenes){
    
    // redraw map...
    let smallestX = 0;
    let largestX = 4;
    let smallestY = 0;
    let largestY = 4;
    
    scenes.forEach(function (scene, i) {
      if(scene.x < smallestX){ smallestX = scene.x; }
      if(scene.y < smallestY){ smallestY = scene.y; }
      if(scene.x > largestX){ largestX = scene.x; }
      if(scene.y > largestY){ largestY = scene.y; }
    });
    
    BOARD.SIZE = (largestX - smallestX) + 1;
    BOARD.STARTING_X = smallestX;
    BOARD.ROWS = (largestY - smallestY) + 1;
    
    $(".map").html("");
    
    for(let i = 0; i < BOARD.ROWS; i++ ){
      $("<div class='row' row='" + (smallestY + i) +"'></div>").appendTo(".map");
      for(let j = 0; j < BOARD.SIZE; j++ ){
        let d = $(`<span class='s' state='unused'>`)
          .attr("x", BOARD.STARTING_X + j)
          .attr("y", (smallestY + i))
          .appendTo(".map .row[row='" + (smallestY + i) +"']");
        
        // adjust state
        if( BOARD.getScene(BOARD.STARTING_X + j, (smallestY + i)) !== undefined){
          d.attr("state", "inactive");
        }
        
      }
      $(`<hr>`).appendTo(".map");
    }
    
    
    BOARD.setActive(2,2);
    BOARD.loadScene(BOARD.active);
//    console.log(BOARD.active);
    
  },

  redrawBoard: function(){
    // around what origin?
    
  },
  getScene: function(x, y){ // get scene by x,y
    return (BOARD.scenes).find(obj => obj.x === parseInt(x) && obj.y === parseInt(y));
  },
  getActiveScene: function(){
    return (BOARD.scenes).find(obj => obj.x === BOARD.active.x && obj.y === BOARD.active.y);
  },
  getScenebyDir: function(dir, from){
  
    // if no from, default to active
    if(from == undefined){
      from = { x: BOARD.active.x, y: BOARD.active.y }
    }
    
//    console.log(BOARD.active, from);
    
    let newX = from.x;
    let newY = from.y;
    
    if(dir == "left"){ newX--; }
    if(dir == "right"){ newX++; }
    if(dir == "up"){ newY--; }
    if(dir == "down"){ newY++; }
    
    return BOARD.getScene(newX, newY);
  },
  getDir: function(dir, from){
  
    // if no from, default to active
    if(from == undefined){
      from = { x: BOARD.active.x, y: BOARD.active.y }
    }
    
    
    let newX = from.x;
    let newY = from.y;
    
    if(dir == "left"){ newX--; }
    if(dir == "right"){ newX++; }
    if(dir == "up"){ newY--; }
    if(dir == "down"){ newY++; }
    
    return {x: newX, y: newY};
  },
  switchScene: function(XY){ 
    
    BOARD.saveScene();
//    console.log(XY);
    // if scene doesn't exist, make scene
    if( !BOARD.getScene(XY.x, XY.y) ){
      console.log("Scene doesn't exist");
      if(!confirm("Make new scene?")) return;      
      // add option to current scene, too
      
      BOARD.makeScene(XY);
      
      return;
    }
    
    // otherwise, switch to it!
    BOARD.loadScene( BOARD.getScene(XY.x, XY.y) );
  },
  expandBoard: function(XY){
    
    console.log(XY);
    
    // expand up
    if( !$(".map .row[row='" + (XY.y - 1) + "']").length ){
      BOARD.ROWS = BOARD.ROWS + 1;
      
      $(`<div class='row' row='` + (XY.y - 1) + `'></div><hr>`).prependTo(".map");
      
      for(let i = 0; i < BOARD.SIZE; i++ ){
        $(`<span class='s' state='unused'>`)
          .attr("x", BOARD.STARTING_X + i)
          .attr("y", (XY.y - 1))
          .appendTo(".map .row[row='" + (XY.y - 1) +"']");
      }
    }
    
    // expand down
    if( !$(".map .row[row='" + (XY.y + 1) + "']").length ){
      BOARD.ROWS = BOARD.ROWS + 1;
      
      $(`<div class='row' row='` + (XY.y + 1) + `'></div><hr>`).appendTo(".map");
      
      for(let i = 0; i < BOARD.SIZE; i++ ){
        $(`<span class='s' state='unused'>`)
          .attr("x", BOARD.STARTING_X + i)
          .attr("y", (XY.y + 1))
          .appendTo(".map .row[row='" + (XY.y + 1) +"']");
      }
    }
    
    // expand left
    if( BOARD.STARTING_X > (XY.x - 1) ){      
      BOARD.STARTING_X = BOARD.STARTING_X - 1;
      console.log(BOARD.STARTING_X);
      BOARD.SIZE = BOARD.SIZE + 1;
      
      $(".map .row").each(function(i, row){
        $(`<span class='s' state='unused'>`)
          .attr("x", BOARD.STARTING_X)
          .attr("y", $(row).attr("row") )
          .prependTo(row);
      });
    }
    
    // expand right
    if( $(".map .row span.s").last().attr("x") < (XY.x + 1) ){      
      
      BOARD.SIZE = BOARD.SIZE + 1;
      
      $(".map .row").each(function(i, row){
        $(`<span class='s' state='unused'>`)
          .attr("x", (XY.x + 1))
          .attr("y", $(row).attr("row") )
          .appendTo(row);
      });
    }
    
  },
  makeScene: function(XY){    
    let _newScene = new Scene(XY.x, XY.y);
    (BOARD.scenes).push( _newScene );
    
    let _active = BOARD.getActiveScene();
    
    // check if map needs to be expanded
    BOARD.expandBoard(XY);
    
    // add actions to the upcoming scene
    let _toLeft = BOARD.getScenebyDir("left", XY);
    let _toRight = BOARD.getScenebyDir("right", XY);
    let _toUp = BOARD.getScenebyDir("up", XY);
    let _toDown = BOARD.getScenebyDir("down", XY);
    
    if( _toUp ){
      if( _newScene.actions.up == null){
        _newScene.actions.up = new Action("up", _toUp.x, _toUp.y, "");
      }
      if( _toUp.actions.down == null){
       _toUp.actions.down = new Action("down", XY.x, XY.y, "");
      }
    }  
    
    if( _toDown ){
      if( _newScene.actions.down == null){
        _newScene.actions.down = new Action("down", _toDown.x, _toDown.y, "");
      }
      if( _toDown.actions.up == null){
       _toDown.actions.up = new Action("up", XY.x, XY.y, "");
      }
    }  
    
    if( _toLeft ){
      if( _newScene.actions.left == null){
        _newScene.actions.left = new Action("left", _toLeft.x, _toLeft.y, "");
      }
      if( _toLeft.actions.right == null){
       _toLeft.actions.right = new Action("right", XY.x, XY.y, "");
      }
    }
    
    if( _toRight ){
      if( _newScene.actions.right == null){
        _newScene.actions.right = new Action("right", _toRight.x, _toRight.y, "");
      }
      if( _toRight.actions.left == null){
       _toRight.actions.left = new Action("left", XY.x, XY.y, "");
      }
    }
    
    BOARD.loadScene(_newScene);
      
    console.log(_newScene);
    
    return _newScene;    
  },
  saveScene: function(){ // save active scene
    
    let _active = BOARD.getActiveScene();
    _active.text = $("#engine textarea").val();
    
    // save effects
    _active.effects.font = $("#engine textarea").css("font-family");
    _active.effects.fontsize = $("#engine textarea").css("font-size");
    _active.effects.lineheight = $("#engine textarea").css("line-height");
    _active.effects.textalign = $("#engine textarea").css("text-align");
    _active.effects.color = getRGB($("#engine textarea").css("color"));
    _active.effects.background = getRGB($("#engine textarea").css("background-color"));
    
    // save actions, if any
    $("#engine-actions a[active]").each(function(i, a){
      let dir = $(a).attr("side");
      _active.actions[dir].text =  $(a).find("input[type='text']").val();
    });
    
  },
  clearScene: function(){
    
    // actions
    $("#engine-actions a").removeAttr("active").attr("inactive", "");    
    $("#engine-actions a span[text]").html("<span make>+</span>");
    
    // text
    $("#engine textarea").val("");
    
  },
  loadScene: function(scene){
    
    BOARD.clearScene();
    
    BOARD.active.x = scene.x;
    BOARD.active.y = scene.y;
    BOARD.setActive(scene.x, scene.y);
    
    let _active = BOARD.getActiveScene();
    $("#engine textarea").val( _active.text );
    
    /* LOAD EFFECTS */
    if( _active.effects.font !== undefined ){
      $("#engine").css("font-family", _active.effects.font );
      $("#engine textarea").css("font-family", _active.effects.font );
    }
      $(".--settings-font select option:selected").removeAttr("selected");
      $(".--settings-font select option[val='" + $("#engine textarea").css("font-family") +"']").attr("selected");
    
    
    if( _active.effects.color !== undefined ){
      $("#engine").css("color", getRGB(_active.effects.color) );
      $("#engine textarea").css("color", getRGB(_active.effects.color) );
    }
    
      $(".--settings-color input[type='color'][text] ").val( getRGB($("#engine").css("color")) );
    
    
    if( _active.effects.background !== undefined ){
      $("#engine").css("background-color", getRGB(_active.effects.background) );
      $("#engine textarea").css("background-color", getRGB(_active.effects.background) );
    }
    
     $(".--settings-color input[type='color'][background] ").val( getRGB($("#engine").css("background-color")) );
    
    if( _active.effects.fontsize ){
      $("#engine textarea").css("font-size", _active.effects.fontsize);      
    };
    
      $(".--settings-fontsize input").val( parseInt($("#engine textarea").css("font-size")) )
    
    if( _active.effects.lineheight ){
      $("#engine textarea").css("line-height", _active.effects.lineheight);      
    };    
      $(".--settings-lineheight input").val( parseInt($("#engine textarea").css("line-height")) )
    
    if( _active.effects.textalign ){
      $("#engine textarea").css("text-align", _active.effects.textalign );
    }
      $(".--settings-textalign select option:selected").removeAttr("selected");
      $(".--settings-textalign select option[val='" + $("#engine textarea").css("text-align")  +"']").attr("selected");
    
    resizeTextarea( $("#engine textarea")[0] );
    
    /*  ACTIONS */
    
    // first, clear
    $("#engine-actions a").removeAttr("active").attr("inactive", "");    
    $("#engine-actions a span[text]").html("<span make>+</span>");
    
    for (var a in _active.actions) {
        if ((_active.actions).hasOwnProperty(a)) {
          if((_active.actions)[a] == null) continue;
          
//          console.log((_active.actions)[a]);

          $("#engine-actions a[side='" + (_active.actions)[a].dir +"']")
            .removeAttr("inactive").attr("active", "");

            $("#engine-actions a[side='" + (_active.actions)[a].dir +"'] span[text]")
            .html(`<input type='text' value='` + (_active.actions)[a].text  + `'>`);
          
          if( $("#engine-actions a[side='" + (_active.actions)[a].dir +"'] span[text] input[type='text']").length && $("#engine-actions a[side='" + (_active.actions)[a].dir +"'] span[text] input[type='text']").val() == ""){
             $("#engine-actions a[side='" + (_active.actions)[a].dir +"'] span[text] input[type='text']").attr("placeholder", "No text");
          }     
        }
    }
  },
  
  updateCoord: function(){
    $("[coord]").html(BOARD.active.x + `,  ` + BOARD.active.y)
    
    if(BOARD.active.x == 2 && BOARD.active.y == 2){
      $(".engine-coord").html("2, 2 (Start)");
    }
    
    
  },
  setActive: function(x, y){
    
    BOARD.active.x = x;
    BOARD.active.y = y;
    
    $(".map span.s[state='active']").attr("state", "inactive");
    
     $(".map span.s[x='" + BOARD.active.x + "'][y='" + BOARD.active.y +"']")
      .attr("state", "active");
    
    BOARD.updateCoord();
  },
  addAction: function(){
    
  }
}


// if a scene is made, it has to adjust all adjacent tiles


$('document').ready(function(){
  
  BOARD.init();
  
  
    // mark active one
    let centerXY = Math.floor(BOARD.SIZE / 2);
    (BOARD.scenes).push( new Scene(centerXY, centerXY) );
    BOARD.setActive(centerXY, centerXY);
  swap("editor");  
  
  console.log(BOARD.scenes);
  
  // check if loadable
  
  if (localStorage.hasOwnProperty("TXT.scenes")) {
   console.log("YEA"); console.log(JSON.parse(localStorage.getItem("TXT.scenes")));
    BOARD.scenes = JSON.parse(localStorage.getItem("TXT.scenes"));
    TXT.scenes = JSON.parse(localStorage.getItem("TXT.scenes"));
    
    // unload
    BOARD.loadScenes(BOARD.scenes);
  }
  
  // set origin
  $(".map span.s[x='" + 2 + "'][y='" + 2 +"']")
      .attr("origin", "");
  
  
  $("#engine-actions div[onMode='editor'] a[side]").on("click", "span[direction]", function(){
    let toDir = $(this).parent().attr("side");
    
    BOARD.switchScene( BOARD.getDir( toDir ) );
  })
  
  $("#engine-actions a[side]").on("click", "span[make]", function(){
    let toDir = $(this).parent().parent().attr("side");
    
    BOARD.switchScene( BOARD.getDir( toDir ) );
  })
  
  
  $(".map").on("click", "span.s", function(){
    
    BOARD.switchScene( {x: parseInt($(this).attr("x")), y: parseInt($(this).attr("y"))} );
  });
  
  
  
});



var STATE = "editor";

function swap(mode){
  STATE = mode;
  
  $("#mode a[mode]").removeAttr("active");
  $("#mode a[mode='" + STATE +"']").attr("active", "");
  
  if(mode == "editor"){
    BOARD.loadScene( BOARD.getActiveScene() );
    
    $("*[onMode='player']").hide();
    $("*[onMode='editor']").show();
    
    $("#engine").attr("mode", "editor");
    
    $(document).off();
    $(document).keyup(function(event) {
      let dir = null;

      if (event.shiftKey && event.which == 38) { dir = "up"; }
      if (event.shiftKey && event.which == 37) { dir = "left"; }
      if (event.shiftKey && event.which == 40) { dir = "down"; }
      if (event.shiftKey && event.which == 39) { dir = "right"; }

      if(dir == null) return;
      
      BOARD.switchScene( BOARD.getDir(dir) );
    });
    
  }
  
  if(mode == "player"){
    BOARD.saveScene();
    save();
    
    $(".--game").html(`<button id="play">Play</button> <button id="preview">Preview</button>`);
    
    $("[playing]").hide();
    $("*[onMode='editor']").hide();
    $("*[onMode='player']").show();
    
    $("#engine").attr("mode", "player");
    $(document).off("keyup");
    
  }
}

$("#mode").on("click", "a[mode]", function(){
  let m = $(this).attr("mode");
  
  $("#mode a[mode]").removeAttr("active");
  $(this).attr("active", "");
  
  STATE = m;
  swap(STATE);
});

