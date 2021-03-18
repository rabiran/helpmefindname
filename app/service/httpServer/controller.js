const sendToService = require('../immigration');
const { dbGetImmigrants, dbGetImmigrantByGardener, dbAddImmigrant,
    dbUpdateImmigrant, dbAddShadowUser, dbGetImmigrant,
    dbDeleteImmigrant, dbGardenerStats, dbCompletedStats, dbTotalMigrationStats,
    dbGetImmigrantByPersonId , dbProgressStats} = require('../immigrantsDb/repository');
const { getPersonApi, orchRetry, orchPause } = require('../apis');
const { HttpError } = require('../../helpers/errorHandlers/httpError');
const domains = require('../../config/specialDomains');
const gConfig = require('../../config/index');
const domainsMap = require('../../config/domainsMap');
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
    const migration = await dbGetImmigrantByPersonId(id);
    if (migration.length > 0) throw new HttpError(400, 'already exists', id);

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
        const { id, steps } = orchObj;

        const tfu = await dbGetImmigrant(id);

        // if(!tfu) throw new HttpError(400, 'this migration doesnt exist');
        if(!tfu) break;

        // const progress = "inprogress";
        const tommy = (subStep) => { return { name: subStep.name, progress: statusTransform(subStep.status) } }
        const stepsObj = steps.map(step => { return { name: step.name, subSteps: step.subSteps.map(tommy) } });

        const isFailed = stepsObj.some(step => step.subSteps.some(subStep => subStep.progress === 'failed'))
        const isCompleted = stepsObj.every(step => step.subSteps.every(subStep => subStep.progress === 'completed'))

        const finalProgress = isFailed ? 'failed' : isCompleted ? 'completed' : 'inprogress';

        const data = { 'status': { progress: finalProgress, steps: stepsObj },  'viewed': false};

        await dbUpdateImmigrant(id, data);
        succesfulsUpdates.push(id);
    }
    return res.json(succesfulsUpdates);
}

const updateImmigrant = async (req, res) => {
    console.log(req.body);
    const { step, subStep, progress, paused, unpauseable, viewed } = req.body;
    const { id } = req.params;

    if (!id) throw new HttpError(400, 'no id');

    const tfu = await dbGetImmigrant(id);

    if(!tfu) throw new HttpError(400, 'this migration doesnt exist');

    const migration = tfu.toObject();

    if(viewed) {
        const data = { 'viewed': true };
        const result = await dbUpdateImmigrant(id, data);
        return res.send(result);
    }
    else if (paused === true || paused === false) {
        if (migration.unpauseable) {
            throw new HttpError(400, 'unpauseable!', id);
        }
        const response = await orchPause({ id, paused });
        const data = { 'status.progress': paused ? 'paused' : 'inprogress' };
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
    res.json(domainsMap);
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

const getProgressStats= async (req, res) => {
    const stats = await dbProgressStats();
    res.json(stats);
}

module.exports = {
    status, getImmigrants, getImmigrantsByGardener, addImmigrant, updateImmigrant, retryStep,
    deleteImmigrant, overrideImmigrant,getExcel,getEntityType,getDomainsMap,
    getDomains, getCompletedStats, getGardenerStats, getTotalStats, getProgressStats
}