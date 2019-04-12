<!DOCTYPE <!DOCTYPE html>
<html>
<head>
    <title>Thetis</title>
    <meta charset="utf-8">
    <meta name="author" content="Leonardo Cossutta">
    <meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
    <link rel="shortcut icon" type="image/png" href="/img/favicon.png"/>
    <link rel="stylesheet" type="text/css" media="screen" href="css/buttons.css">
    <link rel="stylesheet" type="text/css" media="screen" href="css/content.css">
    <link rel="stylesheet" type="text/css" media="screen" href="css/style.css">
    <script src="javascript/jquery.min.js"></script>
    <script src="javascript/compassIndicator.js"></script>
    <script src="javascript/functions.js"></script>
    <script src="javascript/main.js"></script>
    <script src="javascript/updating.js"></script>
    <script src="javascript/sending.js"></script>
    <script src="javascript/resize.js"></script>
    <script src="javascript/operations.js"></script>
    <script src="javascript/veermonitor.js"></script>
    <script type="text/JavaScript">
        (function($){
            // page resizing activates this function
            $(window).resize(function(){
              resizeWindow();
            });
        })(jQuery);
    </script>
</head>
<body>
    <div id="top">
        <?php
            include 'top.php';
        ?>
    </div>

    <table id="contenuto">
      <tr>
        <td class="left top">
          <div class="name">DRIFT HEADING</div>
          <canvas id="ch" height="0" width="0"></canvas>
        </td>
        <td class="right top">
          <div class="name">DRIFT SPEED [kt]</div>
          <div class="value" id="cs">0</div>
        </td>
      </tr>
      <tr>
        <td class="left bottom">
          <div class="name">DELTA<br>MAGNETIC HEADING</div>
          <div class="value" id="mhc">0</div>
        </td>
        <td class="right bottom">
          <div class="name">DELTA<br>SPEED [kt]</div>
          <div class="value" id="sowc">0</div>
        </td>
      </tr>
    </table>

    <div id="aborted" class="msg" hidden>
        <div class="name" id="abortedtxt">OPERATION ABORTED</div>
        <div id="abortedmsg"></div>
        <div id="abortedbtn"><button>OK</button></div>
    </div>

    <div id="bottom">
        <?php
            include 'bottom.php';
        ?>
    </div>
</body>
</html>