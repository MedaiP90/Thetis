<?php
  header('Cache-Control: no-cache, must-revalidate');
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Credentials: false');
  header('Content-type: application/json; charset=utf-8');
  
  $c = $_GET["command"];
  $h = $_GET["dh"];
  $s = $_GET["ds"];

  $data = "{ \"command\" : \"$c\", \"dh\" : \"$h\", \"ds\" : \"$s\" }";
  

  $host = "127.0.0.1";
  $port = 4546;
  
  $socket = socket_create(AF_INET, SOCK_STREAM, 0) or die("{ \"status\" : \"Could not create socket\" }\n");
  $result = socket_connect($socket, $host, $port) or die("{ \"status\" : \"Could not connect to server\" }\n");  
  $result = socket_write($socket, $data) or die("{ \"status\" : \"Could not write to server\" }\n");
  $result = socket_read($socket, 1024) or die("{ \"status\" : \"Could not read server response\" }\n");
 
  echo $result;
  socket_close($socket);
?>
