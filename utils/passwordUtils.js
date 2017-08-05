const crypto = require('crypto');

const encrypt = (passwordText, salt, iterations) => {
    return crypto.pbkdf2Sync(passwordText, salt, iterations, 512, 'sha512').toString();
};

module.exports = { encrypt };