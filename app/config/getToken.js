const config = require('./index');
const path = require("path");

module.exports = {
    redisHost: config.redisUrl,
    clientId: process.env.SPIKE_CLIENT_ID,
    clientSecret: process.env.SPIKE_CLIENT_SECRET,
    spikeURL: config.spikeUrl,
    tokenGrantType: 'client_credentials',
    tokenAudience: 'kartoffel',
    tokenRedisKeyName: 'token',
    spikePublicKeyFullPath: path.join(__dirname, './key.pem'),
    useRedis: true,
    httpsValidation: false,
}