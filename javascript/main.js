/*
 * GLOBAL VARIABLES
 */

// test state
var started = false;
// decide if use gps heading or
// magnetic heading
var gps = true;

// relevant data
var dataTimestamp = 0;
var sog = 0, cog = 0, mh = 0, sow = 0,
    lat = 0.0, lon = 0.0;

const delay = 1000, factor = 5;

// drift direction and speed
var driftDirection = null, driftSpeed = null;

//////////////////////////////////////

/*
 * GLOBAL FUNCTIONS
 */

// update the drift fields
function updateDriftInfo(speed, direc) {
    $('#cs').text(speed);
    $('#ch').text(direc + '°');
}

// actual heading update
function refreshInformations() {
    $('#ah').text(heading() + '°');
}

// stop test
function stopDriftTest(aborted, msg) {
    console.log("drift check stopped");
    started = false;
    $('#drift').text('FIND DRIFT');
    $('#rh').text('--');
    // activate the correction button if
    // operation not aborted
    if(aborted) {
        // make aborted message visible
        $('#abortedmsg').text(msg);
        $('#aborted').attr("hidden", false);
        // drop unaccurate results
        driftDirection = null, driftSpeed = null;
    }
}

// verify if checkbox is checked
function checkChecked() {
    gps = $('#gpsh').prop('checked');
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
        resizeWindow();
          
        $('#ch').text('--');

        var query = getQueryParams(document.location.search);

        // start updating data 
        // fast forwarding with get parameter 't'
        $('#drift').prop("disabled",true);
        if(query.t != undefined)
            jumpTo = query.t;
        else
            jumpTo = 0;
          
        updatingData();

        // add listeners to buttons
        $('#drift').on("click", findDrift);
        $('#gpsh').on("click", checkChecked);
        $('#abortedbtn').on("click", function() {
            $('#aborted').attr("hidden", true);
        });
    });

    // drift button clicked
    function findDrift() {
        if(!started) {
            console.log("drift check started");
            $('#correction').prop("disabled",true);
            $('#drift').text('STOP');
            started = true;
            // calculate the drift
            reset();
            updateDriftInfo('--', '--');
            driftCalcUpdater();
        } else {
            stopDriftTest(false, "");
        }
    }
})(jQuery);