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

// determine the veer direction
function determineVeer() {
    // decide in wich direction the boat 
    // is turning
    if(tries > 0 && started) {
        overallDirection += uheading() - heading();

        tries -= 1;

        setTimeout(determineVeer, delay);
    } else if(started) {
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