// server address
const myurl = "server/server.php";

// useful for fast forwarding
var fakeDelay = 1;
var jumpTo = -1;

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
          if(testType == 'drift' && started)
            stopDriftTest(true, "Connection error");
          else if(testType == 'delta' && started)
            stopDeltaTest(true, "Connection error");
      },
      
      // complete connection
      complete :function(qXHR, textStatus){
          // console.log("complete : " + textStatus);
      }
    });

    // manage the fast forwarding
    if(jumpTo > 0) {
      jumpTo -= 1;
    } else if(jumpTo > -1) {
      fakeDelay = delay;
      $('#drift').prop("disabled",false);
      jumpTo -= 1;
    }
    
    // time for data refresh
    setTimeout(updatingData, fakeDelay);
}
