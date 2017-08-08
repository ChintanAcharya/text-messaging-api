module.exports = (db) => async function (request, response) {
    const page = request.body.page || 1;
    const numPerPage = 10;

    try {
        const docs = await db.collection('requests').find({}).skip((page - 1) * numPerPage).limit(numPerPage).toArray();
        response.json({success: true, data: docs});
    }
    catch (err) {
        response.json({success: false, error: err})
    }
};