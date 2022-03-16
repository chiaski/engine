
/*


    MAP
    
    
*/


const mapControls = {
  
  // x & y == coordinate of start, if any
  initMap: function(x, y){

    
    var map_html = "";
    
    console.log("init at: " + x + "," + y);
    
    for(let i = 0; i < globals.MAP_height; i++){
      for(let j = 0; j < globals.MAP_width; j++){
        
        if(x !== null && y !== null && i == x && j == y){
        
          console.log("b");
          map_html += ("<div class='_s __active __start' data-active='active data-scene='" + i + "," + j + "'>" + i + "," + j + "</div>");
          
        } else if(x == null && y == null && i == 0 && j == 0){
          map_html += "<div class='_s __active __start' data-active='active data-scene='" + i + "," + j + "'>" + i + "," + j + "</div>";
          continue;
        } else{
          
        map_html += "<div class='_s __unused' data-active='unused data-scene='" + i + "," + j + "'>" + i + "," + j + "</div>";
          
        }
        
        
      }
      
      map_html += "<hr>";
      
      
    }
    
      $("#sss").append(map_html);
    
    
  }
  
  
}

mapControls.initMap();
