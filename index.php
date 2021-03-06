<!DOCTYPE <!DOCTYPE html>
<html>
<head>
    <title>Thetis</title>
    <meta charset="utf-8">
    <meta name="author" content="Leonardo Cossutta">
    <meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
    <link rel="stylesheet" type="text/css" media="screen" href="css/main.css">
    <link rel="stylesheet" type="text/css" media="screen" href="css/top.css">
    <script src="javascript/jquery.min.js"></script>
    <script src="javascript/functions.js"></script>
    <script src="javascript/main.js"></script>
    <script src="javascript/updating.js"></script>
    <script src="javascript/sending.js"></script>
    <script src="javascript/operations.js"></script>
    <script src="javascript/veermonitor.js"></script>
</head>
<body>
    <div id="top">
        <?php
            include 'top.php';
        ?>
    </div>

    <div class="bottom">
        <div class="left">
            <div class="name cell">DRIFT<br class="br" /><span class="space name"> </span>HEADING</div>
            <div class="value cell"><span id="ch">--</span></div>
        </div>
        <div class="right">
            <div class="name cell">DRIFT<br class="br" /><span class="space name"> </span>SPEED</div>
            <div class="value cell"><span id="cs">--</span><span id="unit">Kt</span></div>
        </div>
    </div>

    <div id="aborted" class="msg" hidden>
        <div id="abortedtxt" class="msgtxt">OPERATION ABORTED</div>
        <div id="abortedmsg" class="msgcnt"></div>
        <div id="abortedbtn" class="msgbtn"><button>OK</button></div>
    </div>

    <div id="worning" class="msg" hidden>
        <div id="worningtxt" class="msgtxt">DATA MAY BE INACCURATE [<span class="msgtxt" id="datacount"></span>rot.]</div>
        <div id="worningmsg" class="msgcnt">Send results to Argos anyway?</div>
        <div id="worningbtn" class="msgbtn">
            <button id="btnsend">SEND</button>
            <button id="btncancel">CANCEL</button>
        </div>
    </div>
</body>
</html>
