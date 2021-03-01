const express = require('express');
const router = require('./routes');
const { handleHttpError } = require ('../../helpers/errorHandlers/httpError');
const { log } = require('../../helpers/logger');
const morganLogger = require('morgan');
const {updateExcel} = require('../Excel/excel')

const app = express();

app.use(morganLogger('dev'));

app.use(express.json());

app.use('/api', router);

app.use((err, req, res , next) => {
    handleHttpError(err, res);
});

const start = (port) => {
    app.listen(port, () => {
        log(`http service running at ${port}`)
    })
    updateExcel();
    return app;
}

module.exports = start;