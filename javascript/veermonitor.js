const maxTries = 5; // values before angular speed average computation
const error = 2; // angular speed error tolerance 
                 // avg - error < angularSpeed < avg + error

// veer direction
var veer = function(u, l, c) {
    return false;
}

// angular speeds
var angularSpeeds = new Array(),
    angularSpeedsTmp = new Array();
var angularSpeed = null;

// value count
var tries = maxTries;

// previous heading difference calculation
var previousHeading = 0;

function resetAngularSpeeds() {
    veer = function(u, l, c) {
        return false;
    };

    tries = maxTries;
    angularSpeed = null;

    angularSpeeds = new Array();
    angularSpeedsTmp = new Array();
}

// compute the veer direction 
// (veer function)
function determineVeer() {
    if(angularSpeed != null) {
        if(angularSpeeds.length > 0) {
            var avg = computeAverage(angularSpeeds);
        } else {
            var avg = angularSpeed;
        }
        if(angularSpeed < 0 && avg > 0) {
            // different directions
            stopDriftTest(true);
        } else if(angularSpeed < avg + error && angularSpeed > avg - error) {
            // the veer radius is changed too much
            stopDriftTest(true);
        } else {
            if(avg < 0 + error/2 && avg > 0 - error/2) {
                // not turning
                stopDriftTest(true);
            } else if(angularSpeed < 0) {
                // turning left
                veer = function(u, l, c) {
                    return u < l && u >= c;
                }
            } else {
                // turning right
                veer = function(u, l, c) {
                    return u > l && u <= c;
                }
            }
        }
    }
}

// observe the veer and calculate the
// instantaneous and average angular speeds
function veerMonitor() {
    if(started) {
        if(tries == 0) {
            if(angularSpeed != null) {
                angularSpeeds.push(angularSpeed);
            }
            angularSpeed = computeAverage(angularSpeedsTmp);
            angularSpeedsTmp = new Array();
            tries = maxTries;
        }

        var actualHeading = heading();
            diff = actualHeading - previousHeading;

        previousHeading = actualHeading;

        // remove the erroneous results around
        // zero degrees
        if(Math.abs(diff) < 270) {
            angularSpeedsTmp.push(diff);
        }

        tries -= 1;
        setTimeout(veerMonitor, delay*factor);
    }
}