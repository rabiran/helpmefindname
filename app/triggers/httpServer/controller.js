const sendToService = require('../../service');
const { dbGetAllStatuses, dbAddStatus, dbUpdateStatus, dbGetStatus  } = require('../../service/status/statusRepo');
const { getPersonApi } = require('../../service/apis');
const { HttpError } = require ('../../errorHandlers/httpError');

const status = async (req, res) => {
    res.send('service on');
    // console.log('haha');
}

const getAllStatus = async (req, res) => {
    const statuses = await dbGetAllStatuses();
    res.json(statuses);
}

const sendPerson = async (req, res) => {
    const { id } = req.body;

    const dbstatus = await dbGetStatus(id);
    if(dbstatus) throw new HttpError(401, 'already exists');

    const person = await getPersonApi(id);
    const data = { _id: id, status: { completed: false, message: 'sending user creation', step: 0 } };
    await dbAddStatus(data);
    const result = await dbUpdateStatus(id, {status: { completed: true } });
    console.log(result);
    // sendToService(person);
    res.send(data);
}

const updateStatus = async (req, res) => {
    const { message, id } = req.body;
    const data = { status: { completed: false, message, step: 0 } };
    const result = await dbUpdateStatus(id, body);
    res.send(result);
}

module.exports = { status, getAllStatus, sendPerson, updateStatus }