const mongoose = require('mongoose');
const config = require('../../config');

const env = config.env;

module.exports = () => {
    // const connectionUrl = env === 'production' ? prod : env === 'test' ? test : dev;
    const connectionUrl = config.dbUri;
    console.log(`Connecting to ${connectionUrl}`);

    mongoose.connect(connectionUrl, { useUnifiedTopology: true , useNewUrlParser: true } )
    .then(() => {
        console.log('Database connection successful');
    })
    .catch(err => {
        console.error(`Database connection error: ${err}`);
    })
    mongoose.set('useFindAndModify', false);
}