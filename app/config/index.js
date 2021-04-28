const path = require("path");
const booleanEnvParser = require('../helpers/utils/booleanEnvParser');

module.exports = {
    env: process.env.NODE_ENV,
    dbOptions: { useUnifiedTopology: true , useNewUrlParser: true },
    dbUrl: process.env.DB_URL,
    dbUrlTest: process.env.DB_URL_TEST,
    redisUrl: process.env.REDIS_URL,
    spikeUrl: process.env.SPIKE_URL,
    spikeAudience: process.env.AUDIENCE_G,
    kartoffelUrl: process.env.KARTOFFEL_URL,
    kartingUrl: process.env.KARTING_URL,
    orchConnectorUrl: process.env.ORCH_CONNECTOR_URL,

    orchUrl: process.env.ORCH_URL,
    orchUser: process.env.ORCH_USER,
    orchPass: process.env.ORCH_PASS,
    orchDomain: process.env.ORCH_DOMAIN,
    orchCreateRunbookId: process.env.ORCH_CREATE_RUNBOOKID,
    orchRetryId: process.env.ORCH_RETRY_RUNBOOKID,
    orchPauseId: process.env.ORCH_PAUSE_RUNBOOKID,

    kafkaBrokers: process.env.KAFKA_BROKERS,
    kafkaTopic: process.env.KAFKA_TOPIC,
    kafkaGroupId: process.env.GROUPID,
    kafkaClientId: process.env.CLIENTID,
    httpPort: process.env.PORT,
    specialDomain: 'dataSource1',
    specialMailServer: 'hahaha.com',
    targetDomain: 'damoi.com',
    isAuth: booleanEnvParser(process.env.IS_AUTH),
    isMock: booleanEnvParser(process.env.IS_MOCK),
    excelPath: path.join(__dirname, './dataSourcesMap.xlsx'),
    statusEnums: ['waiting', 'inprogress', 'failed', 'completed', 'paused'],
    akaKapaim:[

    ],
    akaAdkatz:[
        
    ],
    entityType: process.env.ENTITY_TYPE,
}