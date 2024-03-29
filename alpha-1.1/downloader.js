console.log("downloader.js loaded");

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
  
  var cartridge_code = JSON.stringify( scenes); 
  console.log(cartridge_code);
  
  $("#downloader").text(cartridge_code);
  
    var range = document.createRange();
  range.selectNode(document.getElementById("downloader"));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

   document.execCommand("copy");
    window.getSelection().removeAllRanges();
  
  alert("Copied cartridge code to clipboard! Note that if you have funky characters or if my code was just inadequate, this might have failed... :(\nYou can play this in the 'Load Cartridge' page.");
});