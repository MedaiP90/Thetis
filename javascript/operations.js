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
function computeAverage(array) {
    var pSum = 0;
    array.forEach(function(value) {
        pSum += value;
    });
    return Math.fixedDecimals(pSum / array.length, 2);
}

// manage the drift calculation
function driftCalcUpdater() {
    if(started) {
        if(dataTimestamp > lastTimestamp) {
            if(usefulTimestamp == -1) {
                storeUseful()
                $('#rh').text(uheading() + '°');

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
                    updateDriftInfo(speed, Math.trunc(direc));
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
    } else {
        // calculate average value
        if(speedVector.length > 0 && directionVector.length > 0) {
            driftSpeed = computeAverage(speedVector);
            driftDirection = computeAverage(directionVector);

            updateDriftInfo(driftSpeed, Math.trunc(driftDirection));
            sendDriftData(driftDirection, driftSpeed);
        }
    }
}