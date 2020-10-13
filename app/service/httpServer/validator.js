const { HttpError } = require ('../../helpers/errorHandlers/httpError');

const isValid = (req, res, next) => {
    const { id, primaryDomainUser } = req.body;

    if(!isProperType(id, 'string')) {
        throw new HttpError(400, 'id field needs to be string or is missing');
    }
    else if(!isProperType(primaryDomainUser, 'string')) {
        throw new HttpError(400, 'primaryDomain field needs to be string or is missing');
    }
    next();
}

const isProperType = (value, type) => (value && typeof(value) === type)

module.exports = { isValid }