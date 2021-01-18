'use strict';
// Import required AWS SDK clients and commands for Node.js
const kijiji = require("kijiji-scraper");
var AWS = require('aws-sdk');


function createParamsTemplate(currentAd) {
    return  {
        TableName: 'apartment',
        Item: {
            'apartmentUrl': {S: `${currentAd.url}`}
        },
        ConditionExpression: "attribute_not_exists(apartmentUrl)"
    };

}
async function dynamodb(adArray) {
    AWS.config.update({region: 'us-east-1'});
    const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    let prunedAds = [];
    for (let i = 0; i < adArray.length; i++) {
        const currentAd = adArray[i];

        let params = createParamsTemplate(currentAd);
        //This thenable promise is a bit unnesscary when it's being awaited
        const isUniqueAd = await ddb.putItem(params).promise().then(data => {
            console.log("added to filtered list");
            console.log(data);
            return true;
            //if the ad is already in the database, then its a duplicate ad so dont add it to the list
        }).catch(error => {
            console.log(`ad is a duplicate ${currentAd}`);
            console.log(error);
            return false;
        });

        // if the ad is unique then push the ad into the filtered list
        console.log("Is it finished?");
        if(isUniqueAd) prunedAds.push(currentAd);
    }
    console.log("DynamoDB function is complete");
    console.log(`prune ad is ${prunedAds}`);
    return prunedAds;

}

exports.lambdaHandler = async (event, context) => {
    try {
        const ads = await kijiji.search(params, options);
        console.log("Is this even working?");
        let adsToemail = await dynamodb(ads);

        console.log("hello world");
        console.log(adsToemail);
        return {'list': adsToemail};
    }
    catch (e) {
        console.log(e);
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



