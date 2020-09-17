const mongoose = require('mongoose');
const config = require('../../config');

module.exports = async () => {
    const connectionUrl = config.dbUrl;
    const dbOptions = config.dbOptions;
    console.log(`Connecting to db: ${connectionUrl}`);

    await mongoose.connect(connectionUrl, dbOptions).catch(err => {
        console.error(`Database connection error: ${err}`);
    });

    console.log('Database connection successful');

    
    // mongoose.set('useFindAndModify', false);
}