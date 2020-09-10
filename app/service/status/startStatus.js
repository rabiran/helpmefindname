const mongoose = require('mongoose');
const config = require('../../config');

module.exports = () => {
    const connectionUrl = config.dbUrl;
    const dbOptions = config.dbOptions;
    console.log(`Connecting to db: ${connectionUrl}`);

    mongoose.connect(connectionUrl, dbOptions )
    .then(() => {
        console.log('Database connection successful');
    })
    .catch(err => {
        console.error(`Database connection error: ${err}`);
    })
    // mongoose.set('useFindAndModify', false);
}