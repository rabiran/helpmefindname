const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});
const config = require('../config');
const { initLogger } = require('../helpers/logger');
const httpServer = require('../service/httpServer/server');
// const directTrigger = require('../triggers/directTrigger');
const startDb = require('../service/immigrantsDb/start');
const { configureSpikeRedis } = require('./spike');
const { initKafka } = require('../helpers/kafkaProducer');
const { configureRedisPeople } = require('../service/personsRedis');
const { orchConnectorHealthCheck, createInTargetOrch } = require('../service/apis');
const { exec } = require("child_process");
const util = require('util');

const execify = util.promisify(exec);

module.exports = async () => {
    // const { stdout,  stderr} = await execify('lssadasd').catch(err => {
    //     console.log(err);
    // });
    // console.log(stdout);
    
    // try {
        initLogger();
        await startDb();
        let a = httpServer(config.httpPort);
        configureSpikeRedis();
        // await initKafka();
        await configureRedisPeople(config.redisUrl);
        await orchConnectorHealthCheck();
        return a;
        // await createInTargetOrch({haha: 2, haha2: 3, jasdasd: true})
        
    // }
    // catch(err) {
    //     console.log('service failed at startup');
    //     console.log(err);
    // }
}