

$("#btn-download").on("click", function(){
  
  console.log("Downloading game to cartridge...");
  
  
  
  $("#downloader").text(JSON.stringify( scenes ));
  
  /* Select the text field */
  $("#downloader").select();
//  $("#downloader").setSelectionRange(0, 99999); // for mobile
  
   document.execCommand("copy");

  alert("Downloading HTML file of game!");
  
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