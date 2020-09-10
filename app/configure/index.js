require('dotenv').config();
const config = require('../config');
const { initLogger } = require('../helpers/logger');
const httpServer = require('../service/httpServer/server');
const directTrigger = require('../triggers/directTrigger');
const startStatus = require('../service/status/startStatus');
const { configureSpikeRedis } = require('./spike');

module.exports = () => {

    initLogger();
    startStatus();
    configureSpikeRedis();
    httpServer();

    if(config.isMock) {
        directTrigger();
    }
}