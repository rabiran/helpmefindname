const mongoose = require('mongoose');
const config = require('../../config');
const { log } = require('../../helpers/logger');

module.exports = async () => {
    const connectionUrl = config.dbUrl;
    const dbOptions = config.dbOptions;
    log(`Connecting to db: ${connectionUrl}`);

    await mongoose.connect(connectionUrl, dbOptions).catch(err => {
        // console.error(`Database connection error: ${err}`);
        throw new Error(err);
    });

    log('Database connection successful');
    mongoose.set('useFindAndModify', false);
}