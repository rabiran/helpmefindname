module.exports = {
    env: process.env.NODE_ENV,
    specialDomain: 'dataSource1',
    specialMailServer: 'hahaha.com',
    targetDomain: 'damoi.com',
    targetOrchAPI: '/api/something',
    httpPort: 8080,
    isMock: true,
    mocks: {
        isDirectTrigger: true,
        isHTTPTrigger: true,
    }
}