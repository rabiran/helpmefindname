require('dotenv').config();
const config = require('../config');
const { initLogger } = require('../helpers/logger');
const httpServer = require('../service/httpServer/server');
// const directTrigger = require('../triggers/directTrigger');
const startDb = require('../service/immigrantsDb/start');
const { configureSpikeRedis } = require('./spike');
const { initKafka } = require('../helpers/kafkaProducer');
const { configureRedisPeople } = require('../service/personsRedis');

const xmlGenerator = require('../helpers/orchFormater');

module.exports = async () => {
    try {
        // const id = 5;
        // const step = 'aa';
        // const subStep = 'bb';

        // const a = xmlGenerator({id, step, subStep});
        // console.log(a);
        const port = config.httpPort

        initLogger();
        await startDb();
        configureSpikeRedis();
        // await initKafka();
        await configureRedisPeople(config.redisUrl);
        return httpServer(port);
    }
    catch(err) {
        console.log('service failed at startup');
        console.log(err);
    }
}