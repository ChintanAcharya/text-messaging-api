module.exports = (db) => (request, response) => {
    const page = request.body.page || 1;
    const numPerPage = 10;

    db.collection('requests').find({}).skip((page - 1) * numPerPage).limit(numPerPage).toArray()
        .then((docs) => {
            response.json({success: true, data: docs});
        })
        .catch((err) => {
            response.json({success: false, error: err});
        })
};