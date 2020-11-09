const jwt = require('jsonwebtoken');
const util = require('util');
const fs = require("fs");
const path = require("path");
const { HttpError } = require ('../../helpers/errorHandlers/httpError');

const averify = util.promisify(jwt.verify);

const isAuth = (req, res, next) => {
    const token = req.header('Authorization');
    const key = fs.readFileSync(path.join(__dirname, '../../config/key.pem'));
    
    const payload = await averify(token, key).catch(() => {
        throw new HttpError(401, 'Unauthorized');
    });
    next();
}


module.exports = { isAuth }