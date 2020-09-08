const { logError } = require('../helpers/logger');

class HttpError extends Error {
    constructor(code, message, personId) {
        super();
        this.code = code || 500;
        this.message = message || 'Error';
        this.personId = personId;
    }
}

const handleHttpError = (err, res) => {
    const { message, code, personId } = err;
    const origin = err.stack.split('\n')[1];
    const finalError = message + origin;
    logError(finalError, personId);

    res.status(code || 500).json({
        message
    });
}

module.exports = { HttpError, handleHttpError }