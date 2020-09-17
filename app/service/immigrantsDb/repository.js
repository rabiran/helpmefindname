const schema = require('./schema');

const dbGetImmigrants = async () => {
    const statuses = await schema.find({});
    return statuses;
}

const dbGetImmigrant = async (_id) => {
    const status = await schema.findById(_id);
    return status;
}

const dbAddImmigrant = async (data) => {
    const status = new schema(data);
    const result = await status.save();
    return result;
}

const dbUpdateImmigrant = async (_id, data) => {
    const statuses = await schema.findByIdAndUpdate(_id, data, {new: true, upsert: true}).catch(err => console.log(err));
    return statuses;
}

const dbDeleteImmigrant = async (_id) => {
    const statuses = await schema.findByIdAndRemove(_id);
    return statuses;
}

module.exports = { dbGetImmigrants, dbGetImmigrant, dbAddImmigrant, dbUpdateImmigrant, dbDeleteImmigrant }