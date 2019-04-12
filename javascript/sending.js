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
          console.log("connection success : " + json.status);
          if(json.status != "ok") {
            sendDriftData(dhs, dss);
          }
      },
      
      // connection error
      error :function(jqXHR, textStatus, errorThrown){
          console.error("error : " + jqXHR + " : " + textStatus + " : " + errorThrown);
          // sending error: retry until success
          //sendDriftData(dhs, dss);
      },
      
      // complete connection
      complete :function(qXHR, textStatus){
          // console.log("complete : " + textStatus);
      }
    });
}