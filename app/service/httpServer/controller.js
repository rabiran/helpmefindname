const sendToService = require('../immigration');
const { dbGetImmigrants, dbAddImmigrant, dbUpdateImmigrant, dbGetImmigrant } = require('../immigrantsDb/repository');
const { getPersonApi } = require('../apis');
const { HttpError } = require('../../helpers/errorHandlers/httpError');

const status = async (req, res) => {
    res.send('service on');
}

const getImmigrants = async (req, res) => {
    const statuses = await dbGetImmigrants();
    res.json(statuses);
}

const addImmigrant = async (req, res) => {
    const { id, primaryDomainUser } = req.body;
    const dbstatus = await dbGetImmigrant(id);
    if (dbstatus) throw new HttpError(400, 'already exists', id);

    const person = await getPersonApi(id);
    const data = {
        _id: id,
        status: { progress: 'inprogress', step: 'initiated' },
        primaryDomainUser
    };
    const result = await dbAddImmigrant(data);
    sendToService(person, primaryDomainUser);
    res.send(result);
}

const updateImmigrant = async (req, res) => {
    const { message, id, type, shadowUser } = req.body;
    switch (type) {
        case 'message': {
            const data = { status: { subStep: message } };
            await dbUpdateImmigrant(id, data);
            break;
        }
        case 'complete': {
            const data = { status: { shadowUser } };
            await dbUpdateImmigrant(id, data);
            sendToService(person, primaryDomainUser);
            break;
        }
    }
    res.send('ok');
}

module.exports = { status, getImmigrants, addImmigrant, updateImmigrant }