require('dotenv').config();
const config = require('../config');
const { initLogger } = require('../helpers/logger');
const httpServer = require('../triggers/httpServer/server');
const directTrigger = require('../triggers/directTrigger');
const startStatus = require('../service/status/startStatus');
const { configureSpikeRedis } = require('./spike');

module.exports = () => {
    initLogger();

    startStatus();
    
    // if(config.auth)
    configureSpikeRedis();
    
    if(config.isMock) {

        if(config.mocks.isHTTPTrigger)
            httpServer();

        if(config.mocks.isDirectTrigger)
            directTrigger();
    }
    else {
        directTrigger();
    }
}