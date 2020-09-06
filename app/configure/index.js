const dotenv = require('dotenv');
const config = require('../config');
const { initLogger } = require('../helpers/logger');
const httpServer = require('../triggers/httpServer/server');
const directTrigger = require('../triggers/directTrigger');
const startStatus = require('../service/status/startStatus');

module.exports = () => {
    dotenv.config();

    
    initLogger();
    // global.logInfo = log;
    // global.logError = logError;

    startStatus();
    
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