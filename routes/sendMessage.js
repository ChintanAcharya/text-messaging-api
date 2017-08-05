const httpRequest = require('request');

module.exports = (db, config) => (request, response) => {
    const {numbers, event, message} = request.body;
    const {test, username, hash, sender} = config.sms;
    const custom = "Test";
    httpRequest.post({
        url: 'https://api.textlocal.in/send/',
        form: {
            test,
            hash,
            username,
            numbers,
            message,
            custom
        }
    }, (err, result, body) => {
        if (err === null) response.json({success: true});
        else response.json({success: false, error: err});
    });
};
