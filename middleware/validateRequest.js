module.exports = () => (request, response, next) => {

    const {numbers, event, date, username, password, name, contact, mainEvent} = request.body;
    /* TEMPORARILY DISABLED
    if (!numbers || !event || !date || !name || !contact || !mainEvent) {
        response.json({success: false, error: 'Invalid request.'});
        return;
    }
    */
    next();

};