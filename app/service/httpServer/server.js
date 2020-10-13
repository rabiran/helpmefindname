const express = require('express');
const router = require('./routes');
const { handleHttpError } = require ('../../helpers/errorHandlers/httpError');
const { log } = require('../../helpers/logger');

const app = express();

app.use(express.json());

app.use('/api', router);

app.use((err, req, res , next) => {
    handleHttpError(err, res);
});

const start = (port) => {
    app.listen(port, () => {
        log(`http service running at ${port}`)
    })
    return app;
}

module.exports = start;