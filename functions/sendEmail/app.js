var AWS = require('aws-sdk');


// Create sendEmail params
exports.lambdaHandler = async (event, context) => {
   if(typeof (event.list) === 'undefined') return null;
    var params = {
        Destination: { /* required */

            ToAddresses: [
                'kapooky101@gmail.com',
            ]
        },
        Message: { /* required */
            Body: { /* required */
                Text: { Data: JSON.stringify(event.list) }
            },
            Subject: {
                Data: 'Test email'
            }
        },
        Source: 'kapooky102@gmail.com', /* required */
    };

    // Create the promise and SES service object
    try {
        var sendPromise = await new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
        console.log(sendPromise);
    }catch (e) {
        console.log(e,e.stack) ;
    }
};
