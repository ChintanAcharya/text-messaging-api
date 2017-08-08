const passwordUtils = require('../utils/passwordUtils');
const crypto = require('crypto');

module.exports = (db) => async (request, response) => {

    const user = request.body.username;
    const pass = request.body.password;

    const salt = crypto.randomBytes(128).toString('base64');
    const iterations = Math.floor(Math.random() * 500 + 500);

    try {
        await db.collection('users').insertOne({
            username: user,
            password: {
                salt,
                iterations,
                hash: passwordUtils.encrypt(pass, salt, iterations)
            }
        });
        response.json({success: true})
    }
    catch
        (err) {
        response.json(err);
    }
};