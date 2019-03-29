/*
 * GLOBAL VARIABLES
 */

// test state
var started = false;
var testType = 'none';
// decide if use gps heading or
// magnetic heading
var gps = true;
var label = ' (cog)';

// relevant data
var dataTimestamp = 0;
var sog = 0, cog = 0, mh = 0, sow = 0,
    lat = 0.0, lon = 0.0;

const delay = 1000, factor = 5;

// drift direction and speed
var driftDirection = null, driftSpeed = null;
// compass and log corrections
var compassDelta = null, logDelta = null;

/* cog and sog are considered without drift
 * cog = mh - compassDelta
 * sog = sow - logDelta
 */

//////////////////////////////////////

/*
 * GLOBAL FUNCTIONS
 */

// update the drift fields
function updateDriftInfo(speed, direc) {
    $('#cs').text(speed);
    compass(direc, 'ch', '.left.top', 0);
}

// update the compass and log fields
function updateDeltaInfo(compass, log) {
    $('#mhc').text(compass);
    $('#sowc').text(log);
}

// actual heading update
function refreshInformations() {
    $('#ah').text(heading() + '°' + label);
}

// stop test
function stopDriftTest(aborted, msg) {
    console.log("drift check stopped");
    started = false;
    $('#drift').text('FIND DRIFT');
    testType = 'none';
    // activate the correction button if
    // operation not aborted
    if(!aborted) {
        $('#correction').prop("disabled",false);
    } else {
        // make aborted message visible
        $('#abortedmsg').text(msg);
        $('#aborted').attr("hidden", false);
        // drop unaccurate results
        driftDirection = null, driftSpeed = null;
    }
}

function stopDeltaTest(aborted) {
    console.log("correction check stopped");
    started = false;
    $('#correction').text('FIND DELTA');
    // activate the drift button
    $('#drift').prop("disabled",false);
    testType = 'none';
    if(aborted) {
        // make aborted message visible
        $('#abortedmsg').text(msg);
        $('#aborted').attr("hidden", false);
        $('#correction').prop("disabled",true);
    }
}

// verify if checkbox is checked
function checkChecked() {
    gps = $('#gpsh').prop('checked');
    if(gps) 
        label = ' (cog)';
    else
        label = ' (mh)';
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
          
        $('#correction').prop("disabled",true);
        compass(0, 'ch', '.left.top', 0);

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
        $('#correction').on("click", findCorrections);
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
            testType = 'drift';
            // calculate the drift
            reset();
            updateDriftInfo(0, 0);
            driftCalcUpdater();
        } else {
            stopDriftTest(false, "");
        }
    }

    // delta button clicked
    function findCorrections() {
        if(!started) {
            console.log("correction check started");
            $('#drift').prop("disabled",true);
            $('#correction').text('STOP');
            started = true;
            testType = 'delta';
            // calculate corrections
            if(driftSpeed != null && driftDirection != null) {
                reset();
                updateDeltaInfo(0, 0);
                correctionCalcUpdater();
            } else {
                stopDeltaTest(true, "No drift information");
            }
        } else {
            stopDeltaTest(false, "");
        }
    }
})(jQuery);