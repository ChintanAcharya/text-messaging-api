module.exports = () => (request, response, next) => {

    const {numbers, event, message} = request.body;

    if (!numbers || !event || !message) {
        response.json({success: false, error: 'Invalid request.'});
        return;
    }

    if (typeof numbers !== 'string' || typeof event !== 'string' || typeof message !== 'string') {
        response.json({success: false, error: 'Invalid request.'});
        return;
    }

    next();

};