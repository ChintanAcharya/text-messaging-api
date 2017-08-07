module.exports = (db) => (request, response) => {
    const {number, status, customID, datetime} = request.body;
    console.log(request.body);

    db.collection('receipts').insertOne(request.body)
        .then(() =>
            db.collection('requests').findOneAndUpdate(
                {_id: +customID, 'numbers.number': number.slice(2)},
                {'$set': {'numbers.$.status': status}}
            )
        )
        .then((result) => {
            response.json({});
        })
        .catch((error) => {
            console.log(error);
            response.json({});
        });
};