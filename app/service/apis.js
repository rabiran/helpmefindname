const config = require('../config');
const mockPerson = require('../mocks/person');
// const { getSpikeToken } = require('../configure/spike');

const createInTargetOrch = async (ADuser) => {
    return {success: true};
}

const getPersonApi = async (id) => {
    // const a = await getSpikeToken();
    // console.log(a);
    return mockPerson;
}

module.exports = { createInTargetOrch, getPersonApi }