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
        const message = 'Dear friends\n' +
            'The \'Freshers\' by BVM is on 5th Sept. \n' +
            'The audition dates: 28-29-30Aug from 6 pm.\n' +
            'Categories: dance,singing,theatre, anchoring\n' +
            'Venue: Auditorium';
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
