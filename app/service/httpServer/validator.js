const { HttpError } = require ('../../helpers/errorHandlers/httpError');

const isValidPost = (req, res, next) => {
    const { id, primaryUniqueIdIndex, isNewUser } = req.body;

    if(!isProperType(id, 'string')) {
        throw new HttpError(400, 'id field needs to be string or is missing');
    }
    else if(!isProperType(primaryUniqueIdIndex, 'number')) {
        throw new HttpError(400, 'primaryUniqueIdIndex field needs to be number or is missing');
    }
    else if(!isProperType(isNewUser, 'boolean')) {
        throw new HttpError(400, 'isNewUser field needs to be boolean or is missing');
    }
    next();
}

const isValidPut = (req, res, next) => {
    const { step, subStep, progress } = req.body;

    if(!isProperType(step, 'string')) {
        throw new HttpError(400, 'step field needs to be string or is missing');
    }
    else if(!isProperType(subStep, 'string')) {
        throw new HttpError(400, 'subStep field needs to be string or is missing');
    }
    else if(!isProperType(progress, 'string')) {
        throw new HttpError(400, 'progress field needs to be string or is missing');
    }
    next();
}



const isProperType = (value, type) => (value !== undefined && typeof(value) === type)

module.exports = { isValidPost, isValidPut }