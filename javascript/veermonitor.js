const maxTries = 5; // values before angular speed average computation
const error = 2; // angular speed error tolerance 
                 // avg - error < angularSpeed < avg + error
const timeout = delay*factor; // time between surveys

// veer direction
var veer = function(u, l, c) {
    return false;
}

// angular speeds
var angularSpeeds = new Array(),
    angularSpeedsTmp = new Array();
var angularSpeed = null, avg = null;

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
            avg = computeAverage(angularSpeeds);
        } else {
            avg = angularSpeed;
        }
        if(Math.sign(angularSpeed) != Math.sign(avg)) {
            // different directions
            //console.log("Different directions (avg = " + avg + ", as = " + angularSpeed + ")");
            if(directionVector.length == 0)
                stopDriftTest(true, "Not turning properly");
            else
                stopDriftTest(false, "");
        } else if(angularSpeed > avg + error || angularSpeed < avg - error) {
            // the veer radius is changed too much
            //console.log("Accelerating (avg = " + avg + ", as = " + angularSpeed + ")");
            if(directionVector.length == 0)
                stopDriftTest(true, "Not mantaining a constant radius");
            else
                stopDriftTest(false, "");
        } else {
            if(avg < 0 + error/4 && avg > 0 - error/4) {
                // not turning
                //console.log("Not turning (avg = " + avg + ")");
                stopDriftTest(true, "Not turning");
            } else if(angularSpeed < 0) {
                // turning left
                //console.log("Turning left (avg = " + avg + ")");
                veer = function(u, l, c) {
                    return u < l && u >= c;
                }
            } else {
                // turning right
                //console.log("Turning right (avg = " + avg + ")");
                veer = function(u, l, c) {
                    return u > l && u <= c;
                }
            }
        }
    }
    
    if(started) {
        setTimeout(determineVeer, timeout*(maxTries + 1));
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
            angularSpeedsTmp.push(diff/factor);
        }

        tries -= 1;
        setTimeout(veerMonitor, timeout);
    }
}