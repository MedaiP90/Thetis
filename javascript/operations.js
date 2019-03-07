// last data received 
var lastTimestamp = -1;
var lsog = 0, lcog = 0, lmh = 0, lsow = 0
    llat = 0.0, llon = 0.0;

// last useful data (for the drift calculation)
var usefulTimestamp = -1;
var usog = 0, ucog = 0, umh = 0, usow = 0
    ulat = 0.0, ulon = 0.0;

// veer direction
var veer = function(u, l, c) {
    return false;
};
var left = false;

// number of tries for veer calculation
var tries = 10;
// useful for veer computation
var overallDirection = 0;
// error tolerance for veer computation
var tolerance = 1;

// drift values for average
var speedVector = new Array();
var directionVector = new Array();
// compass and log values for average
var compassVector = new Array();
var logVector = new Array();

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
    compassVector = new Array();
    logVector = new Array();

    usefulTimestamp = -1;
    usog = 0, ucog = 0, umh = 0;
    usow = 0, ulat = 0.0, ulon = 0.0;

    lastTimestamp = -1;
    lsog = 0, lcog = 0, lmh = 0;
    lsow = 0, llat = 0.0, llon = 0.0;
    
    veer = function(u, l, c) {
        return false;
    };
    left = false;
    tries = 10;
    overallDirection = 0;
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

// determine the veer direction
function determineVeer() {
    // decide in wich direction the boat 
    // is turning
    if(tries > 0) {
        overallDirection += uheading() - heading();

        tries -= 1;

        setTimeout(determineVeer, delay);
    } else {
        console.log((overallDirection/10));

        if(overallDirection/10 > tolerance) {
            left = true;
            veer = function(u, l, c) {
                return u < l && u >= c;
            }
            console.log('\nTurning left');
        } else if(overallDirection/10 < -tolerance) {
            left = false;
            veer = function(u, l, c) {
                return u > l && u <= c;
            }
            console.log('\nTurning right');
        } else {
            stopDriftTest(true);
            left = false;
            console.log('\nNot turning');
        }
    }
}

// manage the drift calculation
function driftCalcUpdater() {
    if(started) {
        if(dataTimestamp > lastTimestamp) {
            if(usefulTimestamp == -1) {
                storeUseful()
                $('#rh').text(uheading() + '°' + label);
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
            //if(left == null || (left && cog <= lcog) || (!left && cog >= lcog)) {
                lastTimestamp = dataTimestamp;
                lsog = sog;
                lcog = cog;
                lmh = mh;
                lsow = sow;
                llat = lat;
                llon = lon;
            //} 
        }

        // repeat the survey
        setTimeout(driftCalcUpdater, delay);
    } else {
        // calculate average value
        if(speedVector.length > 0 && directionVector.length > 0) {
            driftSpeed = computeAverage(speedVector);
            driftDirection = computeAverage(directionVector);

            updateDriftInfo(driftSpeed, Math.trunc(driftDirection));
        }
    }
}

// manage corrections calculation
function correctionCalcUpdater() {
    if(started) {
        // compute cog and sog clean data
        var cleanSpeed = getCleanSpeed(cog, sog, driftDirection, driftSpeed);
        var cleanDirection = getCleanDirection(cog, driftDirection);

        // compute corrections
        var cd = Math.fixedDecimals(mh - cleanDirection, 2),
            ld = Math.fixedDecimals(sow - cleanSpeed, 2);

        compassVector.push(cd);
        logVector.push(ld);

        updateDeltaInfo(cd, ld);

        // repeat the survey every 'factor' seconds
        setTimeout(correctionCalcUpdater, delay*factor);
    } else {
        // calculate average value
        if(compassVector.length > 0 && logVector.length > 0) {
            compassDelta = computeAverage(compassVector);
            logDelta = computeAverage(logVector);

            updateDeltaInfo(compassDelta, logDelta);
        }
    }
}