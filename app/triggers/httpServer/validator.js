const { HttpError } = require ('../../helpers/errorHandlers/httpError');

const hasId = (req, res, next) => {
    const { id } = req.body;
    if(!id || typeof(id) != 'string') {
        throw new HttpError(400, 'id field is missing');
    }
    next();
}

module.exports = { hasId }