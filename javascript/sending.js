// server address
const mycommandurl = "server/command_server.php";

function sendDriftData(dhs, dss) {
    $.ajax({
        // parameters to comunicate with the server
        url: mycommandurl,
        type:"GET",
        dataType: "json",
        data: { command : "drift", dh : dhs, ds : dss },
        crossDomain: true,
        ContentType: "application/json",
        
      // access data
      success: function(data, textStatus, jqXHR){
          var json = JSON.parse(JSON.stringify(data));
          if(json.status != "ok") {
            stopDriftTest(true, "data sent, but status : " + json.status + ". retrying...");
            sendDriftData(dhs, dss);
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