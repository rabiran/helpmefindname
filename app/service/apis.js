const config = require('../config');
const mockPerson = require('../mocks/person');

const createInTargetOrch = async (ADuser) => {
    return {success: true};
}

const getPersonApi = async (id) => {
    return mockPerson;
}

module.exports = { createInTargetOrch, getPersonApi }