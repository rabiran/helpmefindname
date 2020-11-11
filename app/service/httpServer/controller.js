const sendToService = require('../immigration');
const { dbGetImmigrants, dbGetImmigrantByGardener, dbAddImmigrant, 
dbUpdateImmigrant, dbAddShadowUser, dbGetImmigrant, dbDeleteImmigrant } = require('../immigrantsDb/repository');
const { getPersonApi } = require('../apis');
const { HttpError } = require('../../helpers/errorHandlers/httpError');
const domains = require('../../config/specialDomains');

const status = async (req, res) => {
    res.send('service on');
}

const getImmigrantsByGardener = async (req, res) => {
    const migrations = await dbGetImmigrantByGardener(req.params.gardener);
    res.json(migrations);
}

const getImmigrants = async (req, res) => {
    const migrations = await dbGetImmigrants();
    res.json(migrations);
}

const addImmigrant = async (req, res) => {
    const { id, primaryDomainUser, gardenerId } = req.body;
    const dbstatus = await dbGetImmigrant(id);
    if (dbstatus) throw new HttpError(400, 'already exists', id);

    const person = await getPersonApi(id);

    const isDomainFound = person.domainUsers.find(user => user.dataSource === primaryDomainUser);
    if(!isDomainFound) throw new HttpError(400, 'invalid primaryDomainUser', id);

    console.log(person);

    const data = {
        _id: id,
        status: { progress: 'inprogress', step: 'initiated' },
        primaryDomainUser,
        hierarchy: person.hierarchy.join('/'),
        gardenerId,
        fullName: person.fullName,
        identifier: person.identifier || '12345'
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

const deleteImmigrant = async (req, res) => {
    const { id } = req.params;
    const dbstatus = await dbGetImmigrant(id);
    if(dbstatus.status.progress !== 'completed')
        throw new HttpError(400, 'status needs to be completed');
    
    await dbDeleteImmigrant(id);
    res.json('ok');
}

const getDomains = async (req, res) => {
    res.json(Object.values(domains));
}

module.exports = { status, getImmigrants, getImmigrantsByGardener, addImmigrant, updateImmigrant, deleteImmigrant, getDomains }