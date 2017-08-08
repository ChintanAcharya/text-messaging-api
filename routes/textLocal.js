module.exports = (db) => async (request, response) => {
    const {number, status, customID, datetime} = request.body;
    console.log(request.body);
    try {
        const result = await db.collection('requests').findOneAndUpdate(
            {_id: +customID, 'numbers.number': number.slice(2)},
            {'$set': {'numbers.$.status': status}}
        );
        response.json({});
    }
    catch (err) {
        console.log(err);
        response.json({});
    }
};