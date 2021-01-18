'use strict';
const kijiji = require("kijiji-scraper");
const utils = require("./tools/utils.js");

exports.lambdaHandler = async (event, context) => {
    let greatAds = [];

    try {
        console.log("hello");
        // Use the ads array
        let location;
        let ads = event.list;
        for (let i = 0; i < ads.length; ++i) {
            location = ads[i].attributes.location;

            //coerce the value into a boolean
            let utilities = !!(ads[i].attributes.hydro && ads[i].attributes.water
                && ads[i].attributes.heat);


            //Filter out irrelevant ads
            if (ads[i].attributes.price > 1500) continue;
            if (!utilities) continue;
            if (ads[i].attributes.yard) continue;
            //if (!ads[i].attributes.numberbathrooms === 10) continue;

            //call external apis
            const results = await utils.callExternalApis(location);
            if(results.biketoCoyoteTime > 45) continue;
            console.log(`The price is $${ads[i].attributes.price} and triptoCoyote takes ${results.biketoCoyoteTime} minutes`);
            greatAds.push({
                'price':ads[i].attributes.price,
                'walkscore':results.walkscore,
                'bikeTime':results.biketoCoyoteTime,
                'url': ads[i].url
            });

        }
        console.log(greatAds);
        return {'list': greatAds};
    }
    catch (e) {
        console.log(e)
    }


};

const options = {
    minResults: 20,
    pageDelayMs: 1000,
    scraperType: "html"
};

const params = {
    locationId: kijiji.locations.ONTARIO.OTTAWA_GATINEAU_AREA,  // Same as kijiji.locations.ONTARIO.OTTAWA_GATINEAU_AREA.OTTAWA
    categoryId: kijiji.categories.REAL_ESTATE.FOR_RENT.LONG_TERM_RENTALS,  // Same as kijiji.categories.CARS_AND_VEHICLES
    //  sortByName: "priceAsc", // Show the cheapest listings first
    q: "bachelor apartment",
    sortByName: "DATE_DESCENDING"
};



