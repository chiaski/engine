
function Scene(x, y) {

  // scene coordinates
  this.x = parseInt(x);
  this.y = parseInt(y);

  this.text = "";
  this.color = "#FFFFFF"; // default
  
  this.effects = { };

  // actions
  this.actions = { left: null, right: null, up: null, down: null };
}

function Action(dir, x, y, text){
  
  this.dir = dir;
  this.x = parseInt(x);
  this.y = parseInt(y);
  
  this.text = (text !== undefined ? text : ""); 
}

var TXT = {
  scenes: [],
  title: "",
  author: ""
}

function save(){
  BOARD.saveScene();
  localStorage.setItem("TXT.scenes", JSON.stringify(BOARD.scenes));
  TXT.scenes = BOARD.scenes;
}

function autoSave(){
  save();
  setTimeout(autoSave, 60000);
}

function copyCode(){
  
  save();
  
  $("#downloader").html( JSON.stringify(TXT.scenes) );
  
    let range = document.createRange();
  range.selectNode(document.getElementById("downloader"));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

   document.execCommand("copy");
    window.getSelection().removeAllRanges();
  
}



function publish(){
  copyCode();
  
  alert("Copied your game's code to your clipboard. Let's publish it next...")
  
  window.open("https://forms.gle/C8DwjRRwBeTUi8kh7", '_blank');
  
}