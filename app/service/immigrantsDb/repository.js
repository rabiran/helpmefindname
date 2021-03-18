const schema = require('./schema');
const { getRedisPersons } = require('../personsRedis');
const { getPersonApi } = require('../apis');

const dbGetImmigrants = async () => {
    const statuses = await schema.find({});
    return statuses;
}

const dbGetImmigrant = async (_id) => {
    const status = await schema.findById(_id);
    return status;
}

const dbGetImmigrantByGardener = async (gardener) => {
    const migrations = await schema.find({gardenerId: gardener});
    return migrations;
}

const dbGetImmigrantByPersonId = async (personId) => {
    const migrations = await schema.find({personId: personId});
    return migrations;
}

const dbAddImmigrant = async (data) => {
    const status = new schema(data);
    const result = await status.save();
    return result;
}

const dbUpdateImmigrant = async (_id, data) => {
    const statuses = await schema.findByIdAndUpdate(_id, data, {new: true});
    return statuses;
}

const dbAddShadowUser = async (_id, data) => {
    const statuses = await schema.findByIdAndUpdate(_id, { $push: { shadowUsers: data }}, {new: true});
    return statuses;
}

const dbDeleteImmigrant = async (_id) => {
    const statuses = await schema.findByIdAndRemove(_id);
    return statuses;
}

const dbGardenerStats = async () => {
    const res = await schema.distinct('gardenerId');
    const stats = await Promise.all(res.map(async (gardenerId) => {
        const count = await schema.countDocuments({gardenerId});
        const gardenerPerson = await getPersonApi(gardenerId);
        return {name: gardenerPerson.fullName || gardenerId, count}
    }));
    return stats;
}

const dbTotalMigrationStats = async () => {
    let stats = await dbCompletedStats();
    const personsCount = await getRedisPersons();
    const notMigratedCount =  personsCount - stats.length;
    stats.push({name: null, count: notMigratedCount});

    return stats;
}

const dbCompletedStats = async () => {
    const res = await schema.find({'status.progress': 'completed'});
    const primaryDomains = res.map((record)=> record.primaryUniqueId);
    const distinctDomains = [...new Set(primaryDomains)];

    const stats = await Promise.all(distinctDomains.map(async (domain)=> {
        const count = await schema.countDocuments({
            "$and": [ 
                {primaryUniqueId: domain.uniqueID},
                {'status.progress': 'completed'} 
            ]
        });
        return {name: domain, count}
    }));
    return stats;
}

const dbProgressStats = async () => {
    const res = await schema.distinct('status.progress');
    const stats = await Promise.all(res.map(async (progress) => {
        const count = await schema.countDocuments({'status.progress': progress});
        return {name: progress, count}
    }));
    console.log(stats);
    return stats;
}
module.exports = { dbGetImmigrants, dbGetImmigrant, dbAddImmigrant,
dbUpdateImmigrant, dbAddShadowUser, dbDeleteImmigrant,
 dbGetImmigrantByGardener, dbGardenerStats, dbCompletedStats,
 dbTotalMigrationStats, dbGetImmigrantByPersonId, dbProgressStats }