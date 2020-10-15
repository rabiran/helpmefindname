const mongoose = require('mongoose');
const config = require('../../config');
const { log } = require('../../helpers/logger');

module.exports = async () => {
    const connectionUrl = config.env === 'test' ? config.dbUrlTest : config.dbUrl;
    const dbOptions = config.dbOptions;

    await mongoose.connect(connectionUrl, dbOptions).catch(err => {
        log(`Database connection error: ${err}`);
        throw new Error(err);
    });

    log(`Database connection successful to ${connectionUrl}`);
    mongoose.set('useFindAndModify', false);
}