const sendToService = require('../immigration');
const { dbGetImmigrants, dbGetImmigrantByGardener, dbAddImmigrant,
    dbUpdateImmigrant, dbAddShadowUser, dbGetImmigrant,
    dbDeleteImmigrant, dbGardenerStats, dbCompletedStats, dbTotalMigrationStats,
    dbGetImmigrantByPersonId } = require('../immigrantsDb/repository');
const { getPersonApi, orchRetry, orchPause } = require('../apis');
const { HttpError } = require('../../helpers/errorHandlers/httpError');
const domains = require('../../config/specialDomains');
const gConfig = require('../../config/index');
const {getExcelJson} = require('../Excel/excel')
// const { Http } = require('winston/lib/winston/transports');
// const { config } = require('winston');

// const { createInTargetOrch } = require('../apis');
const statusTransform = require('../../helpers/statusTransform');

const status = async (req, res) => {
    res.send('service on');
}

const  getExcel = async (req,res) =>{
    const excelJs = getExcelJson();
    res.json(excelJs);
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
    const { id, primaryUniqueId, isNewUser, gardenerId , startDate, isUrgent} = req.body;
    const migration = await dbGetImmigrant(id);
    if (migration) throw new HttpError(400, 'already exists', id);

    const person = await getPersonApi(id);

    const isDomainFound = person.domainUsers.find(user => user.uniqueID === primaryUniqueId);
    // const primaryDomainUser = person.domainUsers[primaryUniqueId];
    if (!isDomainFound) throw new HttpError(400, 'this primaryDomainUser(uniqueid) doesnt exist on given person', id);

    const result = await sendToService(person, primaryUniqueId, isNewUser, gardenerId, startDate, isUrgent)
        .catch(err => { throw new HttpError(500, err.message, person.id) });

    res.send(result);
}

const overrideImmigrant = async (req, res) => {
    const orchthing = req.body;
    // const { id } = req.params;
    
    const succesfulsUpdates = [];

    for(orchObj of orchthing) {
    // await orchthing.forEach(async (orchObj) => {
        const { id, steps } = orchObj;

        const tfu = await dbGetImmigrant(id);

        // if(!tfu) throw new HttpError(400, 'this migration doesnt exist');
        if(!tfu) return;

        // const progress = "inprogress";
        const tommy = (subStep) => { return { name: subStep.name, progress: statusTransform(subStep.status) } }
        const stepsObj = steps.map(step => { return { name: step.name, subSteps: step.subSteps.map(tommy) } });

        const isFailed = stepsObj.some(step => step.subSteps.some(subStep => subStep.progress === 'failed'))
        const isCompleted = stepsObj.every(step => step.subSteps.every(subStep => subStep.progress === 'completed'))

        const finalProgress = isFailed ? 'failed' : isCompleted ? 'completed' : 'inprogress';

        const data = { 'status': { progress: finalProgress, steps: stepsObj },  'viewed': false};

        await dbUpdateImmigrant(id, data);
        succesfulsUpdates.push(id);
        console.log(succesfulsUpdates);
    // })
    }
    
    console.log(succesfulsUpdates);
    return res.json(succesfulsUpdates);
}

const updateImmigrant = async (req, res) => {
    const { step, subStep, progress, pause, unpauseable, viewed } = req.body;
    const { id } = req.params;

    if (!id) throw new HttpError(400, 'no id');

    const tfu = await dbGetImmigrant(id);

    if(!tfu) throw new HttpError(400, 'this migration doesnt exist');

    const migration = tfu.toObject();

    console.log("update: ");
    console.log(step);
    console.log(subStep);
    console.log(progress);

    if(viewed) {
        const data = { 'viewed': true };
        const result = await dbUpdateImmigrant(id, data);
        return res.send(result);
    }
    else if (pause === true || pause === false) {
        if (migration.unpauseable) {
            throw new HttpError(400, 'unpauseable!', id);
        }
        const response = await orchPause({ id, pause });
        const data = { 'status.progress': pause ? 'paused' : 'inprogress' };
        const result = await dbUpdateImmigrant(id, data);
        return res.send(result);
    }
    else if (unpauseable) {
        const data = { 'unpauseable': unpauseable };
        const result = await dbUpdateImmigrant(id, data);
        return res.send(result);
    }
    else {
        const steps = migration.status.steps;

        const stepIndex = steps.findIndex((obj) => obj.name === step);
        if(stepIndex === -1) throw new HttpError(400, 'step not found');
        const subStepIndex = steps[stepIndex].subSteps.findIndex((obj) => obj.name === subStep);
        if(subStepIndex === -1) throw new HttpError(400, 'subStep not found');

        const newSteps = JSON.parse(JSON.stringify(steps)); // deep copy
        newSteps[stepIndex].subSteps[subStepIndex].progress = progress;

        const isFailed = newSteps.some(step => step.subSteps.some(subStep => subStep.progress === 'failed'))
        const isCompleted = newSteps.every(step => step.subSteps.every(subStep => subStep.progress === 'completed'))

        const finalProgress = isFailed ? 'failed' : isCompleted ? 'completed' : 'inprogress';
        
        const data = { 'status.steps': newSteps , viewed: false , 'status.progress': finalProgress};
        let result = await dbUpdateImmigrant(id, data);
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
    const { step, subStep } = req.body;
    const { id } = req.params;
    const response = await orchRetry({ id, step, subStep });
    res.json(response);
}

const deleteImmigrant = async (req, res) => {
    const { id } = req.params;
    const dbstatus = await dbGetImmigrant(id);
    // if(dbstatus.status.progress !== 'completed')
    //     throw new HttpError(400, 'status needs to be completed');

    await dbDeleteImmigrant(id);
    res.json('ok');
}

const getDomains = async (req, res) => {
    res.json(domains);
}
const getEntityType = async (req, res) => {
    res.json(gConfig.entityType);
}
const getDomainsMap = async (req, res) => {
    res.json(gConfig.domainsMap);
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

module.exports = {
    status, getImmigrants, getImmigrantsByGardener, addImmigrant, updateImmigrant, retryStep,
    deleteImmigrant, overrideImmigrant,getExcel,getEntityType,getDomainsMap,
    getDomains, getCompletedStats, getGardenerStats, getTotalStats
}