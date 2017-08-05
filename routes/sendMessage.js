const httpRequest = require('request-promise-native');

module.exports = (db, config) => (request, response) => {
    const {numbers, event, message} = request.body;
    const {test, username, hash, sender} = config.sms;

    db.collection('counters').findOneAndUpdate(
        {name: "requestCount"},
        {"$inc": {seq: 1}},
        {upsert: true}
    )
        .then((result) => {
            return Promise.resolve(result.value.seq);
        })
        .then((seq) =>
            db.collection('requests').insertOne({
                _id: seq,
                numbers: numbers.split(','),
                event,
                message,
                date: new Date()
            }))
        .then((result) =>
            httpRequest.post({
                url: 'https://api.textlocal.in/send/',
                form: {
                    test,
                    hash,
                    username,
                    numbers,
                    message: 'This is a test.',
                    custom: result.insertedId,
                    sender
                }
            }))
        .then((responseBody) => {
            const res = JSON.parse(responseBody);
            if (res.status === 'success')
                response.json({success: true});
            else return Promise.reject(res.errors);
        })
        .catch((err) => {
            response.json({success: false, error: err})
        });
};
