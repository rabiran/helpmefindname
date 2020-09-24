module.exports = {
    env: process.env.NODE_ENV,
    dbOptions: { useUnifiedTopology: true , useNewUrlParser: true },
    dbUrl: process.env.DB_URL,
    redisUrl: process.env.REDIS_URL,
    spikeUrl: process.env.SPIKE_URL,
    kartoffelUrl: process.env.KARTOFFEL_URL,
    kartingUrl: process.env.KARTING_URL,
    targetOrchUrl: process.env.TARGET_ORCH_URL,
    targetOrchUser: process.env.TARGET_ORCH_USER,
    targetOrchPass: process.env.TARGET_ORCH_PASS,
    httpPort: 8080,
    specialDomain: 'dataSource1',
    specialMailServer: 'hahaha.com',
    targetDomain: 'damoi.com',
    auth: false,
    isMock: true,
    mocks: {
        isDirectTrigger: false,
        isHTTPTrigger: true,
    }
}