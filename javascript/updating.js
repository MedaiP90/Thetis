// server address
const myurl = "server/server.php";

// data update function
function updatingData(){
    $.ajax({
        // parameters to comunicate with the server
        url: myurl,
        type:"GET",
        dataType: "json",
        crossDomain: true,
        ContentType: "application/json",
        
        // access data
        success: function(data, textStatus, jqXHR){
          
          // save the received data (use older
          // data if an error occurs). Latitude and
          // longitude are converted to be used in formulas
          var json = JSON.parse(JSON.stringify(data));
              sog = json.sog || sog;
              cog = json.cog || cog;
              mh = json.mh || mh;
              sow = json.sow || sow;
              lat = Math.nmeaToDec(json.lat) || lat;
              lon = Math.nmeaToDec(json.lon) || lon;
          
          dataTimestamp += delay; 
            
          // update info to visualize
          refreshInformations();

          // console.log("connection success : " + textStatus);
      },
      
      // connection error
      error :function(jqXHR, textStatus, errorThrown){
          console.error("error : " + jqXHR + " : " + textStatus + " : " + errorThrown);
      },
      
      // complete connection
      complete :function(qXHR, textStatus){
          // console.log("complete : " + textStatus);
      }
    });
    
    // time for data refresh
    setTimeout(updatingData, delay);
}
