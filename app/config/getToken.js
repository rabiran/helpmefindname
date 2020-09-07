const config = require('./index');

module.exports = {
    redisHost: config.redisUrl,
    ClientId: 'adssadads',
    ClientSecret: 'sadkadsakdsad',
    spikeURL: config.spikeUrl,
    tokenGrantType: 'client_credentials',
    tokenAudience: 'kartoffel',
    tokenRedisKeyName: 'token',
    useRedis: true,
    httpsValidation: false,
}