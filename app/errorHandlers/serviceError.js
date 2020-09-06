const { logError } = require('../helpers/logger');

module.exports = err => {
    const message = err.message;
    const origin = err.stack.split('\n')[1];

    const finalError = message + origin;
    logError(finalError);
}