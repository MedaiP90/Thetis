/*
 * GLOBAL VARIABLES
 */

// test state
var started = false;
var writing = false;
// decide if use gps heading or
// magnetic heading
var gps = true;

// relevant data
var dataTimestamp = 0;
var sog = 0, cog = 0, mh = 0, sow = 0,
    lat = 0.0, lon = 0.0;

const delay = 1000;

/*
 * Dom elements for faster access
 */
var domCs, domCh, domAh, domDrift,
    domRh, domMsg, domAborted, 
    domGps, domLeft;

//////////////////////////////////////

/*
 * GLOBAL FUNCTIONS
 */

// update the drift fields
function updateDriftInfo(speed, direc) {
    domCs.text(speed);
    domCh.text(direc);
}

// stop test
function stopDriftTest(aborted, msg) {
    console.log("drift check stopped");
    started = false;
    domDrift.text('FIND DRIFT');
    domRh.text('--');
    domLeft.css({
        "background-image":"none"
    });
    while(writing) {
        // wait for driftCalcUpdater() to finish
    }
    // activate the correction button if
    // operation not aborted
    if(aborted) {
        // make aborted message visible
        domMsg.text(msg);
        domAborted.attr("hidden", false);
        // drop unaccurate results
        driftDirection = null, driftSpeed = null;
        updateDriftInfo('--', '--');
    } else {
        updateDriftInfo(driftSpeed, Math.trunc(driftDirection) + '°');
    }
    // send data to Argos
    if(!aborted && driftDirection != null && driftSpeed != null) {
        sendDriftData(driftDirection, driftSpeed);
    }
}

// verify if checkbox is checked
function checkChecked() {
    gps = domGps.prop('checked');
}

// load usefull dom element for
// further use
function loadElements() {
    domCs = $('#cs');
    domCh = $('#ch');
    domAh = $('#ah');
    domDrift = $('#drift');
    domRh = $('#rh');
    domMsg = $('#abortedmsg');
    domAborted = $('#aborted');
    domGps = $('#gpsh');
    domLeft = $(".left_alt");
}

//////////////////////////////////////

// find get parameters from url
// (used for passing the fast forward time)
function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = { }, tokens, re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

(function($){
    $(document).ready(function(){
        loadElements();

        domCh.text('--');

        var query = getQueryParams(document.location.search);

        // start updating data 
        // fast forwarding with get parameter 't'
        domDrift.prop("disabled",true);
        if(query.t != undefined)
            jumpTo = query.t;
        else
            jumpTo = 0;
          
        updatingData();

        // add listeners to buttons
        domDrift.on("click", findDrift);
        domGps.on("click", checkChecked);
        $('#abortedbtn').on("click", function() {
            domAborted.attr("hidden", true);
        });
    });

    // drift button clicked
    function findDrift() {
        if(!started) {
            console.log("drift check started");
            domDrift.text('STOP');
            started = true;
            // calculate the drift
            reset();
            updateDriftInfo('--', '--');
            // lock resources
            writing = true;
            driftCalcUpdater();
        } else {
            stopDriftTest(false, "");
        }
    }
})(jQuery);