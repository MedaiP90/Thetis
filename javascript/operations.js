// last data received 
var lastTimestamp = -1;
var lsog = 0, lcog = 0, lmh = 0, lsow = 0
    llat = 0.0, llon = 0.0;

// last useful data (for the drift calculation)
var usefulTimestamp = -1;
var usog = 0, ucog = 0, umh = 0, usow = 0
    ulat = 0.0, ulon = 0.0;

// drift values for average
var speedVector = new Array();
var directionVector = new Array();

// drift direction and speed
var driftDirection = null, driftSpeed = null;

// decide if use cog or mh
var heading = function() {
    if(gps)
        return cog;
    else
        return mh;
}
var uheading = function() {
    if(gps)
        return ucog;
    else
        return umh;
}
var lheading = function() {
    if(gps)
        return lcog;
    else
        return lmh;
}

function reset() {
    // reset values
    speedVector = new Array();
    directionVector = new Array();
    driftDirection = null;
    driftSpeed = null;

    usefulTimestamp = -1;
    usog = 0, ucog = 0, umh = 0;
    usow = 0, ulat = 0.0, ulon = 0.0;

    lastTimestamp = -1;
    lsog = 0, lcog = 0, lmh = 0;
    lsow = 0, llat = 0.0, llon = 0.0;

    resetAngularSpeeds();
}

function storeUseful() {
    // store survey data
    usefulTimestamp = dataTimestamp;
    usog = sog;
    ucog = cog;
    umh = mh;
    usow = sow;
    ulat = lat;
    ulon = lon;
}

// calculate average from an array of values
// using weighted average formula
function computeAverage(array) {
    var steps = 5;
    var weight = computeMaxWeight(array.length, steps);
    var xSum = array[0] * weight, 
        pSum = weight;
    
    for(var i = 1; i < array.length; i++) {
        xSum += array[i] * weight;
        pSum += weight;
        weight -= steps;
    }

    return Math.fixedDecimals(xSum / pSum, 2);
}

function computeMaxWeight(elements, steps) {
    var init = 0;
    for(var i = 0; i < elements - 1; i++) {
        init += steps;
    }
    return init;
}

// manage the drift calculation
function driftCalcUpdater() {
    if(started) {
        if(dataTimestamp > lastTimestamp) {
            if(usefulTimestamp == -1) {
                storeUseful()
                domRh.text(uheading() + '°');

                previousHeading = heading();
                setTimeout(veerMonitor, timeout);
                // constantly get the veer direction
                determineVeer();
            } else {
                // decide if the new data is useful or not
                if(veer(uheading(), lheading(), heading())) {
                    var speed = getDriftSpeed(ulat, ulon, usefulTimestamp,
                        lat, lon, dataTimestamp);
                    var direc = getDriftDirection(ulat, ulon, lat, lon);

                    speedVector.push(speed);
                    directionVector.push(direc);

                    storeUseful();
                    updateDriftInfo(speed, Math.trunc(direc) + '°');
                }
            }

            // store the data as last if valid
            // (not corrupted by waves action)
            var diff = heading() - lheading();
            if(avg == null || Math.sign(diff) == Math.sign(avg)
                || avg == 0 || Math.abs(diff) > 270) {
                lastTimestamp = dataTimestamp;
                lsog = sog;
                lcog = cog;
                lmh = mh;
                lsow = sow;
                llat = lat;
                llon = lon;
            } 
        }

        // repeat the survey
        setTimeout(driftCalcUpdater, delay);
    } else if(!process_aborted) {
        domLeft.css({
            "background-image":"none"
        });

        if(speedVector.length > 0 && directionVector.length > 0) {
            // calculate average value
            driftSpeed = computeAverage(speedVector);
            driftDirection = computeAverage(directionVector);

            updateDriftInfo(driftSpeed, Math.trunc(driftDirection) + '°');

            if(speedVector.length >= 2 && speedVector.length <= 4 && 
                directionVector.length >= 2 && directionVector.length <= 4) {  
                // send data to Argos
                sendDriftData(driftDirection, driftSpeed);
            } else {
                // data count not in safe range: user decide if use data anyway
                // or get rid of them and repeat the test
                domWorning.attr("hidden", false);
                $("#datacount").text(Math.min(speedVector.length, directionVector.length));
                $("#btnsend").on("click", function() {
                    // send data to Argos
                    sendDriftData(driftDirection, driftSpeed);
    
                    domWorning.attr("hidden", true);
                });
            }
        }
    }
}