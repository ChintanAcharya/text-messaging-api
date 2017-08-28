const httpRequest = require('request-promise-native');

module.exports = (db, config) => async (request, response) => {
    const {numbers, event, date, name, contact, mainEvent} = request.body;
    const {test, username, hash, sender} = config.sms;

    try {
        const seq = (await db.collection('counters').findOneAndUpdate(
            {name: 'requestCount'},
            {'$inc': {seq: 1}},
            {upsert: true}
        )).value.seq;
        const result = await db.collection('requests').insertOne({
            _id: seq,
            numbers: numbers.split(',').map(num => ({number: num, status: '?'})),
            event,
            date: new Date(),
            mainEvent,
        });
        const message = `Thank you for registering in ${event}.\nPlease pay fees at the desks in A-block on ${date} or contact coordinator ${name} : ${contact}.\n-teamBVM`;
        const responseBody = await httpRequest.post({
            url: 'https://api.textlocal.in/send/',
            form: {
                test,
                hash,
                username,
                numbers,
                message,
                custom: result.insertedId,
                sender,
                receipt_url: config.receipt_url
            }
        });
        const res = JSON.parse(responseBody);
        console.log(res);
        if (res.status === 'success')
            response.json({success: true});
        else
            throw res.errors;
    }
    catch (err) {
        response.json({success: false, error: err})
    }
};
