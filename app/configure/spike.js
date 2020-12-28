const getTokenCreator = require("spike-get-token");
const options = require('../config/getToken');

let getToken;

const configureSpikeRedis = () => {
    getToken = getTokenCreator(options);
}

const getSpikeToken = async () => {
    return await getToken();
}

module.exports = { configureSpikeRedis , getSpikeToken }
