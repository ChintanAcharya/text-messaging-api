module.exports = (db) => (request, response) => {
    const {number, status, customID, datetime} = request.body;
    db.collection('requests').findOneAndUpdate(
        {_id: customID, 'numbers.number': number},
        {'$set': {'numbers.$.status': status}}
    )
        .then((result) => {
            console.log(result);
        })
};