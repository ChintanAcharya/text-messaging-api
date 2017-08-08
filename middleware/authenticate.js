const passwordUtils = require('../utils/passwordUtils');

module.exports = (db) => async (request, response, next) => {

    const username = request.body.username;
    const password = request.body.password;

    if (!username || !password) {
        response.json({success: false, error: 'Invalid request'});
        return;
    }

    try {
        const doc = await db.collection('users').findOne({username});

        if (doc === null)
            response.json({success: false, error: 'Invalid username'});
        else {
            const {salt, iterations, hash} = doc.password;
            if (hash === passwordUtils.encrypt(password, salt, iterations))
                next();
            else
                response.json({success: false, error: 'Invalid password'});
        }
    }
    catch (err) {
        response.json({success: false, error: err});
    }

};