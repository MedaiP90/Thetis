<!DOCTYPE <!DOCTYPE html>
<html>
<head>
    <title>Thetis</title>
    <meta charset="utf-8">
    <meta name="author" content="Leonardo Cossutta">
    <meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
    <link rel="stylesheet" type="text/css" media="screen" href="css/main.css">
    <link rel="stylesheet" type="text/css" media="screen" href="css/top.css">
    <link rel="stylesheet" type="text/css" media="screen" href="../CircularMenu/menu_alt.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css">
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
            <div class="name cell">DRIFT <br class="br" />HEADING </div>
            <div class="value cell" id="ch">--</div>
        </div>
        <div class="right">
            <div class="name cell">DRIFT <br class="br" />SPEED [kt] </div>
            <div class="value cell" id="cs">--</div>
        </div>
    </div>

    <div id="aborted" class="msg" hidden>
        <div id="abortedtxt">OPERATION ABORTED</div>
        <div id="abortedmsg"></div>
        <div id="abortedbtn"><button>OK</button></div>
    </div>

    <?php
        include '../CircularMenu/menu_circolare_alt.php';
    ?>
</body>
</html>
