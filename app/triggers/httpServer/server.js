const express = require('express');
const router = require('./routes');
const config = require('../../config');
const { handleError } = require ('../../errorHandlers/httpError');
const port = config.httpPort

const app = express();

app.use(express.json());

app.use('/api', router);

app.use((err, req, res , next) => {
    handleError(err, res);
});

const start = () => {
    app.listen(port, () => {
        console.log(`http service running at ${port}`)
    })
}

module.exports = start;