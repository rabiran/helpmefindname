const jwt = require('jsonwebtoken');
const util = require('util');
const fs = require("fs");
const path = require("path");
const { HttpError } = require ('../../helpers/errorHandlers/httpError');
const config = require('../../config');

const averify = util.promisify(jwt.verify);

const isAuth = async (req, res, next) => {

    if(!config.isAuth) return next();
    
    const token = req.header('Authorization');
    const key = fs.readFileSync(path.join(__dirname, '../../config/key.pem'));
    
    try {
        const payload = await averify(token, key.toString()).catch(err => { throw new HttpError(401, 'Unauthorized'); });
        if(payload.aud !== config.spikeAudience)
            throw new HttpError(401, 'Unauthorized');
        
        return next();
    }
    catch(err) {
        return next(err);
    }
}


module.exports = { isAuth }