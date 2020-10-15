const sendToService = require('../immigration');
const { dbGetImmigrants, dbAddImmigrant, dbUpdateImmigrant, dbAddShadowUser, dbGetImmigrant } = require('../immigrantsDb/repository');
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

    const isDomainFound = person.domainUsers.find(user => user.dataSource === primaryDomainUser);
    if(!isDomainFound) throw new HttpError(400, 'invalid primaryDomainUser', id);

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
    const { message, type, id, shadowUser } = req.body;

    let result = [];

    if(!id) throw new HttpError(400, 'no id');
    if(!type) throw new HttpError(400, 'no type');

    switch (type) {
        case 'message': {
            const data = {'status.subStep': message};
            result = await dbUpdateImmigrant(id, data);
            break;
        }
        case 'complete': {
            if(!shadowUser) throw new HttpError(400, 'no shadowuser');
            const data = {'status.subStep': null, 'status.step': 'created user'}
            await dbUpdateImmigrant(id, data);
            result = await dbAddShadowUser(id, shadowUser);
            const person = await getPersonApi(id);
            sendToService(person, result.primaryDomainUser, result.shadowUsers.toObject());
            break;
        }
    }
    res.send(result);
}

module.exports = { status, getImmigrants, addImmigrant, updateImmigrant }