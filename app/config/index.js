module.exports = {
    env: process.env.NODE_ENV,
    dbUri: process.env.DB_URI,
    specialDomain: 'dataSource1',
    specialMailServer: 'hahaha.com',
    targetDomain: 'damoi.com',
    targetOrchAPI: '/api/something',
    httpPort: 8080,
    auth: false,
    isMock: true,
    mocks: {
        isDirectTrigger: false,
        isHTTPTrigger: true,
    }
}