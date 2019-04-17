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
          <div class="value" id="ch">--</div>
        </td>
        <td class="right top">
          <div class="name">DRIFT SPEED [kt]</div>
          <div class="value" id="cs">--</div>
        </td>
      </tr>
      <tr>
        <td class="left bottom">
          <div class="name">ACTUAL<br />HEADING</div>
          <div class="value" id="ah">--</div>
        </td>
        <td class="right bottom">
          <div class="name">REFERENCE<br />HEADING</div>
          <div class="value" id="rh">--</div>
        </td>
      </tr>
    </table>

    <div id="aborted" class="msg" hidden>
        <div class="name" id="abortedtxt">OPERATION ABORTED</div>
        <div id="abortedmsg"></div>
        <div id="abortedbtn"><button>OK</button></div>
    </div>
</body>
</html>
