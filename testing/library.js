
console.log("library.js loaded");


/*


  LIBRARY
  

*/


// pathing: environment / ...

const library = {
  
  environment: ["stone-1", "flower-1", "stone-2", "moon-1"],
  
  clouds: ["1"]
  
};

const libraryControls = {
  
  $LIBRARY_OBJECTS: "library-objects",
  
  init: function(){
    
    console.log(library);

    
  },
  
  load: function(what){
    
        
    library[what].forEach(function(e, i){
      
      console.log(e);
      
      $("#" + libraryControls.$LIBRARY_OBJECTS).append("<img class='_toadd' src='assets/image/" + what + "/" + e + ".gif'>" );
      
      
      
    });
    
  }
  
  
}

/*



    INITIALIZE AND REFERENCE HERE
    
    

*/

libraryControls.init();
libraryControls.load('environment');


