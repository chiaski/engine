import JSONCrush from './JSONCrush.min.js';
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

console.log("downloader.js loaded");

// let's try this with compressed json

$("#btn-download").on("click", function(){
  alert("Downloading HTML file of game!");
  
  var $iframe = $("iframe#downloader_game");
  var cartridge_code = JSON.stringify( scenes, ' ', '  ');
  
//  console.log("cartridge code: ", cartridge_code);
  
  // replace content with cartridge code
  $iframe.contents().find('html #cartridge').html(cartridge_code);
  
  let link = document.createElement('a');
  link.setAttribute('download', "myCartridge.html");
  link.setAttribute('href', 'data:text/plain' + ';charset=utf-8,' + encodeURIComponent( $iframe.contents().find("html").html() ));
  link.click(); 
//  
});


$("#btn-getcode").on("click", function(){
  
  let cartridge_code = JSON.stringify(scenes); 
  
  $("#downloader").html(cartridge_code);
  
    let range = document.createRange();
  range.selectNode(document.getElementById("downloader"));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

   document.execCommand("copy");
    window.getSelection().removeAllRanges();
  
  alert("Copied cartridge code to clipboard! Note that if you have funky characters or if my code was inadequate, this might have failed... :(\nYou can play this in the 'Load Cartridge' page.");
});


$("#btn-publish").on("click", function(){
  
//  if(scenes.scene_count == 1){
//    alert("You need more than one scene to publish your game.");
//    return;
//  }
  
  let cartridge_code = JSON.stringify(scenes); 
  let publish = encodeURIComponent(JSONCrush.crush(cartridge_code));

  console.log(publish);
  publishSequence(publish);
//  window.open('./player.html?=' + publish, '_blank');

});


function publishSequence(cartridge){
  
  let pTitle = publishValidate("title");
  let pURL = publishValidate("url", pTitle);
  let pAuthor = publishValidate("author");
  let pCartridge = cartridge;
  
  if(!confirm("Ready to publish " + pTitle + " by " + pAuthor + "?")) return false;
  
  alert("Bringing you to " + pTitle + "...");


  function pub(pTitle, pURL, pAuthor, pCartridge) {
    const db = getDatabase();
    set(ref(db, 'published/' + pURL), {
      title: pTitle,
      author: pAuthor,
      url: pURL,
      cartridge: pCartridge,
    });
  }

  pub(pTitle, pURL, pAuthor, pCartridge);
  window.open('./player.html?=' + pURL, '_blank');
}

function publishValidate(what, text){
  
  let p = "";
  
  switch(what){
    case "title":
      p = prompt("What would you like to call your Engine game?");
      p = publishClean(p).trim();
      break;
    case "url":
      p = publishClean(text).trim().replace(/\s/g,'').replace(/[^a-z0-9 -]/gi, '');
      break;
    case "author":
      p = prompt("How would you, the author, like to be called?");
      p = publishClean(p).trim();
      break;
  }
  
  
  // validate, if not loop
//  if (!p.match(/^([a-z0-9]{4,})$/)) publishValidate(what, p);
  if (p.length <= 1) publishValidate(what, p);
  
  return p;
}

function publishClean(text){
  return text;
}