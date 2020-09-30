const { logError } = require('../logger');
const { dbUpdateImmigrant } = require('../../service/immigrantsDb/repository');
class ServiceError extends Error {
    constructor(message, personId) {
        super();
        this.message = message || 'Error';
        this.personId = personId;
    }
}

const handleServiceError = (err, id) => {
    // const { message, personId } = err;
    const { message } = err;
    const origin = err.stack.split('\n')[1];
    const finalError = message + origin;
    logError(finalError, id);
    // logError(finalError, personId);
    dbUpdateImmigrant(id, { status: { progress: 'failed '} }).catch(err => {
        logError(`cant contact db! weird shit, ${err}`, id);
    });
}

module.exports = { ServiceError, handleServiceError }
