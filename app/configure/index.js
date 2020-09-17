require('dotenv').config();
const config = require('../config');
const { initLogger } = require('../helpers/logger');
const httpServer = require('../service/httpServer/server');
const directTrigger = require('../triggers/directTrigger');
const startDb = require('../service/immigrantsDb/start');
const { configureSpikeRedis } = require('./spike');

module.exports = async () => {
    initLogger();
    startDb();
    configureSpikeRedis();
    httpServer();

    if(config.isMock) {
        directTrigger();
    }
}