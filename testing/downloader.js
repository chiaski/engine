

$("#btn-download").on("click", function(){
  alert("Downloading HTML file of game!");
  
  console.log("Downloading game to cartridge...");
  
  $("iframe#downloader_game").html().find('#cartridge').html(JSON.stringify( scenes ));
//  $("iframe#downloader_game").contents().find('#cartridge').html(JSON.stringify( scenes ));
  
  let link = document.createElement('a');
  link.setAttribute('download', "myCartridge.html");
  link.setAttribute('href', 'data:text/plain' + ';charset=utf-8,' + encodeURIComponent( $("iframe#downloader_game").html() ));
  link.click(); 
  
});


$("#btn-getcode").on("click", function(){
  
  console.log("Downloading game to cartridge...");
  
  $("#downloader").text(JSON.stringify( scenes ));
  
  /* Select the text field */
  $("#downloader").select();
//  $("#downloader").setSelectionRange(0, 99999); // for mobile
  
   document.execCommand("copy");

  alert("Copied cartridge code to clipboard!");
  
});