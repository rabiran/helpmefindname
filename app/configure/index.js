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

        return httpServer(port);
        
        // app.listen(port, () => {
        //     log(`http service running at ${port}`)
        // })

        if(config.isMock) {
            directTrigger();
        }

        // return app;
    }
    catch(err) {
        console.log('service failed at startup');
        console.log(err);
    }
}