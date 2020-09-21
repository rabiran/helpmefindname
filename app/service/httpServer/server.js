const express = require('express');
const router = require('./routes');
const { handleHttpError } = require ('../../helpers/errorHandlers/httpError');

const app = express();

app.use(express.json());

app.use('/api', router);

app.use((err, req, res , next) => {
    handleHttpError(err, res);
});

const start = (port) => {
    app.listen(port, () => {
        console.log(`http service running at ${port}`)
    })
}

module.exports = start;