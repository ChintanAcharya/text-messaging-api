const passwordUtils = require('../utils/passwordUtils');
const crypto = require('crypto');

module.exports = (db) => (request, response) => {

    const user = request.body.username;
    const pass = request.body.password;

    console.log({user, pass});

    const salt = crypto.randomBytes(128).toString('base64');
    const iterations = Math.random() * 500 + 500;

    db.collection('users').insertOne({
        username: user,
        password: {
            salt,
            iterations,
            hash: passwordUtils.encrypt(pass, salt, iterations)
        }
    })
        .then(() => response.json({success: true}))
        .catch((err) => response.json(err));

};