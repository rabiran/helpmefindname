const { logError } = require('../helpers/logger');


class HttpError extends Error {
    constructor(code, message) {
      super();
      this.code = code || 500;
      this.message = message || 'Error';
    }
}


const handleError = (err, res) => {
    const { message, code } = err;
    const origin = err.stack.split('\n')[1];
    // const status = 
    const finalError = message + origin;
    logError(finalError);

    res.status(code).json({
        message
    });
}
module.exports = { HttpError, handleError }