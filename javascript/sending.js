// server address
const mycommandurl = "server/command_server.php";

function sendDriftData(dh, ds) {
    $.ajax({
        // parameters to comunicate with the server
        url: mycommandurl,
        type:"GET",
        dataType: "json",
        data: "{ \"command\" : \"\", \"dh\" : \"" + dh + "\", \"ds\" : \"" + ds + "\"}",
        crossDomain: true,
        ContentType: "application/json",
        
      // access data
      success: function(data, textStatus, jqXHR){
          console.log("connection success : " + textStatus + ": " + JSON.stringify(data));
      },
      
      // connection error
      error :function(jqXHR, textStatus, errorThrown){
          console.error("error : " + jqXHR + " : " + textStatus + " : " + errorThrown);
          // sending error: retry until success
          sendDriftData(dh, ds);
      },
      
      // complete connection
      complete :function(qXHR, textStatus){
          // console.log("complete : " + textStatus);
      }
    });
}