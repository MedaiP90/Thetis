// server address
const mycommandurl = "server/command_server.php";

function sendDriftData(dh, ds) {
    $.ajax({
        // parameters to comunicate with the server
        url: mycommandurl,
        type:"GET",
        dataType: "json",
        data: { cmd : "drift", data1 : dh, data2 : ds },
        crossDomain: true,
        ContentType: "application/json",
        
      // access data
      success: function(data, textStatus, jqXHR){
          var json = JSON.parse(JSON.stringify(data));
          if(json.status != "ok") {
            stopDriftTest(true, "data sent, but status : " + json.status + ". retrying...");
            sendDriftData(dh, ds);
          } else {
            console.log("data sent, status : " + json.status);
          }
      },
      
      // connection error
      error :function(jqXHR, textStatus, errorThrown){
          console.error("error : " + jqXHR + " : " + textStatus + " : " + errorThrown);
          // stopDriftTest(true, textStatus);
      },
      
      // complete connection
      complete :function(qXHR, textStatus){
          // console.log("complete : " + textStatus);
      }
    });
}