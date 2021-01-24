const { SchemaType } = require('mongoose');
const schema = require('./schema');
const { getRedisPersons } = require('../personsRedis');

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
    // const res = await schema.aggregate([
    //     {
    //         $match: {
    //             keywords: { $not: {$size: 0} }
    //         }
    //     },
    //     { $unwind: "$keywords" },
    //     {
    //         $group: {
    //             _id: {$toLower: '$keywords'},
    //             count: { $sum: 1 }
    //         }
    //     },
    //     {
    //         $match: {
    //             count: { $gte: 2 }
    //         }
    //     },
    //     { $sort : { count : -1} },
    //     { $limit : 100 }
    // ]);
    const res = await schema.distinct('gardenerId');
    const stats = await Promise.all(res.map(async (gardenerId) => {
        const count = await schema.countDocuments({gardenerId});
        return {name: gardenerId, count}
    }));
    console.log(stats);
    return stats;
}

const dbTotalMigrationStats = async () => {
    let stats = await dbCompletedStats();
    const personsCount = await getRedisPersons();
    const notMigratedCount =  personsCount - completed.length;
    stats.push({name: null, count: notMigratedCount});

    return stats;
}

const dbCompletedStats = async () => {
    const res = await schema.find({'status.progress': 'completed'});
    const primaryDomains = res.map((record)=> record.primaryDomainUser);
    const distinctDomains = [...new Set(primaryDomains)];

    const stats = await Promise.all(distinctDomains.map(async (domain)=> {
        const count = await schema.countDocuments({
            "$and": [ 
                {primaryDomainUser: domain},
                {'status.progress': 'completed'} 
            ]
        });
        return {name: domain, count}
    }));
    
    
    // const notCompleted = await schema.countDocuments({'status.progress': { '$ne': 'completed' }});
    // stats.push({name: null, count: notCompleted});
    return stats;
}
module.exports = { dbGetImmigrants, dbGetImmigrant, dbAddImmigrant,
dbUpdateImmigrant, dbAddShadowUser, dbDeleteImmigrant,
 dbGetImmigrantByGardener, dbGardenerStats, dbCompletedStats,
 dbTotalMigrationStats, dbGetImmigrantByPersonId }