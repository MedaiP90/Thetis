<?php
  header('Cache-Control: no-cache, must-revalidate');
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Credentials: false');
  header('Content-type: application/json; charset=utf-8');
  
  $c = $_GET["cmd"];
  $h = $_GET["data1"];
  $s = $_GET["data2"];

  $data = "{ \"cmd\" : \"$c\", \"data1\" : \"$h\", \"data2\" : \"$s\" }";
  

  $host = "127.0.0.1";
  $port = 4546;
  
  $socket = socket_create(AF_INET, SOCK_STREAM, 0) or die("Could not create socket\n");
  $result = socket_connect($socket, $host, $port) or die("Could not connect to server\n");  
  $result = socket_write($socket, $data) or die("Could not write to server\n");
  $result = socket_read($socket, 1024) or die("Could not read server response\n");
 
  echo $result;
  socket_close($socket);
?>
