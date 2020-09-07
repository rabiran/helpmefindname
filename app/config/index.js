module.exports = {
    env: process.env.NODE_ENV,
    dbUrl: process.env.DB_URL,
    redisUrl: process.env.REDIS_URL,
    spikeUrl: process.env.SPIKE_URL,
    targetOrchUrl: process.env.TARGET_ORCH_URL,
    httpPort: 8080,
    specialDomain: 'dataSource1',
    specialMailServer: 'hahaha.com',
    targetDomain: 'damoi.com',
    auth: true,
    isMock: true,
    mocks: {
        isDirectTrigger: false,
        isHTTPTrigger: true,
    }
}