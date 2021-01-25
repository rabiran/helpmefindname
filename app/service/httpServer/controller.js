const sendToService = require('../immigration');
const { dbGetImmigrants, dbGetImmigrantByGardener, dbAddImmigrant, 
dbUpdateImmigrant, dbAddShadowUser, dbGetImmigrant,
dbDeleteImmigrant, dbGardenerStats, dbCompletedStats, dbTotalMigrationStats,
dbGetImmigrantByPersonId } = require('../immigrantsDb/repository');
const { getPersonApi, orchRetry, orchPause } = require('../apis');
const { HttpError } = require('../../helpers/errorHandlers/httpError');
const domains = require('../../config/specialDomains');
// const { createInTargetOrch } = require('../apis');
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
    const { id, primaryUniqueIdIndex, isNewUser, gardenerId } = req.body;
    const migration = await dbGetImmigrantByPersonId(id);
    if (migration) throw new HttpError(400, 'already exists', id);

    const person = await getPersonApi(id);

    // const isDomainFound = person.domainUsers.find(user => user.dataSource === primaryDomainUser);
    const primaryDomainUser = person.domainUsers[primaryUniqueIdIndex];
    if(!primaryDomainUser) throw new HttpError(400, 'this primaryDomainUser(uniqueid) doesnt exist on given person', id);

    const result = sendToService(person, primaryDomainUser, isNewUser, gardenerId);
    res.send(result);
}

const updateImmigrant = async (req, res) => {
    const { step, subStep, progress, pause, unpauseable } = req.body;
    const { id } = req.params;

    if(!id) throw new HttpError(400, 'no id');

    const migration = await dbGetImmigrant(id);

    if(pause) {
        if(migration.unpauseable) {
            throw new HttpError(400, 'unpauseable!', id);
        }
        const response = await orchPause({id, pause});
        return res.send(response);
    }
    else if(unpauseable) {
        const data = {'unpauseable': unpauseable};
        const result = await dbUpdateImmigrant(id, data);
        return res.send(result);
    }
    else {
        const steps = migration.steps;

        const stepIndex = steps.findIndex((obj) => obj.name === step);
        const subStepIndex = steps[stepIndex].subSteps.findIndex((obj) => obj.name === subStep);
        
        const newSteps = {...steps};
        newSteps[stepIndex].subSteps[subStepIndex].progress = progress;

        const data = {'status.steps': newSteps};
        const result = await dbUpdateImmigrant(id, data);
        return res.send(result);
    }

    // if(!id) throw new HttpError(400, 'no id');
    // if(!type) throw new HttpError(400, 'no type');

    // switch (type) {
    //     case 'message': {
    //         const data = {'status.subStep': message};
    //         result = await dbUpdateImmigrant(id, data);
    //         break;
    //     }
    //     case 'complete': {
    //         if(!shadowUser) throw new HttpError(400, 'no shadowuser');
    //         const data = {'status.subStep': null, 'status.step': 'created user'}
    //         await dbUpdateImmigrant(id, data);
    //         result = await dbAddShadowUser(id, shadowUser);
    //         const person = await getPersonApi(id);
    //         sendToService(person, result.primaryDomainUser, result.shadowUsers.toObject());
    //         break;
    //     }
    // }
    // res.send(result);
}

const retryStep = async (req, res) => {
    const { step, subStep, id } = req.body;
    const response = await orchRetry({id, step, subStep});
    res.json(response);
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

const getCompletedStats = async (req, res) => {
    const stats = await dbCompletedStats();
    res.json(stats);
}

const getGardenerStats = async (req, res) => {
    const stats = await dbGardenerStats();
    res.json(stats);
}

const getTotalStats = async (req, res) => {
    const stats = await dbTotalMigrationStats();
    res.json(stats);
}

module.exports = { status, getImmigrants, getImmigrantsByGardener, addImmigrant, updateImmigrant, retryStep, 
deleteImmigrant,
 getDomains, getCompletedStats, getGardenerStats, getTotalStats }