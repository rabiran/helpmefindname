const statusSchema = require('./statusSchema');

const dbGetAllStatuses = async () => {
    const statuses = await statusSchema.find({});
    return statuses;
}

const dbGetStatus = async (_id) => {
    const status = await statusSchema.findById(_id);
    return status;
}

const dbAddStatus = async (data) => {
    const status = new statusSchema(data);
    const result = await status.save();
    return result;
}

const dbUpdateStatus = async (_id, data) => {
    const statuses = await statusSchema.findByIdAndUpdate(_id, data, {new: true, upsert: true}).catch(err => console.log(err));
    return statuses;
}

const dbDeleteStatus = async (_id) => {
    const statuses = await statusSchema.findByIdAndRemove(_id);
    return statuses;
}

module.exports = { dbGetAllStatuses, dbGetStatus, dbAddStatus, dbUpdateStatus, dbDeleteStatus }