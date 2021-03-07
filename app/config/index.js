const path = require("path");
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

    orchUrl: process.env.ORCH_URL,
    orchUser: process.env.ORCH_USER,
    orchPass: process.env.ORCH_PASS,
    orchDomain: process.env.ORCH_DOMAIN,
    orchCreateRunbookId: process.env.ORCH_CREATE_RUNBOOKID,

    kafkaBrokers: process.env.KAFKA_BROKERS,
    kafkaTopic: process.env.KAFKA_TOPIC,
    kafkaGroupId: process.env.GROUPID,
    kafkaClientId: process.env.CLIENTID,
    httpPort: 8000,
    specialDomain: 'dataSource1',
    specialMailServer: 'hahaha.com',
    targetDomain: 'damoi.com',
    isAuth: true,
    isMock: false,
    excelPath: path.join(__dirname, './dataSourcesMap.xlsx'),
    akaKapaim:[

    ],
    akaAdkatz:[
        
    ],
    entityType: "tamar",
    domainsMap: [
        ['rabiran.com', 'rabiranuid'],
        ['somedomain.com', 'somedomainuid'],
        ['jello.com', 'jellouid'],
        ['jello2.com', 'jellouid'],
        ['yoda.sw', ''],
        ['turtle.com', ''],
        ['donatelo.turtle.com', ''],
        ['rafael.turtle.com', ''],
    ]
}