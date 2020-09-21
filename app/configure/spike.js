const getTokenCreator = require("spike-get-token");
const options = require('../config/getToken');

let getToken;

const configureSpikeRedis = async () => {
    getToken = getTokenCreator(options);
}

const getSpikeToken = async () => {
    return await getToken();
}

module.exports = { configureSpikeRedis , getSpikeToken }