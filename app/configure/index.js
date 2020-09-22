require('dotenv').config();
const config = require('../config');
const { initLogger } = require('../helpers/logger');
const httpServer = require('../service/httpServer/server');
const directTrigger = require('../triggers/directTrigger');
const startDb = require('../service/immigrantsDb/start');
const { configureSpikeRedis } = require('./spike');


module.exports = async () => {
    try {
        const port = config.httpPort

        initLogger();
        await startDb();
        configureSpikeRedis();
        httpServer(port);

        if(config.isMock) {
            directTrigger();
        }
    }
    catch(err) {
        console.log('service failed at startup');
        console.log(err);
    }
}