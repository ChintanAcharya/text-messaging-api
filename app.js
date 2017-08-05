const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();

const config = {
    sms: {
        test: process.env.SMS_TEST === 'true',
        username: process.env.SMS_USERNAME,
        hash: process.env.SMS_HASH,
        sender: process.env.SMS_SENDER || 'TXTLCL'
    },
    database: {
        url: process.env.DATABASE_URL
    }
};

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

MongoClient.connect(config.database.url)
    .then((db) => {
        console.log("Connected to database.");
        const auth = require('./middleware/authenticate')(db);
        const sendMessage = require('./routes/sendMessage')(db, config);
        const createUser = require('./routes/createUser')(db);
        app.post('/sendMessage', auth, sendMessage);
        app.post('/createUser', createUser);

        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            const err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handler
        app.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.json({error: 'Error', success: false, status: err.status});
        });

    })
    .catch((err) => {
        app.all(['/sendMessage', '/addUser'], (request, response) => {
            response.json({success: false, error: 'Failed to connect to the database'});
        });
    });

module.exports = app;
