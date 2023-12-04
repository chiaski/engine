import JSONCrush from './JSONCrush.min.js';

console.log("downloader.js loaded");


var SAVING = {
  init: function(){
    
    

    $("[action='getCartridge']").on("click", function(){
      SAVING.getCartridge();
    });
    

    $("[action='exportHTML']").on("click", function(){
      SAVING.exportHTML();
    });
    
    
    $("[action='publishCartridge']").on("click", function(){
      SAVING.publish();
    //  window.open('./player.html?=' + publish, '_blank');
    });


  },
  
  exportHTML: function(){
    
    
    if(!confirm(`Download ${scenes.title === null ? "game" : scenes.title} as HTML file?`)) return;
    
    $("#downloader_game").remove();
    let c = $(`<iframe id="downloader_game" src="blank-cartridge.html"></iframe>`).prependTo("body");
    
  
    var cartridge_code = JSON.stringify(scenes);
    
    console.log( $(c).html() );
    
    setTimeout(function(){
    $("iframe#downloader_game").contents().find('#cartridge').html(cartridge_code);
      
      let link = document.createElement('a');
      link.setAttribute('download', "myCartridge.html");
      link.setAttribute('href', 'data:text/plain' + ';charset=utf-8,' + encodeURIComponent( $(c).contents().find("html").html() ));
      link.click(); 

    setTimeout(function(){$("#downloader_game").remove()}, 1000);
      
    }, 1500);

    
  },
  
  getCartridge: function(){
    let cartridge_code = JSON.stringify(scenes); 

    $("#downloader").html(cartridge_code);

    let range = document.createRange();
    range.selectNode(document.getElementById("downloader"));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

  document.execCommand("copy");
    window.getSelection().removeAllRanges();

    alert("Copied cartridge code to clipboard!");
    
  },
  
  publish: function(){
    
    alert("Coming soon!"); return;
    
    let cartridge = JSON.stringify(scenes); 
    cartridge = encodeURIComponent(JSONCrush.crush(cartridge));


    // remove invalid chars and shit
    function publishClean(text){
      return text;
    }

    function publishValidate(what, text){
      let p;

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


      if (p.length <= 1) publishValidate(what, p);

      return p;
    }

  
    let pTitle;
    
    if(scenes.title == null || !scenes.title.length || scenes.title == undefined){
      pTitle = publishValidate("title");
    } else{
      pTitle = scenes.title;
    }
    let pURL = publishValidate("url", pTitle);
    let pAuthor = publishValidate("author");
    let pCartridge = cartridge;

    if(!confirm("Ready to publish " + pTitle + " by " + pAuthor + "?")) return false;

//    alert("Bringing you to " + pTitle + "...");
    
    
    //
    // FINISH PUBLISHING SEQUENCE HERE
    //    function pub(pTitle, pURL, pAuthor, pCartridge) {
    //      const db = getDatabase();
    //      set(ref(db, 'published/' + pURL), {
    //        title: pTitle,
    //        author: pAuthor,
    //        url: pURL,
    //        cartridge: pCartridge,
    //      });
    //    }
    //
    //    pub(pTitle, pURL, pAuthor, pCartridge);
    //    window.open('./player.html?=' + pURL, '_blank');

  }
  
}

SAVING.init();

// let's try this with compressed json

//$("#btn-download").on("click", function(){
//  alert("Downloading HTML file of game!");
//  
//  var $iframe = $("iframe#downloader_game");
//  var cartridge_code = JSON.stringify( scenes, ' ', '  ');
//  
//  
//  // replace content with cartridge code
//  $iframe.contents().find('html #cartridge').html(cartridge_code);
//  
//  let link = document.createElement('a');
//  link.setAttribute('download', "myCartridge.html");
//  link.setAttribute('href', 'data:text/plain' + ';charset=utf-8,' + encodeURIComponent( $iframe.contents().find("html").html() ));
//  link.click(); 
//});


