const { HttpError } = require ('../../helpers/errorHandlers/httpError');

const isValid = (req, res, next) => {
    const { id, primaryDomain } = req.body;

    // if(!id || typeof(id) != 'string') {
    //     throw new HttpError(400, 'id field needs to be string or is missing');
    // }
    if(!isProperType(id, 'string')) {
        throw new HttpError(400, 'id field needs to be string or is missing');
    }
    else if(!isProperType(primaryDomain, 'string')) {
        throw new HttpError(400, 'primaryDomain field needs to be string or is missing');
    }
    next();
}

const isProperType = (value, type) => (value && typeof(value) === type)

module.exports = { isValid }