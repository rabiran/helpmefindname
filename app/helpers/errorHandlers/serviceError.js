const { logError } = require('../logger');

class ServiceError extends Error {
    constructor(message, personId) {
        super();
        this.message = message || 'Error';
        this.personId = personId;
    }
}

const handleServiceError = (err) => {
    const { message, personId } = err;
    const origin = err.stack.split('\n')[1];
    const finalError = message + origin;
    logError(finalError, personId);
}

module.exports = { ServiceError, handleServiceError }
