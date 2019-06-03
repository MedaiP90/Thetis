const RADIUS = 6372.795477598 // earth radius

// degrees to radians
Math.radians = function(deg){
	return parseFloat(deg) * Math.PI / 180.0;
}

// radians to degrees
Math.degrees = function(rad){
	return parseFloat(rad) * 180 / Math.PI;
}

// normalize decimal digits number
Math.fixedDecimals = function(number, m) {
    var tmp = 10;
    for(var i = 0; i < m-1; i++) {
        tmp = tmp * 10;
    }
    return Math.trunc(number * tmp) / tmp;
}

// convert NMEA coordinates into 
// sessadecimal degrees
Math.nmeaToDec = function(angle) {
    var deg = Math.trunc(angle/100);
    var min = angle - (deg * 100);
    return deg + (min / 60);
}

// calculate the speed of the drift in knots
function getDriftSpeed(latA, lonA, tsA, latB, lonB, tsB) {
    /*
        latA : latitude of the first point
        lonA : longitude of the first point
        tsA  : timestamp of the first detection
        latB : latitude of the second point
        lonB : longitude of the second point
        tsB  : timestamp of the second detection
    */

    // compute the distance
    var sinLat = Math.sin(Math.radians(Math.abs(latB - latA)) / 2);
    var sinLon = Math.sin(Math.radians(Math.abs(lonB - lonA)) / 2);
    var havLat = sinLat * sinLat;
    var havLon = sinLon * sinLon;
    var dSigma = 2 * Math.asin(Math.sqrt(havLat + (havLon * Math.cos(Math.radians(latA)) * Math.cos(Math.radians(latB)))));

    var dist = RADIUS * dSigma * 1000;

    // compute speed module
    var dT = (tsB - tsA) / 1000;
    var speed = (dist / dT) * 3.6;

    return Math.fixedDecimals(speed * 0.539957, 1);
}

// calculate the drift heading
function getDriftDirection(latA, lonA, latB, lonB) {
    /*
        latA : latitude of the first point
        lonA : longitude of the first point
        latB : latitude of the second point
        lonB : longitude of the second point
    */

    // compute direction
    var dphi = Math.log(Math.tan(Math.radians(latB) / 2 + Math.PI / 4) / Math.tan(Math.radians(latA) / 2 + Math.PI / 4));
    var dlon = Math.abs(lonB - lonA)%180;
    var dirRad = Math.atan2(Math.radians(dlon), dphi);
    if(dirRad >= 0) {
        return Math.fixedDecimals(Math.degrees(dirRad), 2);
    } else {
        return Math.fixedDecimals(360 + Math.degrees(dirRad), 2);
    }
}
