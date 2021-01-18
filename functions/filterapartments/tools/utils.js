const keys = require("./config.js");
const fetch = require("node-fetch");

/**
 * Fetches GPS JSON object from the Google Geocode API
 *
 * @param address  The address of the location
 * @returns {Promise<Location|string|any|number|WorkerLocation>}
 */
async function getLocationFromGoogle(address) {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${keys.googleKey}`;
    let location;
    let response;
    try {
        response = await fetch(url);
        const json = await response.json();
        location = json.results[0].geometry.location;
    } catch (e) {
        console.log(e);
    }

    return location;
}

/**
 * Fetches Walkscore JSON object from the walkscore api
 *
 * @param address The address of the location
 * @param gps The GPS argument fetched from GoogleGeocoder API
 * @returns {Promise<*>}
 */
async function getWalkscore(address, gps) {
    let url = `http://api.walkscore.com/score?format=json&address=${address}&lat=${gps.lat}&lon=${gps.lng}&transit=1&bike=1&wsapikey=${keys.walkScoreApiKey}`;
    let reponse, json;
    try {
        response = await fetch(url);
        json = await response.json();
    } catch (e) {
        console.log(e);
    }

    // return json;
    return json;
}

/**
 * Fetches the bike time JSON object from the Google Distance Matrix API
 *
 * @param gps
 * @returns {Promise<*>}
 */
async function getBiketime(gps) {
    let url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&mode=bicycling&origins=${gps.lat},${gps.lng}&destinations=45.406130,-75.625500&key=${keys.googleKey} `;
    let reponse, json;
    try {
        response = await fetch(url);
        json = await response.json();
    } catch (e) {
        console.log(e);
    }

    // return json;
    return json;
}

/**
 * Invokes functions that need to fetch resources from external API's and then returns a compiled object to the Application code.
 *
 * @param address
 * @returns {Promise<{bikeScore: *, walkscore: {score: {score: *, description: *}, description: *}, transiteScore: *, biketoCoyoteTime: number}>}
 */
async function callExternalApis(address) {
    const gpsCoordinates = await getLocationFromGoogle(address);
    const walkscore = await getWalkscore(address, gpsCoordinates);
    //Time taken to bike to coyote rock gym,
    const bikeToCoyotetime = await getBiketime(gpsCoordinates);

    return {
        walkscore: {score: walkscore.walkscore, description: walkscore.description },
        bikeScore: walkscore.bike,
        transiteScore:walkscore.transit,
        biketoCoyoteTime: Math.floor(bikeToCoyotetime.rows[0].elements[0].duration.value/60)
    };
}

module.exports = {
    callExternalApis,
    getWalkscore,
    getLocationFromGoogle,
};
