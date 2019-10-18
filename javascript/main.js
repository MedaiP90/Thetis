/*
 * GLOBAL VARIABLES
 */

// test state
var started = false;
var process_aborted = false;
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
    domGps, domLeft, domWorning;

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
    process_aborted = aborted;
    console.log("drift check stopped");
    started = false;
    domDrift.text('FIND DRIFT');
    domRh.text('--');
    // activate the correction button if
    // operation not aborted
    if(aborted) {
        // make aborted message visible
        domMsg.text(msg);
        domAborted.attr("hidden", false);
        // drop unaccurate results
        driftDirection = null, driftSpeed = null;
        updateDriftInfo('--', '--');
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
    domWorning = $("#worning");
}

//////////////////////////////////////

// find get parameters from url
// (used for passing the fast forward time)
/*function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = { }, tokens, re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}*/

(function($){
    $(document).ready(function(){
        loadElements();

        domCh.text('--');

        //var query = getQueryParams(document.location.search);

        // start updating data 
        // fast forwarding with get parameter 't'
        /*domDrift.prop("disabled",true);
        if(query.t != undefined)
            jumpTo = query.t;
        else
            jumpTo = 0;*/
          
        updatingData();

        // add listeners to buttons
        domDrift.on("click", findDrift);
        domGps.on("click", checkChecked);
        $('#abortedbtn').on("click", function() {
            domAborted.attr("hidden", true);
        });
        $('#btncancel').on("click", function() {
            domWorning.attr("hidden", true);
            // drop unaccurate results
            driftDirection = null, driftSpeed = null;
            updateDriftInfo('--', '--');
        });
    });

    // drift button clicked
    function findDrift() {
        if(!started) {
            console.log("drift check started");
            domDrift.text('STOP');
            started = true;
            process_aborted = false;
            // calculate the drift
            reset();
            updateDriftInfo('--', '--');
            driftCalcUpdater();
        } else {
            stopDriftTest(false, "");
        }
    }
})(jQuery);
